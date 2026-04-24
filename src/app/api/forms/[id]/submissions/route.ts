export const runtime = 'edge';
import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const submissionSchema = z.object({
  data: z.record(z.string(), z.any()),
  files: z.array(z.any()).optional(),
  captchaToken: z.string().optional(),
})

// Initialize Ratelimit if credentials exist
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.UPSTASH_REDIS_REST_URL !== 'your_redis_url_here') {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, "10 m"),
    analytics: true,
  });
}

const redis = Redis.fromEnv();

function getClientIp(request: Request) {
  return request.headers.get('x-vercel-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
         (request as any).ip ||
         "anonymous";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found or unauthorized' }, { status: 404 })
    }

    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('form_id', id)
      .order('submitted_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('GET submissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const clientIp = getClientIp(request);
    const idempotencyKey = request.headers.get('idempotency-key');

    // 0. Idempotency Check (Enterprise Feature)
    if (idempotencyKey) {
      const existingMsgId = await redis.get(`idempotency:${idempotencyKey}`);
      if (existingMsgId) {
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received (idempotent retry).',
          queue_id: existingMsgId 
        }, { status: 202 });
      }
    }

    // 1. Rate Limiting (Per-Form Per-IP)
    if (ratelimit) {
      try {
        const { success, limit, reset, remaining } = await ratelimit.limit(`${id}:${clientIp}`);
        if (!success) {
          return NextResponse.json({ 
            error: 'Too many submissions for this form. Please try again in 10 minutes.' 
          }, { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          });
        }
      } catch (rateLimitError) {
        console.warn('Rate limit check failed, bypassing:', rateLimitError);
      }
    }

    const body = await request.json();
    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request format', details: result.error.format() }, { status: 400 });
    }

    const { data, files, captchaToken } = result.data;

    // 2. Metadata Cache Check (DB round-trip protection)
    const cacheKey = `form:${id}:meta`;
    let form: any = await redis.get(cacheKey).catch(() => null);

    if (!form) {
      const adminClient = createAdminClient();
      const { data: dbForm, error: formError } = await adminClient
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (formError || !dbForm) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }
      form = dbForm;
      await redis.setex(cacheKey, 60, JSON.stringify(form)).catch(() => null);
    }

    if (!form.published) {
      return NextResponse.json({ error: 'Form is not accepting submissions' }, { status: 403 });
    }

    // 3. Low-Latency Turnstile Prep
    // Verification moved to worker to cut ~200ms of latency from the hot path
    if (process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SECRET_KEY !== 'your_secret_key_here') {
      if (!captchaToken) {
        return NextResponse.json({ error: 'Security check required' }, { status: 400 });
      }
    }

    // 4. Enqueue with UUID and Status Tracking
    const msgId = crypto.randomUUID();
    const payload = {
      msg_id: msgId,
      form_id: id,
      data: data,
      files: files || [],
      captchaToken: captchaToken,
      submitted_at: new Date().toISOString(),
      client_ip: clientIp,
    };

    try {
      const multi = redis.multi();
      multi.lpush('form_submissions_queue', JSON.stringify(payload));
      multi.hset(`msg:${msgId}`, { status: "queued", formId: id, ts: Date.now() });
      multi.expire(`msg:${msgId}`, 86400); // 24h status TTL
      
      if (idempotencyKey) {
        multi.setex(`idempotency:${idempotencyKey}`, 600, msgId); // 10m idempotency
      }
      
      await multi.exec();

      return NextResponse.json({ 
        success: true, 
        message: 'Submission received and is being processed.',
        queue_id: msgId 
      }, { status: 202 });
    } catch (redisError) {
      console.warn('Redis enqueue failed, falling back to direct DB insert:', redisError);
      
      // Fallback: Insert directly into DB
      const adminClient = createAdminClient();
      
      const { data: insertedSubmission, error: insertError } = await adminClient
        .from('submissions')
        .insert({
          form_id: id,
          data: data,
          submitted_at: payload.submitted_at
        })
        .select('id')
        .single();
        
      if (insertError) throw insertError;
      
      // Fallback: Insert files
      if (files && files.length > 0) {
        const fileRecords = files.map((f: any) => ({
          submission_id: insertedSubmission.id,
          file_path: f.path,
          file_name: f.fileName || "unknown",
          file_size: f.size || 0,
          mime_type: f.mime_type || "application/octet-stream",
        }));
        await adminClient.from('files').insert(fileRecords);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Submission received successfully (Direct).',
        submission_id: insertedSubmission.id
      }, { status: 201 });
    }

  } catch (error) {
    console.error('POST submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { decrypt } from '@/utils/encryption'
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
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
  });
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

    // First check form ownership
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
    // 0. Rate Limiting (IP-based)
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for") || "anonymous";
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      
      if (!success) {
        return NextResponse.json({ 
          error: 'Too many submissions. Please try again in an hour.' 
        }, { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        });
      }
    }

    const id = (await params).id
    // Need admin client because the person submitting the form might not be authenticated
    const adminClient = createAdminClient()

    // 1. Check if form exists and is published
    const { data: form, error: formError } = await adminClient
      .from('forms')
      .select('published')
      .eq('id', id)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (!form.published) {
      return NextResponse.json({ error: 'Form is not accepting submissions' }, { status: 403 })
    }

    const body = await request.json()
    const result = submissionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid request format', 
        details: result.error.format() 
      }, { status: 400 })
    }

    const { data, files, captchaToken } = result.data

    // 2. CRYITICAL: Verify Turnstile Captcha
    if (process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SECRET_KEY !== 'your_secret_key_here') {
      if (!captchaToken) {
        return NextResponse.json({ error: 'Security check required' }, { status: 400 })
      }

      const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
      const verifyRes = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${captchaToken}`,
      })

      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        console.error('[Bot Protection] Turnstile verification failed:', verifyData['error-codes'])
        return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 400 })
      }
    }

    if (!data) {
      return NextResponse.json({ error: 'Submission data is required' }, { status: 400 })
    }

    // 🚀 ENQUEUE FOR ASYNCHRONOUS PROCESSING (Upstash Redis)
    const payload = {
      form_id: id,
      data: data,
      files: files || [],
      submitted_at: new Date().toISOString(),
      client_ip: request.headers.get("x-forwarded-for") || "anonymous",
    };

    let msgId = `msg_${Date.now()}`;

    try {
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_URL !== 'your_redis_url_here') {
        const redis = Redis.fromEnv();
        await redis.lpush('form_submissions_queue', payload);
      } else {
        throw new Error('Upstash Redis is not configured.');
      }
    } catch (enqueueError) {
      console.error('[Queue] Upstash Enqueue failure:', enqueueError);
      return NextResponse.json({ error: 'System busy. Please try again later.' }, { status: 503 });
    }

    // Optionally trigger the worker via a fire-and-forget edge function call
    // (This helps keep latency low for the user while starting processing immediately)
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submission-processor`;
    fetch(functionUrl, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trigger: 'new_submission' })
    }).catch(err => console.error('[Queue] Worker trigger failed (ignoring):', err));

    return NextResponse.json({ 
      success: true, 
      message: 'Submission received and is being processed.',
      queue_id: msgId 
    }, { status: 202 });

  } catch (error) {
    console.error('POST submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
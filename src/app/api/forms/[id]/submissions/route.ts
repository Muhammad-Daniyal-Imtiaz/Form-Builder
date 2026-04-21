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

    const { data: submission, error: submitError } = await adminClient
      .from('submissions')
      .insert({
        form_id: id,
        data: data
      })
      .select()
      .single()

    if (submitError) {
      console.error('Submission create error:', submitError)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

    // Optionally handle 'files' array by inserting into 'files' table for tracking
    if (files && Array.isArray(files) && files.length > 0) {
      const fileRecords = files.map(file => ({
        submission_id: submission.id,
        file_path: file.path,
        file_name: file.fileName || 'unknown',
        file_size: file.size || 0,
        mime_type: file.mimeType || 'application/octet-stream'
      }))

      const { error: fileInsertError } = await adminClient
        .from('files')
        .insert(fileRecords)

      if (fileInsertError) {
        console.error('Failed to link files to submission:', fileInsertError)
        // Non-critical, submission data still saved
      }
    }

    // 🚀 INTEGRATIONS SYNC (GOOGLE SHEETS & ZAPIER)
    const { data: formConfig, error: configError } = await adminClient
      .from('forms')
      .select('title, user_id, google_sheet_id, google_sheet_enabled, google_sheet_name, zapier_webhook_url, zapier_enabled, airtable_api_key, airtable_base_id, airtable_table_name, airtable_enabled, slack_bot_token, slack_channel_id, slack_enabled, email_enabled, notification_email, email_app_password, email_to_list, email_host, email_port, email_secure')
      .eq('id', id)
      .single();

    if (configError) {
       console.error('[Integrations] Config fetch error:', configError.message);
    }

    if (!configError && formConfig) {
      // 1. GOOGLE SHEETS
      if (formConfig.google_sheet_enabled && formConfig.google_sheet_id) {
        try {
          const { getGoogleAccessToken, appendToGoogleSheet, getSheetValues } = await import('@/lib/google-sheets');
          const accessToken = await getGoogleAccessToken(formConfig.user_id);
          
          if (accessToken) {
            const { data: fields } = await adminClient.from('form_fields').select('id, label').eq('form_id', id).order('order');
            const existingValues = await getSheetValues(accessToken, formConfig.google_sheet_id, `${formConfig.google_sheet_name || 'Sheet1'}!A1:Z1`);
            const payloadRows = [];
            
            if (existingValues.length === 0) {
              const fieldLabels = fields?.map(f => f.label) || [];
              payloadRows.push(['Submission Date', ...fieldLabels]);
            }

            const rowValues = [new Date().toLocaleString()];
            fields?.forEach(f => {
              let val = data[f.id] || data[f.label] || '';
              if (Array.isArray(val)) val = val.join(', ');
              rowValues.push(String(val));
            });
            payloadRows.push(rowValues);
            
            const success = await appendToGoogleSheet(
              accessToken, 
              formConfig.google_sheet_id, 
              formConfig.google_sheet_name || 'Sheet1', 
              payloadRows
            );

            if (success) {
              await adminClient.from('submissions').update({ google_synced: true }).eq('id', submission.id);
            }
          }
        } catch (err) {
          console.error('failed google sync:', err);
        }
      }

      // 2. ZAPIER
      if (formConfig.zapier_enabled && formConfig.zapier_webhook_url) {
        try {
          // Fetch fields to map IDs to labels
          const { data: fields } = await adminClient.from('form_fields').select('id, label').eq('form_id', id).order('order');
          
          const labelData: Record<string, any> = {};
          if (fields) {
            fields.forEach(f => {
              let val = data[f.id] || data[f.label] || '';
              if (Array.isArray(val)) val = val.join(', ');
              
              // Handle duplicate labels
              let key = f.label;
              let i = 1;
              while (labelData[key]) {
                key = `${f.label}_${++i}`;
              }
              labelData[key] = val;
            });
          }

          const webhookUrl = decrypt(formConfig.zapier_webhook_url);
          const zapResp = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              submission_id: submission.id,
              form_id: id,
              form_name: formConfig.google_sheet_name || 'My Form', // Fallback or use a better field
              submitted_at: submission.submitted_at,
              ...labelData
            })
          });

          if (zapResp.ok) {
            await adminClient.from('submissions').update({ zapier_synced: true }).eq('id', submission.id);
          }
        } catch (err) {
          console.error('failed zapier sync:', err);
        }
      }

      // 3. AIRTABLE
      if (formConfig.airtable_enabled && formConfig.airtable_api_key && formConfig.airtable_base_id) {
        try {
          const airtableApiKey = decrypt(formConfig.airtable_api_key);
          const { data: fields } = await adminClient.from('form_fields').select('id, label').eq('form_id', id).order('order');
          
          if (fields) {
            const mappedFields: any = {
                "Submission ID": submission.id,
                "Submitted At": submission.submitted_at
            };
            fields.forEach(f => {
                let val = data[f.id] || data[f.label] || '';
                if (Array.isArray(val)) val = val.join(', ');
                mappedFields[f.label] = String(val);
            });

            // For real-time, we just try to push to the table name.
            // If the table doesn't exist, it requires a manual bulk sync or setup to create it.
            const airtableResp = await fetch(`https://api.airtable.com/v0/${formConfig.airtable_base_id}/${encodeURIComponent(formConfig.airtable_table_name || 'Submissions')}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${airtableApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ records: [{ fields: mappedFields }] })
            });

            if (airtableResp.ok) {
              await adminClient.from('submissions').update({ airtable_synced: true }).eq('id', submission.id);
            }
          }
        } catch (err) {
          console.error('failed airtable sync:', err);
        }
      }

      // 4. SLACK
      if (formConfig.slack_enabled && formConfig.slack_bot_token && formConfig.slack_channel_id) {
        const botToken = decrypt(formConfig.slack_bot_token);
        console.log(`[Slack] Attempting send to channel: ${formConfig.slack_channel_id}`);
        try {
          const { data: fields } = await adminClient.from('form_fields').select('id, label, type').eq('form_id', id).order('order');
          
          if (fields) {
            const blocks: any[] = [
                {
                    type: "header",
                    text: { type: "plain_text", text: "🚀 New Form Submission!" }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Form:* ${formConfig.title || 'My Form'}\n*Date:* ${new Date(submission.submitted_at).toLocaleString()}`
                    }
                },
                { type: "divider" }
            ];

            const formFields: any[] = [];
            fields.forEach(f => {
                let val = data[f.id] || data[f.label] || '';
                
                // Format values for Slack
                let formattedVal = '';
                if (Array.isArray(val)) {
                    if (['file', 'multifile'].includes(f.type)) {
                        formattedVal = val.map(file => `<${file.url}|${file.fileName || 'View File'}>`).join(', ');
                    } else {
                        formattedVal = val.join(', ');
                    }
                } else if (typeof val === 'object' && val !== null) {
                    if (val.url) {
                        formattedVal = `<${val.url}|${val.fileName || 'View File'}>`;
                    } else {
                        formattedVal = JSON.stringify(val);
                    }
                } else {
                    formattedVal = String(val);
                }

                formFields.push({
                    type: "mrkdwn",
                    text: `*${f.label}:*\n${formattedVal || '_(empty)_'}`
                });
            });

            // Split into sections of 2 fields each for better look
            for (let i = 0; i < formFields.length; i += 2) {
                blocks.push({
                    type: "section",
                    fields: formFields.slice(i, i + 2)
                });
            }

            blocks.push({ type: "divider" });
            blocks.push({
                type: "context",
                elements: [{ type: "mrkdwn", text: `Submission ID: \`${submission.id}\`` }]
            });

            let slackResp = await fetch('https://slack.com/api/chat.postMessage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${botToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel: formConfig.slack_channel_id,
                    blocks
                })
            });

            let slackData = await slackResp.json();
            
            // If bot not in channel, try to join and retry once
            if (!slackData.ok && slackData.error === 'not_in_channel') {
               console.log('[Slack] Bot not in channel, attempting to join...');
               const joinResp = await fetch('https://slack.com/api/conversations.join', {
                   method: 'POST',
                   headers: { 
                       'Authorization': `Bearer ${botToken}`,
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({ channel: formConfig.slack_channel_id })
               });
               const joinData = await joinResp.json();
               
               if (joinData.ok) {
                   console.log('[Slack] Joined channel successfully, retrying post...');
               } else {
                   console.warn('[Slack] Auto-join failed:', joinData.error);
                   console.warn('[Slack] Tip: Ensure your Slack App has "channels:join" scope.');
               }

               // Retry post regardless of join success (sometimes join is successful but returns warning)
               slackResp = await fetch('https://slack.com/api/chat.postMessage', {
                   method: 'POST',
                   headers: {
                       'Authorization': `Bearer ${botToken}`,
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({
                       channel: formConfig.slack_channel_id,
                       blocks
                   })
               });
               slackData = await slackResp.json();
            }

            if (!slackData.ok) {
               console.error('[Slack] API Error:', slackData.error);
            } else {
               console.log('[Slack] Notification sent successfully!');
            }
          }
        } catch (err) {
          console.error('[Slack] Failed slack sync:', err);
        }
      }

      // 5. EMAIL NOTIFICATIONS
      if (formConfig.email_enabled && formConfig.notification_email && formConfig.email_app_password) {
        const appPassword = decrypt(formConfig.email_app_password);
        console.log(`[Email] Attempting to send notification to: ${formConfig.email_to_list || formConfig.notification_email}`);
        try {
          const { data: fields } = await adminClient.from('form_fields').select('id, label, type').eq('form_id', id).order('order');
          
          if (fields) {
            const transporter = nodemailer.createTransport({
              host: formConfig.email_host || 'smtp.gmail.com',
              port: formConfig.email_port || 465,
              secure: formConfig.email_secure ?? true,
              auth: {
                user: formConfig.notification_email,
                pass: appPassword,
              },
            });

            const rows = fields.map(f => {
              let val = data[f.id] || data[f.label] || '';
              if (Array.isArray(val)) {
                if (['file', 'multifile'].includes(f.type)) {
                  val = val.map(file => `<a href="${file.url}">${file.fileName || 'Download'}</a>`).join(', ');
                } else {
                  val = val.join(', ');
                }
              } else if (typeof val === 'object' && val?.url) {
                val = `<a href="${val.url}">${val.fileName || 'Download'}</a>`;
              }
              return `<tr>
                <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; width: 30%;">${f.label}</td>
                <td style="padding: 10px; border: 1px solid #eee;">${val || '-(empty)-'}</td>
              </tr>`;
            }).join('');

            const emailHtml = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #4F46E5; border-radius: 10px; overflow: hidden;">
                <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 20px;">New Submission: ${formConfig.title || 'Your Form'}</h1>
                </div>
                <div style="padding: 20px;">
                  <p>A new entry has been recorded for your form.</p>
                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    ${rows}
                  </table>
                  <p style="margin-top: 25px; font-size: 11px; color: #999;">Submission ID: ${submission.id}</p>
                </div>
              </div>
            `;

            await transporter.sendMail({
              from: `"Form Builder" <${formConfig.notification_email}>`,
              to: formConfig.email_to_list || formConfig.notification_email,
              subject: `🛎️ New Submission for ${formConfig.title || 'Form'}`,
              html: emailHtml
            });

            console.log('[Email] Notification sent successfully!');
          }
        } catch (err) {
          console.error('[Email] Notification failed:', err);
        }
      }
    }

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error('POST submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { createClient } from "supabase-js";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

// --- Types ---
interface FileRecord {
  path: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

// --- Encryption Utility ---
const ENCRYPTION_SECRET = Deno.env.get("ENCRYPTION_SECRET") || "";

function decrypt(text: string): string {
  if (!text) return "";
  if (!text.includes(":")) return text;
  const parts = text.split(":");
  const ivHex = parts.shift();
  const encryptedText = parts.join(":");
  if (!ivHex || ivHex.length !== 32) return text;
  try {
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_SECRET, "hex"), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (_err) { return text; }
}

// --- Worker Setup ---
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  const body = await req.json().catch(() => ({}));
  const startTime = Date.now();
  console.log(`[Worker] Triggered by: ${body.trigger || 'unknown'}`);

  let totalProcessed = 0;

  try {
    const redisUrl = Deno.env.get("UPSTASH_REDIS_REST_URL");
    const redisToken = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");

    if (!redisUrl || !redisToken) throw new Error("Missing Upstash Redis credentials");

    const authHeader = { Authorization: `Bearer ${redisToken}` };

    // 🚀 DRAIN LOOP (FIFO processing: Next.js LPUSH + Worker RPOP)
    while (Date.now() - startTime < 120000) {
      // Atomic multi-pop (FIFO)
      const popRes = await fetch(`${redisUrl}/rpop/form_submissions_queue/500`, { headers: authHeader });
      const popData = await popRes.json();
      if (popData.error) throw new Error(`Upstash Error: ${popData.error}`);
      
      let queueItemsRaw = popData.result;
      if (!queueItemsRaw || queueItemsRaw.length === 0) break;
      if (!Array.isArray(queueItemsRaw)) queueItemsRaw = [queueItemsRaw];
      
      const queueItems = queueItemsRaw.map(m => typeof m === 'string' ? JSON.parse(m) : m);
      console.log(`[Worker] Batch of ${queueItems.length} items popped (FIFO)`);

      // 1. Parallel Verification & Status Updates
      const verifiedItems = await Promise.all(queueItems.map(async (item) => {
        const msgKey = `msg:${item.msg_id}`;
        
        // Update status to processing
        await fetch(`${redisUrl}/hset/${msgKey}/status/processing`, { headers: authHeader });

        // Asynchronous Turnstile Verification (Offloaded from API)
        if (turnstileSecret && turnstileSecret !== 'your_secret_key_here' && item.captchaToken) {
          try {
            const vRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `secret=${turnstileSecret}&response=${item.captchaToken}`,
            });
            const vData = await vRes.json();
            if (!vData.success) {
              console.warn(`[Worker] Dropping bot submission: ${item.msg_id}`);
              await fetch(`${redisUrl}/hset/${msgKey}/status/rejected`, { headers: authHeader });
              return null;
            }
          } catch (e) {
            console.error(`[Worker] Turnstile error for ${item.msg_id}:`, e);
            // On error, we might want to allow or retry. Here we allow to be safe.
          }
        }
        return item;
      }));

      const validItems = verifiedItems.filter(i => i !== null);
      if (validItems.length === 0) continue;

      // 2. STAGE 1: Bulk Insert Submissions
      const submissionsToInsert = validItems.map(item => ({
        form_id: item.form_id,
        data: item.data,
        submitted_at: item.submitted_at || new Date().toISOString()
      }));

      const { data: insertedSubmissions, error: bulkSubmitError } = await supabase
        .from("submissions")
        .insert(submissionsToInsert)
        .select('id, form_id, data, submitted_at');

      if (bulkSubmitError) throw bulkSubmitError;

      // 3. STAGE 2: Bulk Insert Files
      const fileRecords: any[] = [];
      insertedSubmissions.forEach((sub, index) => {
        const originalFiles = validItems[index].files;
        if (originalFiles?.length > 0) {
          originalFiles.forEach((f: any) => {
            fileRecords.push({
              submission_id: sub.id,
              file_path: f.path,
              file_name: f.fileName || "unknown",
              file_size: f.size || 0,
              mime_type: f.mimeType || "application/octet-stream",
            });
          });
        }
      });

      if (fileRecords.length > 0) {
        await supabase.from("files").insert(fileRecords);
      }

      // 4. STAGE 3: Integrations & Completion
      const uniqueFormIds = [...new Set(validItems.map(i => i.form_id))];
      const { data: configs } = await supabase.from("forms").select("*").in("id", uniqueFormIds);
      const configMap = new Map(configs?.map(c => [c.id, c]));

      await Promise.allSettled(insertedSubmissions.map(async (sub, idx) => {
        const formConfig = configMap.get(sub.form_id);
        const originalItem = validItems[idx];
        
        if (formConfig) {
          await runIntegrations(formConfig, sub, sub.data);
        }

        // Final status update
        await fetch(`${redisUrl}/hset/msg:${originalItem.msg_id}/status/completed`, { headers: authHeader });
      }));

      totalProcessed += validItems.length;
    }

    return new Response(JSON.stringify({ success: true, processed: totalProcessed }));

  } catch (err) {
    console.error("[Worker] Global Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

async function runIntegrations(formConfig: any, submission: any, data: any) {
  const tasks = [];

  // SLACK
  if (formConfig.slack_enabled && formConfig.slack_bot_token && formConfig.slack_channel_id) {
    tasks.push((async () => {
      try {
        const token = decrypt(formConfig.slack_bot_token);
        const { data: flds } = await supabase.from('form_fields').select('id, label').eq('form_id', formConfig.id);
        const blocks = [
          { type: "header", text: { type: "plain_text", text: "New Submission (Buffered)" } },
          { type: "section", text: { type: "mrkdwn", text: `*Form:* ${formConfig.title}\n*ID:* ${submission.id}` } }
        ];
        flds?.forEach(f => {
          const val = Array.isArray(data[f.id]) ? data[f.id].map((v:any)=>v.url||v).join(', ') : data[f.id];
          blocks.push({ type: "section", text: { type: "mrkdwn", text: `*${f.label}:* ${val || '-(empty)-'}` } });
        });
        const res = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: formConfig.slack_channel_id, blocks })
        });
        if (res.ok) await supabase.from('submissions').update({ slack_synced: true }).eq('id', submission.id);
      } catch (e) { console.error("[Slack Error]", e); }
    })());
  }

  // ZAPIER
  if (formConfig.zapier_enabled && formConfig.zapier_webhook_url) {
    tasks.push((async () => {
      try {
        const url = decrypt(formConfig.zapier_webhook_url);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submission_id: submission.id, ...data })
        });
        if (res.ok) await supabase.from('submissions').update({ zapier_synced: true }).eq('id', submission.id);
      } catch (e) { console.error("[Zapier Error]", e); }
    })());
  }

  // AIRTABLE
  if (formConfig.airtable_enabled && formConfig.airtable_api_key && formConfig.airtable_base_id) {
    tasks.push((async () => {
      try {
        const key = decrypt(formConfig.airtable_api_key);
        const res = await fetch(`https://api.airtable.com/v0/${formConfig.airtable_base_id}/${encodeURIComponent(formConfig.airtable_table_name || 'Submissions')}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ records: [{ fields: { ...data, "Submission Date": submission.submitted_at } }] })
        });
        if (res.ok) await supabase.from('submissions').update({ airtable_synced: true }).eq('id', submission.id);
      } catch (e) { console.error("[Airtable Error]", e); }
    })());
  }

  // EMAIL
  if (formConfig.email_enabled && formConfig.notification_email && formConfig.email_app_password) {
    tasks.push((async () => {
      try {
        const pass = decrypt(formConfig.email_app_password);
        const transporter = nodemailer.createTransport({
          host: formConfig.email_host || 'smtp.gmail.com',
          port: formConfig.email_port || 465,
          secure: formConfig.email_secure ?? true,
          auth: { user: formConfig.notification_email, pass },
        });
        await transporter.sendMail({
          from: `"Form Worker" <${formConfig.notification_email}>`,
          to: formConfig.email_to_list || formConfig.notification_email,
          subject: `🛎️ New Async Submission: ${formConfig.title}`,
          html: `<p>New submission received for ${formConfig.title}.</p><pre>${JSON.stringify(data, null, 2)}</pre>`
        });
      } catch (e) { console.error("[Email Error]", e); }
    })());
  }

  // GOOGLE SHEETS
  if (formConfig.google_sheet_enabled && formConfig.google_sheet_id) {
    tasks.push((async () => {
        try {
            const accessToken = await getGoogleAccessToken(formConfig.user_id);
            if (accessToken) {
                const sheetName = formConfig.google_sheet_name || 'Sheet1';
                const row = [new Date().toLocaleString(), ...Object.values(data)];
                const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${formConfig.google_sheet_id}/values/${sheetName}:append?valueInputOption=USER_ENTERED`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ values: [row] })
                });
                if (res.ok) await supabase.from('submissions').update({ google_synced: true }).eq('id', submission.id);
            }
        } catch (e) { console.error("[Google Sheets Error]", e); }
    })());
  }

  await Promise.allSettled(tasks);
}

async function getGoogleAccessToken(userId: string) {
    const { data: integration } = await supabase.from('user_integrations').select('*').eq('user_id', userId).eq('provider', 'google').single();
    if (!integration) return null;
    const isExpired = !integration.expires_at || new Date(integration.expires_at).getTime() < Date.now() + 5 * 60 * 1000;
    if (!isExpired) return integration.access_token;
    
    // Refresh logic
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!clientId || !clientSecret || !integration.refresh_token) return null;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: integration.refresh_token,
            grant_type: 'refresh_token',
            grant_type: 'refresh_token',
        }),
    });
    const d = await res.json();
    if (!res.ok) return null;
    await supabase.from('user_integrations').update({
        access_token: d.access_token,
        expires_at: new Date(Date.now() + d.expires_in * 1000).toISOString(),
    }).eq('id', integration.id);
    return d.access_token;
}

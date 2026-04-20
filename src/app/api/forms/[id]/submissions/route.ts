import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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

    const submissionData = await request.json()

    // Assuming the client shape is: { data: { ...fields }, files: [ { path, size, name... } ] }
    // But mostly we just care about data JSON
    const { data, files } = submissionData

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
    const admin = await createAdminClient();
    const { data: formConfig, error: configError } = await admin
      .from('forms')
      .select('user_id, google_sheet_id, google_sheet_enabled, google_sheet_name, zapier_webhook_url, zapier_enabled')
      .eq('id', id)
      .single();

    if (!configError && formConfig) {
      // 1. GOOGLE SHEETS
      if (formConfig.google_sheet_enabled && formConfig.google_sheet_id) {
        try {
          const { getGoogleAccessToken, appendToGoogleSheet, getSheetValues } = await import('@/lib/google-sheets');
          const accessToken = await getGoogleAccessToken(formConfig.user_id);
          
          if (accessToken) {
            const { data: fields } = await admin.from('form_fields').select('id, label').eq('form_id', id).order('order');
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
              await admin.from('submissions').update({ google_synced: true }).eq('id', submission.id);
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
          const { data: fields } = await admin.from('form_fields').select('id, label').eq('form_id', id).order('order');
          
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

          const zapResp = await fetch(formConfig.zapier_webhook_url, {
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
            await admin.from('submissions').update({ zapier_synced: true }).eq('id', submission.id);
          }
        } catch (err) {
          console.error('failed zapier sync:', err);
        }
      }
    }

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error('POST submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
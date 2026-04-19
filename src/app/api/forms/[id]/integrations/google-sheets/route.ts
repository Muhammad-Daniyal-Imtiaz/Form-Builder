import { createClient, createAdminClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getGoogleAccessToken, createGoogleSheet } from '@/lib/google-sheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: integration, error: intError } = await supabase
      .from('user_integrations')
      .select('email')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single();

    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('google_sheet_id, google_sheet_name, google_sheet_enabled')
      .eq('id', id)
      .single();

    return NextResponse.json({
      isConnected: !!integration,
      googleEmail: integration?.email,
      sheetId: form?.google_sheet_id,
      sheetName: form?.google_sheet_name,
      isEnabled: form?.google_sheet_enabled
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const { action } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'create') {
      const accessToken = await getGoogleAccessToken(user.id);
      if (!accessToken) return NextResponse.json({ error: 'Google account not connected' }, { status: 400 });

      const { data: formData } = await supabase.from('forms').select('title').eq('id', id).single();
      const sheet = await createGoogleSheet(accessToken, `${formData?.title || 'Form'} Submissions`);

      if (sheet) {
        await supabase
          .from('forms')
          .update({
            google_sheet_id: sheet.id,
            google_sheet_name: 'Sheet1',
            google_sheet_enabled: true
          })
          .eq('id', id);
        
        return NextResponse.json({ success: true, sheet });
      }
    }

    if (action === 'toggle') {
      const { enabled } = body;
      await supabase.from('forms').update({ google_sheet_enabled: enabled }).eq('id', id);
      return NextResponse.json({ success: true });
    }
    
    if (action === 'disconnect') {
      await supabase.from('forms').update({ 
        google_sheet_id: null, 
        google_sheet_name: null, 
        google_sheet_enabled: false 
      }).eq('id', id);
      return NextResponse.json({ success: true });
    }

    if (action === 'sync-existing') {
      const accessToken = await getGoogleAccessToken(user.id);
      if (!accessToken) return NextResponse.json({ error: 'Google account not connected' }, { status: 400 });

      // 1. Get Form Details (for sheet ID and fields)
      const { data: form } = await supabase
        .from('forms')
        .select('google_sheet_id, google_sheet_name')
        .eq('id', id)
        .single();

      if (!form?.google_sheet_id) return NextResponse.json({ error: 'No sheet connected' }, { status: 400 });

      // 2. Get Fields and Submissions
      const { data: fields } = await supabase.from('form_fields').select('id, label').eq('form_id', id).order('order');
      const { data: submissions } = await supabase.from('submissions').select('*').eq('form_id', id).order('submitted_at');

      if (!submissions || submissions.length === 0) return NextResponse.json({ success: true, count: 0 });

      // 3. Map to Rows
      const rows = submissions.map(sub => {
        const row = [new Date(sub.submitted_at).toLocaleString()];
        fields?.forEach(f => {
          let val = sub.data[f.id] || sub.data[f.label] || '';
          if (Array.isArray(val)) val = val.join(', ');
          row.push(String(val));
        });
        return row;
      });

      // 4. Batch Push
      const { appendToGoogleSheet } = await import('@/lib/google-sheets');
      const success = await appendToGoogleSheet(accessToken, form.google_sheet_id, form.google_sheet_name || 'Sheet1', rows);

      return NextResponse.json({ success, count: rows.length });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

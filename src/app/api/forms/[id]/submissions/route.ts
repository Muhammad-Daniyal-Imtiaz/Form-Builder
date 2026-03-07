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

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error('POST submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
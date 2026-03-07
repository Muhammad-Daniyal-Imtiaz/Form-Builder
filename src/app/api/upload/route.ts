import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${user.id}/${safeFileName}`

    // Use admin client or standard client to upload to storage
    const { data, error } = await supabase.storage
      .from('form-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    }

    // Get the public URL for the file to be stored in the form data
    const { data: publicData } = supabase.storage
      .from('form-attachments')
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: publicData.publicUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
      mimeType: file.type
    }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
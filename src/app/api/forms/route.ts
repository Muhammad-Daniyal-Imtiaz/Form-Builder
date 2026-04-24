export const runtime = 'edge';
import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: forms, error } = await supabase
      .from('forms')
      .select('*, submissions(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(forms)
  } catch (error) {
    console.error('GET forms error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description } = await request.json()
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Auto-heal: Ensure user exists in our `users` table to prevent foreign key errors
    const adminClient = createAdminClient()
    const { data: existingUser, error: checkError } = await adminClient
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check user error:', checkError)
    }

    if (!existingUser) {
      console.log('User profile missing for', user.id, '- synchronizing now.')
      const { error: syncError } = await adminClient.from('users').upsert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: 'user',
        is_active: true,
        is_verified: !!user.email_confirmed_at,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })

      if (syncError) {
        console.error('Auto-heal user sync error:', syncError)
        throw new Error(`Failed to synchronize user profile: ${syncError.message}`)
      }
    }

    const { data: form, error } = await supabase
      .from('forms')
      .insert({
        user_id: user.id,
        title,
        description,
        published: false
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error('POST form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
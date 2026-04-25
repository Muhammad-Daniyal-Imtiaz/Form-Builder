import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Try to get user from DB
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // If not in DB, create them
    if (dbError && dbError.code === 'PGRST116') {
      const adminClient = createAdminClient()
      const { data: newUser, error: createError } = await adminClient
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          role: 'user', // 👈 default
          is_active: true,
          is_verified: !!user.email_confirmed_at
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
      return NextResponse.json({ user: newUser })
    }

    if (dbError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

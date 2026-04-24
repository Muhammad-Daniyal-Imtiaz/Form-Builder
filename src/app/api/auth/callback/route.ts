export const runtime = 'edge';
import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard'

    if (!code) {
      console.error('No code provided in callback')
      const errorUrl = new URL('/login', request.url)
      errorUrl.searchParams.set('error', 'no_code')
      return NextResponse.redirect(errorUrl)
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError || !session?.user) {
      console.error('Auth callback error:', authError)
      const errorUrl = new URL('/login', request.url)
      errorUrl.searchParams.set('error', 'auth_failed')
      return NextResponse.redirect(errorUrl)
    }

    const user = session.user
    
    // 🔥 Capturing Google Provider Tokens for Background Sheets Sync
    if (session.provider_token || session.provider_refresh_token) {
      const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString()
      await adminClient
        .from('user_integrations')
        .upsert({
          user_id: user.id,
          provider: 'google',
          access_token: session.provider_token,
          refresh_token: session.provider_refresh_token,
          email: user.email,
          expires_at: expiresAt,
          updated_at: new Date().toISOString()
        })
    }
    console.log('User authenticated:', user.email)

    // Check if user exists in our `users` table
    const { data: existingUser, error: checkError } = await adminClient
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      // New user – create with default role 'user'
      const { error: createError } = await adminClient
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'User',
          role: 'user',   // 👈 default role
          avatar_url: user.user_metadata?.avatar_url || null,
          is_active: true,
          is_verified: true,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (createError) {
        console.error('Error creating user profile during callback:', createError)
        throw new Error(`Failed to create user profile in database: ${createError.message}`)
      }
    } else {
      // Update last_login for existing user
      await adminClient
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
    }

    // Redirect to dashboard
    const dashUrl = new URL(redirectTo, request.url)
    return NextResponse.redirect(dashUrl)
  } catch (error) {
    console.error('Callback error:', error)
    const errorUrl = new URL('/login', request.url)
    errorUrl.searchParams.set('error', 'server_error')
    return NextResponse.redirect(errorUrl)
  }
}
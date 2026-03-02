import { createClient, createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, name, ...additionalData } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = await createClient()
    const adminClient = await createAdminClient()

    // Check if user already exists in `users` table (optional)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, ...additionalData },
        emailRedirectTo: `${request.headers.get('origin')}/dashboard`
      }
    })

    if (authError || !authData.user) {
      console.error('Auth signup error:', authError)
      return NextResponse.json(
        { error: authError?.message || 'User creation failed' },
        { status: 400 }
      )
    }

    // Create user record in `users` table with default role 'user'
    const { error: userError } = await adminClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'user', // 👈 default
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (userError) {
      console.error('User creation error:', userError)
      // Rollback auth user (optional)
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: authData.session 
        ? 'Signup successful! Redirecting...' 
        : 'Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email,
        name,
        role: 'user',
        is_verified: authData.user.email_confirmed_at !== null
      }
    })
  } catch (error: unknown) {
    console.error('Signup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Signup failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
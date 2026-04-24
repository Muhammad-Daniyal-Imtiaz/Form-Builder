export const runtime = 'edge';
import { createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { published } = await request.json()

    const { data: form, error } = await supabase
      .from('forms')
      .update({ published, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 })
      }
      throw error
    }

    // Invalidate Cache
    try {
      await redis.del(`form:${id}:meta`)
    } catch (e) {
      console.error('[Cache] Redis del error:', e)
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
export const runtime = 'edge';
import { createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const resolvedParams = await params
    const supabase = await createAdminClient()
    const cookieStore = await cookies()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify form ownership
    const { data: form } = await supabase
      .from('forms')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single()

    if (!form || form.user_id !== user.id) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const fieldData = await request.json()
    // Get current max order
    const { data: maxOrder } = await supabase
      .from('form_fields')
      .select('order')
      .eq('form_id', resolvedParams.id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle()

    const newOrder = maxOrder ? maxOrder.order + 1 : 0

    const { data: field, error } = await supabase
      .from('form_fields')
      .insert({
        form_id: resolvedParams.id,
        ...fieldData,
        order: newOrder,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(field, { status: 201 })
  } catch (error) {
    console.error('POST field error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
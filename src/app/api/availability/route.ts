import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const coach_id = searchParams.get('coach_id')

  const supabase = supabaseAdmin()
  let query = supabase.from('availability').select('*')
  if (coach_id) query = query.eq('coach_id', coach_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ availability: data })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { coach_id, day_of_week, time_slot, is_open } = body

    const supabase = supabaseAdmin()
    const { data, error } = await supabase.from('availability')
      .upsert({ coach_id, day_of_week, time_slot, is_open }, { onConflict: 'coach_id,day_of_week,time_slot' })
      .select().single()

    if (error) throw error
    return NextResponse.json({ slot: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

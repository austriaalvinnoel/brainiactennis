import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { client_name, client_email, client_phone, coach_id, lesson_type,
            location, date, time_slot, skill_level, payment_method } = body

    if (!client_name || !client_email || !lesson_type || !location || !date || !time_slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = supabaseAdmin()

    // Check the slot isn't already booked
    const { data: conflict } = await supabase.from('bookings')
      .select('id').eq('coach_id', coach_id).eq('date', date)
      .eq('time_slot', time_slot).eq('status', 'confirmed').maybeSingle()

    if (conflict) {
      return NextResponse.json({ error: 'That slot is already booked. Please choose another time.' }, { status: 409 })
    }

    const { data, error } = await supabase.from('bookings').insert([{
      client_name, client_email, client_phone: client_phone || null,
      coach_id: coach_id || null, lesson_type, location,
      date, time_slot, skill_level, payment_method, status: 'pending',
    }]).select().single()

    if (error) throw error

    // TODO: trigger email/SMS confirmation here (e.g. Resend, Twilio)

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase.from('bookings')
    .select('*, coaches(name, initials)').order('date').order('time_slot')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings: data })
}

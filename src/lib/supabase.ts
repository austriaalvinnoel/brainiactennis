import { createClient } from '@supabase/supabase-js'

// Lazily initialise to avoid build-time errors when env vars are absent
let _client: ReturnType<typeof createClient> | null = null
function getClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    const client = getClient()
    const val = (client as any)[prop]
    return typeof val === 'function' ? val.bind(client) : val
  },
})

// Server-side client with elevated permissions
export const supabaseAdmin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

// ─── Types ────────────────────────────────────────────────────────────────────

export type Coach = {
  id: string
  name: string
  initials: string
  role: string
  bio: string
  areas: string[]   // e.g. ['NYC', 'DC', 'PHL']
  active: boolean
}

export type Availability = {
  id: string
  coach_id: string
  day_of_week: number   // 0 = Mon … 6 = Sun
  time_slot: string     // e.g. '09:00'
  is_open: boolean
}

export type Booking = {
  id: string
  client_name: string
  client_email: string
  client_phone?: string
  coach_id: string
  lesson_type: 'private' | 'group' | 'match'
  location: string
  date: string          // ISO date string
  time_slot: string
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  payment_method: 'online' | 'in_person'
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

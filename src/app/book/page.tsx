'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Coach } from '@/lib/supabase'

const locations = [
  'NYC — Central Park area',
  'NYC — Brooklyn',
  'NYC — Upper West Side',
  'DC — Capitol area',
  'DC — Maryland suburbs',
  'Philadelphia — Center City',
  'Philadelphia — Suburbs',
  'My school / JCC / YMCA',
]
const times = ['9:00 AM','10:30 AM','12:00 PM','2:00 PM','4:00 PM','5:30 PM']
const lessonTypes = [
  { value: 'private', label: 'Private lesson' },
  { value: 'group',   label: 'Group class' },
  { value: 'match',   label: 'Match coaching' },
]

export default function BookPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [form, setForm] = useState({
    client_name: '', client_email: '', client_phone: '',
    lesson_type: 'private', location: '', date: '', time_slot: '',
    coach_id: '', skill_level: 'beginner', payment_method: 'online',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('coaches').select('*').eq('active', true)
      .then(({ data }) => setCoaches((data as Coach[]) ?? []))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCoachChange = (id: string) => {
    set('coach_id', id)
    setSelectedCoach(coaches.find(c => c.id === id) ?? null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('bookings').insert([{ ...form, status: 'pending' }])
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center py-10">
        <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h2 className="text-xl font-medium mb-2">You're booked!</h2>
        <p className="text-gray-500 text-sm mb-6">A confirmation has been sent to {form.client_email}. Your coach will confirm shortly.</p>
        <div className="bg-brand-light rounded-lg p-4 text-left text-sm mb-6">
          {[
            ['Lesson type', lessonTypes.find(l=>l.value===form.lesson_type)?.label],
            ['Coach', selectedCoach?.name ?? 'Any available'],
            ['Date & time', `${form.date} · ${form.time_slot}`],
            ['Location', form.location],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-brand-green/20 last:border-0">
              <span className="text-brand-mid text-xs">{k}</span>
              <span className="text-brand-dark text-xs font-medium">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setSuccess(false); setForm({ client_name:'',client_email:'',client_phone:'',lesson_type:'private',location:'',date:'',time_slot:'',coach_id:'',skill_level:'beginner',payment_method:'online' }) }}
          className="btn-dark w-full">
          Book another lesson
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Easy scheduling</p>
        <h1 className="text-2xl font-medium mb-1">Book your lesson</h1>
        <p className="text-gray-500 text-sm mb-8">Choose your session, pick a coach, and reserve your spot in minutes.</p>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {/* Lesson type */}
          <div>
            <label className="label">Lesson type</label>
            <div className="flex gap-2 flex-wrap">
              {lessonTypes.map(lt => (
                <button type="button" key={lt.value}
                  onClick={() => set('lesson_type', lt.value)}
                  className={`px-4 py-2 rounded-full text-xs border transition-colors ${
                    form.lesson_type === lt.value
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {lt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Your name</label>
              <input className="input" placeholder="Full name" required
                value={form.client_name} onChange={e => set('client_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@email.com" required
                value={form.client_email} onChange={e => set('client_email', e.target.value)} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone (optional — for SMS reminders)</label>
            <input className="input" type="tel" placeholder="(555) 000-0000"
              value={form.client_phone} onChange={e => set('client_phone', e.target.value)} />
          </div>

          {/* Location + Date + Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Location / venue</label>
              <select className="input" required value={form.location} onChange={e => set('location', e.target.value)}>
                <option value="">Select…</option>
                {locations.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preferred date</label>
              <input className="input" type="date" required
                value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="label">Time slot</label>
              <select className="input" required value={form.time_slot} onChange={e => set('time_slot', e.target.value)}>
                <option value="">Select…</option>
                {times.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Coach dropdown */}
          <div>
            <label className="label">Select coach</label>
            <select className="input" value={form.coach_id} onChange={e => handleCoachChange(e.target.value)}>
              <option value="">— Any available coach —</option>
              {coaches.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.areas.join(' · ')}
                </option>
              ))}
            </select>
            {selectedCoach && (
              <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 border border-gray-100">
                <span className="font-medium text-gray-900">{selectedCoach.name}</span>
                {' '}— {selectedCoach.bio}
                <div className="flex gap-1 mt-1.5">
                  {selectedCoach.areas.map(a => (
                    <span key={a} className="bg-brand-light text-brand-mid px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skill + Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Skill level</label>
              <select className="input" value={form.skill_level} onChange={e => set('skill_level', e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="label">Payment</label>
              <select className="input" value={form.payment_method} onChange={e => set('payment_method', e.target.value)}>
                <option value="online">Pay now (card)</option>
                <option value="in_person">Pay at session</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button type="submit" disabled={loading} className="btn-dark w-full py-3">
            {loading ? 'Booking…' : 'Confirm & book lesson'}
          </button>
        </form>
      </div>
    </div>
  )
}

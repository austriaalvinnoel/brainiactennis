'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Booking, Coach, Availability } from '@/lib/supabase'

const TIMES = ['09:00','10:30','12:00','14:00','16:00','17:30']
const TIME_LABELS: Record<string,string> = {
  '09:00':'9 AM','10:30':'10:30','12:00':'12 PM','14:00':'2 PM','16:00':'4 PM','17:30':'5:30',
}
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

type Tab = 'overview' | 'bookings' | 'availability' | 'clients'

export default function CoachDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    supabase.from('coaches').select('*').eq('active', true)
      .then(({ data }) => {
        const list = (data as Coach[]) ?? []
        setCoaches(list)
        if (list.length) setSelectedCoach(list[0])
      })
  }, [])

  useEffect(() => {
    if (!selectedCoach) return
    supabase.from('bookings').select('*').eq('coach_id', selectedCoach.id).order('date').order('time_slot')
      .then(({ data }) => setBookings((data as Booking[]) ?? []))
    supabase.from('availability').select('*').eq('coach_id', selectedCoach.id)
      .then(({ data }) => setAvailability((data as Availability[]) ?? []))
  }, [selectedCoach])

  const toggleSlot = (dayIdx: number, time: string) => {
    setAvailability(prev => {
      const existing = prev.find(a => a.day_of_week === dayIdx && a.time_slot === time)
      if (existing) return prev.map(a => a.day_of_week === dayIdx && a.time_slot === time ? { ...a, is_open: !a.is_open } : a)
      return [...prev, { id: `tmp-${dayIdx}-${time}`, coach_id: selectedCoach!.id, day_of_week: dayIdx, time_slot: time, is_open: true }]
    })
  }

  const isOpen = (dayIdx: number, time: string) =>
    availability.find(a => a.day_of_week === dayIdx && a.time_slot === time)?.is_open ?? false

  const saveAvailability = async () => {
    if (!selectedCoach) return
    setSaving(true)
    for (const slot of availability) {
      await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coach_id: selectedCoach.id, day_of_week: slot.day_of_week, time_slot: slot.time_slot, is_open: slot.is_open }),
      })
    }
    setSaving(false)
    setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today)
  const upcomingBookings = bookings.filter(b => b.date >= today)
  const pendingCount = bookings.filter(b => b.status === 'pending').length

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'availability', label: 'My availability' },
    { id: 'clients', label: 'Clients' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-dark px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-brand-green font-semibold">B</span>
          <span className="text-white text-sm font-medium">BrainiacTennis — Coach portal</span>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1"
            value={selectedCoach?.id ?? ''} onChange={e => setSelectedCoach(coaches.find(c => c.id === e.target.value) ?? null)}>
            {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {selectedCoach && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-medium">
                {selectedCoach.initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-xs font-medium leading-tight">{selectedCoach.name}</p>
                <p className="text-white/40 text-xs">{selectedCoach.areas.join(' · ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 flex gap-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-brand-green text-brand-dark' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
            {t.id === 'bookings' && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'This week', value: bookings.filter(b=>b.status==='confirmed').length, sub: 'Confirmed lessons' },
                { label: 'Pending', value: pendingCount, sub: 'Need confirmation' },
                { label: 'This month', value: bookings.length, sub: 'Total sessions' },
                { label: 'Clients', value: [...new Set(bookings.map(b=>b.client_email))].length, sub: 'Unique clients' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className="text-2xl font-medium">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-medium mb-3">Today's schedule</h3>
            {todayBookings.length === 0
              ? <p className="text-gray-400 text-sm">No lessons scheduled for today.</p>
              : <BookingList bookings={todayBookings} onUpdate={updateBookingStatus} />}
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && (
          <div>
            <h3 className="text-sm font-medium mb-4">Upcoming lessons</h3>
            {upcomingBookings.length === 0
              ? <p className="text-gray-400 text-sm">No upcoming bookings.</p>
              : <BookingList bookings={upcomingBookings} onUpdate={updateBookingStatus} />}
          </div>
        )}

        {/* ── Availability ── */}
        {tab === 'availability' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Set your weekly availability</h3>
              <div className="flex items-center gap-3">
                {saveMsg && <span className="text-brand-green text-xs">{saveMsg}</span>}
                <button onClick={saveAvailability} disabled={saving} className="btn-dark text-xs px-4 py-2">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day, di) => (
                <div key={day} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-brand-dark text-white text-center text-xs py-2 font-medium">{day}</div>
                  <div className="p-2 space-y-1">
                    {TIMES.map(t => {
                      const open = isOpen(di, t)
                      return (
                        <button key={t} onClick={() => toggleSlot(di, t)}
                          className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors ${open ? 'bg-brand-light text-brand-mid' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${open ? 'bg-brand-green' : 'bg-gray-300'}`}></span>
                          {TIME_LABELS[t]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Tap a slot to toggle open / blocked. Clients only see open slots when booking.</p>
          </div>
        )}

        {/* ── Clients ── */}
        {tab === 'clients' && (
          <div>
            <h3 className="text-sm font-medium mb-4">My clients</h3>
            {bookings.length === 0
              ? <p className="text-gray-400 text-sm">No clients yet.</p>
              : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400">
                        {['Name','Email','Lesson type','Date','Skill','Status'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{b.client_name}</td>
                          <td className="px-4 py-3 text-gray-500">{b.client_email}</td>
                          <td className="px-4 py-3 capitalize">{b.lesson_type}</td>
                          <td className="px-4 py-3 text-gray-500">{b.date}</td>
                          <td className="px-4 py-3 capitalize">{b.skill_level}</td>
                          <td className="px-4 py-3">
                            <span className={`status-${b.status}`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingList({ bookings, onUpdate }: { bookings: Booking[], onUpdate: (id: string, status: 'confirmed' | 'cancelled') => void }) {
  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-light rounded-lg px-3 py-2 text-center min-w-[48px]">
              <p className="text-brand-mid font-medium text-sm leading-tight">{b.time_slot}</p>
              <p className="text-brand-green text-xs">{b.date}</p>
            </div>
            <div>
              <p className="font-medium text-sm">{b.client_name}</p>
              <p className="text-gray-400 text-xs capitalize">{b.lesson_type} · {b.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`status-${b.status}`}>{b.status}</span>
            {b.status === 'pending' && (
              <>
                <button onClick={() => onUpdate(b.id, 'confirmed')}
                  className="text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-brand-light hover:border-brand-green transition-colors">
                  Confirm
                </button>
                <button onClick={() => onUpdate(b.id, 'cancelled')}
                  className="text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors">
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

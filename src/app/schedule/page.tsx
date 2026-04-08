'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Coach, Availability } from '@/lib/supabase'
import Link from 'next/link'

const TIMES = ['09:00','10:30','12:00','14:00','16:00','17:30']
const TIME_LABELS: Record<string, string> = {
  '09:00':'9:00 AM','10:30':'10:30 AM','12:00':'12:00 PM',
  '14:00':'2:00 PM','16:00':'4:00 PM','17:30':'5:30 PM',
}
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat']

function getWeekDates(offset: number): Date[] {
  const base = new Date()
  const monday = new Date(base)
  monday.setDate(base.getDate() - ((base.getDay() + 6) % 7) + offset * 7)
  return DAYS.map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d })
}

export default function SchedulePage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [weekOffset, setWeekOffset] = useState(0)
  const [filterCoach, setFilterCoach] = useState('all')
  const dates = getWeekDates(weekOffset)

  useEffect(() => {
    supabase.from('coaches').select('*').eq('active', true).then(({ data }) => setCoaches((data as Coach[]) ?? []))
    supabase.from('availability').select('*').then(({ data }) => setAvailability((data as Availability[]) ?? []))
  }, [])

  const isOpen = (coachId: string, dayIdx: number, time: string) =>
    availability.some(a => a.coach_id === coachId && a.day_of_week === dayIdx && a.time_slot === time && a.is_open)

  const filteredCoaches = filterCoach === 'all' ? coaches : coaches.filter(c => c.id === filterCoach)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Availability</p>
        <h1 className="text-2xl font-medium mb-6">Coach schedule</h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-100">← Prev</button>
          <span className="text-sm font-medium">
            {dates[0].toLocaleDateString('en-US',{month:'short',day:'numeric'})} – {dates[5].toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)}
            className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-100">Next →</button>

          <div className="flex gap-2 ml-4 flex-wrap">
            <button onClick={() => setFilterCoach('all')}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${filterCoach==='all'?'bg-brand-dark text-white border-brand-dark':'border-gray-200 text-gray-600'}`}>
              All coaches
            </button>
            {coaches.map(c => (
              <button key={c.id} onClick={() => setFilterCoach(c.id)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${filterCoach===c.id?'bg-brand-dark text-white border-brand-dark':'border-gray-200 text-gray-600'}`}>
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-3 text-left text-gray-400 w-20 font-normal">Time</th>
                {dates.map((d, i) => (
                  <th key={i} className="py-3 px-2 font-normal text-center">
                    <span className="text-gray-400">{DAYS[i]}</span>
                    <span className={`block text-base font-medium ${d.toDateString()===new Date().toDateString()?'text-brand-green':'text-gray-900'}`}>
                      {d.getDate()}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(t => (
                <tr key={t} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 px-3 text-gray-400 whitespace-nowrap">{TIME_LABELS[t]}</td>
                  {dates.map((_, di) => (
                    <td key={di} className="py-1 px-1 align-top">
                      {filteredCoaches.map(c => {
                        const open = isOpen(c.id, di, t)
                        return open ? (
                          <Link key={c.id} href={`/book?coach=${c.id}&day=${di}&time=${t}`}
                            className="block rounded-md px-2 py-1 mb-1 bg-brand-light text-brand-mid hover:bg-brand-green hover:text-white transition-colors">
                            <span className="font-medium block">{c.name.split(' ')[0]}</span>
                            <span className="opacity-70">Available</span>
                          </Link>
                        ) : null
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-brand-light border border-brand-green/30 inline-block"></span>
            Available — click to book
          </span>
        </div>
      </div>
    </div>
  )
}

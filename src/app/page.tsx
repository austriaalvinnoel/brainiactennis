export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Coach } from '@/lib/supabase'

const services = [
  { title: 'Private lessons', desc: '1-on-1 focused coaching tailored to your game and goals.' },
  { title: 'Group lessons', desc: 'High-energy sessions for kids and adults of all levels.' },
  { title: 'Match coaching', desc: 'Strategic patterns and prep to get you winning on court.' },
]

const testimonials = [
  { quote: 'She pushes me to do my best. I especially love her double dares — then I try super hard.', name: 'Jamie', location: 'Brooklyn' },
  { quote: 'Very patient and more than willing to work with kids who are hesitant. They made our son feel comfortable.', name: 'Dara', location: 'Upper West Side' },
  { quote: 'They demand the very best from the kids and are very thorough but in a nurturing way.', name: 'Molly', location: 'Jersey City' },
]

async function getCoaches(): Promise<Coach[]> {
  const { data } = await supabase.from('coaches').select('*').eq('active', true)
  return (data as Coach[]) ?? []
}

export default async function HomePage() {
  const coaches = await getCoaches()

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-white text-4xl font-medium leading-tight mb-4">
              Play smarter.<br />
              <span className="text-brand-green">Train with Brainiac.</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-md">
              Portable tennis school — private, group & match coaching for kids and adults.
              We come to you with qualified staff and equipment.
            </p>
            <div className="flex gap-3">
              <Link href="/book" className="btn-primary">Book a lesson</Link>
              <Link href="/schedule" className="btn-outline">View schedule</Link>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-white/40 text-xs tracking-wide mb-3">Service areas</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {['NYC + suburbs','DC + suburbs','Philadelphia + suburbs','Schools','JCCs & YMCAs','Community centers'].map(a => (
                <span key={a} className="bg-brand-green/10 text-brand-green border border-brand-green/20 text-xs px-3 py-1 rounded-full">{a}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['20+','Yrs teaching'],['3','Metro areas'],['Div I','Pedigree']].map(([v,l]) => (
                <div key={l} className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-white text-lg font-medium">{v}</p>
                  <p className="text-white/40 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-green text-xs font-medium tracking-wide mb-1">What we offer</p>
          <h2 className="text-2xl font-medium mb-2">Lessons for every level</h2>
          <p className="text-gray-500 text-sm mb-8">From first swings to match-ready strategy — we bring the court to you.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {services.map(s => (
              <div key={s.title} className="card">
                <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center mb-4">
                  <svg className="w-4 h-4 stroke-brand-mid" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9"/>
                  </svg>
                </div>
                <h3 className="font-medium text-sm mb-1">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      {coaches.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Our coaches</p>
            <h2 className="text-2xl font-medium mb-8">Meet the team</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {coaches.map(c => (
                <div key={c.id} className="card flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-mid font-medium text-sm flex-shrink-0">
                    {c.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-brand-green text-xs mb-1">{c.role}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{c.bio}</p>
                    <div className="flex gap-1 mt-2">
                      {c.areas.map(a => (
                        <span key={a} className="bg-brand-light text-brand-mid text-xs px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 px-4 bg-brand-dark text-center">
        <h2 className="text-white text-2xl font-medium mb-3">Ready to play smarter?</h2>
        <p className="text-white/60 text-sm mb-6">Book a lesson online in minutes. We come to you.</p>
        <Link href="/book" className="btn-primary">Book a lesson now</Link>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Testimonials</p>
          <h2 className="text-2xl font-medium mb-8">What people are saying</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <p className="text-brand-green text-sm mb-3">★★★★★</p>
                <p className="text-gray-600 text-xs leading-relaxed italic mb-4">"{t.quote}"</p>
                <p className="text-sm font-medium">{t.name} <span className="text-gray-400 font-normal">· {t.location}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

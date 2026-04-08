import Link from 'next/link'

export default function CareersPage() {
  const roles = [
    { title: 'Tennis instructor — NYC', type: 'Part-time', desc: 'Teach private and group lessons across NYC boroughs. Experience with juniors preferred.' },
    { title: 'Tennis instructor — DC', type: 'Part-time', desc: 'Coach adults and kids in the greater DC and Maryland area. Match coaching experience a plus.' },
    { title: 'Tennis instructor — Philadelphia', type: 'Part-time', desc: 'Lead group clinics and private sessions in the Philadelphia metro area.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Join the team</p>
        <h1 className="text-2xl font-medium mb-3">Careers at BrainiacTennis</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xl">
          We're always looking for passionate, qualified tennis coaches to join our growing team.
          We operate a portable tennis school — you come to schools, JCCs, YMCAs, and community centers
          with equipment provided.
        </p>

        <div className="space-y-4 mb-10">
          {roles.map(r => (
            <div key={r.title} className="card flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-sm mb-0.5">{r.title}</h3>
                <p className="text-gray-500 text-xs mb-2">{r.desc}</p>
                <span className="bg-brand-light text-brand-mid text-xs px-2 py-0.5 rounded-full">{r.type}</span>
              </div>
              <Link href="/contact" className="btn-dark text-xs px-4 py-2 flex-shrink-0">Apply</Link>
            </div>
          ))}
        </div>

        <div className="bg-brand-dark rounded-xl p-6 text-center">
          <h3 className="text-white font-medium mb-2">Don't see your area?</h3>
          <p className="text-white/60 text-sm mb-4">We're always expanding. Send us your info and we'll reach out when a spot opens near you.</p>
          <Link href="/contact" className="btn-primary">Get in touch</Link>
        </div>
      </div>
    </div>
  )
}

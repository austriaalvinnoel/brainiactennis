'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to email service (e.g. Resend)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Get in touch</p>
          <h1 className="text-2xl font-medium mb-4">Contact us</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Have questions about lessons, locations, or pricing? We'd love to hear from you.
            Reach out by email or phone, or fill out the form and we'll get back to you shortly.
          </p>
          <div className="space-y-4">
            {[
              { label: 'Email', value: 'brainiactennis@gmail.com', href: 'mailto:brainiactennis@gmail.com' },
              { label: 'Phone / text', value: '(516) 350-7971', href: 'tel:5163507971' },
              { label: 'Service areas', value: 'NYC · DC · Philadelphia (+ suburbs)', href: null },
              { label: 'Venues', value: 'Schools, community centers, JCCs, YMCAs and more', href: null },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                {item.href
                  ? <a href={item.href} className="text-sm text-brand-dark hover:text-brand-green transition-colors font-medium">{item.value}</a>
                  : <p className="text-sm font-medium">{item.value}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
              <h3 className="font-medium mb-1">Message sent!</h3>
              <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-medium text-sm">Send us a message</h3>
              <div>
                <label className="label">Your name</label>
                <input className="input" required placeholder="Full name"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Email address</label>
                <input className="input" type="email" required placeholder="you@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input resize-none" rows={4} required placeholder="How can we help?"
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn-dark w-full">Send message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

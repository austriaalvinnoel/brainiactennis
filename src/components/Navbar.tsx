'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Tennis tips' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-brand-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 text-white font-medium text-sm">
          <span className="text-brand-green text-lg font-semibold">B</span>
          BrainiacTennis
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-white/70 hover:text-white text-xs transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary text-xs px-4 py-2">
            Book a lesson
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-dark border-t border-white/10 px-4 pb-4">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="block text-white/70 hover:text-white text-sm py-2"
              onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary inline-block mt-2 text-xs"
            onClick={() => setOpen(false)}>
            Book a lesson
          </Link>
        </div>
      )}
    </nav>
  )
}

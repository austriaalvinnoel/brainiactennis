import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-brand-green text-lg font-semibold">B</span>
            <span className="font-medium text-sm">BrainiacTennis</span>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            Portable tennis school for adults and kids. We come to you with qualified staff and equipment.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Quick links</h4>
          {[['/', 'Home'], ['/about', 'Tennis tips'], ['/schedule', 'Schedule'],
            ['/gallery', 'Gallery'], ['/careers', 'Careers']].map(([href, label]) => (
            <Link key={href} href={href}
              className="block text-white/50 hover:text-white text-xs leading-7 transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Contact</h4>
          <a href="mailto:brainiactennis@gmail.com"
            className="block text-white/50 hover:text-white text-xs leading-7 transition-colors">
            brainiactennis@gmail.com
          </a>
          <a href="tel:5163507971"
            className="block text-white/50 hover:text-white text-xs leading-7 transition-colors">
            (516) 350-7971
          </a>
          <p className="text-white/50 text-xs leading-7">NYC · DC · Philadelphia</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 px-4 flex justify-between items-center max-w-6xl mx-auto">
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} BrainiacTennis. All rights reserved.</p>
        <p className="text-white/30 text-xs">Privacy · Terms</p>
      </div>
    </footer>
  )
}

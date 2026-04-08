import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'BrainiacTennis — Play Smarter',
  description: 'Portable tennis school offering private, group, and match coaching for kids and adults in NYC, DC, and Philadelphia.',
  openGraph: {
    title: 'BrainiacTennis',
    description: 'Play smarter. Train with BrainiacTennis.',
    url: 'https://brainiactennis.com',
    siteName: 'BrainiacTennis',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

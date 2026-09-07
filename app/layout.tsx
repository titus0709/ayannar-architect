import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { SanityLive } from '@/sanity/lib/live'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sri Ayyanar Architects — Traditional Temple Architecture',
    template: '%s · Sri Ayyanar Architects',
  },
  description:
    'Preserving sacred architecture, traditional knowledge, and craftsmanship for generations. Traditional South Indian temple architecture, restoration, and consultation.',
  generator: 'v0.app',
  keywords: [
    'temple architecture',
    'South Indian architecture',
    'Dravidian architecture',
    'sthapati',
    'temple restoration',
    'gopuram',
    'traditional craftsmanship',
  ],
  openGraph: {
    title: 'Sri Ayyanar Architects — Traditional Temple Architecture',
    description:
      'Preserving sacred architecture, traditional knowledge, and craftsmanship for generations.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090909',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased bg-background text-foreground">
        {children}
        <SanityLive />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

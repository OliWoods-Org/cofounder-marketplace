import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'CoFounder Marketplace | Buy & Sell AI Agents',
  description: 'The App Store for AI agents. Deploy pre-built agents and teams with one click. Automate your workflow in minutes.',
  keywords: ['AI agents', 'automation', 'marketplace', 'CoFounder', 'Claude', 'AI teams'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

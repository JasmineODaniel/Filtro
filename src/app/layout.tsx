import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Michroma } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

const michroma = Michroma({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Filtro',
  description: 'Visual query builder — construct complex queries without writing raw syntax',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${michroma.variable}`} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}

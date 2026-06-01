import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
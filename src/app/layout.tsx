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
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('filtro-theme');document.documentElement.classList.toggle('dark',t?t==='dark':true)}catch(e){document.documentElement.classList.add('dark')}})();`
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

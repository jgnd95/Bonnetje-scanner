import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Bonnetje Scanner',
  description: 'Scan en organiseer je bonnetjes',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F0F0F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`dark ${inter.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
         </AuthProvider>
      </body>
    </html>
  )
}

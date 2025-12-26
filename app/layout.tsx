import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Traction Control System',
  description: 'Intelligent day-to-day traction control management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

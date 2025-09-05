import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Educational AI System',
  description: 'Advanced AI-powered tools for code evaluation, review, and automated exam generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
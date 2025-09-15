import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'U-LANC: Universal Lossless-Lossy Adaptive Neural Compression',
  description: 'AI-powered adaptive compression for images, audio, and video',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
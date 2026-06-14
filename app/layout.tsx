// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx
// Root layout — fonts, metadata, smooth scroll. Light-only.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { SEO } from '@/lib/constants'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────

// Display serif — editorial character, used for all headings
const fraunces = Fraunces({
  subsets:  ['latin'],
  axes:     ['opsz'],         // optical size axis — avoid explicit weight array
  variable: '--font-fraunces',
  display:  'swap',
})

// Body sans — clean, readable, modern
const hanken = Hanken_Grotesk({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-hanken',
  display:  'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SEO.url),
  title: {
    default:  SEO.title,
    template: '%s | Louis Polo',
  },
  description: SEO.description,
  keywords:    SEO.keywords,
  authors:     [{ name: 'Louis Polo' }],
  creator:     'Louis Polo',
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         SEO.url,
    siteName:    'Louis Polo',
    title:       SEO.title,
    description: SEO.description,
    images: [{ url: SEO.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       SEO.title,
    description: SEO.description,
    images:      [SEO.ogImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body className="bg-[var(--color-lp-porcelain)] text-[var(--color-lp-ink)] font-body antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}

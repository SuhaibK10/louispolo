// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx
// Root layout — fonts, metadata, smooth scroll. Light-only.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from 'next'
import { Lora, Hanken_Grotesk } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { DesktopGate }         from '@/components/layout/DesktopGate'
import { SEO } from '@/lib/constants'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────

// Display serif — calm contemporary serif, used for all headings
const lora = Lora({
  subsets:  ['latin'],
  variable: '--font-lora',
  display:  'swap',
})

// Body sans — clean, readable, modern
const hanken = Hanken_Grotesk({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-hanken',
  display:  'swap',
})

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width:             'device-width',
  initialScale:      1,
  viewportFit:       'cover',
  interactiveWidget: 'resizes-content',
}

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
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest:    '/site.webmanifest',
  appleWebApp: { title: 'Louis Polo' },
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lora.variable} ${hanken.variable}`}>
      <body className="bg-[var(--color-lp-porcelain)] text-[var(--color-lp-ink)] font-body antialiased">
        <DesktopGate>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </DesktopGate>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xbzixq74c9");
            `,
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}

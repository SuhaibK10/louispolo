// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx
// Root layout — fonts, metadata, smooth scroll. Light-only.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from 'next'
import { Lora, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { DesktopGate }         from '@/components/layout/DesktopGate'
import { SEO } from '@/lib/constants'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────

// Display serif — calm, contemporary serif, used for hero/section headings
// and the PDP title. Loaded with italic too, for the selective emotional-
// accent pattern (Tailwind's `italic` utility) added later. Product-card
// titles deliberately stay restrained — see .lp-heading-product in
// globals.css, which is NOT this expressive tier.
const lora = Lora({
  subsets:  ['latin'],
  style:    ['normal', 'italic'],
  variable: '--font-lora',
  display:  'swap',
})

// Body sans — refined contemporary sans, even letterforms, elegant at small
// sizes.
const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  variable: '--font-body-sans',
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
    <html lang="en" className={`${lora.variable} ${jakarta.variable}`}>
      <head>
        {/* Opens the connection to the image CDN before the first photo is
            requested, so DNS + TLS handshake isn't on the critical path.
            imagedelivery.net serves every image on every page. */}
        <link rel="preconnect" href="https://imagedelivery.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://imagedelivery.net" />
        {/* Same idea for video — without this, clicking a demo-video play
            button pays the full DNS+TLS handshake cost before the first
            byte can even start downloading, which reads as lag. */}
        {process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CODE && (
          <link
            rel="preconnect"
            href={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CODE}.cloudflarestream.com`}
            crossOrigin=""
          />
        )}
      </head>
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
        {/* Google Analytics 4 — property "Louis Polo", measurement ID
            G-WZV0X0MVK2. Standard gtag.js loader, split into two Scripts
            (the library, then the init call) since it needs to run after
            gtag.js has actually loaded. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WZV0X0MVK2"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WZV0X0MVK2');
            `,
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}

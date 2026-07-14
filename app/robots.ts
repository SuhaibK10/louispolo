// ─────────────────────────────────────────────────────────────────────────────
// app/robots.ts
// Served at /robots.txt — the first file crawlers read.
// Allows the storefront, blocks user-specific pages (cart/checkout/wishlist/
// account) and API routes, and points crawlers at the sitemap.
// Base URL comes from SEO.url in lib/constants.ts, same as app/sitemap.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { SEO } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/cart',
        '/checkout',
        '/wishlist',
        '/compare',
        '/account',
        '/api/',
      ],
    },
    sitemap: `${SEO.url}/sitemap.xml`,
  }
}

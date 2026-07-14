// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts
// Served at /sitemap.xml — the list of pages handed to search engines.
// Product URLs come from config/products.ts, so adding a product there
// automatically adds it here. Cart/checkout/wishlist/account are deliberately
// excluded (user-specific pages that should not be indexed).
// The base URL comes from SEO.url in lib/constants.ts — one place to change
// if the production domain ever moves.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/config/products'
import { SEO }      from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base         = SEO.url
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                    lastModified, changeFrequency: 'weekly',  priority: 1   },
    { url: `${base}/shop`,          lastModified, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/about`,         lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,       lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`,       lastModified, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terms`,         lastModified, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/refund-policy`, lastModified, changeFrequency: 'yearly',  priority: 0.2 },
  ]

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${base}/shop/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}

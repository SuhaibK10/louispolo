// ─────────────────────────────────────────────────────────────────────────────
// lib/assistant/catalog.ts
// What the shopping assistant knows about the catalog. Everything is derived
// from config/products.ts, so a price, colour or spec edited there is picked up
// by the assistant with no second place to update.
//
//  - buildCatalogIndex()  one compact line per product, placed in the system
//                         prompt so most questions need a single model call
//                         (the free Gemini tier is limited by requests/day).
//  - getProductDetails()  the one tool the model can call for specs, features,
//                         warranty, FAQs and per-colour availability.
// ─────────────────────────────────────────────────────────────────────────────

import { PRODUCTS } from '@/config/products'
import type { Product, ProductCategory } from '@/types'

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  trolley:     'trolley',
  set:         'luggage set',
  backpack:    'backpack',
  'office-bag':'office bag',
  vanity:      'vanity case',
  kids:        'kids bag',
  duffle:      'duffle bag',
  overnighter: 'overnighter',
  organizer:   'organizer',
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

/** Never reveal exact stock counts, only a coarse availability label. */
function availability(stock: number, lowStock?: boolean): string {
  if (stock <= 0) return 'out of stock'
  if (lowStock || stock <= 5) return 'low stock'
  return 'in stock'
}

/** Lowest price per size across all colours, in the order sizes first appear. */
function sizePrices(p: Product): { size: string; price: number }[] {
  const lowest = new Map<string, number>()
  for (const v of p.variants) {
    for (const s of v.sizes) {
      const prev = lowest.get(s.size)
      if (prev === undefined || s.price < prev) lowest.set(s.size, s.price)
    }
  }
  return [...lowest.entries()].map(([size, price]) => ({ size, price }))
}

function isSellable(p: Product): boolean {
  return p.variants.some((v) => v.sizes.some((s) => s.stock > 0))
}

/** One line per product. Kept short on purpose: it is sent with every request. */
export function buildCatalogIndex(): string {
  return PRODUCTS.map((p) => {
    const sizes  = sizePrices(p).map((s) => `${s.size} ${inr(s.price)}`).join(', ')
    const colors = p.variants.map((v) => v.color).join('/')
    const sold   = isSellable(p) ? '' : ' [currently out of stock]'
    return `- ${p.name} (${p.slug}) | ${CATEGORY_LABEL[p.category]} | ${sizes} | colours: ${colors}${sold}`
  }).join('\n')
}

export function buildCategorySummary(): string {
  const counts = new Map<ProductCategory, number>()
  for (const p of PRODUCTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return [...counts.entries()]
    .map(([c, n]) => `${CATEGORY_LABEL[c]} (${n})`)
    .join(', ')
}

export type ProductDetails = {
  name:         string
  url:          string
  category:     string
  description:  string
  features:     string[]
  specs:        { label: string; value: string }[]
  warranty:     string | null
  faqs:         { q: string; a: string }[]
  colours: {
    colour: string
    accent: string | null
    sizes:  { size: string; price: string; mrp: string | null; availability: string }[]
  }[]
}

function toDetails(p: Product): ProductDetails {
  return {
    name:        p.name,
    url:         `/shop/${p.slug}`,
    category:    CATEGORY_LABEL[p.category],
    description: p.description,
    features:    p.features.map((f) => f.label),
    specs:       p.specs ?? [],
    warranty:    p.warranty ?? null,
    faqs:        (p.faqs ?? []).slice(0, 6),
    colours: p.variants.map((v) => ({
      colour: v.color,
      accent: v.accentColor ?? null,
      sizes:  v.sizes.map((s) => {
        const mrp = s.mrp ?? p.mrp
        return {
          size:         s.size,
          price:        inr(s.price),
          mrp:          mrp && mrp > s.price ? inr(mrp) : null,
          availability: availability(s.stock, v.lowStock),
        }
      }),
    })),
  }
}

/**
 * Tool handler. Accepts 1 to 3 slugs, so one tool covers both "tell me about
 * X" and "compare X and Y". Unknown slugs are reported back so the model can
 * correct itself instead of guessing.
 */
export function getProductDetails(slugs: unknown): {
  products: ProductDetails[]
  notFound: string[]
} {
  const list = Array.isArray(slugs)
    ? slugs.filter((s): s is string => typeof s === 'string').slice(0, 3)
    : []

  const products: ProductDetails[] = []
  const notFound: string[] = []

  for (const raw of list) {
    const slug = raw.trim().toLowerCase()
    const hit  = PRODUCTS.find((p) => p.slug === slug)
    if (hit) products.push(toDetails(hit))
    else notFound.push(raw)
  }
  return { products, notFound }
}

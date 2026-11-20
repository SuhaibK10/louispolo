// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/catalog.ts
// What the Shopify-site assistant knows about products, built from the live
// Shopify catalog (lib/shopify-assistant/store.ts):
//
//  - buildCatalogIndex()  one compact line per product, placed in the system
//                         prompt so most questions need a single model call.
//  - getProductDetails()  the tool the model calls for descriptions, specs,
//                         warranty and per-colour price and availability.
// ─────────────────────────────────────────────────────────────────────────────

import type { StoreProduct } from './store'

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

const COLOUR_OPTION = /^colou?r$/i

function priceLine(p: StoreProduct): string {
  const prices = p.variants.map((v) => v.price).filter((n) => n > 0)
  if (!prices.length) return 'price on product page'
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const cheapest = p.variants.find((v) => v.price === min)
  const mrp = cheapest?.compareAt && cheapest.compareAt > min ? ` (MRP ${inr(cheapest.compareAt)})` : ''
  return (min === max ? inr(min) : `from ${inr(min)}`) + mrp
}

/** Coarse availability only: never reveal counts (the public feed has none anyway). */
function stockLine(p: StoreProduct): string {
  const avail = p.variants.filter((v) => v.available).length
  if (avail === 0) return 'out of stock'
  if (avail < p.variants.length) return 'in stock in some options'
  return 'in stock'
}

/** One line per product. Kept short on purpose: it is sent with every request. */
export function buildCatalogIndex(products: StoreProduct[]): string {
  return products
    .map((p) => {
      const opts = p.options
        .map((o) => `${COLOUR_OPTION.test(o.name) ? 'colours' : o.name.toLowerCase()}: ${o.values.join('/')}`)
        .join(' | ')
      return `- ${p.name} | /products/${p.handle} | ${p.type} | ${priceLine(p)}${opts ? ' | ' + opts : ''} | ${stockLine(p)}`
    })
    .join('\n')
}

export function buildTypeSummary(products: StoreProduct[]): string {
  const counts = new Map<string, number>()
  for (const p of products) counts.set(p.type, (counts.get(p.type) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} (${n})`).join(', ')
}

export type ProductDetails = {
  name:        string
  url:         string
  type:        string
  description: string
  options:     { name: string; values: string[] }[]
  variants:    { option: string; price: string; mrp: string | null; availability: 'in stock' | 'out of stock' }[]
}

function toDetails(p: StoreProduct): ProductDetails {
  return {
    name:        p.name,
    url:         `/products/${p.handle}`,
    type:        p.type,
    description: p.description,
    options:     p.options,
    variants:    p.variants.map((v) => ({
      option:       v.title,
      price:        inr(v.price),
      mrp:          v.compareAt && v.compareAt > v.price ? inr(v.compareAt) : null,
      availability: v.available ? 'in stock' : 'out of stock',
    })),
  }
}

/** Accepts handles or "/products/<handle>" paths; unknown ones are reported back. */
export function getProductDetails(
  products: StoreProduct[],
  handles: unknown,
): { products: ProductDetails[]; notFound: string[] } {
  const list = Array.isArray(handles)
    ? handles.filter((h): h is string => typeof h === 'string').slice(0, 3)
    : []
  const found: ProductDetails[] = []
  const notFound: string[] = []
  for (const raw of list) {
    const handle = raw.trim().toLowerCase().replace(/^.*\/products\//, '').replace(/[/?#].*$/, '')
    const hit = products.find((p) => p.handle === handle)
    if (hit) found.push(toDetails(hit))
    else notFound.push(raw)
  }
  return { products: found, notFound }
}

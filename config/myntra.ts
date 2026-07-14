// ─────────────────────────────────────────────────────────────────────────────
// config/myntra.ts
// Products stocked on Myntra. While our own logistics/payment setup is
// pending, these products sell through Myntra: the card and PDP show the
// Myntra street price + rating and the buy CTA deep-links to the listing.
//
// Products WITHOUT an entry here keep the normal add-to-cart flow.
// Prices/ratings snapshot: 2026-07-14 from myntra.com/louis-polo.
// Matched to our catalog via MRP (Myntra MRP == our size price).
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductSize } from '@/types'

export interface MyntraSizeListing {
  url: string
  price: number
  rating?: number
  ratingCount?: number
}

export interface MyntraListing {
  /** Default listing (used when no size is selected) */
  url: string
  /** Lowest street price across sizes, for "From ₹—" display */
  fromPrice: number
  /** Headline rating shown on cards — from the most-reviewed listing */
  rating?: number
  ratingCount?: number
  sizes?: Partial<Record<ProductSize, MyntraSizeListing>>
}

const M = 'https://www.myntra.com'

export const MYNTRA_LISTINGS: Record<string, MyntraListing> = {
  skytrail: {
    url: `${M}/trolley-bag/louis+polo/louis-polo-skytrail-textured-hard-sided-cabin-trolley-suitcase--volume-48l/40284512/buy`,
    fromPrice: 1949,
    rating: 4.29,
    ratingCount: 143,
    sizes: {
      'Cabin':  { url: `${M}/trolley-bag/louis+polo/louis-polo-skytrail-textured-hard-sided-cabin-trolley-suitcase--volume-48l/40284512/buy`,        price: 1949, rating: 4.29, ratingCount: 143 },
      'Medium': { url: `${M}/trolley-bag/louis+polo/louis-polo-skytrail-textured-hard-sided-medium-trolley-suitcase--volume-782-l/40284520/buy`,     price: 2299, rating: 4.29, ratingCount: 143 },
      'Large':  { url: `${M}/trolley-bag/louis+polo/louis-polo-skytrail-textured-hard-sided-large-trolley-suitcase--volume-117-l/40284525/buy`,      price: 2649, rating: 4.29, ratingCount: 143 },
    },
  },
  veezoom: {
    url: `${M}/trolley-bag/louis+polo/louis-polo-veezoom-textured-hard-sided-cabin-trolley-suitcase--volume-47-l/40284514/buy`,
    fromPrice: 1999,
    rating: 4.76,
    ratingCount: 21,
    sizes: {
      'Cabin':  { url: `${M}/trolley-bag/louis+polo/louis-polo-veezoom-textured-hard-sided-cabin-trolley-suitcase--volume-47-l/40284514/buy`,                 price: 1999, rating: 4.76, ratingCount: 21 },
      'Medium': { url: `${M}/trolley-bag/louis+polo/louis-polo-veezoom-textured-360-degree-rotation-medium-trolley-suitcase---81-l/40284517/buy`,             price: 2349, rating: 4.23, ratingCount: 26 },
      'Large':  { url: `${M}/trolley-bag/louis+polo/louis-polo--veezoom-yellow-large-hard-sided-trolley-bag/40284523/buy`,                                    price: 6299, rating: 4.11, ratingCount: 27 },
    },
  },
  softsquare: {
    url: `${M}/trolley-bag/louis+polo/louis-polo-softsquare-textured-hard-sided-cabin-trolley-suitcase---volume-47l/40284530/buy`,
    fromPrice: 1999,
    rating: 4.33,
    ratingCount: 6,
    sizes: {
      'Cabin':  { url: `${M}/trolley-bag/louis+polo/louis-polo-softsquare-textured-hard-sided-cabin-trolley-suitcase---volume-47l/40284530/buy`,              price: 1999 },
      'Medium': { url: `${M}/trolley-bag/louis+polo/louis-polo-softsquare-textured-hard-sided-medium-trolley-suitcase---volume-839l/40284528/buy`,            price: 2349, rating: 4.33, ratingCount: 6 },
      'Large':  { url: `${M}/trolley-bag/louis+polo/louis-polo-softsquare-large-trolley-suitcase---volume-125-l/40284538/buy`,                                price: 2649, rating: 4.14, ratingCount: 7 },
    },
  },
  prostripe: {
    url: `${M}/trolley-bag/louis+polo/louis-polo-prostripe-front-opening-hard-sided-20-inch-trolley-suitcase--56-l/40280794/buy`,
    fromPrice: 2949,
    rating: 4.2,
    ratingCount: 15,
    sizes: {
      'Cabin': { url: `${M}/trolley-bag/louis+polo/louis-polo-prostripe-front-opening-hard-sided-20-inch-trolley-suitcase--56-l/40280794/buy`, price: 2949, rating: 4.2, ratingCount: 15 },
    },
  },
  motostripe: {
    url: `${M}/trolley-bag/louis+polo/louis-polo-motostripe-cabin-trolley-suitcase---volume-49-l/40280796/buy`,
    fromPrice: 1949,
    rating: 4.8,
    ratingCount: 10,
    sizes: {
      'Cabin': { url: `${M}/trolley-bag/louis+polo/louis-polo-motostripe-cabin-trolley-suitcase---volume-49-l/40280796/buy`, price: 1949, rating: 4.8, ratingCount: 10 },
    },
  },
  hexcore: {
    url: `${M}/laptop-bag/louis+polo/louis-polo-unisex-hexcore-textured-laptop-bag/40280795/buy`,
    fromPrice: 1524,
    rating: 4.18,
    ratingCount: 17,
    sizes: {
      'One Size': { url: `${M}/laptop-bag/louis+polo/louis-polo-unisex-hexcore-textured-laptop-bag/40280795/buy`, price: 1524, rating: 4.18, ratingCount: 17 },
    },
  },
  'veezoom-set': {
    url: `${M}/trolley-bag/louis+polo/louis-polo-veezoom-set-of-3-textured-trolley-suitcase---cabin--medium--large/40284516/buy`,
    fromPrice: 6949,
    sizes: {
      'Set of 3': { url: `${M}/trolley-bag/louis+polo/louis-polo-veezoom-set-of-3-textured-trolley-suitcase---cabin--medium--large/40284516/buy`, price: 6949 },
    },
  },
}

export function getMyntraListing(slug: string): MyntraListing | undefined {
  return MYNTRA_LISTINGS[slug]
}

/** Listing + price for a specific size, falling back to the product default. */
export function getMyntraForSize(slug: string, size: ProductSize | null): { url: string; price: number } | undefined {
  const listing = MYNTRA_LISTINGS[slug]
  if (!listing) return undefined
  if (size && listing.sizes?.[size]) {
    const s = listing.sizes[size]!
    return { url: s.url, price: s.price }
  }
  return { url: listing.url, price: listing.fromPrice }
}

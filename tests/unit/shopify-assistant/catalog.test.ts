import { describe, expect, it } from 'vitest'
import { buildCatalogIndex, getProductDetails } from '@/lib/shopify-assistant/catalog'
import type { StoreProduct } from '@/lib/shopify-assistant/store'

const skytrail: StoreProduct = {
  id: 1,
  name: 'LOUIS POLO SkyTrail 24',
  handle: 'louis-polo-skytrail-24-inch',
  type: 'Luggage',
  description: 'Hard-shell check-in suitcase.',
  options: [{ name: 'Color', values: ['Navy', 'Grey'] }],
  variants: [
    { title: 'Navy', price: 5990, compareAt: 11990, available: true },
    { title: 'Grey', price: 5990, compareAt: 11990, available: false },
  ],
}
const backpack: StoreProduct = {
  id: 2,
  name: 'LOUIS POLO TechTrek Backpack',
  handle: 'louis-polo-techtrek-backpack',
  type: 'Backpack',
  description: 'Laptop backpack.',
  options: [],
  variants: [{ title: 'Default Title', price: 2861, compareAt: null, available: true }],
}
const products = [skytrail, backpack]

describe('getProductDetails (the tool the AI calls)', () => {
  it('accepts plain handles and full product URLs', () => {
    const result = getProductDetails(products, [
      'louis-polo-skytrail-24-inch',
      'https://louispoloworld.com/products/LOUIS-POLO-TECHTREK-BACKPACK?variant=1#reviews',
    ])
    expect(result.notFound).toEqual([])
    expect(result.products.map((p) => p.url)).toEqual([
      '/products/louis-polo-skytrail-24-inch',
      '/products/louis-polo-techtrek-backpack',
    ])
  })

  it('reports unknown handles back instead of guessing', () => {
    expect(getProductDetails(products, ['nope'])).toEqual({ products: [], notFound: ['nope'] })
  })

  it('ignores bad input from the model: non-arrays, non-strings, more than 3 handles', () => {
    expect(getProductDetails(products, 'louis-polo-skytrail-24-inch')).toEqual({ products: [], notFound: [] })
    expect(getProductDetails(products, undefined)).toEqual({ products: [], notFound: [] })
    expect(getProductDetails(products, [42, null, { handle: 'x' }])).toEqual({ products: [], notFound: [] })
    const many = getProductDetails(products, ['a', 'b', 'c', 'louis-polo-skytrail-24-inch'])
    expect(many.notFound).toEqual(['a', 'b', 'c'])
    expect(many.products).toEqual([])
  })

  it('gives per-colour price, MRP and stock without revealing counts', () => {
    const [details] = getProductDetails(products, ['louis-polo-skytrail-24-inch']).products
    expect(details.variants).toEqual([
      { option: 'Navy', price: '₹5,990', mrp: '₹11,990', availability: 'in stock' },
      { option: 'Grey', price: '₹5,990', mrp: '₹11,990', availability: 'out of stock' },
    ])
  })
})

describe('buildCatalogIndex (the product list in the AI prompt)', () => {
  it('writes one short line per product with price, colours and stock', () => {
    const lines = buildCatalogIndex(products).split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe(
      '- LOUIS POLO SkyTrail 24 | /products/louis-polo-skytrail-24-inch | Luggage | ₹5,990 (MRP ₹11,990) | colours: Navy/Grey | in stock in some options',
    )
    expect(lines[1]).toBe(
      '- LOUIS POLO TechTrek Backpack | /products/louis-polo-techtrek-backpack | Backpack | ₹2,861 | in stock',
    )
  })
})

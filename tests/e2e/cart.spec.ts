// Product page → cart, on the Next.js site. Shoppers cannot pick more than the
// stock for a size, and what they add shows up in the cart.
import { expect, test } from '@playwright/test'
import { PRODUCTS } from '@/config/products'
import { getMyntraListing } from '@/config/myntra'
import { defaultSize } from '@/lib/utils'
import { blockOutsideRequests } from './helpers'

// The product page opens on the first colour and its default size. Pick the
// product (sold here, not on Myntra) whose default size has the lowest stock,
// so the test reaches the limit in a few clicks.
const candidates = PRODUCTS.flatMap((product) => {
  const sizes = product.variants[0].sizes
  const size = sizes.find((s) => s.size === defaultSize(sizes))
  return !getMyntraListing(product.slug) && size && size.stock >= 2 ? [{ product, stock: size.stock }] : []
}).sort((a, b) => a.stock - b.stock)

const { product, stock } = candidates[0]

test.beforeEach(async ({ page, baseURL }) => {
  await blockOutsideRequests(page, baseURL)
})

test(`the quantity stops at the stock for the size (${stock} for ${product.slug})`, async ({ page }) => {
  await page.goto(`/shop/${product.slug}`)

  const increase = page.getByRole('button', { name: 'Increase quantity' })
  const quantity = increase.locator('xpath=preceding-sibling::span[1]')
  await expect(quantity).toHaveText('1')

  for (let n = 2; n <= stock; n++) {
    await expect(increase).toBeEnabled()
    await increase.click()
    await expect(quantity).toHaveText(String(n))
  }
  await expect(increase).toBeDisabled()

  await page.getByRole('button', { name: 'Decrease quantity' }).click()
  await expect(quantity).toHaveText(String(stock - 1))
  await expect(increase).toBeEnabled()
})

test('adding to cart shows the item in the cart', async ({ page }) => {
  await page.goto(`/shop/${product.slug}`)
  await page.getByRole('button', { name: 'Increase quantity' }).click()
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await expect(page.getByRole('link', { name: 'Go to Cart' })).toBeVisible()

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lp-cart') ?? 'null'))
  expect(saved?.state?.items).toEqual([
    expect.objectContaining({ productSlug: product.slug, quantity: 2, color: product.variants[0].color }),
  ])

  await page.goto('/cart')
  await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()
  await expect(page.getByText(product.name).first()).toBeVisible()
})

test('an empty cart says so', async ({ page }) => {
  await page.goto('/cart')
  await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible()
})

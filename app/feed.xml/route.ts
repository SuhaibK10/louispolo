// ─────────────────────────────────────────────────────────────────────────────
// app/feed.xml/route.ts
// Product feed for Meta Commerce Manager (Catalogues → Add products → "Use a
// URL"). Same RSS 2.0 + <g:...> namespace Google Merchant Center uses — Meta
// reads this format too, so nothing custom to learn on their end.
//
// One <item> per (product, color, size) combination, since that's the real
// sellable unit — price and stock both vary by size, not just by product.
// Point Meta's "Enter a URL" field at https://louispolo.in/feed.xml, not the
// homepage; the homepage is HTML for people, this is structured data for
// machines.
//
// Built straight from config/products.ts (this site's actual source of
// truth), so the feed only goes stale the same way the site itself would —
// there's no separate data entry to keep in sync. Meta re-fetches this on
// whatever schedule you set in Commerce Manager (daily by default).
// ─────────────────────────────────────────────────────────────────────────────

import { PRODUCTS } from '@/config/products'
import { pdpUrl } from '@/lib/cloudflareImages'
import { SEO, BRAND } from '@/lib/constants'
import type { ColorVariant } from '@/types'

export const dynamic = 'force-static'

// Same category → display-name mapping as app/admin/media/page.tsx's
// CATEGORY_LABELS — kept local here rather than shared, since this is the
// only other place that needs it and the two lists are small enough that
// duplication is cheaper than the indirection of extracting a shared module.
const CATEGORY_LABELS: Record<string, string> = {
  trolley:      'Trolleys',
  set:          'Sets',
  backpack:     'Backpacks',
  'office-bag': 'Office Bags',
  vanity:       'Vanity Cases',
  kids:         'Kids',
  duffle:       'Duffle Bags',
  overnighter:  'Overnighters',
  organizer:    'Organizers',
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

// ID-safe token for building a feed item's g:id, e.g. "Set of 3" -> "set-of-3".
const slugToken = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Same fallback chain used everywhere on the site a color's image is
// resolved (ProductInfo.tsx, ProductCard.tsx, BestSellersCarousel.tsx,
// QuickViewModal.tsx) — a variant's own images override the product's,
// falling back to the product's images if the variant has none of its own.
function resolveImages(images: string[] | undefined, product: (typeof PRODUCTS)[number], colorIndex: number): string[] {
  if (images?.length) return images
  const fallback = product.images[colorIndex] ?? product.images[0]
  return fallback ? [fallback] : product.images
}

function buildItems(): string[] {
  const items: string[] = []

  for (const product of PRODUCTS) {
    const productType = CATEGORY_LABELS[product.category] ?? product.category

    product.variants.forEach((variant: ColorVariant, colorIndex: number) => {
      const resolvedImages = resolveImages(variant.images, product, colorIndex)
      const [primaryImageId, ...additionalImageIds] = resolvedImages

      // No real photo to advertise with — skip rather than send Meta a
      // broken/placeholder image link, which would get the item rejected.
      if (!primaryImageId || primaryImageId.startsWith('data:')) return

      const imageLink = pdpUrl(primaryImageId, product.imageFit)
      const additionalImageLinks = additionalImageIds
        .filter((id) => !id.startsWith('data:'))
        .slice(0, 10) // Meta's own cap on g:additional_image_link
        .map((id) => pdpUrl(id, product.imageFit))

      const link = `${SEO.url}/shop/${product.slug}?color=${encodeURIComponent(variant.color)}`

      for (const sizeOption of variant.sizes) {
        const mrp = sizeOption.mrp ?? product.mrp
        const onSale = typeof mrp === 'number' && mrp > sizeOption.price
        const priceValue = onSale ? mrp! : sizeOption.price
        const salePriceValue = onSale ? sizeOption.price : null

        const id = `${product.id}-${slugToken(variant.color)}-${slugToken(sizeOption.size)}`
        const availability = sizeOption.stock > 0 ? 'in stock' : 'out of stock'

        const fields = [
          `<g:id>${escapeXml(id)}</g:id>`,
          `<title>${escapeXml(`${product.name} - ${variant.color}${sizeOption.size !== 'One Size' ? ` - ${sizeOption.size}` : ''}`)}</title>`,
          `<description>${escapeXml(product.description)}</description>`,
          `<link>${escapeXml(link)}</link>`,
          `<g:image_link>${escapeXml(imageLink)}</g:image_link>`,
          ...additionalImageLinks.map((url) => `<g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`),
          `<g:availability>${availability}</g:availability>`,
          `<g:condition>new</g:condition>`,
          `<g:price>${priceValue.toFixed(2)} INR</g:price>`,
          ...(salePriceValue !== null ? [`<g:sale_price>${salePriceValue.toFixed(2)} INR</g:sale_price>`] : []),
          `<g:brand>${escapeXml(BRAND.name)}</g:brand>`,
          `<g:product_type>${escapeXml(productType)}</g:product_type>`,
          `<g:item_group_id>${escapeXml(product.id)}</g:item_group_id>`,
          `<g:color>${escapeXml(variant.color)}</g:color>`,
          `<g:size>${escapeXml(sizeOption.size)}</g:size>`,
          // No GTIN/barcode data in the catalog — sku (when present) stands
          // in as the manufacturer part number; without either, Meta expects
          // an explicit identifier_exists:no rather than silently guessing.
          ...(sizeOption.sku
            ? [`<g:mpn>${escapeXml(sizeOption.sku)}</g:mpn>`]
            : [`<g:identifier_exists>no</g:identifier_exists>`]),
        ]

        items.push(`<item>\n${fields.map((f) => `      ${f}`).join('\n')}\n    </item>`)
      }
    })
  }

  return items
}

export async function GET() {
  const items = buildItems()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(BRAND.name)} product feed</title>
    <link>${escapeXml(SEO.url)}</link>
    <description>${escapeXml(`${BRAND.name} product catalog for Meta Commerce Manager`)}</description>
    ${items.join('\n    ')}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

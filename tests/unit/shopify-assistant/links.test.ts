import { describe, expect, it } from 'vitest'
import { createLinkGuard } from '@/lib/shopify-assistant/links'
import { BRAND } from '@/lib/constants'

const products = [
  { handle: 'louis-polo-skytrail-24-inch', name: 'LOUIS POLO SkyTrail Medium Check-In Suitcase' },
  { handle: 'louis-polo-aero-v-20', name: 'LOUIS POLO Aero-V 20" Cabin Trolley' },
]
const collections = [{ handle: 'cabin-luggage', title: 'Cabin Luggage' }]

/** Runs a whole answer through the guard in one go. */
function clean(text: string) {
  const guard = createLinkGuard(products, collections)
  return guard.push(text) + guard.flush()
}

describe('createLinkGuard', () => {
  it('keeps links to real products and collections', () => {
    expect(clean('Try the [SkyTrail](/products/louis-polo-skytrail-24-inch).'))
      .toBe('Try the [SkyTrail](/products/louis-polo-skytrail-24-inch).')
    expect(clean('See [cabin bags](/collections/cabin-luggage)'))
      .toBe('See [cabin bags](/collections/cabin-luggage)')
  })

  it('normalises absolute and upper-case product URLs to a site path', () => {
    expect(clean('[SkyTrail](https://louispoloworld.com/products/LOUIS-POLO-SKYTRAIL-24-INCH/)'))
      .toBe('[SkyTrail](/products/louis-polo-skytrail-24-inch)')
  })

  it('repairs a mistyped handle when the link text is the exact product name', () => {
    expect(clean('[LOUIS POLO SkyTrail Medium Check-In Suitcase](/products/skytrail-24)'))
      .toBe('[LOUIS POLO SkyTrail Medium Check-In Suitcase](/products/louis-polo-skytrail-24-inch)')
  })

  it('repairs a mistyped collection handle from the collection title', () => {
    expect(clean('[Cabin Luggage](/collections/cabin-bags)'))
      .toBe('[Cabin Luggage](/collections/cabin-luggage)')
  })

  it('reduces invented or outside links to their plain label', () => {
    expect(clean('Buy the [Mystery Bag](/products/does-not-exist) now')).toBe('Buy the Mystery Bag now')
    expect(clean('Read [this](https://evil.example.com/phish)')).toBe('Read this')
    expect(clean('[click](javascript:alert(1))')).not.toContain('javascript:')
  })

  it('turns the WhatsApp link into the plain URL', () => {
    expect(clean(`Chat with us on [WhatsApp](${BRAND.whatsapp})`)).toBe(`Chat with us on ${BRAND.whatsapp}`)
  })

  it('holds back a link split across streamed chunks until it is complete', () => {
    const guard = createLinkGuard(products, collections)
    expect(guard.push('Try the [SkyTr')).toBe('Try the ')
    expect(guard.push('ail](/products/louis-polo-sky')).toBe('')
    expect(guard.push('trail-24-inch) today')).toBe('[SkyTrail](/products/louis-polo-skytrail-24-inch) today')
    expect(guard.flush()).toBe('')
  })

  it('releases an unfinished bracket at the end of the answer', () => {
    const guard = createLinkGuard(products, collections)
    expect(guard.push('Sizes [20 or 24')).toBe('Sizes ')
    expect(guard.flush()).toBe('[20 or 24')
  })
})

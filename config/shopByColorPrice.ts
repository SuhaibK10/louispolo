// ─────────────────────────────────────────────────────────────────────────────
// config/shopByColorPrice.ts
// Content for the homepage "Take What You Need" section (Color / Size tabs)
// — a parallel-tab section styled like CategoryGrid + BestSellersCarousel.
// Both tabs work the same way: a row of clickable options above a
// horizontal drag-scroll carousel of matching products, computed directly
// from PRODUCTS in the component. Nothing else to configure here.
//
// Homepage switch — flip to false to pull this section off the homepage.
// ─────────────────────────────────────────────────────────────────────────────

export const SHOP_BY_COLOR_PRICE_HOME_ENABLED = false

// Products carry ~28 distinct literal color names (Grey, Charcoal Grey,
// Metallic Grey, Zen Gray, ...) — grouped into 13 clickable swatches here so
// the Color tab isn't a 28-option row. Each swatch's `matches` list is every
// literal `variant.color` string on the shop page that should count as "in"
// this group. Add new colors to the matching group's list as new
// products/colors are added.
//
// Derived by clustering every product's representative hex (bodyHex when
// set, since a few products use colorHex for an accent/zipper trim rather
// than the main shell — falling back to that raw colorHex would misplace
// them, e.g. a White variant whose colorHex is a brown zipper) by
// hue/saturation/lightness: anything under ~12% saturation reads as a
// neutral (grouped by lightness into Black/Dark Grey/Grey/Silver),
// everything else grouped by hue.
export interface ColorSwatch {
  label:   string
  hex:     string   // representative hex for the swatch dot
  matches: string[] // every literal variant.color value in this group
}

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    label: 'Black',
    hex: '#212121',
    matches: ['Black', 'Metallic Black', 'Charcoal', 'Carbon Fiber', 'Tangy Black'],
  },
  {
    label: 'Dark Grey',
    hex: '#4A4945',
    matches: ['Charcoal Grey'],
  },
  {
    label: 'Grey',
    hex: '#757575',
    matches: ['Grey', 'Metallic Grey', 'Zen Gray'],
  },
  {
    label: 'Silver & Light Grey',
    hex: '#BDBDBD',
    matches: ['Gray', 'Silver', 'Silver Brush', 'Onyx Silver', 'Stone Grey', 'Brushed Silver', 'Metallic Silver'],
  },
  {
    label: 'Red',
    hex: '#C62828',
    matches: ['Crimson Red', 'Patriot Red', 'Red', 'Pop Red'],
  },
  {
    label: 'Orange & Tan',
    hex: '#E08423',
    matches: ['Blaze Orange', 'Amber Orange', 'Warm Sand'],
  },
  {
    label: 'Yellow & Gold',
    hex: '#F2C14E',
    matches: ['Yellow', 'Moon Yellow'],
  },
  {
    label: 'Cream & White',
    hex: '#F5F3EC',
    matches: ['Signature Cream', 'Ivory', 'Bold White', 'Tech White', 'White'],
  },
  {
    label: 'Olive & Green',
    hex: '#464B38',
    matches: ['Emerald Green', 'Olive Green', 'Lime Green', 'Green', 'Sage Mist'],
  },
  {
    label: 'Teal & Turquoise',
    hex: '#00B0C8',
    matches: ['Mint Green', 'Royal Teal', 'Turquoise Blue', 'Turquoise'],
  },
  {
    label: 'Sky Blue',
    hex: '#4FC3F7',
    matches: ['Sky Blue', 'Tender Blue', 'Ice Blue'],
  },
  {
    label: 'Blue & Navy',
    hex: '#1565C0',
    matches: ['Blue', 'Midnight Blue', 'Navy Blue', 'Midnight Navy', 'Citrine Blue', 'Navy'],
  },
  {
    label: 'Pink, Rose & Purple',
    hex: '#D8556F',
    matches: ['Blossom Pink', 'Blush Pink', 'Rose Gold', 'Rosegold', 'Pink', 'Purple'],
  },
]

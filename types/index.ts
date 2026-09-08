// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// All TypeScript types. One place. No 'any' anywhere.
// ─────────────────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'trolley'
  | 'set'
  | 'backpack'
  | 'office-bag'
  | 'vanity'
  | 'kids'
  | 'duffle'
  | 'overnighter'
  | 'organizer'

export type ProductSize = 'Cabin' | 'Medium' | 'Large' | 'Cabin + Medium' | 'Set of 2' | 'Set of 3' | 'One Size' | '8 Inch' | '9 Inch' | '11 Inch' | '12 Inch' | '14 Inch' | '16 Inch' | '17 Inch' | '18 Inch' | '19 Inch' | '20 Inch'

export type ProductTag =
  | 'Best Seller'
  | 'New Arrival'
  | 'Exclusive'
  | 'Limited Edition'
  | 'Flagship'
  | 'Selling Fast'

// ─── Product & Variant ───────────────────────────────────────────────────────

export interface ProductFeature {
  label: string
}

// Editorial detail block — short heading + body, shown in the "In Detail"
// section of the PDP. Two or three per product, written in brand voice.
// When `image` is set, the block renders as an alternating image+text
// panel instead of the plain numbered-list row.
export interface ProductHighlight {
  heading: string
  body: string
  image?: string
  imageFit?: 'pad' | 'cover'
}

// One row of the Specifications accordion,
// e.g. { label: 'Shell', value: 'Polycarbonate + ABS' }
export interface SpecRow {
  label: string
  value: string
}

export interface ProductFAQ {
  q: string
  a: string
}

export interface SizeOption {
  size: ProductSize
  price: number
  stock: number
  sku?: string
}

export interface ColorVariant {
  color: string
  colorHex: string      // accent / zipper color
  bodyHex?: string      // main shell / body color
  accentColor?: string  // accent / zipper color name (shown alongside color)
  sizes: SizeOption[]
  lowStock?: boolean
  images?: string[]     // per-color gallery — overrides Product.images[index] when set
  demoVideoYoutubeId?: string  // per-color video — overrides Product.demoVideoYoutubeId when set
}

export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  /** Extra categories this product should also show up under, beyond its primary `category` (which still governs the displayed category label). */
  additionalCategories?: ProductCategory[]
  tag?: ProductTag
  isFeatured?: boolean
  saleExclusive?: boolean
  mrp?: number  // strike-through "original" price, shown alongside the current price when set
  recentPurchases?: number  // e.g. 174 — shows a quiet "X bought in the last 7 days" badge on the PDP
  demoVideoId?: string  // Cloudflare Stream video UID — shows a play button next to Wishlist on the PDP
  demoVideoYoutubeId?: string  // YouTube video ID — trial alternative to demoVideoId, embeds via iframe instead
  // How this product's photos should be fit into their frame. Omit for the
  // default 'pad' (a transparent cutout padded onto a flat background — the
  // whole catalog so far). Set to 'cover' for full-bleed lifestyle/studio
  // shots that carry their own backdrop rather than a removed background.
  imageFit?: 'pad' | 'cover'
  hideSizeSelector?: boolean  // skip the size-chip row entirely — auto-selects the product's only size
  description: string
  // Cloudinary public_ids — transform on the fly via URL
  // e.g. "louispolo/products/aerosmart/aerosmart-red-1"
  images: string[]
  cardZoom?: number       // e.g. 1.3 = zoom in 30% on shop listing card
  hideSizeGuide?: boolean
  features: ProductFeature[]
  variants: ColorVariant[]
  // ── PDP detail content (all optional — sections render only when present) ──
  story?: string[]               // long-form paragraphs for the "In Detail" section
  highlights?: ProductHighlight[]
  specs?: SpecRow[]              // Specifications accordion rows
  warranty?: string              // e.g. '3-year manufacturer warranty'
  faqs?: ProductFAQ[]
  // ── SEO (optional — PDP metadata falls back to name/description) ──
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  variantKey: string          // `${productId}-${color}-${size}`
  productId: string
  productName: string
  productSlug: string
  image: string
  color: string
  colorHex: string
  size: ProductSize | null
  price: number
  quantity: number
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
}

export interface CategoryChip {
  label: string
  value: ProductCategory | 'all'
}

export interface HeroSlide {
  image: string          // mobile (9:16 portrait)
  desktopImage?: string  // desktop (16:9 landscape) — falls back to image if omitted
  headline?: string
  subline?: string
  isVideo?: boolean
  showCta?: boolean
  textStyle?:    'light' | 'dark' | 'shadow' | 'pill'
  textSize?:     'xl' | 'lg' | 'md'
  textPosition?: 'top' | 'center' | 'bottom'
  textOffset?:   number
  mobileObjectPosition?:  string  // CSS object-position for the mobile image, e.g. '30% center'
  desktopObjectPosition?: string  // CSS object-position for the desktop image, e.g. '30% center'
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

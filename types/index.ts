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

export type ProductSize = 'Cabin' | 'Medium' | 'Large' | 'Set of 3' | 'One Size' | '9 Inch' | '12 Inch' | '17 Inch' | '20 Inch'

export type ProductTag =
  | 'Best Seller'
  | 'New Arrival'
  | 'Exclusive'
  | 'Limited Edition'

// ─── Product & Variant ───────────────────────────────────────────────────────

export interface ProductFeature {
  label: string
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
}

export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  tag?: ProductTag
  isFeatured?: boolean
  description: string
  // Cloudinary public_ids — transform on the fly via URL
  // e.g. "louispolo/products/aerosmart/aerosmart-red-1"
  images: string[]
  cardZoom?: number       // e.g. 1.3 = zoom in 30% on shop listing card
  hideSizeGuide?: boolean
  features: ProductFeature[]
  variants: ColorVariant[]
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
  textStyle?:    'light' | 'dark' | 'shadow' | 'pill' | 'gold' | 'teal'
  textSize?:     'xl' | 'lg' | 'md'
  textPosition?: 'top' | 'center' | 'bottom'
  textOffset?:   number
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

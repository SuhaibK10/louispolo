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

export type ProductSize = '20"' | '24"' | '28"' | 'Set of 3' | 'One Size'

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
  colorHex: string
  sizes: SizeOption[]
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
  // Cloudinary public_id
  image: string
  // Optional overlay headline
  headline?: string
  subline?: string
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// config/products.ts
// THE single place to add, edit, or remove products.
//
// IMAGES: Use Cloudinary public_ids (not full URLs).
// The cld() helper in lib/cloudinary.ts builds the URL with transforms.
// Upload images to Cloudinary folder: louispolo/products/{slug}/
// Example public_id: "louispolo/products/aerosmart/aerosmart-red-1"
//
// TO ADD A PRODUCT:  add an object to PRODUCTS array below.
// TO REMOVE:         delete the object.
// TO ADD A COLOR:    add to the variants array inside the product.
// TO ADD A SIZE:     add to the sizes array inside the color variant.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product, HeroSlide } from '@/types'

// ─── Hero Slides ─────────────────────────────────────────────────────────────
// 3-4 images that auto-slide in the hero section.
// Replace public_ids with your Cloudinary uploads.
export const HERO_SLIDES: HeroSlide[] = [
  {
    image: 'https://res.cloudinary.com/dpepctqdj/image/upload/v1781504029/ChatGPT_Image_Jun_15_2026_at_11_43_24_AM_upwxum.png',
    
    
  },
  {
    image: 'https://res.cloudinary.com/dpepctqdj/image/upload/v1781515909/Generated_Image_June_15_2026_-_2_56PM_fopldm.jpg',
    
    
  },
  {
    image: 'https://res.cloudinary.com/dpepctqdj/video/upload/v1781555131/Ultra_realistic_luxury_product_dknwps.mp4',
    isVideo: true,

  },
  {
    image: 'https://res.cloudinary.com/dpepctqdj/image/upload/v1781517318/Generated_Image_June_15_2026_-_3_24PM_ixhfbq.jpg',
    
    
  },
]

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  // ── AeroSmart 3-in-1 ────────────────────────────────────────────────────
  {
    id: 'aerosmart-3in1',
    name: 'AeroSmart 3-in-1',
    slug: 'aerosmart-3in1',
    category: 'trolley',
    isFeatured: true,
    description:
      'Our most innovative design — front laptop pocket, side multipurpose pocket, and main cabin. Three-way access so you never dig through your bag at security again.',
    images: [
      '1C6A9437_Large_Background_Removed_l7k4xk',
      '1C6A9495_Background_Removed_czmfug',
      '1C6A9455_Large_Background_Removed_xydl9r',
    ],
    features: [
      { label: '3-in-1 compartments' },
      { label: '360° spinner wheels' },
      { label: 'Hard shell ABS' },
      { label: 'Telescopic handle' },
    ],
    variants: [
      {
        color: 'Red',
        colorHex: '#C0392B',
        sizes: [
          { size: 'Cabin', price: 8500, stock: 40, sku: '8906206840001-R-20' },
          { size: 'Medium', price: 9500, stock: 30, sku: '8906206840001-R-24' },
          { size: 'Large', price: 10500, stock: 20, sku: '8906206840001-R-28' },
        ],
      },
      {
        color: 'Teal',
        colorHex: '#2C9E8F',
        sizes: [
          { size: 'Cabin', price: 8500, stock: 35, sku: '8906206840001-T-20' },
          { size: 'Medium', price: 9500, stock: 25, sku: '8906206840001-T-24' },
          { size: 'Large', price: 10500, stock: 15, sku: '8906206840001-T-28' },
        ],
      },
      {
        color: 'Brown',
        colorHex: '#7D5A3C',
        sizes: [
          { size: 'Cabin', price: 8500, stock: 30, sku: '8906206840001-B-20' },
          { size: 'Medium', price: 9500, stock: 20, sku: '8906206840001-B-24' },
        ],
      },
      {
        color: 'Yellow',
        colorHex: '#F4C430',
        sizes: [
          { size: 'Cabin', price: 8500, stock: 25, sku: '8906206840001-Y-20' },
        ],
      },
    ],
  },

  // ── SkyTrail ────────────────────────────────────────────────────────────
  {
    id: 'skytrail',
    name: 'SkyTrail',
    slug: 'skytrail',
    category: 'trolley',
    isFeatured: true,
    description:
      'Built for the frequent flyer. SkyTrail combines a sleek hard shell ABS body with 360° spinner wheels and combination lock — smooth, secure, and ready for boarding.',
    images: [
      'IMG_2853_Background_Removed_bezyzs',
      'IMG_2853_Background_Removed_bezyzs',
      'IMG_2853_Background_Removed_bezyzs',
    ],
    features: [
      { label: '360° spinner wheels' },
      { label: 'Combination lock' },
      { label: 'Telescopic handle' },
      { label: 'Hard shell ABS' },
    ],
    variants: [
      {
        color: 'Blue',
        colorHex: '#1E88E5',
        sizes: [
          { size: 'Cabin', price: 9099, stock: 50, sku: '8906206840292' },
          { size: 'Medium', price: 10649, stock: 40, sku: '8906206840308' },
          { size: 'Large', price: 12550, stock: 30, sku: '8906206840315' },
        ],
      },
      {
        color: 'Grey',
        colorHex: '#9E9E9E',
        sizes: [
          { size: 'Cabin', price: 9099, stock: 50, sku: '8906206840346' },
          { size: 'Medium', price: 10649, stock: 40, sku: '8906206840339' },
          { size: 'Large', price: 12550, stock: 30, sku: '8906206840322' },
        ],
      },
    ],
  },

  // ── VeeZoom ─────────────────────────────────────────────────────────────
  {
    id: 'veezoom',
    name: 'VeeZoom',
    slug: 'veezoom',
    category: 'trolley',
    isFeatured: true,
    description:
      'Bold V-pattern design that stands out on every conveyor belt. Hard shell ABS with ultra-smooth spinner wheels — because your luggage should be as ambitious as you are.',
    images: [
      'VeeZoom__Yellow_lpokls',
      'VeeZoom__Yellow_lpokls',
      'VeeZoom__Yellow_lpokls',
    ],
    features: [
      { label: '360° spinner wheels' },
      { label: 'Telescopic handle' },
      { label: 'Hard shell ABS' },
      { label: 'Lightweight build' },
    ],
    variants: [
      {
        color: 'Yellow',
        colorHex: '#FDD835',
        sizes: [
          { size: 'Cabin', price: 9099, stock: 50, sku: '8906206840230' },
          { size: 'Medium', price: 10649, stock: 40, sku: '8906206840247' },
          { size: 'Large', price: 12550, stock: 30, sku: '8906206840254' },
        ],
      },
      {
        color: 'Black',
        colorHex: '#212121',
        sizes: [
          { size: 'Cabin', price: 9099, stock: 50, sku: '8906206840285' },
          { size: 'Medium', price: 10649, stock: 40, sku: '8906206840278' },
          { size: 'Large', price: 12550, stock: 30, sku: '8906206840261' },
        ],
      },
    ],
  },

  // ── SoftSquare ──────────────────────────────────────────────────────────
  {
    id: 'softsquare',
    name: 'SoftSquare',
    slug: 'softsquare',
    category: 'trolley',
    isFeatured: true,
    description:
      'Clean geometric lines meet premium ABS protection. SoftSquare is the one for people who travel often and want luggage that looks good on day 50 as it did on day 1.',
    images: [
      '1-8_Large_Background_Removed_zodwmf',
      'louispolo/products/softsquare/softsquare-blue-1',
      'louispolo/products/softsquare/softsquare-black-1',
    ],
    features: [
      { label: '360° spinner wheels' },
      { label: 'Combination lock' },
      { label: 'Telescopic handle' },
      { label: 'Hard shell ABS' },
    ],
    variants: [
      {
        color: 'Rosegold',
        colorHex: '#B76E79',
        sizes: [
          { size: 'Cabin', price: 9490, stock: 40, sku: '8906206840353' },
          { size: 'Medium', price: 10990, stock: 30, sku: '8906206840360' },
          { size: 'Large', price: 12490, stock: 25, sku: '8906206840377' },
        ],
      },
      {
        color: 'Blue',
        colorHex: '#1E88E5',
        sizes: [
          { size: 'Cabin', price: 9490, stock: 40, sku: '8906206840407' },
          { size: 'Medium', price: 10990, stock: 30, sku: '8906206840384' },
          { size: 'Large', price: 12490, stock: 25, sku: '8906206840391' },
        ],
      },
      {
        color: 'Black',
        colorHex: '#212121',
        sizes: [
          { size: 'Cabin', price: 9490, stock: 40, sku: '8906206840414' },
          { size: 'Medium', price: 10990, stock: 30, sku: '8906206840438' },
          { size: 'Large', price: 12490, stock: 25, sku: '8906206840421' },
        ],
      },
    ],
  },

  // ── ProStripe ───────────────────────────────────────────────────────────
  {
    id: 'prostripe',
    name: 'ProStripe',
    slug: 'prostripe',
    category: 'trolley',
    isFeatured: false,
    description:
      'Front-open design for the business traveller who moves fast. Instant access to your laptop, documents, and essentials without opening the main compartment.',
    images: [
      '2-5_2_Background_Removed_o4wue3',
      '9_Background_Removed_2_rlmt2x',
    ],
    features: [
      { label: 'Front open design' },
      { label: '360° spinner wheels' },
      { label: 'Combination lock' },
      { label: 'Telescopic handle' },
    ],
    variants: [
      {
        color: 'Grey',
        colorHex: '#9E9E9E',
        sizes: [
          { size: 'Cabin', price: 13259, stock: 20, sku: '8906206840056' },
        ],
      },
      {
        color: 'Black',
        colorHex: '#212121',
        sizes: [
          { size: 'Cabin', price: 13259, stock: 20, sku: '8906206840117' },
        ],
      },
    ],
  },

  // ── MotoStripe ──────────────────────────────────────────────────────────
  {
    id: 'motostripe',
    name: 'MotoStripe',
    slug: 'motostripe',
    category: 'trolley',
    isFeatured: true,
    description:
      'Racing-inspired stripe design on a polycarbonate shell. Lightweight, impact-resistant, and fast through the terminal. MotoStripe is for people who move.',
    images: [
      'IMG_2892_Background_Removed_dnutdx',
      '1-13_Background_Removed_c0oxox',
      '1-13_Background_Removed_c0oxox',
    ],
    features: [
      { label: '360° spinner wheels' },
      { label: 'Polycarbonate shell' },
      { label: 'Telescopic handle' },
      { label: 'Ultra lightweight' },
    ],
    variants: [
      {
        color: 'Grey',
        colorHex: '#9E9E9E',
        sizes: [{ size: 'Cabin', price: 8899, stock: 30, sku: '8906206840186' }],
      },
      {
        color: 'Green',
        colorHex: '#43A047',
        sizes: [{ size: 'Cabin', price: 8899, stock: 30, sku: '8906206840162' }],
      },
      {
        color: 'Blue',
        colorHex: '#1E88E5',
        sizes: [{ size: 'Cabin', price: 8899, stock: 30, sku: '8906206840179' }],
      },
    ],
  },

  

  

  // ── ArmorPack (Backpack) ─────────────────────────────────────────────────
  {
    id: 'armorpack',
    name: 'ArmorPack',
    slug: 'armorpack',
    category: 'backpack',
    isFeatured: true,
    description:
      'Hard shell protection in a backpack form. ArmorPack keeps your laptop, camera, and essentials safe without adding bulk. Adjustable straps, rigid outer shell, secure zip.',
    images: [
      '1-2_Large_Background_Removed_xialtl',
      '1-2_Large_Background_Removed_xialtl',
    ],
    features: [
      { label: 'Hard shell protection' },
      { label: 'Adjustable shoulder straps' },
      { label: 'Laptop compartment' },
      { label: 'Secure zip closure' },
    ],
    variants: [
      {
        color: 'Carbon Fiber',
        colorHex: '#2C2C2C',
        sizes: [
          { size: 'One Size', price: 8499, stock: 30, sku: '8906206840209' },
        ],
      },
      {
        color: 'Silver Brush',
        colorHex: '#C0C0C0',
        sizes: [
          { size: 'One Size', price: 8499, stock: 30, sku: '8906206840193' },
        ],
      },
    ],
  },

  // ── HexCore (Office Bag) ─────────────────────────────────────────────────
  {
    id: 'hexcore',
    name: 'HexCore',
    slug: 'hexcore',
    category: 'office-bag',
    isFeatured: false,
    description:
      'Rigid hard shell office bag built for daily professional use. Documents stay flat, tech stays safe, and you arrive looking sharp. The briefcase for people who hate briefcases.',
    images: [
      'hexcore_vhfwcc.png',
      'hexcore_vhfwcc.png',
    ],
    features: [
      { label: 'Hard shell protection' },
      { label: 'Professional design' },
      { label: 'Document friendly' },
      { label: 'Secure zip closure' },
    ],
    variants: [
      {
        color: 'Carbon Fiber',
        colorHex: '#2C2C2C',
        sizes: [
          { size: 'One Size', price: 6099, stock: 30, sku: '8906206840216' },
        ],
      },
      {
        color: 'Silver Brush',
        colorHex: '#C0C0C0',
        sizes: [
          { size: 'One Size', price: 6099, stock: 30, sku: '8906206840223' },
        ],
      },
    ],
  },

  // ── SkyTrail Set of 3 ────────────────────────────────────────────────────
  {
    id: 'skytrail-set',
    name: 'SkyTrail — Set of 3',
    slug: 'skytrail-set',
    category: 'set',
    isFeatured: false,
    description:
      '20", 24", and 28" SkyTrail bags in a nesting set — one fits inside another for compact storage at home. The complete setup for every kind of trip.',
    images: [
      'louispolo/products/skytrail-set/skytrail-set-blue-1',
      'louispolo/products/skytrail-set/skytrail-set-grey-1',
    ],
    features: [
      { label: '20", 24" & 28" included' },
      { label: '360° spinner wheels' },
      { label: 'Combination lock' },
      { label: 'Nesting storage design' },
    ],
    variants: [
      {
        color: 'Blue',
        colorHex: '#1E88E5',
        sizes: [
          { size: 'Set of 3', price: 31699, stock: 15, sku: '8906206840087' },
        ],
      },
      {
        color: 'Grey',
        colorHex: '#9E9E9E',
        sizes: [
          { size: 'Set of 3', price: 31699, stock: 15, sku: '8906206840100' },
        ],
      },
    ],
  },

  // ── VeeZoom Set of 3 ─────────────────────────────────────────────────────
  {
    id: 'veezoom-set',
    name: 'VeeZoom — Set of 3',
    slug: 'veezoom-set',
    category: 'set',
    isFeatured: false,
    description:
      'The full VeeZoom family — 20", 24", and 28" in matching bold design. Nesting format for home storage. Everything you need for a week, a month, or forever.',
    images: [
      'louispolo/products/veezoom-set/veezoom-set-yellow-1',
      'louispolo/products/veezoom-set/veezoom-set-black-1',
    ],
    features: [
      { label: '20", 24" & 28" included' },
      { label: '360° spinner wheels' },
      { label: 'Hard shell ABS' },
      { label: 'Nesting storage design' },
    ],
    variants: [
      {
        color: 'Yellow',
        colorHex: '#FDD835',
        sizes: [
          { size: 'Set of 3', price: 31699, stock: 15, sku: '8906206840094' },
        ],
      },
      {
        color: 'Black',
        colorHex: '#212121',
        sizes: [
          { size: 'Set of 3', price: 31699, stock: 15, sku: '8906206840070' },
        ],
      },
    ],
  },

  // ── SoftSquare Set of 3 ──────────────────────────────────────────────────
  {
    id: 'softsquare-set',
    name: 'SoftSquare — Set of 3',
    slug: 'softsquare-set',
    category: 'set',
    isFeatured: false,
    description:
      'Three SoftSquare bags in a matching set. Clean, geometric, and built to last. The smart choice for families and frequent travellers who want everything to match.',
    images: [
      'louispolo/products/softsquare-set/softsquare-set-blue-1',
      'louispolo/products/softsquare-set/softsquare-set-rosegold-1',
    ],
    features: [
      { label: '20", 24" & 28" included' },
      { label: '360° spinner wheels' },
      { label: 'Combination lock' },
      { label: 'Nesting storage design' },
    ],
    variants: [
      {
        color: 'Blue',
        colorHex: '#1E88E5',
        sizes: [
          { size: 'Set of 3', price: 32970, stock: 15, sku: '8906206840148' },
        ],
      },
      {
        color: 'Black',
        colorHex: '#212121',
        sizes: [
          { size: 'Set of 3', price: 32970, stock: 15, sku: '8906206840155' },
        ],
      },
      {
        color: 'Rosegold',
        colorHex: '#B76E79',
        sizes: [
          { size: 'Set of 3', price: 32970, stock: 15, sku: '8906206840131' },
        ],
      },
    ],
  },
]

// ─── Helper: get all featured products ───────────────────────────────────────
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured)

// ─── Helper: get product by slug ─────────────────────────────────────────────
export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug)

// ─── Helper: get products by category ────────────────────────────────────────
export const getProductsByCategory = (category: string): Product[] =>
  category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === category)

// ─── Stats for TrustBar ───────────────────────────────────────────────────────
export const BRAND_STATS = [
  { value: 9,   suffix: '+', label: 'Years of Craft' },
  { value: 50,  suffix: '+', label: 'Products Designed' },
  { value: 13,  suffix: '',  label: 'Product Lines' },
  { value: 100, suffix: '%', label: 'Made in India' },
]

// ─── Category display config ──────────────────────────────────────────────────
export const CATEGORIES = [
  { label: 'All',         value: 'all',        count: PRODUCTS.length },
  { label: 'Trolley Bags',value: 'trolley',    count: PRODUCTS.filter(p => p.category === 'trolley').length },
  { label: 'Sets',        value: 'set',        count: PRODUCTS.filter(p => p.category === 'set').length },
  { label: 'Backpacks',   value: 'backpack',   count: PRODUCTS.filter(p => p.category === 'backpack').length },
  { label: 'Office Bags', value: 'office-bag', count: PRODUCTS.filter(p => p.category === 'office-bag').length },
] as const

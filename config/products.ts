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
    image:     'hero12_h3ptde.jpg',
    headline:  'Every Trip, Covered',
    textStyle: 'shadow',
  },
  {
    image:       'hero123_qezgc2.jpg',
    headline:    'Bold in Every Color',
    textStyle:   'teal',
    textOffset:  1,
  },
  {
    image:        'duffle_kgw8qx.jpg',
    headline:     'Less Bag, More Swag',
    textStyle:    'light',
    textPosition: 'top',
  },
  
  

  {
    image:        'Generated_Image_June_19_2026_-_2_36AM_r9titc.jpg',
    headline:     'The Showstopper: AeroSmart 3in1',
    textStyle:    'light',
    textSize:     'lg',
    textPosition: 'top',
  },
  {
    image:     'heroLast_dkzwim.jpg',
    headline:  'Stop Scrolling. Start Buying.',
    textStyle: 'dark',
    textSize:  'lg',
    showCta:   true,
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
      'Our most innovative design, front laptop pocket, side multipurpose pocket, and main cabin. Three-way access so you never dig through your bag at security again.',
    images: [
      '1C6A9495_Background_Removed_czmfug',
      'IMG_2420_Large_Background_Removed_ed2pt3',
      '1C6A9455_Large_Background_Removed_xydl9r',
      '1C6A9455_Large_Background_Removed_xydl9r'
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
    isFeatured: true,
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

  // ── Champ ────────────────────────────────────────────────────────────────
  {
    id: 'champ',
    name: 'Champ',
    slug: 'champ',
    category: 'trolley',
    isFeatured: true,
    description: ' Lightweight Hard Shell Carry-On',
    images: ['https://res.cloudinary.com/dpepctqdj/image/upload/c_fill,w_600,h_600,g_auto/louis-polo-champ-08-1781602537072-1781602537072_Background_Removed_ywa111.png','https://res.cloudinary.com/dpepctqdj/image/upload/c_fill,w_600,h_600,g_auto/louis-polo-champ-black-08-1781603000214-1781603000214_Background_Removed_dg0xa2'],
    features: [
      { label: 'Hard shell construction' },
    ],
    variants: [
      {
        color: 'Turquoise',
        colorHex: '#40E0D0',
        sizes: [
          { size: 'Cabin', price: 7999, stock: 1000, sku: 'PLACEHOLDER_SKU' },
        ],
      },
      {
        color: 'Black',
        colorHex: '#1A1714',
        sizes: [
          { size: 'Cabin', price: 7999, stock: 1000, sku: 'PLACEHOLDER_SKU' },
        ],
      },
    ],
  },

  // ── Magma ────────────────────────────────────────────────────────────────
  {
    id: 'magma',
    name: 'Magma',
    slug: 'magma',
    category: 'trolley',
    isFeatured: true,
    description: ' Secure Lock Hard Shell Carry-On Suitcase',
    images: ['https://res.cloudinary.com/dpepctqdj/image/upload/c_fill,w_600,h_600,g_auto/louis-polo-magma-blue-08-1781604249533-1781604249533_Background_Removed_i6ef93','https://res.cloudinary.com/dpepctqdj/image/upload/c_fill,w_600,h_600,g_auto/louis-polo-magma-black-08-1781604029524-1781604029524_Background_Removed_gn6fjh'],
    features: [
      { label: 'Secure combination lock' },
      { label: 'Hard shell construction' },
    ],
    variants: [
      {
        color: 'Turquoise',
        colorHex: '#40E0D0',
        sizes: [
          { size: 'Cabin', price: 7999, stock: 10000, sku: 'PLACEHOLDER_SKU' },
        ],
      },
      {
        color: 'Grey',
        colorHex: '#808080',
        sizes: [
          { size: 'Cabin', price: 7999, stock: 10000, sku: 'PLACEHOLDER_SKU' },
        ],
      },
    ],
  },


  // ── Luna Blue ───────────────────────────────────────────────────────────
  {
    id: 'luna-blue',
    name: 'Luna Blue',
    slug: 'luna-blue',
    category: 'trolley',
    isFeatured: true,
    description:
      'A cheerful character-print carry-on featuring a quirky blue illustrated character with curly hair and an adorable companion. Light, durable, and impossible to miss on the luggage carousel.',
    images: ['ced09a26-95e8-4385-bf21-973db653ca5b.png_y0ocex'],
    features: [
      { label: 'Character print design' },
      { label: 'Hard shell body' },
      { label: 'Smooth rolling wheels' },
      { label: 'Lightweight build' },
    ],
    variants: [
      {
        color: 'Blue',
        colorHex: '#1E88E5',
        sizes: [{ size: 'Cabin', price: 6500, stock: 30, sku: 'PLACEHOLDER_SKU' }],
      },
    ],
  },

  // ── CharacterPop ─────────────────────────────────────────────────────────
  {
    id: 'character-pop',
    name: 'CharacterPop',
    slug: 'character-pop',
    category: 'trolley',
    isFeatured: true,
    description:
      'A vibrant two-tone suitcase with a bold animated character design on a yellow and red background. Eye-catching on every conveyor belt — for those who travel with personality front and centre.',
    images: ['8466e6e9-f2b8-428e-a144-3fade53f6576.png_y7byfd'],
    features: [
      { label: 'Character print design' },
      { label: '360° spinner wheels' },
      { label: 'Telescopic handle' },
      { label: 'Hard shell body' },
    ],
    variants: [
      {
        color: 'Yellow-Red',
        colorHex: '#FDD835',
        sizes: [
          { size: 'Cabin',  price: 7999, stock: 30, sku: 'PLACEHOLDER_SKU' },
          { size: 'Medium', price: 8999, stock: 20, sku: 'PLACEHOLDER_SKU' },
        ],
      },
    ],
  },

  // ── RetroTech ─────────────────────────────────────────────────────────────
  {
    id: 'retrotech',
    name: 'RetroTech',
    slug: 'retrotech',
    category: 'trolley',
    isFeatured: true,
    description:
      'Vintage electronics and dynamic abstract patterns printed on a hard shell carry-on. RetroTech is for travellers who want their luggage to be a conversation starter at every airport.',
    images: ['d96f8eb1-6b93-4016-be59-01945e579924.png_kskcae'],
    features: [
      { label: 'Retro print design' },
      { label: 'Hard shell body' },
      { label: 'Smooth rolling wheels' },
      { label: 'Ergonomic handle' },
    ],
    variants: [
      {
        color: 'Multicolor',
        colorHex: '#5C6BC0',
        sizes: [{ size: 'Cabin', price: 7499, stock: 30, sku: 'PLACEHOLDER_SKU' }],
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
    isFeatured: true,
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
    isFeatured: true,
    description:
      '20", 24", and 28" SkyTrail bags in a nesting set — one fits inside another for compact storage at home. The complete setup for every kind of trip.',
    images: [
      '02-3_Background_Removed_cucfkt',
      '01-2_Background_Removed_2_blmmcl',
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
    isFeatured: true,
    description:
      'The full VeeZoom family — 20", 24", and 28" in matching bold design. Nesting format for home storage. Everything you need for a week, a month, or forever.',
    images: [
      '01-2_Background_Removed_o0b5il.png',
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


  // ── Gemtote Duffle Bag ──────────────────────────────────────────────────
  {
    id: 'gemtote-duffle-bag',
    name: 'Gemtote Duffle Bag',
    slug: 'gemtote-duffle-bag',
    category: 'duffle',
    isFeatured: true,
    description:
      'A hard-shell duffle built for short trips and quick getaways — structured enough to hold its shape, light enough to grab and go. Available in five colors.',
    images: [
      'Generated_Image_June_18_2026_-_1_53AM_Background_Removed_cblbni.png',
      'louispolo/products/gemtote-duffle-bag/gemtote-duffle-bag-grey-1',
      '1C6A9677_Large_Background_Removed_w6duba.png',
      'louispolo/products/gemtote-duffle-bag/gemtote-duffle-bag-green-1',
      'https://res.cloudinary.com/dpepctqdj/image/upload/v1781733655/1C6A9716_Background_Removed_r9rkn4.png',
    ],
    features: [
      { label: 'Hard shell protection' },
      { label: 'Adjustable shoulder strap' },
      { label: 'Spacious main compartment' },
      { label: 'Lightweight build' },
    ],
    variants: [
      {
        color: 'White',
        colorHex: '#FAFAFA',
        sizes: [
          { size: 'One Size', price: 4699, stock: 30 },
        ],
      },
      
      {
        color: 'Yellow',
        colorHex: '#FDD835',
        sizes: [
          { size: 'One Size', price: 4699, stock: 30 },
        ],
      },
      {
        color: 'Grey',
        colorHex: '#9E9E9E',
        sizes: [
          { size: 'One Size', price: 4699, stock: 30 },
        ],
      },
      {
        color: 'Pink',
        colorHex: '#EC407A',
        sizes: [
          { size: 'One Size', price: 4699, stock: 30 },
        ],
      },
      {
        color: 'Green',
        colorHex: '#43A047',
        sizes: [
          { size: 'One Size', price: 4699, stock: 30 },
        ],
      },
      
    ],
  },

  // ── Vanity Case ─────────────────────────────────────────────────────────
  {
    id: 'vanity-case',
    name: 'Vanity Case',
    slug: 'vanity-case',
    category: 'vanity',
    isFeatured: true,
    description:
      'A compact hard-shell case for the essentials you don\'t want loose in your bag — toiletries, electronics, small accessories. Available in seven colors and finishes.',
    images: [
      'https://res.cloudinary.com/dpepctqdj/image/upload/v1781777700/Screenshot_2026-06-18_at_2.59_Background_Removed.59_AM_qafnke.png',
      'louispolo/products/vanity-case/vanity-case-brown-1',
      'louispolo/products/vanity-case/vanity-case-white-lp-logo-1',
      'louispolo/products/vanity-case/vanity-case-white-floral-1',
      'louispolo/products/vanity-case/vanity-case-orange-1',
      'louispolo/products/vanity-case/vanity-case-green-1',
      'louispolo/products/vanity-case/vanity-case-floral-1',
    ],
    features: [
      { label: 'Hard shell protection' },
      { label: 'Compact, travel-friendly size' },
      { label: 'Secure zip closure' },
      { label: 'Multiple compartments' },
    ],
    variants: [
      {
        color: 'Black',
        colorHex: '#212121',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
        ],
      },
      {
        color: 'Brown',
        colorHex: '#7D5A3C',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
        ],
      },
      {
        color: 'White LP Logo',
        colorHex: '#FFFFFF',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
        ],
      },
      {
        color: 'White Floral',
        colorHex: '#F8F1E7',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
        ],
      },
      {
        color: 'Orange',
        colorHex: '#FB8C00',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
        ],
      },
      {
        color: 'Green',
        colorHex: '#43A047',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
        ],
      },
      {
        color: 'Floral',
        colorHex: '#D8A7B1',
        sizes: [
          { size: 'One Size', price: 5799, stock: 30 },
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
  { label: 'Duffle Bags', value: 'duffle',     count: PRODUCTS.filter(p => p.category === 'duffle').length },
  { label: 'Vanity Cases',value: 'vanity',     count: PRODUCTS.filter(p => p.category === 'vanity').length },
] as const

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
    textStyle: 'shadow',
    textSize:  'lg',
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
      '1C6A9455_Large_Background_Removed_xydl9r',
      '1C6A9495_Background_Removed_czmfug',
      'IMG_2420_Large_Background_Removed_ed2pt3.png',
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
        color: 'Yellow',
        colorHex: '#F4C430',
        sizes: [
          { size: 'Cabin', price: 8500, stock: 25, sku: '8906206840001-Y-20' },
        ],
      },
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
      '1C6A9363_Large_Background_Removed_ajflwe.png',
      
    ],
    features: [
      { label: '360° spinner wheels' },
      { label: 'Combination lock' },
      { label: 'Telescopic handle' },
      { label: 'Hard shell ABS' },
    ],
    variants: [
      {
        color: 'Charcoal',
        colorHex: '#3D3D3D',
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
      'IMG_3179_Background_Removed_Large_Background_Removed_wolj9y.png',
      'IMG_3140_Background_Removed_Large_Background_Removed_juszdy.png',
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
      '1-2_Large_2_Background_Removed_dnpjfv.png',
    ],
    features: [
      { label: 'Hard shell protection' },
      { label: 'Adjustable shoulder straps' },
      { label: 'Laptop compartment' },
      { label: 'Secure zip closure' },
    ],
    variants: [
      {
        color: 'Silver Brush',
        colorHex: '#C0C0C0',
        sizes: [
          { size: 'One Size', price: 8499, stock: 30, sku: '8906206840193' },
        ],
      },
      {
        color: 'Carbon Fiber',
        colorHex: '#2C2C2C',
        sizes: [
          { size: 'One Size', price: 8499, stock: 30, sku: '8906206840209' },
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
      '20", 24", and 28" SkyTrail bags in a nesting set, one fits inside another for compact storage at home. The complete setup for every kind of trip.',
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
    name: 'VeeZoom - Set of 3',
    slug: 'veezoom-set',
    category: 'set',
    isFeatured: true,
    description:
      'The full VeeZoom family — 20", 24", and 28" in matching bold design. Nesting format for home storage. Everything you need for a week, a month, or forever.',
    images: [
      '01-2_Background_Removed_o0b5il.png',
      '01-3_Background_Removed_cut3ue.png',
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
      '1C6A9697_Background_Removed_Large_Background_Removed_fc0j9n.png',
      '1C6A9716_Background_Removed_r9rkn4.png',
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

  // ── FlexBag Hybrid Duffel ────────────────────────────────────────────────
  {
    id:          'flexbag-hybrid-duffel',
    name:        'FlexBag Hybrid Duffel',
    slug:        'flexbag-hybrid-duffel',
    category:    'duffle',
    cardZoom:    1.3,
    isFeatured:  true,
    description: 'A hybrid travel bag combining hard-shell protection with the flexibility of a duffel. Perfect for weekend getaways, business trips, and cabin travel, lightweight, durable, and spacious.',
    images:      [
      '01---flexbag---black-1781383670118-1781383670118_Background_Removed_n03tnr',
      'untitled-1-1-1781414351367-1781414351367_Background_Removed_nr2vnl',
      'untitled-1-1-1781414384834-1781414384834_Background_Removed_zchjbk',
      'untitled-1-1-1781414421642-1781414421642_Background_Removed_jh0xjj',
      'untitled-1-1-1781414459774-1781414459774_Background_Removed_c8gvms'


    ],
    features: [
      { label: 'Hard shell protection panel' },
      { label: 'Trolley attachment sleeve' },
      { label: 'Spacious main compartment' },
      { label: 'Lightweight build' },
      { label: 'Versatile — gym, cabin & weekend use' },
    ],
    variants: [
      {
        color:    'Black',
        colorHex: '#212121',
        sizes: [{ size: '20 Inch', price: 2999, stock: 30 }],
      },
      {
        color:    'Navy',
        colorHex: '#1A237E',
        sizes: [{ size: '20 Inch', price: 2999, stock: 30 }],
      },
      {
        color:    'Green',
        colorHex: '#2E7D32',
        sizes: [{ size: '20 Inch', price: 2999, stock: 30 }],
      },
      {
        color:    'Grey',
        colorHex: '#757575',
        sizes: [{ size: '20 Inch', price: 2999, stock: 30 }],
      },
      {
        color:    'Silver',
        colorHex: '#BDBDBD',
        sizes: [{ size: '20 Inch', price: 2999, stock: 30 }],
      },
    ],
  },

  // ── GridPod 8" Travel Utility Case ───────────────────────────────────────
  {
    id:          'gridpod',
    name:        'GridPod ',
    slug:        'gridpod',
    category:    'vanity',
    description: 'A compact hard-shell organizer built to protect cosmetics, toiletries, electronics, cables, chargers, medicines, and all your travel essentials. Impact-resistant shell, comfortable fabric lining, and a luggage mounting sleeve so it stays with your bag.',
    isFeatured:  false,
    images:      [
      'louis-polo-grid-pod-vanity-silver-08-1781757213777-1781757213777_Background_Removed_nf3usc',
      'louis-polo-grid-pod-vanity-grey-08-1781757256978-1781757256978_Background_Removed_fcbi2f',
      'louis-polo-grid-pod-vanity-blue-01-1781757330010-1781757330010_Background_Removed_qtb4xf.png',
      'louis-polo-grid-pod-vanity-black-08-1781757362906-1781757362906_Background_Removed_ynroed'
    ],
    features: [
      { label: 'Hard shell — impact & compression resistant' },
      { label: 'Concealed pocket inside' },
      { label: 'Comfortable fabric lining' },
      { label: 'Smooth zipper' },
      { label: 'Luggage mounting sleeve' },
      { label: 'Lightweight & wear resistant' },
    ],
    variants: [
      {
        color:    'Silver',
        colorHex: '#BDBDBD',
        sizes: [{ size: '9 Inch', price: 999, stock: 50 }],
      },
      {
        color:    'Green',
        colorHex: '#2E7D32',
        sizes: [{ size: '9 Inch', price: 999, stock: 50 }],
      },
      {
        color:    'Blue',
        colorHex: '#1565C0',
        sizes: [{ size: '9 Inch', price: 999, stock: 50 }],
      },
      {
        color:    'Red',
        colorHex: '#C62828',
        sizes: [{ size: '9 Inch', price: 999, stock: 50 }],
      },
    ],
  },

  

  // ── The Attaché Overnighter ──────────────────────────────────────────────
  {
    id:          'attache-overnighter',
    name:        'Attache',
    slug:        'attache-overnighter',
    category:    'overnighter',
    cardZoom:    1.3,
    isFeatured:  true,
    description: 'Built for professionals on the move. Cabin-friendly dimensions with smart organisation — dedicated laptop storage, hard-shell protection, and 360° spinner wheels for effortless overnight business travel.',
    images:      [
      'louis-polo-attache-red-08-1781606815844-1781606815844_Background_Removed_vug5zj',
      'louis-polo-attache-black-hero-10-1781606578945-1781606578945_Background_Removed_v0prue'
    ],
    features: [
      { label: '360° silent spinner wheels' },
      { label: 'Dedicated laptop compartment' },
      { label: 'Combination lock' },
      { label: 'Telescopic handle' },
      { label: 'Hard shell ABS' },
      { label: 'Carry-on approved' },
    ],
    variants: [
       {
        color:    'Red',
        colorHex: '#C62828',
        sizes: [{ size: '17 Inch', price: 6999, stock: 30 }],
      },
      {
        color:    'Black',
        colorHex: '#212121',
        sizes: [{ size: '17 Inch', price: 6999, stock: 30 }],
      },
     
    ],
  },

  // ── SwiftGate 17" Overnighter Trolley ────────────────────────────────────
  {
    id:          'swiftgate',
    name:        'SwiftGate',
    slug:        'swiftgate',
    category:    'overnighter',
    description: 'Professional styling meets practical organisation. The SwiftGate features a front-opening compartment for instant access to your laptop, tablet, documents, and chargers — without touching the main compartment. Built for overnight trips and short business travel.',
    isFeatured:  false,
    images:      [
      'swiftgate---blue01-1781498983947-1781498983947_Background_Removed_lanodd','swiftgate---red09-1781498866690-1781498866690_Background_Removed_zdqhyi',],
    features: [
      { label: 'Front-access laptop compartment' },
      { label: '360° silent spinner wheels' },
      { label: 'Combination security lock' },
      { label: 'Anti-theft zipper' },
      { label: 'Telescopic handle' },
      { label: 'Lightweight hard-shell construction' },
      { label: 'Carry-on approved dimensions' },
    ],
    variants: [
      {
        color:    'Blue',
        colorHex: '#1565C0',
        sizes: [{ size: '17 Inch', price: 9899, stock: 30 }],
      },
      {
        color:    'Red',
        colorHex: '#C62828',
        sizes: [{ size: '17 Inch', price: 9899, stock: 30 }],
      },
    ],
  },
  

  // ── V-Glide Beauty Case ──────────────────────────────────────────────────
  {
    id:          'v-glide',
    name:        'V-Glide',
    slug:        'v-glide',
    category:    'vanity',
    description: 'A stylish hard-shell travel beauty organizer with a signature V-pattern finish. Dedicated compartments, mesh pockets, and an integrated trolley sleeve keep your cosmetics, skincare, and accessories perfectly organised and secure on every trip.',
    isFeatured:  false,
    images:      [
      '1-1781427971087-1781427971087_Background_Removed_f1vctd',
      '1-1781427934381-1781427934381_Background_Removed_iw2ctm',
      '1-1781427886031-1781427886031_Background_Removed_syzs8q',
      '8-1781428020176-1781428020176_Background_Removed_v6a0uj'
      
    ],
    features: [
      { label: 'Hard-shell V-pattern finish' },
      { label: 'Dedicated compartments & mesh pockets' },
      { label: 'Concealed pocket inside' },
      { label: 'Comfortable fabric lining' },
      { label: 'Smooth zipper' },
      { label: 'Integrated trolley sleeve' },
      { label: 'Lightweight & wear resistant' },
    ],
    variants: [
      {
        color:    'Silver',
        colorHex: '#BDBDBD',
        sizes: [{ size: '9 Inch', price: 2999, stock: 50 }],
      },
      {
        color:    'Rose Gold',
        colorHex: '#B76E79',
        sizes: [{ size: '9 Inch', price: 2999, stock: 50 }],
      },
      {
        color:    'Black',
        colorHex: '#212121',
        sizes: [{ size: '9 Inch', price: 2999, stock: 50 }],
      },
      {
        color:    'Sky Blue',
        colorHex: '#4FC3F7',
        sizes: [{ size: '9 Inch', price: 2999, stock: 50 }],
      },
    ],
  },

  // ── OrbitPod 12" Vanity Case ─────────────────────────────────────────────
  {
    id:          'orbitpod',
    name:        'OrbitPod',
    slug:        'orbitpod',
    category:    'vanity',
    description: 'A stylish hard-shell travel organizer for modern travellers. The dual-compartment interior with zippered centre section keeps cosmetics, gadgets, chargers, toiletries, medicines, and daily essentials neatly separated. Comes with a shoulder strap for hands-free carry.',
    isFeatured:  false,
    images:      [
      'louis-polo-orbit-pod-vanity-metallic-gre-1781766231871-1781766231871_Background_Removed_l5lzhb',
      'louis-polo-orbit-pod-vanity-turquoise-bl-1781766125876-1781766125876_Background_Removed_g39dpv',
      
      'louis-polo-orbit-pod-vanity-metallic-sil-1781766417179-1781766417179_Background_Removed_db00pk',
      
      
    ],
    features: [
      { label: '360° hard-shell protection' },
      { label: 'Smart dual-compartment interior' },
      { label: 'Zippered centre divider' },
      { label: 'Shoulder strap included' },
      { label: 'Concealed pocket' },
      { label: 'Comfortable fabric lining' },
      { label: 'Smooth zipper & wear resistant' },
    ],
    variants: [
      
      {
        color:    'Metallic Grey',
        colorHex: '#757575',
        sizes: [{ size: '12 Inch', price: 1999, stock: 50 }],
      },
      {
        color:    'Turquoise Blue',
        colorHex: '#00B0C8',
        sizes: [{ size: '12 Inch', price: 1999, stock: 50 }],
      },
      {
        color:    'Metallic Silver',
        colorHex: '#BDBDBD',
        sizes: [{ size: '12 Inch', price: 1999, stock: 50 }],
      },
    ],
  },
  // ── Voyage Pod  ───────────────────────────────
  {
    id:          'voyage-pod',
    name:        'Voyage Pod ',
    slug:        'voyage-pod',
    category:    'vanity',
    description: 'A compact hard-shell travel organizer for cosmetics, toiletries, grooming essentials, electronics, medicines, and personal accessories. Features a spacious interior with zippered mesh pocket and an integrated luggage mounting sleeve that attaches to your trolley handle.',
    isFeatured:  false,
    images:      [
      'louis-polo-voyage-pod-silver-09-1781689965483-1781689965483_Background_Removed_ysfewb',
      'louis-polo-voyage-pod-grey-09-1781690030424-1781690030424_Background_Removed_s63370','louis-polo-voyage-pod-blue-09-1781690104205-1781690104205_Background_Removed_eoz5ph',
      'louis-polo-voyage-pod-black01-1781690181273-1781690181273_Background_Removed_k1um9u'
    ],
    features: [
      { label: 'Hard shell — impact & compression resistant' },
      { label: 'Zippered mesh organizer pocket inside' },
      { label: 'Comfortable fabric lining' },
      { label: 'Smooth zipper' },
      { label: 'Luggage mounting sleeve' },
      { label: 'Lightweight & wear resistant' },
    ],
    variants: [
      {
        color:    'Silver',
        colorHex: '#BDBDBD',
        sizes: [{ size: '9 Inch', price: 1999, stock: 50 }],
      },
      {
        color:    'Grey',
        colorHex: '#757575',
        sizes: [{ size: '9 Inch', price: 1999, stock: 50 }],
      },
      {
        color:    'Blue',
        colorHex: '#1565C0',
        sizes: [{ size: '9 Inch', price: 1999, stock: 50 }],
      },
      {
        color:    'Black',
        colorHex: '#212121',
        sizes: [{ size: '9 Inch', price: 1999, stock: 50 }],
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
  { label: 'Duffle Bags', value: 'duffle',       count: PRODUCTS.filter(p => p.category === 'duffle').length },
  { label: 'Vanity Cases',value: 'vanity',       count: PRODUCTS.filter(p => p.category === 'vanity').length },
  { label: 'OverNighters', value: 'overnighter', count: PRODUCTS.filter(p => p.category === 'overnighter').length },
] as const

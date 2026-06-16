// ─────────────────────────────────────────────────────────────────────────────
// lib/constants.ts
// Every magic string lives here. Never hardcode elsewhere.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  name:      'Louis Polo',
  tagline:   'Trendsetters in Luggage',
  email:     'support@louispolo.in',
  phone:     '+91-89287 89287',
  whatsapp:  'https://wa.me/918928789287',
  instagram: 'https://instagram.com/louispololuggage',
  linkedin:  'https://linkedin.com/company/louis-polo',
} as const

export const ROUTES = {
  home:    '/',
  shop:    '/store/shop',
  cart:    '/store/cart',
  about:   '/store/about',
  contact: '/store/contact',
} as const

export const NAV_ITEMS = [
  { label: 'Shop',    href: ROUTES.shop    },
  { label: 'About',   href: ROUTES.about   },
  { label: 'Contact', href: ROUTES.contact },
] as const

// Cart config
export const CART_CONFIG = {
  freeShippingThreshold: 5000,
  shippingCost:          199,
  maxQtyPerItem:         10,
} as const

// SEO defaults
export const SEO = {
  title:       'Louis Polo — Trendsetters in Luggage',
  description: 'Premium hard luggage designed for every journey. Shop AeroSmart, SkyTrail, VeeZoom and more. 9 years of manufacturing excellence. Made in India.',
  keywords:    'louis polo, luggage, trolley bags, hard shell suitcase, travel bags, india',
  ogImage:     '/og-image.jpg',
  url:         'https://louispolo.in',
} as const

// Size display order
export const SIZE_ORDER = ['Cabin', 'Medium', 'Large', 'Set of 3', 'One Size'] as const

// ─────────────────────────────────────────────────────────────────────────────
// lib/constants.ts
// Every magic string lives here. Never hardcode elsewhere.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  name:      'Louis Polo',
  tagline:   'Trendsetters in Luggage',
  email:     'support@louispolo.in',
  teamEmail: 'suhaib@louispolo.in',  // receives internal order notifications
  phone:     '+91-89287 89287',
  whatsapp:  'https://wa.me/918928789287',
  instagram: 'https://instagram.com/louispololuggage',
  linkedin:  'https://linkedin.com/company/louis-polo',
} as const

export const ROUTES = {
  home:     '/',
  shop:     '/shop',
  compare:  '/compare',
  cart:     '/cart',
  wishlist: '/wishlist',
  about:    '/about',
  contact:  '/contact',
} as const

export const NAV_ITEMS = [
  { label: 'Home',    href: ROUTES.home    },
  { label: 'Shop',    href: ROUTES.shop    },
  { label: 'Compare', href: ROUTES.compare },
  { label: 'About',   href: ROUTES.about   },
  { label: 'Contact', href: ROUTES.contact },
] as const

// Cart config
// Shipping is free on all orders — no threshold, no flat fee. If this ever
// changes, also update the cart page's summary display (app/(store)/cart/page.tsx),
// which previously had a conditional "Free shipping above ₹X" message tied
// to freeShippingThreshold. That message is now removed entirely since
// there's nothing left to condition on.
export const CART_CONFIG = {
  freeShipping:   true,
  maxQtyPerItem:  10,
} as const

// SEO defaults
export const SEO = {
  title:       'Louis Polo Luggage That Travels With You',
  description: 'Crafted for those who move with purpose. Discover Louis Polo\'s collection of hard-shell trolleys, duffles & travel sets, built to last, designed to impress.',
  keywords:    'louis polo, luggage, trolley bags, hard shell suitcase, travel bags, india',
  ogImage:     '/web-app-manifest-512x512.png',
  url:         'https://www.louispolo.in',
} as const

// Size display order
export const SIZE_ORDER = ['Cabin', 'Medium', 'Large', 'Set of 3', 'One Size'] as const

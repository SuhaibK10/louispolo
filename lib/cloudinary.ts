// ─────────────────────────────────────────────────────────────────────────────
// lib/cloudinary.ts
// Cloudinary URL helpers. Upload once, transform via URL.
// Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dpepctqdj'
const BASE   = `https://res.cloudinary.com/${CLOUD}/image/upload`

// Build a Cloudinary URL from a public_id + transform string.
// Also handles full Cloudinary URLs by injecting transforms after /upload/.
export function cld(publicId: string, transforms = 'f_auto,q_auto'): string {
  if (!publicId.startsWith('http')) {
    return `${BASE}/${transforms}/${publicId}`
  }
  // Inject transforms into an existing Cloudinary URL (e.g. when HERO_SLIDES
  // stores a versioned full URL instead of a bare public_id).
  const marker = '/upload/'
  const idx = publicId.indexOf(marker)
  if (idx !== -1 && publicId.includes('res.cloudinary.com')) {
    return (
      publicId.slice(0, idx + marker.length) +
      transforms + '/' +
      publicId.slice(idx + marker.length)
    )
  }
  return publicId
}

// ─── Preset transforms ────────────────────────────────────────────────────────

// Hero slide — desktop, 16:9 landscape
export const heroUrl = (id: string) =>
  cld(id, 'f_auto,q_90,w_1600,ar_16:9,c_fill,g_center')

// Hero slide — mobile, full natural portrait (no forced crop — CSS handles fit)
export const heroUrlMobile = (id: string) =>
  cld(id, 'f_auto,q_auto,w_900,c_limit')

// Product card thumbnail — 3:4 portrait
export const cardUrl = (id: string) =>
  cld(id, 'f_auto,q_80,w_600,h_800,c_pad,b_rgb:F5F3ED')

// Product detail hero — large, high quality
export const pdpUrl = (id: string) =>
  cld(id, 'f_auto,q_90,w_900,h_1200,c_pad,b_rgb:F5F3ED')

// Cart / order thumbnail — square
export const thumbUrl = (id: string) =>
  cld(id, 'f_auto,q_75,w_200,h_200,c_pad,b_rgb:F5F3ED')

// Mobile optimised card
export const mobileCardUrl = (id: string) =>
  cld(id, 'f_auto,q_75,w_400,h_533,c_fill,g_auto')

// Exhibition / trade show gallery — landscape crop, content-aware gravity
export const expoUrl = (id: string) =>
   cld(id, 'f_auto,q_auto,w_1050,h_1400,c_fill,g_auto')

// Placeholder for when no image is uploaded yet
export const PLACEHOLDER_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' fill='%23F0EDE6'%3E%3Crect width='600' height='800'/%3E%3Ctext x='50%25' y='50%25' font-family='serif' font-size='48' fill='%23C9A96E' text-anchor='middle' dominant-baseline='middle'%3ELP%3C/text%3E%3C/svg%3E`

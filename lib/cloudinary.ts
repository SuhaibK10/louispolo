// ─────────────────────────────────────────────────────────────────────────────
// lib/cloudinary.ts
// Cloudinary URL helpers. Upload once, transform via URL.
// Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dpepctqdj'
const BASE   = `https://res.cloudinary.com/${CLOUD}/image/upload`

// Build a Cloudinary URL from a public_id + transform string
export function cld(publicId: string, transforms = 'f_auto,q_auto'): string {
  // If it's already a full URL (for placeholder/external images), return as-is
  if (publicId.startsWith('http')) return publicId
  return `${BASE}/${transforms}/${publicId}`
}

// ─── Preset transforms ────────────────────────────────────────────────────────

// Hero slide — full viewport, high quality
export const heroUrl = (id: string) =>
  cld(id, 'f_auto,q_90,w_1600,h_900,c_fill,g_center')

// Product card thumbnail — 3:4 portrait
export const cardUrl = (id: string) =>
  cld(id, 'f_auto,q_80,w_600,h_800,c_fill,g_auto')

// Product detail hero — large, high quality
export const pdpUrl = (id: string) =>
  cld(id, 'f_auto,q_90,w_900,h_1200,c_fill,g_auto')

// Cart / order thumbnail — square
export const thumbUrl = (id: string) =>
  cld(id, 'f_auto,q_75,w_200,h_200,c_fill,g_auto')

// Mobile optimised card
export const mobileCardUrl = (id: string) =>
  cld(id, 'f_auto,q_75,w_400,h_533,c_fill,g_auto')

// Placeholder for when no image is uploaded yet
export const PLACEHOLDER_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' fill='%23F0EDE6'%3E%3Crect width='600' height='800'/%3E%3Ctext x='50%25' y='50%25' font-family='serif' font-size='48' fill='%23C9A96E' text-anchor='middle' dominant-baseline='middle'%3ELP%3C/text%3E%3C/svg%3E`

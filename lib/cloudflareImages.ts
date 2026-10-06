// ─────────────────────────────────────────────────────────────────────────────
// lib/cloudflareImages.ts
// Cloudflare Images URL helpers. Same function names/signatures as the old
// lib/cloudinary.ts so every call site (ProductCard, ImageGallery, etc.)
// swaps over without changes.
// Set NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH in .env.local
// ─────────────────────────────────────────────────────────────────────────────

const HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH
const BASE = `https://imagedelivery.net/${HASH}`

// Build a Cloudflare Images delivery URL from an image ID + flexible-variant
// param string (e.g. "w=600,h=800,fit=pad").mm
export function cfImg(imageId: string | undefined, params = ''): string {
  // No image assigned yet (e.g. a variant awaiting photography) — fall back
  // to the placeholder instead of throwing on `undefined.startsWith`.
  if (!imageId) return PLACEHOLDER_URL
  if (imageId.startsWith('/')) {
    // Local static asset (public/) — served as-is, no transform.
    return imageId
  }
  return `${BASE}/${imageId}/${params}`
}

// Alias — old call sites used `cld(id, transforms)` directly for one-off
// crops instead of a named preset. Same function, kept under both names so
// only the transform-string syntax at each call site needed converting.
export const cld = cfImg

// ─── Preset transforms ────────────────────────────────────────────────────────

// Quality tiers — mirrors the eco/good split the old Cloudinary presets used:
// small, repeated-everywhere images get squeezed harder; large/detail-critical
// ones stay higher quality. Format (AVIF/WebP/etc.) is negotiated automatically
// per browser regardless of this setting, same as f_auto did on Cloudinary.
const Q_ECO  = 'quality=70'  // cards, thumbnails — small, shown dozens of times per page
const Q_GOOD = 'quality=85'  // PDP, hero — large, detail matters

// Hero slide — desktop, 16:9 landscape
export const heroUrl = (id: string) =>
  cfImg(id, `w=1600,fit=cover,${Q_GOOD}`)

// Hero slide — mobile, full natural portrait (no forced crop — CSS handles fit)
export const heroUrlMobile = (id: string) =>
  cfImg(id, `w=900,fit=scale-down,${Q_GOOD}`)

// Product photo fit — 'pad' is the default: a transparent cutout padded onto
// a flat background (the whole catalog so far). 'cover' fills the frame
// edge-to-edge instead, cropping to fit, for full-bleed lifestyle/studio
// shots that carry their own backdrop rather than a removed background.
// Pass a product's `imageFit` field through from config/products.ts.
export type ImageFit = 'pad' | 'cover'

const fitParams = (fit: ImageFit, w: number, h: number) =>
  fit === 'cover'
    ? `w=${w},h=${h},fit=cover,gravity=auto`
    : `w=${w},h=${h},fit=pad`

// Product card thumbnail — 3:4 portrait
export const cardUrl = (id: string, fit: ImageFit = 'pad') =>
  cfImg(id, `${fitParams(fit, 600, 800)},${Q_ECO}`)

// Product detail hero — large, high quality
export const pdpUrl = (id: string, fit: ImageFit = 'pad') =>
  cfImg(id, `${fitParams(fit, 900, 1200)},${Q_GOOD}`)

// Hover-zoom magnified view — double the linear resolution of pdpUrl, so
// zooming in reveals real detail instead of just stretching the same pixels.
// Only fetched when zoom is actually engaged (see ImageGallery.tsx).
export const pdpZoomUrl = (id: string, fit: ImageFit = 'pad') =>
  cfImg(id, `${fitParams(fit, 1800, 2400)},quality=90`)

// Cart / order thumbnail — square
export const thumbUrl = (id: string, fit: ImageFit = 'pad') =>
  cfImg(id, `${fitParams(fit, 200, 200)},${Q_ECO}`)

// Internal media-library grid (app/admin/media) — always `contain`,
// regardless of the product's on-site imageFit: an admin browsing assets
// needs to see the whole frame to tell photos apart, not a cropped preview.
export const adminThumbUrl = (id: string) =>
  cfImg(id, `w=300,h=300,fit=contain,${Q_ECO}`)

// Full-size original as JPEG. The "public" variant is capped and served as AVIF
// to browsers that accept it, which Shopify can't upload.
export const publicUrl = (id: string) => cfImg(id, 'format=jpeg')

// Social share preview (WhatsApp/Twitter/Facebook link unfurl) — standard
// 1200×630 OG card. Always cover+gravity=auto regardless of the product's own
// on-site imageFit: a padded product shot would sit small in empty space at
// this landscape ratio, so the crop is forced here rather than passed through.
export const ogUrl = (id: string) =>
  cfImg(id, `w=1200,h=630,fit=cover,gravity=auto,${Q_GOOD}`)

// Category/mood tile — full lifestyle photo, fills the frame.
// gravity=auto — saliency-based smart crop, so cropping favours the actual
// subject instead of a plain center-crop (equivalent to Cloudinary's g_auto).
export const categoryUrl = (id: string) =>
  cfImg(id, `w=800,h=800,fit=cover,gravity=auto,${Q_GOOD}`)

// Exhibition / trade show gallery — wide enough for retina desktop
export const expoUrl = (id: string) =>
  cfImg(id, `w=1600,h=2133,fit=cover,gravity=auto,${Q_GOOD}`)

// Video lives in lib/cloudflareStream.ts (cfVideo / cfVideoPoster) — a
// separate Cloudflare product from Images, so it isn't re-exported here.

// Placeholder for when no image is uploaded yet
export const PLACEHOLDER_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' fill='%23BEB7AC'%3E%3Crect width='600' height='800'/%3E%3Ctext x='50%25' y='50%25' font-family='serif' font-size='48' fill='%23B99A62' text-anchor='middle' dominant-baseline='middle'%3ELP%3C/text%3E%3C/svg%3E`

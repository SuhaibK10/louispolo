// ─────────────────────────────────────────────────────────────────────────────
// config/factory.ts
// Behind-the-scenes photos — factory floor, QC, dispatch/truck loading.
// Shown on the About page (FactoryGallery).
//
// IMAGES: Cloudinary public_ids only (same as exhibitions/reviews).
// Upload your photos to Cloudinary, then paste each image's public_id below.
// Until a publicId is filled in, a placeholder tile is shown.
// ─────────────────────────────────────────────────────────────────────────────

export interface FactoryPhoto {
  publicId: string
  alt: string
  caption: string   // small label shown on the photo, e.g. "Production line · Mumbai"
  fit?: 'cover' | 'pad'  // 'cover' crops to fill (default), 'pad' shows the full image
}

export const FACTORY_PHOTOS: FactoryPhoto[] = [
  {
    publicId: '',
    alt:      'Production line at the Louis Polo factory in Mumbai',
    caption:  'Production line · Mumbai',
  },
  {
    publicId: '',
    alt:      'Quality control checks on finished luggage',
    caption:  'Quality control',
  },
  {
    publicId: '',
    alt:      'Finished products being loaded into a truck for dispatch',
    caption:  'Dispatch · Loading for delivery',
  },
]

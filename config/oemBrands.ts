// ─────────────────────────────────────────────────────────────────────────────
// config/oemBrands.ts
// Brands our factory has manufactured for — shown as a moving logo strip
// inside the BrandStory section (homepage + About page).
//
// IMAGES: Cloudinary public_ids only (same as factory/exhibitions).
// Upload each logo (transparent PNG or SVG) to Cloudinary, then paste its
// public_id below. Until a publicId is filled in, the brand name is shown
// as a styled text wordmark, so the strip works immediately.
// Logos are rendered white via CSS filter to sit on the dark section.
// ─────────────────────────────────────────────────────────────────────────────

export interface OEMBrand {
  name: string
  publicId: string
}

export const OEM_BRANDS: OEMBrand[] = [
  { name: 'ESBEDA',         publicId: '' },
  { name: 'GAS',            publicId: '' },
  { name: 'Kenneth Cole',   publicId: '' },
  { name: 'Johnnie Walker', publicId: '' },
  { name: 'Croma',          publicId: '' },
  { name: 'Stelatoes',      publicId: '' },
  { name: 'Chivas',         publicId: '' },
  { name: 'Elvitario',      publicId: '' },
  { name: 'La Martina',     publicId: '' },
  { name: 'Gilmore Oak',    publicId: '' },
  { name: 'WROGN',          publicId: '' },
  { name: 'Black & White',  publicId: '' },
  { name: 'Aéropostale',    publicId: '' },
  { name: 'Tukzer',         publicId: '' },
  { name: 'Aliens',         publicId: '' },
]

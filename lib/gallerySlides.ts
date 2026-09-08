// ─────────────────────────────────────────────────────────────────────────────
// lib/gallerySlides.ts
// Merges a product's photo array with an optional demo video into one
// ordered list of gallery slides — video always sits right after the first
// photo. Shared by ImageGallery (mobile) and ProductInfo's desktop thumbnail
// strip so both stay index-aligned against the same `active` state.
// ─────────────────────────────────────────────────────────────────────────────

export type GallerySlide =
  | { type: 'image'; src: string }
  | { type: 'video'; youtubeId: string }

export function buildGallerySlides(images: string[], videoYoutubeId?: string): GallerySlide[] {
  const slides: GallerySlide[] = images.map((src) => ({ type: 'image', src }))
  if (videoYoutubeId && slides.length > 0) {
    slides.splice(1, 0, { type: 'video', youtubeId: videoYoutubeId })
  }
  return slides
}

// YouTube's own thumbnail endpoint — no API key needed. Not run through
// next/image: img.youtube.com isn't in next.config.ts's remotePatterns and
// a 64px gallery thumbnail doesn't need the optimization pipeline anyway.
export const youtubeThumbnail = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

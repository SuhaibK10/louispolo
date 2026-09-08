// ─────────────────────────────────────────────────────────────────────────────
// lib/gallerySlides.ts
// Merges a product's photo array with an optional demo video into one
// ordered list of gallery slides — video always sits right after the first
// photo. Shared by ImageGallery (mobile) and ProductInfo's desktop thumbnail
// strip so both stay index-aligned against the same `active` state.
// ─────────────────────────────────────────────────────────────────────────────

export type GallerySlide =
  | { type: 'image'; src: string }
  | { type: 'video'; source: 'youtube'; youtubeId: string }
  | { type: 'video'; source: 'stream'; videoId: string }

interface DemoVideo {
  youtubeId?:     string  // trial alternative — see Product.demoVideoYoutubeId
  streamVideoId?: string  // Cloudflare Stream UID — see Product.demoVideoId
}

export function buildGallerySlides(images: string[], video?: DemoVideo): GallerySlide[] {
  const slides: GallerySlide[] = images.map((src) => ({ type: 'image', src }))
  if (slides.length === 0) return slides
  if (video?.youtubeId) {
    slides.splice(1, 0, { type: 'video', source: 'youtube', youtubeId: video.youtubeId })
  } else if (video?.streamVideoId) {
    slides.splice(1, 0, { type: 'video', source: 'stream', videoId: video.streamVideoId })
  }
  return slides
}

// YouTube's own thumbnail endpoint — no API key needed. Not run through
// next/image: img.youtube.com isn't in next.config.ts's remotePatterns and
// a 64px gallery thumbnail doesn't need the optimization pipeline anyway.
export const youtubeThumbnail = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

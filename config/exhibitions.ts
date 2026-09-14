// ─────────────────────────────────────────────────────────────────────────────
// config/exhibitions.ts
// Trade show photos — shown on the homepage (ExhibitionGallery) and the About
// page. Add a new object to EXHIBITIONS for a new show. Add to its `photos`
// array for more images from that show.
//
// IMAGES: Cloudflare Images IDs only (see lib/cloudflareImages.ts expoUrl()/cld()).
// Upload via /admin/media or the Cloudflare dashboard.
// ─────────────────────────────────────────────────────────────────────────────

// Homepage-only switch — flip to false to pull "Where we show up" off the
// homepage. The About page keeps showing it regardless.
export const EXHIBITION_GALLERY_HOME_ENABLED = false

export interface ExhibitionPhoto {
  publicId: string
  alt: string
  fit?: 'cover' | 'pad'  // 'cover' crops to fill (default), 'pad' shows the full image
}

export interface Exhibition {
  id: string
  city: string
  venue: string   // exhibition / trade show name
  date: string    // e.g. "March 2026"
  photos: ExhibitionPhoto[]
}

export const EXHIBITIONS: Exhibition[] = [
  {
    id: 'mumbai_exhib_26_27_28_Feb',
    city: 'Mumbai',
    venue: 'Gifts World Expo',
    date: '26-28 Feb 2026',
    photos: [
      { publicId: 'c9af59ec-d694-4a36-471f-5904b112b300', alt: 'Louis Polo ' },
      { publicId: 'f5c6b51d-c49a-4020-8648-ca7f18352800', alt: 'Louis Polo ' },
      { publicId: '46d0a1de-1fca-4dc6-c9c8-8daba9abf800', alt: 'Louis Polo ' },
      { publicId: '718563ab-8f09-4f9f-7f10-7456ffb45d00', alt: 'Louis Polo ' },
    ],
  },
  {
    id: 'Banglore Expo ',
    city: 'Bengaluru ',
    venue: 'Tripura Vasini',
    date: '11-13 Sep 2025',
    photos: [
      { publicId: '7d17cd05-53ba-4900-636c-6757d2182500', alt: 'Louis Polo ' },
      { publicId: '60cace24-544a-4f7b-8a3b-12d95a35ac00', alt: 'Louis Polo ' },
      { publicId: 'c280f058-5ec3-4c54-073d-288b44e58300', alt: 'Louis Polo ' },
    ],
  },
  {
    id: 'exhibition-3',
    city: 'Delhi',
venue: 'Bharat Mandapam',
    date: '24-26 July 2025',
    photos: [
      { publicId: '0a324d6f-a868-454b-6f15-b11be5735000', alt: 'Louis Polo ' },
      { publicId: '04588056-0be4-4ee0-788b-efba13e9e500', alt: 'Louis Polo ' },
      { publicId: 'ae163e6b-da8d-43d1-d5e9-d9a8eb07f600', alt: 'Louis Polo ' },
    ],
  },
]

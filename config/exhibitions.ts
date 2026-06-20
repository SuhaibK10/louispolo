// ─────────────────────────────────────────────────────────────────────────────
// config/exhibitions.ts
// Trade show photos — shown on the homepage (ExhibitionGallery) and the About
// page. Add a new object to EXHIBITIONS for a new show. Add to its `photos`
// array for more images from that show.
//
// IMAGES: Cloudinary public_ids only (see lib/cloudinary.ts expoUrl()).
// Upload to folder: louispolo/exhibitions/{exhibition-id}/
// ─────────────────────────────────────────────────────────────────────────────

export interface ExhibitionPhoto {
  publicId: string
  alt: string
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
    date: '26-28 Feb',
    photos: [
      { publicId: '1773867226962_loaw14.jpg', alt: 'Louis Polo ' },
      { publicId: '1773867223468_i9huwp', alt: 'Louis Polo ' },
      { publicId: '1773867223830_wat8zn', alt: 'Louis Polo ' },
      { publicId: '1773867223503_w6jupo', alt: 'Louis Polo ' },
      { publicId: '1773867224138_ydjr3w.jpg', alt: 'Louis Polo ' },
      { publicId: '1773867224138_ydjr3w.jpg', alt: 'Louis Polo ' },
    ],
  },
  {
    id: 'Gift Expo ',
    city: 'Bengaluru ',
    venue: '[SHOW NAME 2]',
    date: '[MONTH YEAR 2]',
    photos: [
      { publicId: 'louispolo/exhibitions/exhibition-2/photo-1', alt: 'Louis Polo ' },
      { publicId: 'louispolo/exhibitions/exhibition-2/photo-2', alt: 'Louis Polo ' },
      { publicId: 'louispolo/exhibitions/exhibition-2/photo-3', alt: 'Louis Polo styled ' },
    ],
  },
  {
    id: 'exhibition-3',
    city: 'Delhi',
    venue: '[SHOW NAME 3]',
    date: '[MONTH YEAR 3]',
    photos: [
      { publicId: 'louispolo/exhibitions/exhibition-3/photo-1', alt: 'Louis Polo booth front entrance' },
      { publicId: 'louispolo/exhibitions/exhibition-3/photo-2', alt: 'Louis Polo product display' },
      { publicId: 'louispolo/exhibitions/exhibition-3/photo-3', alt: 'Louis Polo trolley bag lineup' },
    ],
  },
]

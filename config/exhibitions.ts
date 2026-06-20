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
      { publicId: '1773867226962_loaw14.jpg', alt: 'Louis Polo ' },
      { publicId: '1773867223468_i9huwp', alt: 'Louis Polo ' },
      { publicId: '1773867223830_wat8zn', alt: 'Louis Polo ' },
      { publicId: '1773867223503_w6jupo', alt: 'Louis Polo ' },
      { publicId: '1773867224138_ydjr3w.jpg', alt: 'Louis Polo ' },
      { publicId: '1773867224138_ydjr3w.jpg', alt: 'Louis Polo ' },
    ],
  },
  {
    id: 'Banglore Expo ',
    city: 'Bengaluru ',
    venue: 'Tripura Vasini',
    date: '11-13 Sep 2025',
    photos: [
      { publicId: 'WhatsApp_Image_2026-06-20_at_21.28.02_wzghgv.jpg', alt: 'Louis Polo ', fit: 'pad' },
      { publicId: 'WhatsApp_Image_2026-06-20_at_21.05.58_2_o9nek0.jpg', alt: 'Louis Polo ' },
       { publicId: 'WhatsApp_Image_2026-06-20_at_21.05.58_pe0rvj.jpg', alt: 'Louis Polo ' },
       { publicId: 'WhatsApp_Image_2026-06-20_at_21.05.59_eyfgiy.jpg', alt: 'Louis Polo ' },
       { publicId: 'WhatsApp_Image_2026-06-20_at_21.05.59_1_vg3ts9.jpg', alt: 'Louis Polo ' },
      
    ],
  },
  {
    id: 'exhibition-3',
    city: 'Delhi',
venue: 'Bharat Mandapam',
    date: '24-26 July 2025',
    photos: [
      { publicId: 'WhatsApp_Image_2026-06-20_at_21.28.23_ivxion.jpg', alt: 'Louis Polo booth front entrance', fit: 'pad' },
      { publicId: 'WhatsApp_Image_2026-06-20_at_21.23.19_ldrbvf.jpg', alt: 'Louis Polo product display' },
      { publicId: 'WhatsApp_Image_2026-06-20_at_21.23.18_1_i9gzff.jpg', alt: 'Louis Polo trolley bag lineup' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// config/reviews.ts
// Manually curated customer reviews, shown per product from the shop grid
// card. Add entries here as reviews come in — a slug with no entry just
// shows an empty state in the modal, nothing breaks.
// ─────────────────────────────────────────────────────────────────────────────

export interface Review {
  name:    string
  rating:  number   // 1–5
  date:    string   // e.g. '12 Aug 2026'
  text:    string
  /** Cloudflare Images IDs — same pipeline as product photos */
  images?: string[]
  /** Cloudflare Stream UID — same pipeline as product demo videos */
  video?:  string
}

export const PRODUCT_REVIEWS: Record<string, Review[]> = {
  'aerosmart-3in1': [
    {
      name:   'Nikhil',
      rating: 5,
      date:   '4 Sep 2026',
      text:   "The side pouch is the real hero here, I keep my water bottle and umbrella in it and never have to open the main case for small stuff. Didn't expect to use the hook as much as I do, hung a small tote on it while my hands were full at the airport and it held up fine.",
      images: ['b4fdabce-620c-4c0c-e314-886eb0debc00', '8887f692-93fd-412e-0dd8-d8e8ad51aa00', 'afd95dad-92c1-469e-ee8a-35f97904a400'],
    },
    {
      name:   'Naveen',
      rating: 5,
      date:   '20 Aug 2026',
      text:   "The wheels glides so smoothly with barely a push, doesn't catch or wobble even fully loaded. Makes the whole thing feel way lighter than it is.",
      images: ['ae0a150f-dba0-4c81-2b99-03306e475300'],
    },
    {
      name:   'Meera ',
      rating: 5,
      date:   '22 Aug 2026',
      text:   "It's basically two bags in one,the small case pops off for toiletries,Packed for a 3-day trip in half the time I usually take. Higly Organizable ",
      images: ['a40494d5-2b7a-40c9-2d4b-e46821d74500'],
    },
    {
      name:   'Arjun R.',
      rating: 5,
      date:   '23 Aug 2026',
      text:   "The finish is stunning in person looks elegant, highly premium.",
      video:  '0efce2ec96bce0c80eca870babf6a851',
    },
    { name: 'Rohit Verma',     rating: 5, date: '2 Jul 2026',  text: "Been using this for close to two months now, still looks brand new. No scratches even after being tossed around by the airline staff." },
    { name: 'Sneha K.',        rating: 4, date: '5 Jul 2026',  text: "Good bag overall. Only complaint is the handle feels a bit stiff when fully extended, but nothing major." },
    { name: 'Amit Bansal',     rating: 5, date: '9 Jul 2026',  text: "Took this on a 10-day Europe trip, fit way more than I thought it would for the size. Zero regrets." },
    { name: 'Priyanka D.',     rating: 5, date: '12 Jul 2026', text: "Simple, sturdy, does the job. Wheels roll well on tiles and carpet both." },
    { name: 'Karthik R.',      rating: 4, date: '15 Jul 2026', text: "Decent build quality for the price. The lock feels a little cheap but functions fine." },
    { name: 'Farhan Sheikh',   rating: 5, date: '18 Jul 2026', text: "My old suitcase broke at the airport so I bought this in a rush online — best impulse purchase this year." },
    { name: 'Divya Menon',     rating: 5, date: '21 Jul 2026', text: "Love the color, doesn't look like every other black suitcase on the belt. Easy to spot." },
    { name: 'Manish Tiwari',   rating: 3, date: '24 Jul 2026', text: "Does what it says but the zipper on the small case snagged once. Still usable, just wish it was smoother." },
    { name: 'Aisha Khan',      rating: 5, date: '27 Jul 2026', text: "Bought this for my mother, she's not very tech-savvy but even she found it easy to use. Light enough for her to lift alone." },
    { name: 'Vishal Nair',     rating: 4, date: '30 Jul 2026', text: "Solid for domestic flights. Haven't tried checking it in yet so can't speak to that." },
    { name: 'Ritika Chawla',   rating: 5, date: '2 Aug 2026',  text: "The two-piece setup is genuinely useful, I keep my chargers and toiletries in the small one separately." },
    { name: 'Deepak Joshi',    rating: 5, date: '5 Aug 2026',  text: "Third suitcase I've owned, easily the best build so far. Feels like it'll last years." },
    { name: 'Anjali Rao',      rating: 4, date: '8 Aug 2026',  text: "Pretty happy with it. Would've liked one more color option but the one I got looks good." },
    { name: 'Suresh Pillai',   rating: 5, date: '11 Aug 2026', text: "Handled rough baggage handling on a connecting flight without a dent. Impressed." },
    { name: 'Neha Agarwal',    rating: 5, date: '14 Aug 2026', text: "Compact but fits a surprising amount. Perfect for a long weekend trip." },
    { name: 'Rahul Malhotra',  rating: 4, date: '16 Aug 2026', text: "Good quality, delivery was quick too. Wish the interior had one more pocket." },
    { name: 'Pooja Iyer',      rating: 5, date: '18 Aug 2026', text: "Carried it through three cities in ten days, still rolls smooth. No complaints." },
    { name: 'Vikram Chauhan',  rating: 5, date: '19 Aug 2026', text: "Bought after comparing a bunch of options, glad I went with this one. Feels premium for what I paid." },
    { name: 'Sanya Kapoor',    rating: 4, date: '21 Aug 2026', text: "Works well, just make sure you don't overpack the small case — the zipper gets tight." },
    { name: 'Abhishek Nanda',  rating: 5, date: '23 Aug 2026', text: "My go-to bag now for every short trip. Sturdy handle, smooth wheels, no issues so far." },
  ],
  'aerosmart-pro': [
    {
      name:   'Aparna',
      rating: 5,
      date:   '9 Sep 2026',
      text:   "Looks even better in hand than in the pictures, the glossy finish catches light and doesn't look cheap at all. Gets compliments every time I use it. Shows fingerprints more than a matte one would, but worth it for how attractive it looks.",
      images: [
        '4007c0ae-a07b-4aea-a1e6-06920e0ee100',
        '6f248c1a-47a2-4a89-257a-a20aec996800',
        'b749d1ab-f4ab-4308-1f31-12f961be5100',
        'd7af4aa0-7a32-4d33-caba-db6a45d9d700',
      ],
    },
  ],
}

export function getReviewsForProduct(slug: string): Review[] {
  return PRODUCT_REVIEWS[slug] ?? []
}

// ── Manual rating badge ─────────────────────────────────────────────────────
// A manually-set aggregate rating shown as the same star-pill badge Myntra
// listings get near the product name — for non-Myntra products where a
// rating is known but there's no Myntra data to source it from. Independent
// of the individual reviews above.
export const MANUAL_RATINGS: Record<string, { rating: number; count: number }> = {
  'aerosmart-3in1': { rating: 4.6, count: 386 },
  'aerosmart-pro':  { rating: 4.4, count: 184 },
  'shirtvault':     { rating: 4.2, count: 274 },
}

export function getManualRating(slug: string) {
  return MANUAL_RATINGS[slug]
}

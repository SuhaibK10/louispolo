'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ReviewsSection.tsx
// Social proof. Real names, real trip contexts, real quotes.
// Replace placeholder copy with verified customer reviews before launch.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, animate } from 'framer-motion'
import { Star, X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Image                                 from 'next/image'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'
import { cld }                               from '@/lib/cloudflareImages'
import { cfVideoPoster }                     from '@/lib/cloudflareStream'
import { DemoVideoModal }                    from '@/components/product/DemoVideoModal'

const REVIEWS = [
  {
    name:    'Nikhil',
    city:    '',
    trip:    '',
    product: 'AeroSmart 3-in-1',
    rating:  5,
    text:    "The side pouch is the real hero here, I keep my water bottle and umbrella in it and never have to open the main case for small stuff. Didn't expect to use the hook as much as I do, hung a small tote on it while my hands were full at the airport and it held up fine.",
    photos:  ['b4fdabce-620c-4c0c-e314-886eb0debc00', '8887f692-93fd-412e-0dd8-d8e8ad51aa00', 'afd95dad-92c1-469e-ee8a-35f97904a400'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Aparna',
    city:    '',
    trip:    '',
    product: 'AeroSmart Pro',
    rating:  5,
    text:    "Looks even better in hand than in the pictures, the glossy finish catches light and doesn't look cheap at all. Gets compliments every time I use it. Shows fingerprints more than a matte one would, but worth it for how attractive it looks.",
    photos:  ['4007c0ae-a07b-4aea-a1e6-06920e0ee100', '6f248c1a-47a2-4a89-257a-a20aec996800', 'b749d1ab-f4ab-4308-1f31-12f961be5100', 'd7af4aa0-7a32-4d33-caba-db6a45d9d700'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Adnan Wahab',
    city:    'Delhi',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Took this to Kashmir last month , Gulmarg, Pahalgam, the whole route. Check-in was smooth. The front compartment is a game changer, I had my charger, snacks, docs all within reach. Zero stress the entire trip.',
    photos:  [
      'fc5d01fa-24c8-45d0-bf2b-d2224c042200',
      '1c6ab9bb-273c-4e43-5d3c-9edcba3e3d00',
      'a55ec6b4-c9ea-429c-4995-61e8453e7b00',
    ] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Arjun',
    city:    'Bengaluru',
    trip:    '',
    product: '',
    rating:  5,
    text:    'This Trolley looks really nice, and it is highly organizable too',
    photos:  ['db350626-b2e6-41fd-1880-a859270db600','428e24d5-cf50-4c9f-a587-fc8aa9cef500','636ed414-033a-441e-884e-b1c3b80d5c00'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Gurovind Sharma',
    city:    'Hyderabad',
    trip:    '',
    product: 'HexCore Office Bag',
    rating:  5,
    text:    'I travel every week for work to Delhi, Pune, Chennai, repeat. This laptop bag has been with me for 4 months now and looks brand new. Highly oranizable for my laptop and docs.',
    photos:  ['594c35f6-dcf9-4358-91e2-408a737a9500','8be23a3d-763a-44b1-d9c9-bd5b286d2500','ddcdfc2b-ef96-4c42-92a2-1dae3140f800','6ee65449-39c6-4835-80c0-cbcd3d6b5700'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Adil Ali',
    city:    'Pune',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Bought this customised backpack from Louis Polo, Engraived my name on it, The backpack looks solid and elegant',
    photos:  ['831a845e-273b-496c-a52a-135df4b59300','e39992ae-79e5-4d3a-8bdc-257470177500'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Fatima Sheikh',
    city:    'Ahmedabad',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Gifted the VeeZoom Set of 3 to my relative for their Umrah trip.A very thoughtful gift.',
    photos:  [] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Sneha Iyer',
    city:    'Chennai',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Bought this on Buy 1 Get 1 Free, Looks good and best for stuffs',
    photos:  ['f2731a75-a0db-433b-2af1-9a70ec554000'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Arun Pillai',
    city:    'Kochi',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Ordered this Gym Bag, its quite fine in this price',
    photos:  ['e15d1c2d-0d4d-4cad-60ea-2601e8d0ce00'] as string[],
    videos:  [] as string[],
  },
  {
    name:    'Arjun R.',
    city:    '',
    trip:    '',
    product: 'AeroSmart 3-in-1',
    rating:  5,
    text:    'The finish is stunning in person looks elegant, highly premium.',
    photos:  [] as string[],
    videos:  ['0efce2ec96bce0c80eca870babf6a851'] as string[],
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          strokeWidth={1.5}
          className={i < rating ? 'fill-lp-gold text-lp-gold' : 'text-lp-border'}
        />
      ))}
    </div>
  )
}

function Lightbox({
  photos,
  index,
  reviewName,
  onClose,
  onPrev,
  onNext,
}: {
  photos: string[]
  index: number
  reviewName: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const src = cld(photos[index], 'w=900,h=900,fit=pad,background=%23F5F3ED')
  const multi = photos.length > 1

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={28} strokeWidth={1.5} />
        </button>

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          exit={{    scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm md:max-w-md aspect-square"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            key={index}
            src={src}
            alt={`${reviewName} photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 448px"
          />

          {multi && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`block w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const REVIEW_FILTERS = [
  { id: 'all',    label: 'All ' },
  { id: 'images', label: 'Reviews with Images' },
  { id: 'videos', label: 'Reviews with Videos' },
] as const

type ReviewFilter = typeof REVIEW_FILTERS[number]['id']

export function ReviewsSection() {
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number; reviewName: string } | null>(null)
  const [videoLightbox, setVideoLightbox] = useState<string | null>(null)
  const [filter, setFilter] = useState<ReviewFilter>('all')

  const filtered = REVIEWS.filter((r) =>
    filter === 'all'    ? true :
    filter === 'images' ? r.photos.length > 0 :
    r.videos.length > 0
  )

  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)
  const x = useMotionValue(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const calculate = () => {
      if (trackRef.current && containerRef.current) {
        setDragWidth(trackRef.current.scrollWidth - containerRef.current.offsetWidth)
      }
    }
    if (!trackRef.current) return
    const ro = new ResizeObserver(calculate)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [filter])

  // Reset scroll position when the filter changes
  useEffect(() => {
    x.set(0)
    setActiveIndex(0)
  }, [filter, x])

  // Track drag position → active dot
  useMotionValueEvent(x, 'change', (latest) => {
    const dw = trackRef.current && containerRef.current
      ? trackRef.current.scrollWidth - containerRef.current.offsetWidth
      : 0
    if (dw <= 0) return
    const progress = Math.min(Math.max(-latest / dw, 0), 1)
    setActiveIndex(Math.round(progress * Math.max(filtered.length - 1, 1)))
  })

  // Dot click → glide the track to that review
  const goTo = useCallback((i: number) => {
    const dw = trackRef.current && containerRef.current
      ? trackRef.current.scrollWidth - containerRef.current.offsetWidth
      : 0
    if (dw <= 0) return
    animate(x, -(i / Math.max(filtered.length - 1, 1)) * dw, { type: 'spring', stiffness: 220, damping: 32 })
  }, [x, filtered.length])

  const handlePrev = useCallback(() =>
    setLightbox(lb => lb && { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length }), [])
  const handleNext = useCallback(() =>
    setLightbox(lb => lb && { ...lb, index: (lb.index + 1) % lb.photos.length }), [])

  return (
    <>
      <section className="section-pad overflow-hidden" style={{ paddingTop: '1.5rem' }}>
        <div className="container-lp">

          {/* Header */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="mb-10 md:mb-12"
          >
            <motion.span variants={fadeUp} className="lp-eyebrow">
              2.47L products sold · 4.8 ★ verified buyers
            </motion.span>
            <motion.h2 variants={fadeUp} className="lp-heading-lg">
              Packed, Travelled, Approved.
            </motion.h2>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-nowrap justify-between gap-1.5 md:gap-2 -mt-4 mb-8 md:-mt-6 md:mb-10">
            {REVIEW_FILTERS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={
                  id === filter
                    ? 'whitespace-nowrap font-body text-[0.58rem] md:text-[0.7rem] tracking-[0.06em] md:tracking-widest uppercase px-2.5 md:px-4 py-2 border rounded-sm bg-lp-ink text-lp-porcelain border-lp-ink transition-all duration-200'
                    : 'whitespace-nowrap font-body text-[0.58rem] md:text-[0.7rem] tracking-[0.06em] md:tracking-widest uppercase px-2.5 md:px-4 py-2 border rounded-sm bg-transparent text-lp-muted border-lp-border hover:border-lp-ink hover:text-lp-ink transition-all duration-200'
                }
                aria-pressed={id === filter}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials — swipeable editorial carousel */}
        {filtered.length === 0 ? (
          <div className="container-lp py-10">
            <p className="font-body text-[0.85rem] text-lp-muted text-center">
              {filter === 'videos' ? 'No video reviews yet, check back soon.' : 'No reviews yet, check back soon.'}
            </p>
          </div>
        ) : (
        <div ref={containerRef} className="overflow-hidden w-full">
          <motion.div
            key={filter}
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.05}
            dragMomentum={true}
            className="flex gap-8 md:gap-10 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
            style={{ x, WebkitUserSelect: 'none' }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {filtered.map((review) => (
              <article
                key={review.name}
                className="flex flex-col gap-4 bg-[#4A4F55] rounded-xl p-6 md:p-7 shrink-0 w-[78vw] sm:w-[46vw] md:w-[34vw] lg:w-[24rem]"
              >
                {/* Stars + product */}
                <div className="flex items-start justify-between gap-3">
                  <StarRating rating={review.rating} />
                  {review.product && (
                    <span className="font-body text-[0.6rem] tracking-widest uppercase text-lp-porcelain/50 shrink-0">
                      {review.product}
                    </span>
                  )}
                </div>

                {/* Quote */}
                <p className="font-body text-[0.9rem] text-lp-porcelain/90 leading-relaxed flex-1">
                  {review.text}
                </p>

                {/* Customer photos + video */}
                {(review.photos.length > 0 || review.videos.length > 0) && (
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                    {review.videos.map((vid, i) => (
                      <button
                        key={`v${i}`}
                        onClick={() => setVideoLightbox(vid)}
                        className="relative shrink-0 w-24 h-24 overflow-hidden bg-lp-porcelain border border-lp-border cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={cfVideoPoster(vid)}
                          alt={`${review.name} video`}
                          fill
                          className="object-cover"
                          sizes="96px"
                          draggable="false"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <Play size={20} strokeWidth={0} fill="white" className="ml-0.5" />
                        </span>
                      </button>
                    ))}
                    {review.photos.map((pid, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox({ photos: review.photos, index: i, reviewName: review.name })}
                        className="relative shrink-0 w-24 h-24 overflow-hidden bg-lp-porcelain border border-lp-border cursor-zoom-in hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={cld(pid, 'w=200,h=200,fit=pad,background=%23F5F3ED')}
                          alt={`${review.name} photo ${i + 1}`}
                          fill
                          className="object-contain"
                          sizes="96px"
                          draggable="false"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Attribution — small caps, quiet */}
                <div className="pt-1">
                  <p className="font-body text-[0.72rem] tracking-[0.12em] uppercase font-medium text-lp-porcelain">
                    {review.name}
                  </p>
                  {review.city && (
                    <p className="font-body text-[0.7rem] text-lp-porcelain/60 mt-0.5">
                      {review.city}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </motion.div>
        </div>
        )}

        {/* Carousel dots */}
        {filtered.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
          {filtered.map((review, i) => (
            <button
              key={review.name}
              type="button"
              onClick={() => goTo(i)}
              className="p-1"
              aria-label={`Go to review ${i + 1} of ${filtered.length}`}
              aria-current={i === activeIndex}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 h-1.5 bg-[#4A4F55]'
                    : 'w-1.5 h-1.5 bg-lp-border hover:bg-[#4A4F55]/60'
                }`}
              />
            </button>
          ))}
        </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          reviewName={lightbox.reviewName}
          onClose={() => setLightbox(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      <DemoVideoModal
        open={!!videoLightbox}
        onClose={() => setVideoLightbox(null)}
        videoId={videoLightbox ?? undefined}
      />
    </>
  )
}

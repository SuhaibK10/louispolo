// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/corporate-gifting/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }         from 'next'
import Image                     from 'next/image'
import { Briefcase, Users, Gift, Palette, Check } from 'lucide-react'
import { getProductBySlug }      from '@/config/products'
import { OEM_BRANDS }            from '@/config/oemBrands'
import { cardUrl }               from '@/lib/cloudinary'
import { CorporateEnquiryForm }  from '@/components/corporate/CorporateEnquiryForm'

export const metadata: Metadata = {
  title:       'Corporate Gifting',
  description: 'Bulk orders and corporate gifting from Louis Polo. Employee kits, client gifts, and co-branded luggage, factory-direct pricing from our own Mumbai facility.',
  alternates:  { canonical: '/corporate-gifting' },
}

const STATS = [
  { value: '3500+', label: 'Bags produced daily' },
  { value: '10+',   label: 'Years as an OEM manufacturer' },
  { value: '150+',  label: 'Factory employees' },
  { value: '95%',   label: 'Self-made materials' },
]

const USE_CASES = [
  {
    icon:  Users,
    title: 'Employee Kits',
    body:  'Onboarding kits, work anniversaries, and travel allowances that feel like a real gift, not a line item.',
  },
  {
    icon:  Gift,
    title: 'Client & Partner Gifts',
    body:  'Premium hard-shell luggage for the relationships that matter, branded or as-is.',
  },
  {
    icon:  Briefcase,
    title: 'Events & Conferences',
    body:  'Bulk giveaways for launches, offsites, and conferences, ordered and delivered on your timeline.',
  },
  {
    icon:  Palette,
    title: 'Co-Branded Orders',
    body:  'Custom colours, logo placement, and packaging. The same factory that builds for global brands, working for yours.',
  },
]

const SHOWCASE_SLUGS = ['aerosmart-3in1', 'hexcore', 'armorpack', 'gemtote-duffle-bag', 'skytrail', 'softsquare']

const SHOWCASE_PRODUCTS = SHOWCASE_SLUGS
  .map((slug) => getProductBySlug(slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

export default function CorporateGiftingPage() {
  return (
    <div className="pt-16 md:pt-20">

      {/* ── Hero ── */}
      <div className="container-lp section-pad" style={{ paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>
        <span className="lp-eyebrow">Corporate Gifting</span>
        <h1 className="lp-heading-lg mb-5 max-w-2xl">Luggage that speaks for your brand.</h1>
        <p className="font-body text-[0.95rem] text-lp-ink leading-relaxed max-w-xl">
          Corporate gifting, employee travel kits, and co-branded bulk orders. The same
          factory that builds for global brands, working at your scale, direct from our
          own facility in Mumbai.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="bg-lp-cream border-y border-lp-border">
        <div className="container-lp py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <p className="font-display leading-none text-lp-ink" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}>
                  {value}
                </p>
                <p className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-lp-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Use cases ── */}
      <div className="container-lp section-pad">
        <h2 className="lp-heading-md mb-10">Where corporate orders fit.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          {USE_CASES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-lp-cream">
                <Icon size={17} strokeWidth={1.5} className="text-lp-ink" />
              </div>
              <div>
                <p className="font-display text-[1rem] text-lp-ink mb-1">{title}</p>
                <p className="font-body text-[0.85rem] text-lp-muted leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Image showcase ── */}
      <div className="bg-lp-cream">
        <div className="container-lp section-pad">
          <span className="lp-eyebrow">The range</span>
          <h2 className="lp-heading-md mb-10 max-w-xl">Built for bulk, without looking like it.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {SHOWCASE_PRODUCTS.map((product) => (
              <div key={product.id}>
                <div className="relative aspect-3/4 bg-white rounded-md overflow-hidden mb-3">
                  <Image
                    src={cardUrl(product.images[0])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 45vw, 30vw"
                  />
                </div>
                <p className="font-body text-[0.85rem] text-lp-ink">{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Brands we've manufactured for ── */}
      <div className="container-lp section-pad">
        <p className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-lp-faint text-center mb-8">
          Brands we&apos;ve manufactured for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {OEM_BRANDS.map(({ name }) => (
            <span key={name} className="font-display text-[1.1rem] text-lp-muted">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Where we show up ── */}
      <div className="bg-lp-cream border-y border-lp-border">
        <div className="container-lp py-10 md:py-12 text-center">
          <p className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-lp-faint mb-3">
            Where we show up
          </p>
          <p className="font-display text-[1.3rem] text-lp-ink">
            Mumbai · London · Hong Kong
          </p>
        </div>
      </div>

      {/* ── What's included ── */}
      <div className="bg-lp-ink">
        <div className="container-lp section-pad">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <span className="lp-eyebrow">How it works</span>
              <h2 className="font-display text-[1.8rem] md:text-[2.2rem] text-white leading-tight mb-6">
                Tell us what you need. We handle the rest.
              </h2>
              <ul className="space-y-3">
                {[
                  'Minimum order quantities that flex to your budget',
                  'Custom colours and logo branding on request',
                  'Factory-direct pricing, no middleman markup',
                  'Pan-India delivery, tracked and on schedule',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={16} strokeWidth={1.5} className="text-lp-gold shrink-0 mt-0.5" />
                    <span className="font-body text-[0.9rem] text-white/70 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <CorporateEnquiryForm />
          </div>
        </div>
      </div>

    </div>
  )
}

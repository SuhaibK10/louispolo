'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/CorporateSection.tsx
// Corporate / bulk order band — light cream, sits below Shop by Category.
// Hosts the OEM client-brand marquee (moved here from BrandStory) and a CTA
// that opens the corporate enquiry modal.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }              from 'react'
import { motion }                from 'framer-motion'
import { ArrowRight }            from 'lucide-react'
import { OEMBrandsMarquee }      from './OEMBrandsMarquee'
import { CorporateEnquiryModal } from '@/components/ui/CorporateEnquiryModal'
import { fadeUp, VIEWPORT }      from '@/lib/animations'

export function CorporateSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className="section-pad bg-[var(--color-lp-cream)]">
      <div className="container-lp">

        {/* ── Copy + CTA ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="max-w-[42rem] mx-auto text-center"
        >
          <span className="lp-eyebrow text-[var(--color-lp-gold)]">Corporate &amp; Bulk Orders</span>
          <h2 className="lp-heading-lg mb-5">
            Luggage for your business.
          </h2>
          <p className="font-body text-[var(--color-lp-muted)] text-base leading-relaxed mb-8">
            Corporate gifting, employee travel kits, and co-branded bulk orders.
            The same factory that builds for global brands, working at your scale.
          </p>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary inline-flex">
            Make a corporate enquiry
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </motion.div>

        {/* ── OEM brand marquee ── */}
        <div className="mt-12 pt-8 border-t border-[var(--color-lp-border)]">
          <p className="font-body text-[0.6rem] tracking-[0.18em] uppercase text-[var(--color-lp-faint)] text-center mb-6">
            Brands we&apos;ve manufactured for
          </p>
          <OEMBrandsMarquee />
        </div>

      </div>

      <CorporateEnquiryModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}

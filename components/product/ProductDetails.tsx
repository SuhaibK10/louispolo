'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ProductDetails.tsx
// PDP detail content, two exports:
//   ProductAccordions — Specifications / Warranty & Care / Shipping & Returns /
//                       FAQs, rendered inside the buy panel under the CTA.
//   ProductStory      — long-form "In Detail" editorial section rendered
//                       full-width below the PDP grid.
// Every section is optional — nothing renders if the product has no content.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }               from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus }                   from 'lucide-react'
import type { Product }           from '@/types'

// Care guidance is the same for every hard-shell product — written once here.
const CARE_COPY =
  'Wipe the shell with a soft, damp cloth — no solvents or abrasives. Clean wheels and the telescopic handle track occasionally to keep them running smoothly, and store your luggage dry, away from direct sunlight.'

const SHIPPING_COPY =
  'Shipping is free on every order, anywhere in India. Unused items in original packaging can be returned within 7 days of delivery. If anything arrives damaged, write to us within 48 hours with photos and we will replace it or refund you in full — return shipping on us.'

// ─── Accordion primitives ─────────────────────────────────────────────────────

interface AccordionItem {
  label: string
  content: React.ReactNode
}

function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="border-t border-[var(--color-lp-border)]">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={item.label} className="border-b border-[var(--color-lp-border)]">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left group"
              aria-expanded={open}
            >
              <span className="font-body text-[0.72rem] tracking-[0.12em] uppercase text-[var(--color-lp-ink)]">
                {item.label}
              </span>
              <Plus
                size={14}
                strokeWidth={1.5}
                className={`shrink-0 text-[var(--color-lp-muted)] group-hover:text-[var(--color-lp-gold)] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ─── Accordions (buy panel) ──────────────────────────────────────────────────

export function ProductAccordions({ product }: { product: Product }) {
  const items: AccordionItem[] = []

  if (product.specs?.length) {
    items.push({
      label: 'Specifications',
      content: (
        <dl>
          {product.specs.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between gap-6 py-2 border-b border-[var(--color-lp-border)]/50 last:border-b-0"
            >
              <dt className="font-body text-[0.78rem] text-[var(--color-lp-muted)] shrink-0">{label}</dt>
              <dd className="font-body text-[0.78rem] text-[var(--color-lp-ink)] text-right">{value}</dd>
            </div>
          ))}
        </dl>
      ),
    })
  }

  if (product.warranty) {
    items.push({
      label: 'Warranty & Care',
      content: (
        <div className="space-y-3">
          <p className="font-body text-[0.82rem] text-[var(--color-lp-ink)] leading-relaxed">
            {product.warranty}
          </p>
          <p className="font-body text-[0.82rem] text-[var(--color-lp-muted)] leading-relaxed">
            {CARE_COPY}
          </p>
        </div>
      ),
    })
  }

  items.push({
    label: 'Shipping & Returns',
    content: (
      <p className="font-body text-[0.82rem] text-[var(--color-lp-muted)] leading-relaxed">
        {SHIPPING_COPY}
      </p>
    ),
  })

  if (product.faqs?.length) {
    items.push({
      label: 'FAQs',
      content: (
        <div className="space-y-4">
          {product.faqs.map(({ q, a }) => (
            <div key={q}>
              <p className="font-body text-[0.82rem] font-medium text-[var(--color-lp-ink)] mb-1">{q}</p>
              <p className="font-body text-[0.82rem] text-[var(--color-lp-muted)] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      ),
    })
  }

  if (!items.length) return null
  return <Accordion items={items} />
}

// ─── Story ("In Detail" editorial section) ───────────────────────────────────

export function ProductStory({ product }: { product: Product }) {
  const hasStory      = !!product.story?.length
  const hasHighlights = !!product.highlights?.length
  if (!hasStory && !hasHighlights) return null

  return (
    <section className="mt-16 md:mt-24 border-t border-[var(--color-lp-border)] pt-12 md:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 md:gap-20">

        {/* Left rail — section label */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="font-body text-[0.65rem] tracking-[0.16em] uppercase text-[var(--color-lp-gold)] mb-3">
            In Detail
          </p>
          <h2 className="lp-heading-md">
            The {product.name.trim()}, up close
          </h2>
        </div>

        {/* Right column — story + highlights */}
        <div>
          {hasStory && (
            <div className="space-y-5 mb-4">
              {product.story!.map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="font-body text-[0.92rem] text-[var(--color-lp-muted)] leading-[1.8]"
                >
                  {para}
                </p>
              ))}
            </div>
          )}

          {hasHighlights && (
            <div>
              {product.highlights!.map(({ heading, body }, i) => (
                <div
                  key={heading}
                  className="border-t border-[var(--color-lp-border)] pt-6 mt-6 grid grid-cols-[auto_1fr] gap-5"
                >
                  <span className="font-display text-[0.85rem] text-[var(--color-lp-faint)] leading-[1.6] pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.15rem] text-[var(--color-lp-ink)] mb-2">
                      {heading}
                    </h3>
                    <p className="font-body text-[0.88rem] text-[var(--color-lp-muted)] leading-[1.75]">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

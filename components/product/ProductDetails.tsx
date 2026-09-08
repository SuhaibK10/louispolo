'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ProductDetails.tsx
// PDP detail content, two exports:
//   ProductAccordions — Specifications / Warranty & Care / Shipping & Replacement /
//                       FAQs, rendered inside the buy panel under the CTA.
//   ProductStory      — long-form "In Detail" editorial section rendered
//                       full-width below the PDP grid.
// Every section is optional — nothing renders if the product has no content.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }               from 'react'
import Image                      from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus }                   from 'lucide-react'
import type { Product }           from '@/types'
import { pdpUrl, PLACEHOLDER_URL } from '@/lib/cloudflareImages'

// Care guidance is the same across the range, except the wheels/telescopic
// handle clause — only true for products that actually have them. Whether a
// given product does isn't reliable from `category` alone (some 'vanity'
// cases have spinner wheels, most don't), so it's read off the product's own
// specs/features instead of hardcoded per category.
const CARE_COPY_WHEELED =
  'Wipe the shell with a soft, damp cloth, without solvents or abrasives. Clean wheels and the telescopic handle track occasionally to keep them running smoothly, and store your luggage dry, away from direct sunlight.'
const CARE_COPY_BAG =
  'Wipe the shell with a soft, damp cloth, without solvents or abrasives, and store it dry, away from direct sunlight.'

function hasWheels(product: Product): boolean {
  return (
    !!product.specs?.some((s) => /wheel/i.test(s.label) || /wheel/i.test(s.value)) ||
    !!product.features?.some((f) => /wheel/i.test(f.label))
  )
}

const SHIPPING_COPY =
  'Shipping is free on every order, anywhere in India. Items are non-returnable. We offer a free replacement only if the product arrives damaged (write to us within 48 hours with photos) or develops a manufacturing defect while still within its warranty period.'

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
              <span className="font-body font-semibold text-[0.72rem] tracking-[0.06em] uppercase text-[var(--color-lp-ink)]">
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
              <dt className="font-body text-[0.9rem] text-[var(--color-lp-muted)] shrink-0">{label}</dt>
              <dd className="font-body text-[0.9rem] font-medium text-[var(--color-lp-ink)] text-right">{value}</dd>
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
          <p className="font-body text-[0.95rem] font-medium text-[var(--color-lp-ink)] leading-[1.65]">
            {product.warranty}
          </p>
          <p className="font-body text-[0.95rem] font-medium text-[var(--color-lp-body)] leading-[1.65]">
            {hasWheels(product) ? CARE_COPY_WHEELED : CARE_COPY_BAG}
          </p>
        </div>
      ),
    })
  }

  items.push({
    label: 'Shipping & Replacement',
    content: (
      <p className="font-body text-[0.95rem] font-medium text-[var(--color-lp-body)] leading-[1.65]">
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
              <p className="font-body text-[0.95rem] font-semibold text-[var(--color-lp-ink)] mb-1.5">{q}</p>
              <p className="font-body text-[0.95rem] font-medium text-[var(--color-lp-body)] leading-[1.65]">{a}</p>
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
  const hasStory = !!product.story?.length
  const allHighlights   = product.highlights ?? []
  const textHighlights  = allHighlights.filter((h) => !h.image)
  const imageHighlights = allHighlights.filter((h) => h.image)
  const hasTextHighlights = textHighlights.length > 0
  if (!hasStory && !allHighlights.length) return null

  return (
    <>
      {(hasStory || hasTextHighlights) && (
        <section className="mt-16 md:mt-24 border-t border-[var(--color-lp-border)] pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 md:gap-20">

            {/* Left rail — section label */}
            <div className="md:sticky md:top-28 md:self-start">
              <p className="font-body font-semibold text-[0.65rem] tracking-[0.13em] uppercase text-[var(--color-lp-gold)] mb-3">
                In Detail
              </p>
              <h2 className="lp-heading-md">
                The {product.name.trim()}, <em className="italic font-normal">up close.</em>
              </h2>
            </div>

            {/* Right column — story + highlights */}
            <div>
              {hasStory && (
                <div className="space-y-5 mb-4">
                  {product.story!.map((para) => (
                    <p
                      key={para.slice(0, 40)}
                      className="font-body text-[1.05rem] font-medium text-[var(--color-lp-ink)] leading-[1.7] max-w-[35rem]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {hasTextHighlights && (
                <div>
                  {textHighlights.map(({ heading, body }, i) => (
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
                        <p className="font-body text-[1rem] font-medium text-[var(--color-lp-ink)] leading-[1.65]">
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
      )}

      {imageHighlights.length > 0 && (
        <section className="mt-16 md:mt-24">
          <p className="font-body font-semibold text-[0.65rem] tracking-[0.13em] uppercase text-[var(--color-lp-gold)] mb-2 text-center">
            Craftsmanship in Detail
          </p>
          <h2 className="lp-heading-md text-center mb-12 md:mb-16">Details You&rsquo;ll Love</h2>

          <div className="flex flex-col gap-16 md:gap-24">
            {imageHighlights.map(({ heading, body, image, imageFit }, i) => (
              <div
                key={heading}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-lp-image-bg">
                  <Image
                    src={pdpUrl(image!, imageFit ?? 'pad') || PLACEHOLDER_URL}
                    alt={heading}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div>
                  <p className="font-body font-semibold text-[0.65rem] tracking-[0.13em] uppercase text-[var(--color-lp-gold)] mb-3">
                    Feature {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display text-[1.5rem] md:text-[1.75rem] text-[var(--color-lp-ink)] mb-4 leading-tight">
                    {heading}
                  </h3>
                  <p className="font-body text-[1.05rem] font-medium text-[var(--color-lp-body)] leading-[1.7] max-w-[30rem]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

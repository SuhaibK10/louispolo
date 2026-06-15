// ─────────────────────────────────────────────────────────────────────────────
// app/store/contact/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { MessageCircle } from 'lucide-react'
import { BRAND }         from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Contact',
  description: 'Get in touch with Louis Polo. We respond within 2 hours.',
}

export default function ContactPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="section-pad">
        <div className="container-lp">
          <span className="lp-eyebrow">Get in touch</span>
          <h1 className="lp-heading-lg mb-10">We&apos;d love to hear from you.</h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT — contact details */}
            <div className="space-y-6">
              <div>
                <p className="font-body text-sm text-[var(--color-lp-muted)] mb-1">Email</p>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="font-body text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors"
                >
                  {BRAND.email}
                </a>
              </div>

              <div>
                <p className="font-body text-sm text-[var(--color-lp-muted)] mb-1">Phone</p>
                <a
                  href={`tel:${BRAND.phone.replace(/[\s-]/g, '')}`}
                  className="font-body text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors"
                >
                  {BRAND.phone}
                </a>
              </div>

              <div>
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>

              <div>
                <p className="font-body text-sm text-[var(--color-lp-muted)] mb-1">Offices</p>
                <p className="font-body text-[var(--color-lp-ink)]">
                  Mumbai · Bhiwandi · London · Hong Kong
                </p>
              </div>
            </div>

            {/* RIGHT — response info */}
            <div className="space-y-4">
              <p className="font-body text-[var(--color-lp-ink)]">
                We typically respond within 2 hours on WhatsApp.
              </p>
              <p className="font-body text-[var(--color-lp-ink)]">
                For bulk orders or B2B enquiries, email us directly.
              </p>
              <p className="font-body text-sm text-[var(--color-lp-muted)]">
                Monday – Saturday, 9 am – 7 pm IST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

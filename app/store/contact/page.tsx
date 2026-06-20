// ─────────────────────────────────────────────────────────────────────────────
// app/store/contact/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { BRAND }         from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Contact',
  description: 'Get in touch with Louis Polo. We respond within 2 hours.',
}

export default function ContactPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="section-pad" style={{ paddingTop: '1.5rem' }}>
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
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.529 5.845L.057 23.48a.75.75 0 0 0 .923.923l5.635-1.472A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.209-1.432l-.374-.22-3.88 1.013 1.013-3.88-.22-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
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

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/careers/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Hammer, TrendingUp, Users, ShieldCheck } from 'lucide-react'
import { BRAND }         from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Careers',
  description: 'Join Louis Polo. We build hard-shell luggage from our own factory in Bhiwandi, direct to customers across India.',
  alternates:  { canonical: '/careers' },
}

const VALUES = [
  {
    icon:  Hammer,
    title: 'Real craft',
    body:  'Every role here connects to a bag someone will actually carry. No abstractions, no middlemen.',
  },
  {
    icon:  ShieldCheck,
    title: 'Ownership',
    body:  'We are a small team. What you build ships fast, and you see the outcome, good or bad.',
  },
  {
    icon:  TrendingUp,
    title: 'Room to grow',
    body:  'Ten years as an OEM manufacturer, now building our own brand from scratch. Early hires shape what comes next.',
  },
  {
    icon:  Users,
    title: 'Direct impact',
    body:  'Small teams, flat structure. Your work reaches customers within days, not quarters.',
  },
]

const DEPARTMENTS = [
  'Design & Product',
  'Manufacturing & Quality Control',
  'Warehouse & Fulfilment',
  'Customer Experience',
  'Marketing & Growth',
]

export default function CareersPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad" style={{ paddingTop: '1.5rem' }}>

        {/* ── Hero ── */}
        <span className="lp-eyebrow">Careers</span>
        <h1 className="lp-heading-lg mb-4 max-w-2xl">Build with us.</h1>
        <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] leading-relaxed max-w-xl">
          Louis Polo started as an OEM manufacturer in Bhiwandi over ten years ago, building
          luggage for other brands. We are now building our own, direct to customers across
          India. We are a small team and we hire slowly, but we are always open to talking to
          people who care about the work.
        </p>

        {/* ── Values ── */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--color-lp-cream)]">
                <Icon size={17} strokeWidth={1.5} className="text-[var(--color-lp-ink)]" />
              </div>
              <div>
                <p className="font-display text-[1rem] text-[var(--color-lp-ink)] mb-1">{title}</p>
                <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)] leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Departments ── */}
        <div className="mt-16 pt-12 border-t border-[var(--color-lp-border)]">
          <h2 className="lp-heading-md mb-6">Where we hire.</h2>
          <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] leading-relaxed max-w-xl mb-8">
            We do not always have open roles listed, but we keep every resume we receive on
            file and reach out when the right one comes up.
          </p>
          <div className="flex flex-wrap gap-3">
            {DEPARTMENTS.map(dept => (
              <span
                key={dept}
                className="font-body text-[0.75rem] tracking-[0.08em] uppercase text-[var(--color-lp-ink)] border border-[var(--color-lp-border)] rounded-full px-4 py-2"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        {/* ── Apply CTA ── */}
        <div className="mt-16 pt-12 border-t border-[var(--color-lp-border)] max-w-xl">
          <h2 className="lp-heading-md mb-3">Get in touch.</h2>
          <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] leading-relaxed mb-6">
            Send us your resume and a note on what you would want to work on. Tell us which
            department fits best.
          </p>
          <a
            href={`mailto:${BRAND.email}?subject=${encodeURIComponent('Career application, Louis Polo')}`}
            className="btn-primary inline-flex"
          >
            Email your resume
          </a>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/careers/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }          from 'next'
import { Hammer, TrendingUp, Users, ShieldCheck, Briefcase, Download } from 'lucide-react'
import { CareerApplicationForm }  from '@/components/careers/CareerApplicationForm'

export const metadata: Metadata = {
  title:       'Careers',
  description: 'Join Louis Polo. We build hard-shell luggage from our own factory in Mumbai, direct to customers across India.',
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
  'Technology',
  'Manufacturing & Quality Control',
  'Warehouse & Fulfilment',
  'Customer Experience',
  'Marketing & Growth',
]

export default function CareersPage() {
  return (
    <div className="pt-16 md:pt-20">
      <div className="container-lp section-pad" style={{ paddingTop: '1.5rem' }}>

        {/* ── Hero ── */}
        <span className="lp-eyebrow">Careers</span>
        <h1 className="lp-heading-lg mb-4 max-w-2xl">Build with us.</h1>
        <p className="font-body text-[0.9rem] text-lp-ink leading-relaxed max-w-xl">
          Louis Polo started as an OEM manufacturer over a decade ago, building luggage for
          global brands. Now we also build our own, We are now building our own, direct to customers across
          India, London, HongKong. <br/> <br/>
          We remain a small, fast-moving team, and we are always glad to hear from people
          who care about the craft.
        </p>

        {/* ── Values ── */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          {VALUES.map(({ icon: Icon, title, body }) => (
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

        {/* ── Open Positions ── */}
        <div className="mt-16 pt-12 border-t border-lp-border">
          <div className="flex flex-col md:flex-row gap-x-10 md:gap-x-12 gap-y-8 items-start">
            {/* LEFT — heading + role details, stacked so the form on the
                right can align its top edge with "Open position" itself */}
            <div className="md:w-1/2">
              <h2 className="lp-heading-md mb-6">Open position</h2>

              <div className="flex items-center gap-2 mb-3">
                <Briefcase size={20} strokeWidth={1.5} className="text-lp-ink shrink-0" />
                <span className="font-body text-[0.72rem] tracking-widest uppercase text-lp-ink font-medium">
                  Internship · Remote · 2 Months · ₹10,000-20,000/month · API cost on us
                </span>
              </div>
              <h3 className="font-display text-[1.4rem] text-lp-ink mt-6 mb-3">
                Creative Intern (Gen AI)
              </h3>
              <p className="font-body text-[0.92rem] text-lp-ink leading-relaxed mb-4">
                Own the visual output for Louis Polo: hero shots, ad creatives and lifestyle
                imagery, built with Gen AI tools and finished to a studio-grade
                standard. <br/> We are a small, fast-moving team and we ship at a fast pace.
              </p>

              <a
                href="/documents/louis-polo-creative-intern-jd.pdf"
                download
                className="flex w-fit items-center gap-1.5 font-body text-[0.78rem] text-lp-ink underline underline-offset-2 hover:text-lp-gold transition-colors mb-8"
              >
                <Download size={14} strokeWidth={1.5} />
                Job Description
              </a>

              <p className="font-body text-[0.72rem] tracking-widest uppercase text-lp-muted font-medium mb-3">
                What you&apos;ll do
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Design hero images, ad creatives and campaign visuals for the brand',
                  'Generate photorealistic product and lifestyle images with AI tools',
                  'Edit and finish every piece to a premium, studio-quality standard',
                  'Track new AI creative tools and bring the useful ones into our workflow',
                ].map(item => (
                  <li key={item} className="font-body text-[0.9rem] text-lp-ink leading-relaxed pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-lp-gold">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-body text-[0.72rem] tracking-widest uppercase text-lp-muted font-medium mb-3">
                What we&apos;re looking for
              </p>
              <ul className="space-y-2 mb-2">
                {[
                  'Strong visual instinct and a sharp eye for premium, realistic imagery',
                  'Extremely good at prompt writing, you can get exact, consistent results out of any AI tool',
                  'Hands-on with AI image tools: Midjourney, Nano Banana Pro, Krea AI or FLUX',
                  'Bonus: AI video (Runway, Veo, Kling) or Photoshop, Premiere Pro, After Effects, Figma',
                ].map(item => (
                  <li key={item} className="font-body text-[0.9rem] text-lp-ink leading-relaxed pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-lp-gold">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-body text-[0.85rem] text-lp-muted leading-relaxed">
                Expect a reply within 3-4 days, we are moving fast.
              </p>
            </div>

            {/* RIGHT — application form, top-aligned with the left column
                so it starts level with "Open position" itself */}
            <div className="md:w-1/2">
              <CareerApplicationForm role="Creative Intern (Gen AI)" />
              <p className="font-body text-[0.8rem] text-lp-muted leading-relaxed mt-4 text-center">
                Have a question? Write to us at{' '}
                <a
                  href="mailto:careers@louispolo.in"
                  className="text-lp-ink underline underline-offset-2 hover:text-lp-gold transition-colors"
                >
                  careers@louispolo.in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ── Departments ── */}
        <div className="mt-16 pt-12 border-t border-lp-border">
          <h2 className="lp-heading-md mb-6">Where else we hire.</h2>
          <p className="font-body text-[0.9rem] text-lp-muted leading-relaxed max-w-xl mb-2">
            We do not always have every role listed, but we keep every resume we receive on
            file and reach out when the right one comes up.
          </p>
          <p className="font-body text-[0.9rem] text-lp-muted leading-relaxed max-w-xl mb-8">
            Our team is based across Mumbai, London and Hong Kong.
          </p>
          <div className="flex flex-wrap gap-3">
            {DEPARTMENTS.map(dept => (
              <span
                key={dept}
                className="font-body text-[0.75rem] tracking-[0.08em] uppercase text-lp-ink border border-lp-border rounded-full px-4 py-2"
              >
                {dept}
              </span>
            ))}
          </div>

          <p className="font-body text-[0.85rem] text-lp-muted leading-relaxed mt-8">
            For any other department, email your resume to{' '}
            <a
              href={`mailto:careers@louispolo.in?subject=${encodeURIComponent('Career application, Louis Polo')}`}
              className="text-lp-ink underline underline-offset-2 hover:text-lp-gold transition-colors"
            >
              careers@louispolo.in
            </a>.
          </p>
        </div>

      </div>
    </div>
  )
}

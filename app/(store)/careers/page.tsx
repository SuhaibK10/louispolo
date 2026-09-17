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

interface OpenPosition {
  role:                string
  tags:                string   // the uppercase meta line: type · location · duration · pay
  description:         string
  jdHref?:             string   // downloadable JD PDF, if one exists
  whatYoullDo:         string[]
  whatWereLookingFor:  string[]
  showTask:            boolean  // the AI-creative task only makes sense for creative roles
  applyByEmail?:       boolean  // skip the in-page form — direct straight to emailing a resume
}

const POSITIONS: OpenPosition[] = [
  {
    role: 'UI/UX Design Intern',
    tags: 'Internship · Remote · 2 Months · ₹20,000/month',
    description:
      "Own the look and feel of everything Louis Polo customers touch, the website, the app, every PDP and campaign page. We are obsessive about not looking like every other AI-templated D2C brand out there, and we need someone with the taste to keep it that way. High design quotient is non-negotiable here, you notice the details most people scroll past.",
    jdHref: '/documents/louis-polo-uiux-designer-jd.pdf',
    whatYoullDo: [
      'Design and evolve the visual language across the website, app, and every customer touchpoint',
      'Own new product pages, landing pages, and campaign creatives end to end, from concept to dev handoff',
      'Build and maintain a cohesive design system, typography, color, components, spacing, all of it',
      'Work closely with engineering to make sure every design ships pixel-accurate, not approximated',
      'Push back on generic, templated design, every screen should look considered, not AI-generated',
      'Bring outside references, benchmark against category leaders, and keep raising the bar',
    ],
    whatWereLookingFor: [
      'A portfolio with real range: layout, typography, color, motion, not just polished mockups',
      'Obsessive attention to detail, the kind that notices a 2px misalignment',
      'End-to-end fluency in Figma, from wireframes to high-fidelity, dev-ready files',
      'A strong point of view on what looks premium versus what looks generic, and the ability to defend it',
      'Experience designing for e-commerce or D2C brands is a strong plus',
      'Can take a rough brief and turn it into three strong directions, not one safe one',
    ],
    showTask: false,
  },
  {
    role: 'Growth Creative Intern (Gen AI)',
    tags: 'Internship · Remote · 2 Months · ₹10,000/month · API cost on us',
    description:
      "Own creative that doesn't just look beautiful, it sells. Hero visuals, Meta ad creatives, product videos, competitor research and campaign ideas for a growing premium travel brand. Small, fast-moving team, we experiment aggressively and ship even faster.",
    jdHref: '/documents/louis-polo-creative-intern-jd.pdf',
    whatYoullDo: [
      'Design premium hero images, ad creatives and campaign visuals',
      'Generate photorealistic lifestyle and product imagery using AI',
      'Create scroll-stopping social posts and edit short-form performance videos',
      'Assist in planning Meta, Instagram and other digital ad campaigns',
      'Research competitors and reverse engineer what makes their creatives work',
      'Build systems that make our creative workflow faster and better',
    ],
    whatWereLookingFor: [
      'Strong visual taste and understanding of color, typography and composition',
      'Understands customer psychology, what makes someone stop scrolling and buy',
      'Exceptional prompt writing, comfortable with Midjourney, Nano Banana Pro, FLUX, Krea, GPT or Claude',
      'Basic understanding of Meta Ads and branding vs. conversion creative',
      'Comfortable editing short-form video: CapCut, Premiere Pro, DaVinci Resolve or After Effects',
    ],
    showTask: false,
  },
]

export default function CareersPage() {
  return (
    <div className="pt-16 md:pt-18">
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
        {POSITIONS.map((position) => (
          <div key={position.role} className="mt-16 pt-12 border-t border-lp-border">
            <div className="flex flex-col md:flex-row gap-x-10 md:gap-x-12 gap-y-8 items-start">
              {/* LEFT — heading + role details, stacked so the form on the
                  right can align its top edge with "Open position" itself */}
              <div className="md:w-1/2">
                <h2 className="lp-heading-md mb-6">Open position</h2>

                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={20} strokeWidth={1.5} className="text-lp-ink shrink-0" />
                  <span className="font-body text-[0.72rem] tracking-widest uppercase text-lp-ink font-medium">
                    {position.tags}
                  </span>
                </div>
                <h3 className="font-display text-[1.4rem] text-lp-ink mt-6 mb-3">
                  {position.role}
                </h3>
                <p className="font-body text-[0.92rem] text-lp-ink leading-relaxed mb-4">
                  {position.description}
                </p>

                {position.jdHref && (
                  <a
                    href={position.jdHref}
                    download
                    className="flex w-fit items-center gap-1.5 font-body text-[0.78rem] text-lp-ink underline underline-offset-2 hover:text-lp-gold transition-colors mb-8"
                  >
                    <Download size={14} strokeWidth={1.5} />
                    Job Description
                  </a>
                )}

                <p className="font-body text-[0.72rem] tracking-widest uppercase text-lp-muted font-medium mb-3">
                  What you&apos;ll do
                </p>
                <ul className="space-y-2 mb-8">
                  {position.whatYoullDo.map(item => (
                    <li key={item} className="font-body text-[0.9rem] text-lp-ink leading-relaxed pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-lp-gold">
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="font-body text-[0.72rem] tracking-widest uppercase text-lp-muted font-medium mb-3">
                  What we&apos;re looking for
                </p>
                <ul className="space-y-2 mb-8">
                  {position.whatWereLookingFor.map(item => (
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
                {position.applyByEmail ? (
                  <div className="bg-lp-cream rounded-2xl p-6 md:p-8 text-center">
                    <p className="font-display text-[1.1rem] text-lp-ink mb-2">
                      Apply by email
                    </p>
                    <p className="font-body text-[0.9rem] text-lp-ink leading-relaxed mb-5">
                      Email your resume to{' '}
                      <a
                        href={`mailto:careers@louispolo.in?subject=${encodeURIComponent(`Application: ${position.role}`)}`}
                        className="underline underline-offset-2 hover:text-lp-gold transition-colors"
                      >
                        careers@louispolo.in
                      </a>
                      {' '}with the role name in the subject line, and a portfolio or LinkedIn link if you have one.
                    </p>
                    <a
                      href={`mailto:careers@louispolo.in?subject=${encodeURIComponent(`Application: ${position.role}`)}`}
                      className="btn-primary w-fit mx-auto"
                    >
                      Email your resume
                    </a>
                  </div>
                ) : (
                  <>
                    <CareerApplicationForm role={position.role} showTask={position.showTask} />
                    <p className="font-body text-[0.8rem] text-lp-muted leading-relaxed mt-4 text-center">
                      Have a question? Write to us at{' '}
                      <a
                        href="mailto:careers@louispolo.in"
                        className="text-lp-ink underline underline-offset-2 hover:text-lp-gold transition-colors"
                      >
                        careers@louispolo.in
                      </a>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

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

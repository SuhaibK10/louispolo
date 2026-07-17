// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Footer.tsx
// Server Component — newsletter + corporate enquiry are client islands.
// Structure: newsletter band → link grid → payments/legal bar → © line.
// Social icons are monochrome (gold on hover).
// ─────────────────────────────────────────────────────────────────────────────

import Link                          from 'next/link'
import Image                         from 'next/image'
import { Instagram, Linkedin, Mail } from 'lucide-react'
import { BRAND, ROUTES }             from '@/lib/constants'
import { FooterNewsletter }          from './FooterNewsletter'
import { FooterCorporateLink }       from './FooterCorporateLink'

const SHOP_LINKS = [
  { label: 'All Products', href: ROUTES.shop },
  { label: 'Trolley Bags', href: `${ROUTES.shop}?category=trolley` },
  { label: 'Sets',         href: `${ROUTES.shop}?category=set` },
  { label: 'Backpacks',    href: `${ROUTES.shop}?category=backpack` },
  { label: 'Office Bags',  href: `${ROUTES.shop}?category=office-bag` },
  { label: 'Duffle Bags',  href: `${ROUTES.shop}?category=duffle` },
  { label: 'Vanity Cases', href: `${ROUTES.shop}?category=vanity` },
  { label: 'Overnighters', href: `${ROUTES.shop}?category=overnighter` },
  { label: 'Compare Models', href: '/compare' },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: ROUTES.about   },
  { label: 'Careers',  href: ROUTES.careers },
  { label: 'Contact',  href: ROUTES.contact },
]

const LEGAL_LINKS = [
  { label: 'Privacy',       href: '/privacy' },
  { label: 'Terms',         href: '/terms' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

const footerLink =
  'font-body text-[0.8rem] text-white/65 hover:text-[var(--color-lp-gold)] transition-colors duration-200'

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.529 5.845L.057 23.48a.75.75 0 0 0 .923.923l5.635-1.472A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.209-1.432l-.374-.22-3.88 1.013 1.013-3.88-.22-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  )
}

// ── Payment marks — brand colors on warm-white chips ──────────────────────
// Wordmark-style marks are set in type; geometric marks (Mastercard circles,
// UPI/RuPay chevrons) are drawn from primitives so they stay crisp at 28px.
const payChip =
  'flex h-6 items-center justify-center gap-1.5 rounded-[3px] bg-white px-2 opacity-90'

function PaymentMarks() {
  return (
    <div className="flex items-center gap-2 flex-wrap">

      {/* UPI */}
      <span className={payChip} role="img" aria-label="UPI">
        <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
          <path d="M0 0l6.2 8L0 16z"  fill="#ED752E" />
          <path d="M7 0l7.2 8L7 16z"  fill="#0B9444" />
        </svg>
        <span className="font-body text-[0.68rem] font-semibold tracking-tight text-[#1A1714]">
          UPI
        </span>
      </span>

      {/* Visa */}
      <span className={payChip} role="img" aria-label="Visa">
        <span className="font-body text-[0.72rem] font-semibold tracking-[-0.03em] text-[#1A1F71]">
          VISA
        </span>
      </span>

      {/* Mastercard */}
      <span className={payChip} role="img" aria-label="Mastercard">
        <svg viewBox="0 0 36 22" width="26" height="16" aria-hidden="true">
          <circle cx="13" cy="11" r="10" fill="#EB001B" />
          <circle cx="23" cy="11" r="10" fill="#F79E1B" />
          <defs>
            <clipPath id="lp-mc-overlap"><circle cx="13" cy="11" r="10" /></clipPath>
          </defs>
          <circle cx="23" cy="11" r="10" fill="#FF5F00" clipPath="url(#lp-mc-overlap)" />
        </svg>
      </span>

      {/* RuPay */}
      <span className={payChip} role="img" aria-label="RuPay">
        <span className="font-body text-[0.7rem] font-semibold tracking-[-0.02em] text-[#1B3281]">
          RuPay
        </span>
        <svg viewBox="0 0 12 14" width="8" height="10" aria-hidden="true">
          <path d="M0 0l5.5 7L0 14z"   fill="#F58220" />
          <path d="M6.5 0L12 7l-5.5 7z" fill="#35A848" />
        </svg>
      </span>

      {/* Gateway note — Razorpay mark in brand blue, wordmark light (their
          dark-background badge style) */}
      <span className="flex items-center gap-1.5 font-body text-[0.68rem] text-white/45 ml-1">
        Secured by
        <span className="flex items-center gap-1 font-medium text-white/70">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="#3395FF" aria-hidden="true">
            <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24z" />
            <path d="M14.26 10.098L3.389 17.166 1.564 24h9.428l3.268-13.902z" />
          </svg>
          Razorpay
        </span>
      </span>
    </div>
  )
}

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(180deg, #1A1714 0%, #120F0A 100%)' }}
    >
      <div className="container-lp pt-20 md:pt-28">

        {/* ── Newsletter card ─────────────────────────────────────────────── */}
        <div className="pb-12 md:pb-14 border-b border-[#C9A96E]/15">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-10 md:py-14 flex flex-col items-center text-center gap-8">
            <div>
              <p className="lp-eyebrow">Newsletter</p>
              <h2 className="font-display text-[1.6rem] md:text-[2rem] leading-tight text-white">
                Join The Journey.
              </h2>
              <p className="font-body text-[0.85rem] text-white/55 mt-2">
                New collections, launches and offers. One email a month, no noise.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* ── Link grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 md:py-14 border-b border-[#C9A96E]/15">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.svg"
              alt="Louis Polo"
              width={78}
              height={52}
              className="mb-4 brightness-0 invert mx-auto"
            />
            <p className="font-body text-[0.8rem] text-white/55 leading-relaxed mb-4">
              Premium hard-shell luggage from the factory that builds for the
              world&apos;s biggest brands.
            </p>
            <p className="font-body text-[0.62rem] tracking-[0.16em] uppercase text-white/45 mb-6 text-center">
              Mumbai · London · Hong Kong
            </p>

            {/* Social — official brand colors */}
            <div className="flex gap-4 justify-center">
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="transition-opacity duration-200 hover:opacity-70" style={{ color: '#E4405F' }} aria-label="Instagram">
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a href={BRAND.linkedin} target="_blank" rel="noopener noreferrer" className="transition-opacity duration-200 hover:opacity-70" style={{ color: '#0A66C2' }} aria-label="LinkedIn">
                <Linkedin size={17} strokeWidth={1.5} />
              </a>
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="transition-opacity duration-200 hover:opacity-70" style={{ color: '#25D366' }} aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
              <a href={`mailto:${BRAND.email}`} className="transition-opacity duration-200 hover:opacity-70" style={{ color: '#EA4335' }} aria-label="Email support">
                <Mail size={17} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="lp-eyebrow mb-4">Shop</p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={footerLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="lp-eyebrow mb-4">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={footerLink}>{label}</Link>
                </li>
              ))}
              <li>
                <FooterCorporateLink />
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="lp-eyebrow mb-4">Support</p>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${BRAND.email}`} className={footerLink}>{BRAND.email}</a>
              </li>
              <li>
                <a href={`tel:${BRAND.phone.replace(/[\s-]/g, '')}`} className={footerLink}>{BRAND.phone}</a>
              </li>
              <li>
                <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className={footerLink}>
                  WhatsApp us
                </a>
              </li>
            </ul>
            <p className="font-body text-[0.72rem] text-white/40 mt-4">
              We reply within 2 hours.
            </p>
          </div>
        </div>

        {/* ── Payments + legal ────────────────────────────────────────────── */}
        <div className="py-5 flex flex-col items-center justify-center gap-4 border-b border-[#C9A96E]/15">
          <PaymentMarks />
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-[0.72rem] text-white/45 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Copyright ───────────────────────────────────────────────────── */}
        <div className="py-5 text-center">
          <p className="font-body text-[0.7rem] text-white/35 tracking-wide">
            © {new Date().getFullYear()} LOUISPOLO FASHION INDIA PRIVATE LIMITED.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

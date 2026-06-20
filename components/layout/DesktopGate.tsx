'use client'

import Image  from 'next/image'
import { useEffect, useState } from 'react'

export function DesktopGate({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    setMounted(true)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!mounted) return <>{children}</>

  if (isDesktop) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'var(--color-lp-porcelain)' }}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("/noise.png")', backgroundSize: '200px' }}
        />

        {/* Corner ornament lines */}
        <span className="absolute top-10 left-10 w-14 h-14 border-t border-l" style={{ borderColor: 'var(--color-lp-gold)' }} />
        <span className="absolute top-10 right-10 w-14 h-14 border-t border-r" style={{ borderColor: 'var(--color-lp-gold)' }} />
        <span className="absolute bottom-10 left-10 w-14 h-14 border-b border-l" style={{ borderColor: 'var(--color-lp-gold)' }} />
        <span className="absolute bottom-10 right-10 w-14 h-14 border-b border-r" style={{ borderColor: 'var(--color-lp-gold)' }} />

        <div className="flex flex-col items-center gap-8 px-8 text-center max-w-md">
          {/* Logo */}
          <Image
            src="/logo.svg"
            alt="Louis Polo"
            width={90}
            height={88}
            className="h-16 w-auto"
            priority
          />

          {/* Divider */}
          <div className="flex items-center gap-4 w-full">
            <span className="flex-1 h-px" style={{ background: 'var(--color-lp-border)' }} />
            <span
              className="font-body text-[0.55rem] tracking-[0.25em] uppercase"
              style={{ color: 'var(--color-lp-gold)' }}
            >
              Coming Soon
            </span>
            <span className="flex-1 h-px" style={{ background: 'var(--color-lp-border)' }} />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1
              className="font-display leading-[1.1]"
              style={{ fontSize: '2.6rem', color: 'var(--color-lp-ink)' }}
            >
              Desktop version is
              <br />
              <em>under construction.</em>
            </h1>
            <p
              className="font-body leading-relaxed"
              style={{ fontSize: '0.9rem', color: 'var(--color-lp-muted)' }}
            >
              Our full desktop experience is on its way.
              <br />
              For now, kindly visit us on your mobile.
            </p>
          </div>

          {/* Mobile icon hint */}
          <div
            className="flex flex-col items-center gap-2 mt-2"
            style={{ color: 'var(--color-lp-faint)' }}
          >
            <svg width="22" height="36" viewBox="0 0 22 36" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="20" height="34" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="11" cy="30" r="1.5" fill="currentColor"/>
              <line x1="8" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span
              className="font-body tracking-[0.14em] uppercase"
              style={{ fontSize: '0.6rem', color: 'var(--color-lp-faint)' }}
            >
              Best experienced on mobile
            </span>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

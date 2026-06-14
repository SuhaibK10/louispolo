'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/providers/SmoothScrollProvider.tsx
// Lenis smooth scroll — gives the site that premium scroll feel.
// The exponential easing (Math.pow(2, -10 * t)) is what makes it feel luxury.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import Lenis         from 'lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration:    1.2,
      easing:      (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// lib/animations.ts
// All Framer Motion variants. Import from here — never define inline.
// ─────────────────────────────────────────────────────────────────────────────

import type { Variants } from 'framer-motion'

// The LP premium easing curve
const LP_EASE = [0.25, 0.1, 0.25, 1] as const

// ─── Base variants ────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: LP_EASE },
  },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const slideFromLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: LP_EASE },
  },
}

export const slideFromRight: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: LP_EASE },
  },
}

export const scaleUp: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.5, ease: LP_EASE },
  },
}

// ─── Stagger containers ───────────────────────────────────────────────────────

export const staggerChildren: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}

// ─── Special ──────────────────────────────────────────────────────────────────

// Gold line expands from left — used under headings
export const expandLine: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, delay: 0.2, ease: LP_EASE },
  },
}

// Hero text — each word clips up from below
export const clipUp: Variants = {
  hidden:  { opacity: 0, y: 48, clipPath: 'inset(100% 0 0 0)' },
  visible: {
    opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

// ─── Viewport config ──────────────────────────────────────────────────────────

export const VIEWPORT = {
  once:   true,
  margin: '-80px',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// config/spinWheel.ts
// Segments for the homepage "spin to win" wheel, and the weighted picker that
// decides a spin's outcome. The picker only ever runs server-side (see
// app/api/spin-to-win/route.ts) — the client never decides its own result,
// it just animates to whichever index the server already chose. This file
// itself has no 'use client', so it's safe to import from both sides: the
// client uses SPIN_WHEEL_SEGMENTS to render the wheel's labels, the server
// uses pickSpinSegment() to choose the winner.
//
// couponCode must match a real, enabled code in config/coupons.ts — a code
// that doesn't exist there would let someone "win" a discount that fails at
// checkout. SPIN5 and SPIN15 are new codes added there for this; the 10%
// slots intentionally reuse the existing FTB10 code rather than minting a
// third near-identical one.
// ─────────────────────────────────────────────────────────────────────────────

export interface SpinSegment {
  label:       string
  couponCode?: string  // omitted = this segment doesn't win anything
  weight:      number  // relative odds — higher wins more often
}

// 8 segments, drawn clockwise starting from the top (12 o'clock) — must stay
// in this order, since the wheel's CSS slices and the pointer's landing math
// both assume index 0 starts at the top.
export const SPIN_WHEEL_SEGMENTS: SpinSegment[] = [
  { label: '5% off',           couponCode: 'SPIN5',  weight: 2 },
  { label: 'Sorry, try again',                        weight: 3 },
  { label: '10% off',          couponCode: 'FTB10',  weight: 2 },
  { label: 'Almost there!',                           weight: 2 },
  { label: '15% off',          couponCode: 'SPIN15', weight: 1 },
  { label: 'Sorry, try again',                        weight: 3 },
  { label: '10% off',          couponCode: 'FTB10',  weight: 2 },
  { label: 'No luck today',                           weight: 2 },
]

export function pickSpinSegment(): { index: number; segment: SpinSegment } {
  const total = SPIN_WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0)
  let r = Math.random() * total
  for (let i = 0; i < SPIN_WHEEL_SEGMENTS.length; i++) {
    r -= SPIN_WHEEL_SEGMENTS[i].weight
    if (r <= 0) return { index: i, segment: SPIN_WHEEL_SEGMENTS[i] }
  }
  const last = SPIN_WHEEL_SEGMENTS.length - 1
  return { index: last, segment: SPIN_WHEEL_SEGMENTS[last] }
}

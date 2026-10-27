// ─────────────────────────────────────────────────────────────────────────────
// app/api/spin-to-win/route.ts
// Fired when a visitor spins the homepage wheel (components/ui/SpinToWinModal.tsx).
// The outcome is decided HERE, server-side, not by the client — the client
// only ever reports a name + phone and animates to whichever segment index
// this route returns. Deciding it client-side would let anyone open devtools
// and always "win" the top prize.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { pickSpinSegment } from '@/config/spinWheel'

export async function POST(request: NextRequest) {
  const { name, phone } = await request.json()

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof phone !== 'string' || phone.replace(/\D/g, '').length !== 10
  ) {
    return NextResponse.json({ error: 'Enter a valid name and phone number.' }, { status: 400 })
  }

  const { index, segment } = pickSpinSegment()

  // Best-effort — the spin has already "happened" for the visitor by this
  // point, so a logging failure here shouldn't take their result away.
  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('spin_to_win_entries').insert({
    name:          name.trim(),
    phone:         phone.replace(/\D/g, ''),
    segment_label: segment.label,
    coupon_code:   segment.couponCode ?? null,
  })
  if (error) {
    console.error('Failed to save spin-to-win entry:', error)
  }

  return NextResponse.json({
    segmentIndex: index,
    label:        segment.label,
    couponCode:   segment.couponCode ?? null,
  })
}

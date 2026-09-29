// ─────────────────────────────────────────────────────────────────────────────
// lib/metaPixel.ts
// Sends events to the Meta Pixel. The pixel itself is loaded once in
// app/layout.tsx (Script id "meta-pixel") — this file only calls it.
// Client-side only.
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

// The pixel loads after hydration (strategy="afterInteractive"), so on a
// first page view window.fbq may not exist yet when a component mounts —
// retry for a few seconds instead of dropping the event.
//
// `eventID` is optional now but worth passing wherever a stable one exists
// (e.g. an order ID for Purchase) — it's what lets a future server-side
// Conversions API call for the same event get deduplicated against this
// client-side one instead of double-counting.
//
// Returns a cancel function, so it can be used directly as a useEffect result.
export function metaTrack(event: string, params: Record<string, unknown> = {}, eventID?: string): () => void {
  if (typeof window === 'undefined') return () => {}

  let tries = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const send = () => {
    if (window.fbq) {
      window.fbq('track', event, params, eventID ? { eventID } : undefined)
      return
    }
    if (++tries < 25) timer = setTimeout(send, 200)
  }
  send()

  return () => clearTimeout(timer)
}

// ─────────────────────────────────────────────────────────────────────────────
// lib/oaiq.ts
// Sends conversion events to the OpenAI Ads Manager pixel. The pixel itself is
// loaded once in app/layout.tsx (Script id "openai-ads-pixel") — this file only
// calls it. Client-side only.
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    oaiq?: (command: string, ...args: unknown[]) => void
  }
}

// The pixel loads after hydration (strategy="afterInteractive"), so on a first
// page view window.oaiq may not exist yet when a component mounts — retry for
// a few seconds instead. Don't define a stand-in window.oaiq here: the pixel's
// own snippet returns early when one already exists, so the real SDK would
// never load.
//
// Returns a cancel function, so it can be used directly as a useEffect result.
export function oaiqMeasure(event: string, params: Record<string, unknown>): () => void {
  if (typeof window === 'undefined') return () => {}

  let tries = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const send = () => {
    if (window.oaiq) {
      window.oaiq('measure', event, params)
      return
    }
    if (++tries < 25) timer = setTimeout(send, 200)
  }
  send()

  return () => clearTimeout(timer)
}

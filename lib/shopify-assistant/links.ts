// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/links.ts
// Link guard for the Shopify-site assistant (same idea as lib/assistant/links.ts).
// The model is told to link products as [Name](/products/handle); a small model
// can mangle or invent a handle, which would land a customer on a 404. Every
// link in the streamed answer passes through this guard:
//   - [label](/products/<real handle>)  kept
//   - [label](<WhatsApp url>)           turned into the plain URL (the widget links it)
//   - anything else                     reduced to its plain label text
// Text arrives in arbitrary chunks, so a possibly-unfinished "[label](url" tail
// is held back until it is complete.
// ─────────────────────────────────────────────────────────────────────────────

import { BRAND } from '@/lib/constants'

const LINK         = /\[([^\]\n]*)\]\(([^)\s]*)\)/g
const LINK_AT_HEAD = /^\[[^\]\n]*\]\([^)\s]*\)/
const MAX_HOLD     = 300

const nameKey = (s: string) => s.toLowerCase().replace(/^louis polo\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim()

/**
 * @param products  every live product's handle and display name. When the model
 *                  mistypes a long handle but the link text is exactly a product's
 *                  name, the link is repaired to that product instead of dropped.
 */
export function createLinkGuard(products: { handle: string; name: string }[]) {
  let buf = ''
  const handles = new Set(products.map((p) => p.handle))
  const byName  = new Map(products.map((p) => [nameKey(p.name), p.handle]))

  function clean(text: string): string {
    return text.replace(LINK, (_m, label: string, url: string) => {
      const product = /^(?:https?:\/\/[^/]+)?\/products\/([a-z0-9-]+)\/?$/i.exec(url)
      if (product && handles.has(product[1].toLowerCase())) return `[${label}](/products/${product[1].toLowerCase()})`
      if (url === BRAND.whatsapp) return url
      const repaired = byName.get(nameKey(label))
      if (repaired) return `[${label}](/products/${repaired})`
      return label
    })
  }

  function drain(final: boolean): string {
    let end = buf.length
    if (!final) {
      const open = buf.lastIndexOf('[')
      if (open !== -1) {
        const tail = buf.slice(open)
        if (!LINK_AT_HEAD.test(tail) && tail.length < MAX_HOLD && !tail.includes('\n')) end = open
      }
    }
    const out = clean(buf.slice(0, end))
    buf = buf.slice(end)
    return out
  }

  return {
    push(chunk: string): string {
      buf += chunk
      return drain(false)
    },
    flush(): string {
      return drain(true)
    },
  }
}

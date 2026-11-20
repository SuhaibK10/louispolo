// ─────────────────────────────────────────────────────────────────────────────
// lib/assistant/links.ts
// The model is told to link products as [Name](/shop/slug), but small models
// occasionally mangle a slug (e.g. /shop/shop/x) or invent one. A bad link would
// land a customer on a 404, so every link in the streamed answer passes through
// this guard:
//   - [label](/shop/<real slug>)   kept
//   - [label](<WhatsApp url>)      turned into the plain URL (the widget links it)
//   - anything else                reduced to its plain label text
//
// Text arrives in arbitrary chunks, so a link can be split across two chunks.
// The guard holds back a possibly-unfinished "[label](url" tail until it is
// complete, so we never judge half a link.
// ─────────────────────────────────────────────────────────────────────────────

import { PRODUCTS } from '@/config/products'
import { BRAND } from '@/lib/constants'

const SLUGS = new Set(PRODUCTS.map((p) => p.slug))

const LINK         = /\[([^\]\n]*)\]\(([^)\s]*)\)/g
const LINK_AT_HEAD = /^\[[^\]\n]*\]\([^)\s]*\)/
const MAX_HOLD     = 300 // never hold back more than this many characters

function clean(text: string): string {
  return text.replace(LINK, (_m, label: string, url: string) => {
    const shop = /^\/shop\/([a-z0-9-]+)\/?$/.exec(url)
    if (shop && SLUGS.has(shop[1])) return `[${label}](/shop/${shop[1]})`
    if (url === BRAND.whatsapp) return url
    return label
  })
}

export function createLinkGuard() {
  let buf = ''

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
    /** Feed a streamed chunk; returns the text that is safe to send now. */
    push(chunk: string): string {
      buf += chunk
      return drain(false)
    },
    /** Call once at the end of the answer to release anything held back. */
    flush(): string {
      return drain(true)
    },
  }
}

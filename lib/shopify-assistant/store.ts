// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/store.ts
// Live data for the Shopify-site assistant, read from the public storefront of
// louispoloworld.com, so there is nothing to keep in sync by hand:
//
//  - getProducts()  every published product, from /products.json (prices, MRP,
//                   colours, availability, full description). Cached 10 min.
//  - getPolicies()  the policy and help pages, plus the announcement bar
//                   (e.g. the free-shipping threshold). Cached 1 hour.
//
// Edits made in Shopify admin show up here after the cache expires. If Shopify
// can't be reached, the last good copy keeps being served.
// ─────────────────────────────────────────────────────────────────────────────

export const SHOP_URL = (process.env.SHOPIFY_STORE_URL || 'https://louispoloworld.com').replace(/\/+$/, '')

const PRODUCTS_TTL_MS = 10 * 60 * 1000
const POLICIES_TTL_MS = 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 10_000
const MAX_DESCRIPTION_CHARS = 3500
const MAX_POLICY_CHARS = 4000

// The help pages the assistant answers policy questions from.
const POLICY_PAGES = [
  { title: 'Shipping policy',           path: '/policies/shipping-policy' },
  { title: 'Return and refund policy',  path: '/policies/refund-policy' },
  { title: 'Shipping and delivery',     path: '/pages/shipping-returns' },
  { title: 'Returns and exchanges',     path: '/pages/returns-exchanges' },
  { title: 'Warranty',                  path: '/pages/warranty-registration' },
  { title: 'Track order',               path: '/pages/track-order' },
  { title: 'FAQ',                       path: '/pages/faq' },
  { title: 'Contact information',       path: '/policies/contact-information' },
]

// ── Types ─────────────────────────────────────────────────────────────────────

export type StoreVariant = {
  title:     string
  price:     number
  compareAt: number | null
  available: boolean
}

export type StoreProduct = {
  id:          number
  name:        string
  handle:      string
  type:        string
  description: string
  options:     { name: string; values: string[] }[]
  variants:    StoreVariant[]
}

export type StorePolicies = {
  announcements: string[]
  pages:         { title: string; url: string; text: string }[]
}

// ── Small cache: fresh for `ttl`, then refreshed; serves the stale copy on failure ──

function cached<T>(ttl: number, load: () => Promise<T>): () => Promise<T> {
  let entry: { value: T; at: number } | null = null
  let inflight: Promise<T> | null = null

  return async () => {
    if (entry && Date.now() - entry.at < ttl) return entry.value
    if (!inflight) {
      inflight = load()
        .then((value) => {
          entry = { value, at: Date.now() }
          return value
        })
        .finally(() => { inflight = null })
    }
    try {
      return await inflight
    } catch (e) {
      if (entry) {
        console.warn('[shopify-assistant] refresh failed, serving cached copy:', e instanceof Error ? e.message : e)
        return entry.value
      }
      throw e
    }
  }
}

async function get(path: string): Promise<Response> {
  const res = await fetch(SHOP_URL + path, {
    headers: { 'User-Agent': 'LouisPoloAssistant/1.0', Accept: '*/*' },
    cache:   'no-store',
    signal:  AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`)
  return res
}

// ── HTML → plain text ─────────────────────────────────────────────────────────

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—',
  hellip: '…', times: '×', deg: '°', middot: '·', bull: '•', rarr: '→',
}

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : m
    }
    return NAMED[e.toLowerCase()] ?? m
  })
}

export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|svg|noscript|template|form|nav|button)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<li\b[^>]*>/gi, '\n- ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(p|div|h[1-6]|tr|ul|ol|table|section|article|blockquote)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/^-\s*$/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

// Only the page's own content: the policy body, or the page's rich-text block.
function mainContent(html: string): string {
  const end = html.indexOf('</main>')
  for (const marker of ['shopify-policy__body', 'class="rte']) {
    const start = html.indexOf(marker)
    if (start !== -1) return html.slice(html.lastIndexOf('<', start), end > start ? end : undefined)
  }
  const main = html.indexOf('<main')
  return main !== -1 ? html.slice(main, end > main ? end : undefined) : html
}

// ── Products ──────────────────────────────────────────────────────────────────

type RawVariant = { title: string; price: string; compare_at_price: string | null; available: boolean }
type RawProduct = {
  id: number; title: string; handle: string; product_type: string; body_html: string | null
  options: { name: string; values: string[] }[]; variants: RawVariant[]
}

const money = (s: string | null): number | null => {
  const n = s == null ? NaN : Number(s)
  return Number.isFinite(n) && n > 0 ? n : null
}

function toProduct(p: RawProduct): StoreProduct {
  return {
    id:          p.id,
    name:        p.title.replace(/^LOUIS POLO\s+/i, '').trim(),
    handle:      p.handle,
    type:        p.product_type || 'Product',
    description: htmlToText(p.body_html || '').slice(0, MAX_DESCRIPTION_CHARS),
    options:     (p.options || []).filter((o) => o.name !== 'Title'),
    variants:    (p.variants || []).map((v) => ({
      title:     v.title,
      price:     money(v.price) ?? 0,
      compareAt: money(v.compare_at_price),
      available: !!v.available,
    })),
  }
}

export const getProducts = cached<StoreProduct[]>(PRODUCTS_TTL_MS, async () => {
  const all: StoreProduct[] = []
  for (let page = 1; page <= 8; page++) {
    const data = (await (await get(`/products.json?limit=250&page=${page}`)).json()) as { products?: RawProduct[] }
    const batch = data.products ?? []
    all.push(...batch.map(toProduct))
    if (batch.length < 250) break
  }
  if (all.length === 0) throw new Error('Shopify returned no products')
  return all
})

// ── Policies ──────────────────────────────────────────────────────────────────

function announcements(html: string): string[] {
  const out: string[] = []
  const slide = /class="announcement-slider__slide"[^>]*>([\s\S]*?)<\/div>/g
  let m: RegExpExecArray | null
  while ((m = slide.exec(html))) {
    const text = htmlToText(m[1].replace(/<\/span>\s*<span/g, '</span>: <span'))
    if (text && !out.includes(text)) out.push(text)
  }
  return out
}

export const getPolicies = cached<StorePolicies>(POLICIES_TTL_MS, async () => {
  const [home, ...pages] = await Promise.allSettled([
    get('/').then((r) => r.text()),
    ...POLICY_PAGES.map((p) => get(p.path).then((r) => r.text())),
  ])

  const result: StorePolicies = {
    announcements: home.status === 'fulfilled' ? announcements(home.value) : [],
    pages: [],
  }
  pages.forEach((r, i) => {
    if (r.status !== 'fulfilled') return
    const text = htmlToText(mainContent(r.value)).slice(0, MAX_POLICY_CHARS)
    if (text) result.pages.push({ title: POLICY_PAGES[i].title, url: POLICY_PAGES[i].path, text })
  })
  if (result.pages.length === 0) throw new Error('Could not load any policy pages')
  return result
})

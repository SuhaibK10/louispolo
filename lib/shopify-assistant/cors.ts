// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/cors.ts
// Only the Shopify storefront may call the assistant routes. The origin list
// can be replaced with SHOPIFY_ASSISTANT_ORIGINS (comma-separated). The local
// theme preview (`shopify theme dev`) is always allowed too, so the chat works
// at http://127.0.0.1:9292 against the live backend. CORS only limits browsers,
// so this opens nothing a script couldn't already do by faking the Origin.
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_ORIGINS = [
  'https://louispoloworld.com',
  'https://www.louispoloworld.com',
  'https://cyqpsc-j0.myshopify.com',
]
const DEV_ORIGINS = ['http://127.0.0.1:9292', 'http://localhost:9292']

export function allowedOrigins(): Set<string> {
  const env  = process.env.SHOPIFY_ASSISTANT_ORIGINS
  const list = env ? env.split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_ORIGINS
  return new Set([...list, ...DEV_ORIGINS])
}

export function isAllowedOrigin(origin: string | null): origin is string {
  return !!origin && allowedOrigins().has(origin)
}

export function cors(origin: string | null): Record<string, string> {
  if (!isAllowedOrigin(origin)) return { Vary: 'Origin' }
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
    Vary:                           'Origin',
  }
}

export function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(origin) },
  })
}

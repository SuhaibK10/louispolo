// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/providers/index.ts
// Picks the AI provider for the Shopify chat from environment variables.
//
//   SHOPIFY_ASSISTANT_PROVIDER          "openrouter" or "gemini". When unset:
//                                       OpenRouter if OPENROUTER_API_KEY is set, else Gemini.
//   OPENROUTER_API_KEY                  key for OpenRouter
//   SHOPIFY_ASSISTANT_OPENROUTER_MODEL  OpenRouter model id (default google/gemini-3.1-flash-lite)
//   GEMINI_API_KEY                      key for Gemini (Google AI Studio)
//   SHOPIFY_ASSISTANT_MODEL             Gemini model id (default gemini-3.1-flash-lite)
//
// To switch provider, change SHOPIFY_ASSISTANT_PROVIDER in Vercel and redeploy.
// ─────────────────────────────────────────────────────────────────────────────

import { geminiProvider } from './gemini'
import { openRouterProvider } from './openrouter'
import type { Provider } from './types'

export * from './types'

// gemini-3.1-flash-lite answered ~4x faster than gemini-3.5-flash-lite in testing
// (2.4 s vs 9.6 s for the same 4-sentence reply). On OpenRouter it is the same model,
// so answers match whichever provider is used.
const DEFAULT_GEMINI_MODEL     = 'gemini-3.1-flash-lite'
const DEFAULT_OPENROUTER_MODEL = 'google/gemini-3.1-flash-lite'

/** The configured provider, or null when its API key is missing. */
export function pickProvider(): Provider | null {
  const env    = process.env
  const choice = (env.SHOPIFY_ASSISTANT_PROVIDER || (env.OPENROUTER_API_KEY ? 'openrouter' : 'gemini')).trim().toLowerCase()

  if (choice === 'openrouter') {
    return env.OPENROUTER_API_KEY
      ? openRouterProvider(env.OPENROUTER_API_KEY, env.SHOPIFY_ASSISTANT_OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL)
      : null
  }
  if (choice === 'gemini') {
    return env.GEMINI_API_KEY
      ? geminiProvider(env.GEMINI_API_KEY, env.SHOPIFY_ASSISTANT_MODEL || DEFAULT_GEMINI_MODEL)
      : null
  }
  console.error(`[shopify-assistant] unknown SHOPIFY_ASSISTANT_PROVIDER "${choice}" (use "openrouter" or "gemini")`)
  return null
}

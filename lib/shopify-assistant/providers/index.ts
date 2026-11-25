// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/providers/index.ts
// Picks the AI provider for the Shopify chat from environment variables.
//
//   SHOPIFY_ASSISTANT_PROVIDER          "openrouter" or "gemini", or both in order, comma-separated
//                                       (e.g. "gemini,openrouter"): when one is busy, rate-limited or
//                                       out of quota/credits before it has written anything, the next
//                                       one answers instead. When unset: OpenRouter if
//                                       OPENROUTER_API_KEY is set, else Gemini.
//   OPENROUTER_API_KEY                  key for OpenRouter
//   SHOPIFY_ASSISTANT_OPENROUTER_MODEL  OpenRouter model id (default google/gemini-3.1-flash-lite)
//   GEMINI_API_KEY                      key for Gemini (Google AI Studio)
//   SHOPIFY_ASSISTANT_MODEL             Gemini model id (default gemini-3.1-flash-lite)
//
// To switch provider, change SHOPIFY_ASSISTANT_PROVIDER in Vercel and redeploy.
// Free setup: "gemini,openrouter" with a free OpenRouter model such as
// SHOPIFY_ASSISTANT_OPENROUTER_MODEL=google/gemma-4-31b-it:free.
// ─────────────────────────────────────────────────────────────────────────────

import { geminiProvider } from './gemini'
import { openRouterProvider } from './openrouter'
import { isBusyError, type Provider } from './types'

export * from './types'

// gemini-3.1-flash-lite answered ~4x faster than gemini-3.5-flash-lite in testing
// (2.4 s vs 9.6 s for the same 4-sentence reply). On OpenRouter it is the same model,
// so answers match whichever provider is used.
const DEFAULT_GEMINI_MODEL     = 'gemini-3.1-flash-lite'
const DEFAULT_OPENROUTER_MODEL = 'google/gemini-3.1-flash-lite'

function providerFor(choice: string): Provider | null {
  const env = process.env
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

/** Tries each provider in turn while they fail as busy before writing any text. */
function fallbackChain(providers: Provider[]): Provider {
  if (providers.length === 1) return providers[0]
  return {
    name:  providers.map((p) => p.name).join(' > '),
    model: providers.map((p) => p.model).join(' > '),
    async answer(request) {
      for (let i = 0; ; i++) {
        const provider = providers[i]
        let wrote = false
        try {
          return await provider.answer({ ...request, onText: (text) => { wrote = true; request.onText(text) } })
        } catch (e) {
          if (wrote || request.signal.aborted || !isBusyError(e) || i === providers.length - 1) throw e
          console.warn(`[shopify-assistant] ${provider.name} (${provider.model}) busy, trying ${providers[i + 1].name}:`,
            e instanceof Error ? e.message : e)
        }
      }
    },
  }
}

/** The configured provider (or fallback chain), or null when no listed provider has its API key. */
export function pickProvider(): Provider | null {
  const env     = process.env
  const choices = (env.SHOPIFY_ASSISTANT_PROVIDER || (env.OPENROUTER_API_KEY ? 'openrouter' : 'gemini'))
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const providers = choices.map(providerFor).filter((p): p is Provider => p !== null)
  return providers.length ? fallbackChain(providers) : null
}

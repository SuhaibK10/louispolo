// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/providers/types.ts
// What every AI provider for the Shopify chat shares: the interface the route
// calls, the tool the model can use, limits, and retry/error handling.
// ─────────────────────────────────────────────────────────────────────────────

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type AnswerRequest = {
  systemPrompt: string
  messages:     ChatMessage[]
  /** Runs a tool the model asked for and returns a JSON-serialisable result. */
  runTool:      (name: string, args: unknown) => unknown
  /** Receives the answer text as it streams in. */
  onText:       (text: string) => void
  signal:       AbortSignal
}

export type Provider = {
  /** "gemini" or "openrouter"; for a fallback chain, the names joined with " > ". */
  name:  string
  model: string
  /** Streams one answer through onText; throws on API errors. */
  answer(request: AnswerRequest): Promise<void>
}

// One round of tool calls, then a forced text answer: at most 2 model calls per message.
export const MAX_TOOL_ROUNDS   = 1
export const MAX_OUTPUT_TOKENS = 1024

/** Tools in plain JSON Schema; each provider converts them to its own format. */
export const TOOLS = [
  {
    name: 'get_product_details',
    description:
      'Get full details for 1 to 3 LOUIS POLO products: description, features, specifications, warranty, care, and price and availability for every option. Use it for any question beyond the catalog line, and to compare products.',
    parameters: {
      type: 'object',
      properties: {
        handles: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 3,
          description: 'Product paths exactly as written in the catalog, e.g. "/products/louis-polo-aerox-lightweight-20-hard-shell-cabin-trolley".',
        },
      },
      required: ['handles'],
    },
  },
] as const

/** An error from a model API, with its HTTP status when there is one. */
export class ModelError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'ModelError'
  }
}

function statusOf(e: unknown): number | undefined {
  return (e as { status?: number })?.status
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/** Temporary overload on the provider's side: worth a quick retry. */
export function isOverloaded(e: unknown): boolean {
  const status = statusOf(e)
  return status === 502 || status === 503 || /UNAVAILABLE|high demand|overloaded/i.test(messageOf(e))
}

/** Rate limits, exhausted quota or credits, or overload: the shopper should try again later. */
export function isBusyError(e: unknown): boolean {
  const status = statusOf(e)
  return status === 402 || status === 429 || isOverloaded(e) ||
    /RESOURCE_EXHAUSTED|quota|rate.?limit|credits/i.test(messageOf(e))
}

const RETRY_DELAYS_MS = [1200, 2500]

/** Runs fn, retrying twice with a short pause while the provider reports overload. */
export async function withRetry<T>(fn: () => Promise<T>, signal: AbortSignal, label: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (e) {
      if (signal.aborted || !isOverloaded(e) || attempt >= RETRY_DELAYS_MS.length) throw e
      console.warn(`[shopify-assistant] ${label} overloaded, retry ${attempt + 1}/${RETRY_DELAYS_MS.length}`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
    }
  }
}

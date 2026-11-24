// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/providers/openrouter.ts
// OpenRouter (openrouter.ai), called with OPENROUTER_API_KEY. One key reaches
// many models (Gemini, GPT, Claude, Llama, ...) through the OpenAI-compatible
// chat completions API, billed from the OpenRouter account's credits.
// ─────────────────────────────────────────────────────────────────────────────

import { MAX_OUTPUT_TOKENS, MAX_TOOL_ROUNDS, ModelError, TOOLS, withRetry, type Provider } from './types'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

const FUNCTION_TOOLS = TOOLS.map((t) => ({
  type:     'function' as const,
  function: { name: t.name, description: t.description, parameters: t.parameters },
}))

type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } }

type Message =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
  | { role: 'tool'; tool_call_id: string; content: string }

type StreamChunk = {
  error?:   { message?: string; code?: number | string }
  choices?: {
    delta?: {
      content?:    string | null
      tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string } }[]
    }
  }[]
}

export function openRouterProvider(apiKey: string, model: string): Provider {
  return {
    name: 'openrouter',
    model,
    async answer({ systemPrompt, messages, runTool, onText, signal }) {
      const history: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m): Message => ({ role: m.role, content: m.content })),
      ]

      for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
        const lastRound = round === MAX_TOOL_ROUNDS
        const response = await withRetry(() => post(apiKey, {
          model,
          messages:    history,
          tools:       FUNCTION_TOOLS,
          // On the last round the model must answer in text, not call another tool.
          tool_choice: lastRound ? 'none' : 'auto',
          max_tokens:  MAX_OUTPUT_TOKENS,
          stream:      true,
        }, signal), signal, 'openrouter')

        let text = ''
        const calls: ToolCall[] = []

        for await (const chunk of readEvents(response.body!)) {
          if (chunk.error) {
            const code = Number(chunk.error.code)
            throw new ModelError(`OpenRouter: ${chunk.error.message || 'stream error'}`, Number.isFinite(code) ? code : undefined)
          }
          const delta = chunk.choices?.[0]?.delta
          if (!delta) continue
          if (typeof delta.content === 'string' && delta.content) {
            text += delta.content
            onText(delta.content)
          }
          // Tool calls arrive in pieces: the id and name first, then the JSON arguments in parts.
          for (const piece of delta.tool_calls ?? []) {
            const call = (calls[piece.index ?? 0] ??= { id: '', type: 'function', function: { name: '', arguments: '' } })
            if (piece.id) call.id = piece.id
            if (piece.function?.name && !call.function.name) call.function.name = piece.function.name
            if (piece.function?.arguments) call.function.arguments += piece.function.arguments
          }
        }

        const toolCalls = calls.filter(Boolean)
        if (toolCalls.length === 0 || lastRound) return

        history.push({ role: 'assistant', content: text || null, tool_calls: toolCalls })
        for (const call of toolCalls) {
          let args: unknown = {}
          try { args = call.function.arguments ? JSON.parse(call.function.arguments) : {} } catch { /* model sent broken JSON */ }
          history.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(runTool(call.function.name, args)) })
        }
      }
    },
  }
}

async function post(apiKey: string, body: unknown, signal: AbortSignal): Promise<Response> {
  const res = await fetch(ENDPOINT, {
    method:  'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    signal,
  })
  if (!res.ok || !res.body) {
    let message = `OpenRouter HTTP ${res.status}`
    try {
      const data = (await res.json()) as { error?: { message?: string } }
      if (data?.error?.message) message += `: ${data.error.message}`
    } catch { /* body was not JSON */ }
    throw new ModelError(message, res.status)
  }
  return res
}

/** Reads OpenRouter's server-sent events as JSON chunks, skipping keep-alive comments. */
async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<StreamChunk> {
  const reader  = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return
      buffer += decoder.decode(value, { stream: true })
      let nl: number
      while ((nl = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, nl).trim()
        buffer = buffer.slice(nl + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return
        try { yield JSON.parse(data) as StreamChunk } catch { /* skip a malformed line */ }
      }
    }
  } finally {
    reader.cancel().catch(() => {})
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/providers/gemini.ts
// Google Gemini, called directly with GEMINI_API_KEY (Google AI Studio).
// ─────────────────────────────────────────────────────────────────────────────

import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  type Content,
  type FunctionCall,
  type FunctionDeclaration,
  type Part,
} from '@google/genai'
import { MAX_OUTPUT_TOKENS, MAX_TOOL_ROUNDS, TOOLS, withRetry, type Provider } from './types'

const FUNCTION_DECLARATIONS: FunctionDeclaration[] = TOOLS.map((t) => ({
  name:                 t.name,
  description:          t.description,
  parametersJsonSchema: t.parameters,
}))

export function geminiProvider(apiKey: string, model: string): Provider {
  const ai = new GoogleGenAI({ apiKey })

  return {
    name: 'gemini',
    model,
    async answer({ systemPrompt, messages, runTool, onText, signal }) {
      const contents: Content[] = messages.map((m) => ({
        role:  m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
        const lastRound = round === MAX_TOOL_ROUNDS
        const response = await withRetry(() => ai.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            tools:             [{ functionDeclarations: FUNCTION_DECLARATIONS }],
            // On the last round the model must answer in text, not call another tool.
            ...(lastRound && { toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.NONE } } }),
            maxOutputTokens:   MAX_OUTPUT_TOKENS,
            abortSignal:       signal,
          },
        }), signal, 'gemini')

        const modelParts: Part[]         = []
        const calls:      FunctionCall[] = []

        for await (const chunk of response) {
          for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
            modelParts.push(part)
            if (part.functionCall) calls.push(part.functionCall)
            else if (typeof part.text === 'string' && !part.thought && part.text) onText(part.text)
          }
        }

        if (calls.length === 0 || lastRound) return

        contents.push({ role: 'model', parts: modelParts })
        contents.push({
          role:  'user',
          parts: calls.map((call): Part => ({
            functionResponse: {
              id:       call.id,
              name:     call.name,
              response: { output: runTool(call.name ?? '', call.args) },
            },
          })),
        })
      }
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// lib/shopify-assistant/suggestions.ts
// The model ends each answer with one line of follow-up questions:
//   >> Show me more options | What about backpacks? | Compare these two
// This splitter streams the answer text through and keeps that line out of it,
// so the widget can show the questions as tap-to-ask buttons instead.
// Text arrives in arbitrary chunks, so a trailing "\n" or "\n>" that could be the
// start of the line is held back until the next chunk shows what it is.
// ─────────────────────────────────────────────────────────────────────────────

const MARKER        = /(^|\n)[ \t]*>>/
const MAYBE_MARKER  = /(^|\n)[ \t]*>?$/
const MAX_COUNT     = 3
const MAX_CHARS     = 60

export function createSuggestionSplitter() {
  let text = ''               // answer text received so far (before the marker)
  let released = 0            // how much of `text` has been passed on
  let line: string | null = null  // everything after the marker, once seen

  return {
    /** Takes a chunk of model text and returns the part that is safe to show now. */
    push(chunk: string): string {
      if (line !== null) { line += chunk; return '' }
      text += chunk
      const marker = MARKER.exec(text)
      if (marker) {
        line = text.slice(marker.index + marker[0].length)
        text = text.slice(0, marker.index)
      }
      let end = text.length
      if (line === null) {
        const hold = MAYBE_MARKER.exec(text)
        if (hold) end = hold.index
      }
      const out = text.slice(released, Math.max(end, released))
      released = Math.max(end, released)
      return out
    },

    /** Returns any answer text still held back. Call once the model has finished. */
    flush(): string {
      const out = text.slice(released)
      released = text.length
      return line === null ? out : out.replace(/\s+$/, '')
    },

    /** The follow-up questions, cleaned up: at most 3, each short. */
    suggestions(): string[] {
      if (line === null) return []
      const seen = new Set<string>()
      return line.split('\n')[0]
        .split('|')
        .map((s) => s
          .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
          .replace(/[*_`"]/g, '')
          .replace(/^\s*(?:[-•]|\d+[.)])\s*/, '')
          .trim())
        .filter((s) => {
          const key = s.toLowerCase()
          if (s.length < 2 || s.length > MAX_CHARS || seen.has(key)) return false
          seen.add(key)
          return true
        })
        .slice(0, MAX_COUNT)
    },
  }
}

// Shared helpers for the chat route tests: build requests the way the Shopify
// widget sends them (JSON as text/plain, with an Origin header) and read the
// newline-delimited JSON stream the chat route answers with.

export const STORE_ORIGIN = 'https://louispoloworld.com'

let ipCounter = 0
/** A fresh visitor IP per call, so the per-visitor rate limit never interferes. */
export const freshIp = () => `10.0.${Math.floor(++ipCounter / 250)}.${ipCounter % 250}`

export function post(
  path: string,
  body: unknown,
  { origin = STORE_ORIGIN, ip = freshIp(), raw = false }: { origin?: string | null; ip?: string; raw?: boolean } = {},
) {
  const headers: Record<string, string> = { 'Content-Type': 'text/plain', 'x-forwarded-for': ip }
  if (origin) headers.Origin = origin
  return new Request(`https://ai.louispoloworld.com${path}`, {
    method: 'POST',
    headers,
    body: raw ? String(body) : JSON.stringify(body),
  })
}

export type ChatEvent = { t: 'text' | 'error'; v: string } | { t: 'suggest'; v: string[] } | { t: 'done' }

export async function readEvents(res: Response): Promise<ChatEvent[]> {
  const text = await res.text()
  return text.split('\n').filter(Boolean).map((line) => JSON.parse(line) as ChatEvent)
}

/** All answer text in the stream, joined. */
export const answerText = (events: ChatEvent[]) =>
  events.filter((e): e is { t: 'text'; v: string } => e.t === 'text').map((e) => e.v).join('')

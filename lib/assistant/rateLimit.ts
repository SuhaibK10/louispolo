// ─────────────────────────────────────────────────────────────────────────────
// lib/assistant/rateLimit.ts
// Two guards in front of the free Gemini quota (shared by every visitor):
//   1. a per-visitor limit, so one person (or script) cannot burn the quota;
//   2. a daily cap on total messages, kept safely under the free-tier ceiling.
//
// State lives in memory, so on Vercel it is per serverless instance. That is
// good enough to blunt casual abuse and runaway loops, but it is NOT a hard
// guarantee. If the assistant ever moves to a paid key or gets real traffic,
// back this with Upstash Redis or a Supabase table instead.
// ─────────────────────────────────────────────────────────────────────────────

const WINDOW_MS      = 10 * 60 * 1000
const PER_IP_LIMIT   = 15   // messages per visitor per 10 minutes
const MAX_TRACKED    = 5000 // cap the map so it cannot grow without bound

// Messages per day across the whole site. Each message can cost up to two model
// calls (one tool round trip), and the free tier is reported at ~500 calls/day,
// so the default stays well below that. Override with ASSISTANT_DAILY_LIMIT.
const DAILY_LIMIT = Number(process.env.ASSISTANT_DAILY_LIMIT) || 200

const hits = new Map<string, number[]>()
let day   = new Date().toISOString().slice(0, 10)
let total = 0

export type LimitResult = { ok: true } | { ok: false; reason: 'visitor' | 'daily' }

export function checkLimit(visitorId: string, now = Date.now()): LimitResult {
  const today = new Date(now).toISOString().slice(0, 10)
  if (today !== day) { day = today; total = 0 }
  if (total >= DAILY_LIMIT) return { ok: false, reason: 'daily' }

  const recent = (hits.get(visitorId) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= PER_IP_LIMIT) {
    hits.set(visitorId, recent)
    return { ok: false, reason: 'visitor' }
  }

  recent.push(now)
  hits.set(visitorId, recent)
  total += 1

  if (hits.size > MAX_TRACKED) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }
  return { ok: true }
}

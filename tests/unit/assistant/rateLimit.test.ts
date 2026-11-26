import { beforeEach, describe, expect, it, vi } from 'vitest'

// The limiter keeps its counts in module state, so each test loads a fresh copy.
async function loadLimiter(dailyLimit?: number) {
  vi.resetModules()
  if (dailyLimit !== undefined) vi.stubEnv('ASSISTANT_DAILY_LIMIT', String(dailyLimit))
  return (await import('@/lib/assistant/rateLimit')).checkLimit
}

const T0 = Date.UTC(2026, 10, 26, 6, 0, 0)  // 26 Nov 2026, 06:00 UTC
const MIN = 60_000

describe('checkLimit', () => {
  beforeEach(() => { vi.unstubAllEnvs() })

  it('allows 15 messages per visitor in 10 minutes, then refuses', async () => {
    const checkLimit = await loadLimiter()
    for (let i = 0; i < 15; i++) expect(checkLimit('1.1.1.1', T0 + i).ok).toBe(true)
    expect(checkLimit('1.1.1.1', T0 + 20)).toEqual({ ok: false, reason: 'visitor' })
  })

  it('counts each visitor separately', async () => {
    const checkLimit = await loadLimiter()
    for (let i = 0; i < 15; i++) checkLimit('1.1.1.1', T0 + i)
    expect(checkLimit('2.2.2.2', T0 + 20).ok).toBe(true)
  })

  it('lets a visitor back in once their oldest messages are 10 minutes old', async () => {
    const checkLimit = await loadLimiter()
    for (let i = 0; i < 15; i++) checkLimit('1.1.1.1', T0)
    expect(checkLimit('1.1.1.1', T0 + 9 * MIN).ok).toBe(false)
    expect(checkLimit('1.1.1.1', T0 + 10 * MIN).ok).toBe(true)
  })

  it('stops everyone once the daily cap is reached, and resets the next day (UTC)', async () => {
    const checkLimit = await loadLimiter(3)
    expect(checkLimit('a', T0).ok).toBe(true)
    expect(checkLimit('b', T0).ok).toBe(true)
    expect(checkLimit('c', T0).ok).toBe(true)
    expect(checkLimit('d', T0)).toEqual({ ok: false, reason: 'daily' })
    expect(checkLimit('d', T0 + 24 * 60 * MIN).ok).toBe(true)
  })

  it('defaults to 200 messages a day when ASSISTANT_DAILY_LIMIT is not set', async () => {
    const checkLimit = await loadLimiter()
    for (let i = 0; i < 200; i++) expect(checkLimit(`visitor-${i}`, T0).ok).toBe(true)
    expect(checkLimit('one-more', T0)).toEqual({ ok: false, reason: 'daily' })
  })
})

// The two small endpoints behind the Shopify chat:
//   POST /api/shopify-assistant/lead      phone numbers shoppers leave
//   POST /api/shopify-assistant/feedback  👍/👎 votes on answers
// Supabase is faked, so nothing is written to the real database.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { post } from './helpers'

const db = vi.hoisted(() => ({
  insert: vi.fn(async (_row: Record<string, unknown>) => ({ error: null as { message: string } | null })),
  upsert: vi.fn(async (_row: Record<string, unknown>, _opts: unknown) => ({ error: null as { message: string } | null })),
  tables: [] as string[],
}))

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: () => ({
    from: (table: string) => {
      db.tables.push(table)
      return { insert: db.insert, upsert: db.upsert }
    },
  }),
}))
vi.mock('@/lib/shopify-assistant/providers', () => ({
  pickProvider: () => ({ name: 'openrouter', model: 'google/gemini-3.1-flash-lite', answer: async () => {} }),
}))

const lead     = (await import('@/app/api/shopify-assistant/lead/route')).POST
const feedback = (await import('@/app/api/shopify-assistant/feedback/route')).POST

beforeEach(() => {
  db.insert.mockClear()
  db.upsert.mockClear()
  db.tables.length = 0
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('POST /api/shopify-assistant/lead', () => {
  it('refuses other websites (403) and saves nothing', async () => {
    const res = await lead(post('/api/shopify-assistant/lead', { phone: '9876543210' }, { origin: 'https://evil.example.com' }))
    expect(res.status).toBe(403)
    expect(db.insert).not.toHaveBeenCalled()
  })

  it.each([
    '9876543210',
    '+91 98765 43210',
    '+91-98765-43210',
    '919876543210',
    '09876543210',
    ' (98765) 43210 ',
  ])('accepts %s and saves it as +919876543210', async (phone) => {
    const res = await lead(post('/api/shopify-assistant/lead', { phone }))
    expect(res.status).toBe(204)
    expect(db.tables).toEqual(['assistant_leads'])
    expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({ phone: '+919876543210' }))
  })

  it.each([
    ['too short', '98765'],
    ['too long', '98765432101'],
    ['not a mobile number (starts with 5)', '5876543210'],
    ['letters', 'call me maybe'],
    ['empty', ''],
    ['not text', 9876543210],
  ])('rejects a phone number that is %s (400)', async (_name, phone) => {
    const res = await lead(post('/api/shopify-assistant/lead', { phone }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Enter a valid 10-digit mobile number.' })
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('caps the saved questions and page fields', async () => {
    await lead(post('/api/shopify-assistant/lead', { phone: '9876543210', questions: 'q'.repeat(3000) + '   ', page: 'p'.repeat(400) }))
    const row = db.insert.mock.calls[0][0]
    expect(row.questions).toHaveLength(2000)
    expect(row.page).toHaveLength(300)
  })

  it('rejects oversized bodies (413) and malformed JSON (400)', async () => {
    expect((await lead(post('/api/shopify-assistant/lead', { phone: '9876543210', questions: 'x'.repeat(6000) }))).status).toBe(413)
    expect((await lead(post('/api/shopify-assistant/lead', 'not json', { raw: true }))).status).toBe(400)
  })

  it('still thanks the shopper (204) but logs it when the database write fails', async () => {
    db.insert.mockResolvedValueOnce({ error: { message: 'relation "assistant_leads" does not exist' } })
    const res = await lead(post('/api/shopify-assistant/lead', { phone: '9876543210' }))
    expect(res.status).toBe(204)
    expect(console.error).toHaveBeenCalledWith('[shopify-assistant] failed to save lead:', 'relation "assistant_leads" does not exist')
  })
})

describe('POST /api/shopify-assistant/feedback', () => {
  const vote = (overrides: Record<string, unknown> = {}) => ({
    id: 'a1b2c3d4-answer', vote: 'up', question: 'Cabin size?', answer: 'The 20-inch fits most airlines.', page: '/products/x',
    ...overrides,
  })

  it('saves a vote once per answer, with the AI model that wrote it', async () => {
    const res = await feedback(post('/api/shopify-assistant/feedback', vote()))
    expect(res.status).toBe(204)
    expect(db.tables).toEqual(['assistant_feedback'])
    expect(db.upsert).toHaveBeenCalledWith(
      {
        answer_id: 'a1b2c3d4-answer', vote: 'up', question: 'Cabin size?', answer: 'The 20-inch fits most airlines.',
        page: '/products/x', model: 'openrouter:google/gemini-3.1-flash-lite',
      },
      { onConflict: 'answer_id' },
    )
  })

  it.each([
    ['an unknown vote', { vote: 'meh' }],
    ['a missing vote', { vote: undefined }],
    ['an id that is too short', { id: 'abc' }],
    ['an id with unsafe characters', { id: 'abc123; drop table' }],
    ['a missing answer', { answer: '' }],
  ])('rejects %s (400)', async (_name, overrides) => {
    const res = await feedback(post('/api/shopify-assistant/feedback', vote(overrides)))
    expect(res.status).toBe(400)
    expect(db.upsert).not.toHaveBeenCalled()
  })

  it('caps long questions and answers', async () => {
    await feedback(post('/api/shopify-assistant/feedback', vote({ question: 'q'.repeat(900), answer: 'a'.repeat(5000) })))
    const row = db.upsert.mock.calls[0][0]
    expect(row.question).toHaveLength(800)
    expect(row.answer).toHaveLength(4000)
  })

  it('refuses other websites (403)', async () => {
    const res = await feedback(post('/api/shopify-assistant/feedback', vote(), { origin: 'https://evil.example.com' }))
    expect(res.status).toBe(403)
    expect(db.upsert).not.toHaveBeenCalled()
  })
})

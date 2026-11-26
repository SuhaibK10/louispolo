import { describe, expect, it, vi } from 'vitest'
import { allowedOrigins, cors, isAllowedOrigin, json } from '@/lib/shopify-assistant/cors'

describe('origin check for the chat API', () => {
  it('allows the live store, its myshopify domain and the local theme preview', () => {
    for (const origin of [
      'https://louispoloworld.com',
      'https://www.louispoloworld.com',
      'https://cyqpsc-j0.myshopify.com',
      'http://127.0.0.1:9292',
      'http://localhost:9292',
    ]) {
      expect(isAllowedOrigin(origin), origin).toBe(true)
    }
  })

  it('rejects other sites, look-alike domains and requests with no Origin', () => {
    for (const origin of [
      null,
      '',
      'https://evil.example.com',
      'http://louispoloworld.com',            // not https
      'https://louispoloworld.com.evil.com',  // look-alike
      'https://louispoloworld.com:8443',
    ]) {
      expect(isAllowedOrigin(origin), String(origin)).toBe(false)
    }
  })

  it('replaces the default list with SHOPIFY_ASSISTANT_ORIGINS but keeps the local preview', () => {
    vi.stubEnv('SHOPIFY_ASSISTANT_ORIGINS', 'https://staging.example.com, https://other.example.com')
    expect(allowedOrigins()).toEqual(new Set([
      'https://staging.example.com',
      'https://other.example.com',
      'http://127.0.0.1:9292',
      'http://localhost:9292',
    ]))
    expect(isAllowedOrigin('https://louispoloworld.com')).toBe(false)
  })

  it('only sends CORS headers back to allowed origins', () => {
    expect(cors('https://louispoloworld.com')).toMatchObject({
      'Access-Control-Allow-Origin':  'https://louispoloworld.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      Vary: 'Origin',
    })
    expect(cors('https://evil.example.com')).toEqual({ Vary: 'Origin' })
  })

  it('builds uncached JSON responses', async () => {
    const res = json({ ok: true }, 201, 'https://louispoloworld.com')
    expect(res.status).toBe(201)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://louispoloworld.com')
    expect(await res.json()).toEqual({ ok: true })
  })
})

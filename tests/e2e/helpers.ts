import type { Page } from '@playwright/test'

/**
 * Lets the page load only from the local test server. Analytics, Meta Pixel,
 * Supabase, image CDNs and fonts are all blocked, so a test run never sends
 * data anywhere or depends on an outside service being up.
 */
export async function blockOutsideRequests(page: Page, baseURL: string | undefined) {
  const origin = new URL(baseURL ?? 'http://127.0.0.1').origin
  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (url.startsWith(origin) || url.startsWith('data:') || url.startsWith('blob:')) return route.fallback()
    return route.abort()
  })
}

/** The chat API answers in newline-delimited JSON; this builds a fake answer body. */
export function ndjson(events: object[]) {
  return events.map((e) => JSON.stringify(e)).join('\n') + '\n'
}

// The "Ask LP's AI" chat widget on the Next.js site. The AI reply is faked at
// the network layer, so these tests check the widget itself: it opens, sends
// the question, streams in the answer, only links to our own shop pages, and
// shows errors clearly.
import { expect, test } from '@playwright/test'
import { blockOutsideRequests, ndjson } from './helpers'

test.beforeEach(async ({ page, baseURL }) => {
  await blockOutsideRequests(page, baseURL)
})

test('opens, sends the question and shows the streamed answer', async ({ page }) => {
  let sent: { messages: { role: string; content: string }[] } | undefined
  await page.route('**/api/assistant', async (route) => {
    sent = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/x-ndjson',
      body: ndjson([
        { t: 'text', v: 'For a short trip, the ' },
        { t: 'text', v: '[AeroSmart 3-in-1](/shop/aerosmart-3in1) fits most cabin limits. ' },
        { t: 'text', v: 'Avoid [this site](https://evil.example.com).' },
        { t: 'done' },
      ]),
    })
  })

  await page.goto('/')
  await page.getByRole('button', { name: "Ask LP's AI" }).click()

  const chat = page.getByRole('dialog', { name: "LP's AI" })
  await expect(chat).toBeVisible()
  await expect(chat).toContainText("Hello, I'm LP's AI")

  await chat.getByRole('textbox', { name: 'Your message' }).fill('Which bag for a 3-day trip?')
  await chat.getByRole('button', { name: 'Send message' }).click()

  await expect(chat).toContainText('fits most cabin limits')
  expect(sent?.messages.at(-1)).toEqual({ role: 'user', content: 'Which bag for a 3-day trip?' })

  // Our own product link is clickable; an outside link is never made clickable.
  // (The server also strips outside links before they reach the widget; this
  // checks the widget's own safety net.)
  await expect(chat.getByRole('link', { name: 'AeroSmart 3-in-1' })).toHaveAttribute('href', '/shop/aerosmart-3in1')
  await expect(chat).toContainText('Avoid')
  await expect(chat.locator('a[href*="evil.example.com"]')).toHaveCount(0)
})

test('shows the server’s message when the assistant is busy', async ({ page }) => {
  await page.route('**/api/assistant', (route) =>
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'You have asked a lot of questions. Please wait a few minutes.' }),
    }))

  await page.goto('/')
  await page.getByRole('button', { name: "Ask LP's AI" }).click()
  const chat = page.getByRole('dialog', { name: "LP's AI" })
  await chat.getByRole('textbox', { name: 'Your message' }).fill('Hello')
  await chat.getByRole('button', { name: 'Send message' }).click()

  await expect(chat).toContainText('Please wait a few minutes.')
})

test('closes again', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: "Ask LP's AI" }).click()
  const chat = page.getByRole('dialog', { name: "LP's AI" })
  await expect(chat).toBeVisible()
  await chat.getByRole('button', { name: 'Close assistant' }).click()
  await expect(chat).toBeHidden()
  await expect(page.getByRole('button', { name: "Ask LP's AI" })).toBeVisible()
})

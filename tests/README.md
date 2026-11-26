# Tests

Both suites run in GitHub Actions on every pull request (`.github/workflows/ci.yml`).
Merging to `main` deploys to Vercel, so open a pull request and merge once the checks pass.

## Unit tests: Vitest (`tests/unit`)

```bash
npm test             # run once
npm run test:watch   # re-run on save
```

They cover the backend of the Shopify site's "Ask AI" chat (`app/api/shopify-assistant`, `lib/shopify-assistant`):

- **Origin check:** only the store's domains may call the chat API.
- **Input validation:** request size limits, message shape, the 12 × 800-character caps, phone numbers and votes.
- **Rate limit:** 15 questions per visitor per 10 minutes, and the daily cap.
- **Link guard:** the AI can only link real products and collections.
- **Follow-up buttons**, and the product-details tool the AI calls.

The route handlers are called directly with real `Request` objects. Supabase, the Shopify catalogue feed and the AI provider are faked, so the tests make no network calls.

## Browser and HTTP tests: Playwright (`tests/e2e`)

```bash
npm run build && npm run test:e2e
```

These run against a production build, on a desktop and a phone screen size:

- **Chat widget:** opens, sends the question, streams the answer, and never makes outside links clickable. The AI reply is faked.
- **Product page:** the quantity can't go above the stock for a size, and added items show in the cart.
- **API guards:** the chat API's origin check and input validation, and the admin gate (401 without a login, redirect to the login page).

Every request that leaves the local server is blocked, so the tests never touch Shopify, Supabase, analytics or an AI provider.

**Local runs:** some settings are read at build time. Export the placeholder values listed in `E2E_ENV` (`playwright.config.ts`) before `npm run build`, the same as CI does.

// Unit tests (Vitest). Run with `npm test`; CI runs them on every pull request.
// Browser tests live in tests/e2e and run with Playwright (playwright.config.ts).
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    include:     ['tests/unit/**/*.test.ts'],
    environment: 'node',
    // Each test file gets fresh module state (the rate limiter keeps counts in memory).
    isolate:     true,
    restoreMocks: true,
    unstubEnvs:  true,
  },
})

// Browser and HTTP tests (Playwright) against a production build of this app.
// CI runs them on every pull request (.github/workflows/ci.yml).
//
// Run locally:
//   npm run build && npm run test:e2e
// with the same environment as CI (see E2E_ENV below and the workflow's `env`).
// Tests block every request that leaves the local server, so they never touch
// Shopify, Supabase, analytics or an AI provider, and cost nothing to run.
import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT) || 3100

/**
 * Placeholder settings for the test server. None of these are real secrets: they only
 * let the app start and let the admin gate and chat routes run their checks.
 * The same values are set in the CI workflow, because some are read at build time.
 */
export const E2E_ENV = {
  NEXT_PUBLIC_SUPABASE_URL:      'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'e2e-anon-key',
  SUPABASE_SERVICE_ROLE_KEY:     'e2e-service-role-key',
  ADMIN_PASSWORD:                'e2e-admin-password',
  ASSISTANT_ENABLED:             'true',
  OPENROUTER_API_KEY:            'e2e-not-a-real-key',
}

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /api\.spec\.ts/ },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/shop`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ...E2E_ENV, ...process.env } as Record<string, string>,
  },
})

import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke test dei percorsi critici sul build statico (dist/) servito da `astro preview`.
 * Eseguire: npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx astro preview --port 4321',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone SE'], browserName: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});

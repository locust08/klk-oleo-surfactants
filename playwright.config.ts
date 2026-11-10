import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  globalSetup: './tests/browser/setup.ts',
  timeout: 30_000,
  use: { baseURL: process.env.TEST_SERVER_URL || 'http://127.0.0.1:4372', channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', reducedMotion: 'reduce', trace: 'retain-on-failure' },
  webServer: process.env.TEST_SERVER_URL ? undefined : { command: 'node --import tsx scripts/test-server.ts', url: 'http://127.0.0.1:4372/surfactants', timeout: 120_000, reuseExistingServer: false },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { viewport: { width: 820, height: 1180 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  outputDir: '.superpowers/browser-results',
});

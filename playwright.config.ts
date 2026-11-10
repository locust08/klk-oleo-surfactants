import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  use: { baseURL: process.env.TEST_SERVER_URL || 'http://127.0.0.1:4371', channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', reducedMotion: 'reduce', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  outputDir: '.superpowers/browser-results',
});

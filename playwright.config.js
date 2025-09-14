import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://automationexercise.com', // para despues ir page.goto('/');
    testIdAttribute: 'data-qa',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
    trace: 'on-first-retry',
    viewport: { width: 1366, height: 768 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], headless: false } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});

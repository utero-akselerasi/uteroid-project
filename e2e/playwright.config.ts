import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
const envPath = path.join(__dirname, '..', '.env.test');
dotenv.config({ path: envPath });

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

// Prevent running against live site unless explicitly allowed
if (!baseURL.includes('localhost') && !baseURL.includes('127.0.0.1') && !baseURL.includes('3020') && process.env.ALLOW_LIVE !== 'true') {
  throw new Error(`Refusing to run tests against live site ${baseURL}. Set ALLOW_LIVE=true to override.`);
}

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 120000, // Increase global timeout to 2 minutes
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    storageState: 'e2e/.auth/admin.json',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Mobile disabled - only Chromium needed
    // {
    //   name: 'mobile',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  // Disable webServer - user runs dev server manually
});

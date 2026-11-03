import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
const envPath = path.resolve(__dirname, '.env.test');
dotenv.config({ path: envPath });

const baseURL = process.env.BASE_URL || 'http://localhost:3020';

// Live site protection
if (!baseURL.includes('localhost') && !baseURL.includes('127.0.0.1') && process.env.ALLOW_LIVE !== 'true') {
  throw new Error(`Refusing to run tests against live site ${baseURL}. Set ALLOW_LIVE=true to override.`);
}

export default defineConfig({
  testDir: './e2e',
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 60000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL,
    storageState: 'e2e/.auth/admin.json',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

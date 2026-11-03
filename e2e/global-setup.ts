import { chromium, type FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

async function globalSetup(config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'http://localhost:3020';
  const username = process.env.ADMIN_USER || '';
  const password = process.env.ADMIN_PASSWORD || '';

  if (!username || !password) {
    throw new Error('Admin credentials (ADMIN_USER, ADMIN_PASSWORD) are missing from .env.test');
  }

  const authDir = path.resolve(process.cwd(), 'e2e/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  const storageStatePath = path.join(authDir, 'admin.json');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  await page.goto(`${baseURL}/admin`, { waitUntil: 'domcontentloaded' });

  // Check if already authenticated
  const isDashboard = await page.locator('text=Keluar').isVisible().catch(() => false);
  if (!isDashboard) {
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    // totpCode left empty as instructed
    await page.getByRole('button', { name: 'Masuk Dashboard' }).click();
    await page.waitForSelector('text=Keluar', { timeout: 15000 });
  }

  // Save the authenticated storageState to e2e/.auth/admin.json
  await context.storageState({ path: storageStatePath });
  await browser.close();
}

export default globalSetup;

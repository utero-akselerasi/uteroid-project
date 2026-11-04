import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3020';

export function generateTestName(suffix: string = '') {
  return `ZZ TEST ${suffix} ${Date.now()}`;
}

export async function login(page: Page) {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');

  // Check if already logged in (dashboard is visible)
  const dashboardVisible = await page.locator('text=/projects|Portofolio|Daftar Proyek/i').count() > 0;
  if (dashboardVisible) {
    return;
  }

  // Wait for login form to be visible
  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.waitFor({ state: 'visible', timeout: 10000 });

  const passwordInput = page.locator('input[name="password"]');
  const totpInput = page.locator('input[name="totpCode"]');

  await usernameInput.fill(ADMIN_USER);
  await passwordInput.fill(ADMIN_PASSWORD);

  // Check if TOTP field exists and is required
  const totpExists = await totpInput.count() > 0;
  if (totpExists) {
    const totpRequired = await totpInput.getAttribute('required');
    if (totpRequired !== null) {
      await totpInput.fill('');
    }
  }

  // Click the submit button
  await page.click('button[type="submit"], button:has-text("Masuk Dashboard")');
  await page.waitForLoadState('networkidle');

  // Wait for dashboard to load
  await page.waitForSelector('text=/projects|Portofolio|Daftar Proyek/i', { timeout: 10000 });
}

export async function cleanupAllTestProjects(baseURL: string = BASE_URL) {
  try {
    const authPath = path.resolve(process.cwd(), 'e2e/.auth/admin.json');
    let cookieHeader = '';
    if (fs.existsSync(authPath)) {
      const state = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
      cookieHeader = (state.cookies || []).map((c: any) => `${c.name}=${c.value}`).join('; ');
    }

    const sessionRes = await fetch(`${baseURL}/portfolio-api/admin/auth/session`, {
      headers: { Cookie: cookieHeader },
    });
    const session = await sessionRes.json().catch(() => ({}));
    const csrfToken = session?.csrfToken || '';

    const res = await fetch(`${baseURL}/portfolio-api/projects`);
    if (!res.ok) return;
    const list = await res.json();
    if (!Array.isArray(list)) return;

    for (const p of list) {
      if (typeof p.title === 'string' && p.title.startsWith('ZZ TEST')) {
        await fetch(`${baseURL}/portfolio-api/admin/projects/${p.id}`, {
          method: 'DELETE',
          headers: {
            Cookie: cookieHeader,
            'X-CSRF-Token': csrfToken,
          },
        });
      }
    }
  } catch (e) {
    console.error('Error during cleanupAllTestProjects:', e);
  }
}

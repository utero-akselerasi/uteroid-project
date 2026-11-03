import { test, expect } from './fixtures';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test.describe('Admin Login', () => {
  // Use empty storageState so tests in this file test the manual login flow
  test.use({ storageState: { cookies: [], origins: [] } });

  test('wrong password shows an error', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });

    await page.locator('input[name="username"]').fill(ADMIN_USER);
    // Exactly ONE single attempt with wrong password to avoid locking account
    await page.locator('input[name="password"]').fill('incorrect_password_attempt');
    await page.locator('input[name="totpCode"]').fill('');

    await page.getByRole('button', { name: 'Masuk Dashboard' }).click();

    // Verify error element appears
    const errorElement = page.locator('[class*="error"]');
    await expect(errorElement).toBeVisible({ timeout: 10000 });
    const text = await errorElement.textContent();
    expect(text).toBeTruthy();
  });

  test('correct password opens the dashboard', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });

    await page.locator('input[name="username"]').fill(ADMIN_USER);
    await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Masuk Dashboard' }).click();

    await expect(page.locator('text=Keluar')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('button:has-text("Daftar Proyek")')).toBeVisible();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('logout works', async ({ page }) => {
    // First log in
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    await page.locator('input[name="username"]').fill(ADMIN_USER);
    await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Masuk Dashboard' }).click();
    await expect(page.locator('text=Keluar')).toBeVisible({ timeout: 15000 });

    // Click Keluar
    await page.locator('text=Keluar').click();

    // Verify redirected to login form
    await expect(page.locator('input[name="password"]')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Masuk Dashboard' })).toBeVisible();
  });

  test('/admin without login redirects to login form', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="password"]')).toBeVisible({ timeout: 10000 });
  });
});

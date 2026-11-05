import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Smoke Test', () => {
  test('dashboard loads automatically after login via storageState', async ({ page }) => {
    // Navigate directly to /admin using saved authentication state
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    // Verify authenticated dashboard elements
    await expect(page).toHaveTitle(/Portfolio Dashboard/i);
    await expect(page.locator('text=Keluar')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('button:has-text("Daftar Proyek")')).toBeVisible();

    // Verify login form is NOT visible
    await expect(page.locator('input[name="password"]')).not.toBeVisible();
  });
});


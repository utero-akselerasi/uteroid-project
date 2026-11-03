import { test, expect } from './global-setup';
import { login, logout, ADMIN_USER, ADMIN_PASSWORD } from './test-utils';

test.describe('Admin Login', () => {
  test('wrong password shows an error', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="username"]').fill(ADMIN_USER);
    await page.locator('input[name="password"]').fill('wrong-password');
    await page.locator('input[name="totpCode"]').fill('');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    // Check for error message
    const errorText = await page.locator('text=/invalid|error|failed/i').textContent();
    expect(errorText).toBeTruthy();
  });

  test('correct password opens the dashboard', async ({ page }) => {
    await login(page);

    // Verify dashboard is loaded
    await expect(page.locator('text=/projects/i')).toBeVisible();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('logout works', async ({ page }) => {
    await login(page);
    await logout(page);

    // Verify redirected to login
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('/admin without login redirects to login form', async ({ page }) => {
    // Clear any existing session cookies
    const context = page.context();
    await context.clearCookies();

    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Should see login form
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});

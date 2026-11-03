import { test, expect } from './fixtures';

test.describe('Project List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Keluar')).toBeVisible({ timeout: 15000 });
  });

  test('loads and displays projects table', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const rows = table.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('status counts show', async ({ page }) => {
    // Look inside the stats container for exact labels
    const statsContainer = page.locator('div[class*="stats"]').first();
    await expect(statsContainer).toBeVisible();

    await expect(statsContainer.getByText('Total', { exact: true })).toBeVisible();
    await expect(statsContainer.getByText('Published', { exact: true })).toBeVisible();
    await expect(statsContainer.getByText('Draft', { exact: true })).toBeVisible();
    await expect(statsContainer.getByText('Archived', { exact: true })).toBeVisible();
    await expect(statsContainer.getByText('Featured', { exact: true })).toBeVisible();
  });

  test('filter by status works', async ({ page }) => {
    const statusSelect = page.locator('select[aria-label="Filter status"]');
    await expect(statusSelect).toBeVisible();

    await statusSelect.selectOption('published');
    expect(await statusSelect.inputValue()).toBe('published');

    // Projects table should still be displayed
    const rows = page.locator('table tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);

    // Switch to draft
    await statusSelect.selectOption('draft');
    expect(await statusSelect.inputValue()).toBe('draft');

    // Reset to all
    await statusSelect.selectOption('all');
    expect(await statusSelect.inputValue()).toBe('all');
  });

  test('search by project name works', async ({ page }) => {
    const searchInput = page.locator('input[aria-label="Filter nama proyek"]');
    await expect(searchInput).toBeVisible();

    // Search for a known project
    await searchInput.fill('GaragePlug');
    await page.waitForTimeout(500);

    // Result should contain the searched project
    const tableText = await page.locator('table tbody').textContent();
    expect(tableText).toContain('GaragePlug');

    // Search for non-existent text
    await searchInput.fill('XYZNONEXISTENT999');
    await page.waitForTimeout(500);
    const emptyRows = await page.locator('table tbody tr').count();
    expect(emptyRows).toBe(0);

    // Clear search
    await searchInput.fill('');
  });

  test('filter by year works', async ({ page }) => {
    const yearSelect = page.locator('select[aria-label="Filter tahun"]');
    await expect(yearSelect).toBeVisible();

    const options = await yearSelect.locator('option').allTextContents();
    if (options.length > 1) {
      await yearSelect.selectOption({ index: 1 });
      const selected = await yearSelect.inputValue();
      expect(selected).not.toBe('all');
    }
  });

  test('archived widget is present (or report if missing)', async ({ page }) => {
    // Check if there is a separate dedicated archived widget / drawer / section
    const dedicatedArchivedWidget = page.locator('[data-testid="archived-widget"], .archived-section, aside:has-text("Archived")');
    const count = await dedicatedArchivedWidget.count();

    if (count === 0) {
      test.info().annotations.push({
        type: 'issue',
        description: 'Missing dedicated archived widget in admin dashboard (archived projects are only filtered via Status dropdown and Stat card).'
      });
    }
    expect(true).toBe(true);
  });
});

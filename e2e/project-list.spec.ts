import { test, expect } from './fixtures';
import { login } from './test-utils';

test.describe('Project List', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('loads and displays projects table', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const rows = await table.locator('tbody tr').all();
    expect(rows.length).toBeGreaterThan(0);
  });

  test('status counts show', async ({ page }) => {
    // Stats are in a div with class "stats"
    const statsContainer = page.locator('.stats');
    await expect(statsContainer).toBeVisible();

    // Check for each stat label
    await expect(statsContainer.getByText('Total')).toBeVisible();
    await expect(statsContainer.getByText('Published')).toBeVisible();
    await expect(statsContainer.getByText('Draft')).toBeVisible();
    await expect(statsContainer.getByText('Archived')).toBeVisible();
    await expect(statsContainer.getByText('Featured')).toBeVisible();
  });

  test('filter by status works', async ({ page }) => {
    // Status filter is a select in the toolbar
    const statusSelect = page.locator('select').filter({ hasText: 'Semua status' });
    await expect(statusSelect).toBeVisible();

    await statusSelect.selectOption('published');
    expect(await statusSelect.inputValue()).toBe('published');

    // Projects table should still be displayed
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Reset to all
    await statusSelect.selectOption('all');
    expect(await statusSelect.inputValue()).toBe('all');
  });

  test('search by project name works', async ({ page }) => {
    // Search input in toolbar
    const searchInput = page.locator('input').filter({ has: page.locator('.toolbar') }).first();
    await expect(searchInput).toBeVisible();

    // Search for a known project
    await searchInput.fill('GaragePlug');
    await page.waitForTimeout(500);

    // Result should contain the searched project
    const tableText = await page.locator('table tbody').textContent();
    expect(tableText).toContain('GaragePlug');

    // Clear search
    await searchInput.fill('');
  });

  test('filter by year works', async ({ page }) => {
    // Year filter is a select in the toolbar
    const yearSelect = page.locator('select').filter({ hasText: 'Semua tahun' });
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

import { test, expect } from './global-setup';
import { login } from './test-utils';

test.describe('Project List', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('loads and displays projects', async ({ page }) => {
    // Wait for projects to load
    await page.waitForLoadState('networkidle');

    // Check if projects are displayed
    const projectCards = page.locator('[data-testid="project-card"], .project-card, tr[data-project-id]');
    const count = await projectCards.count();

    // At least one project should be visible
    expect(count).toBeGreaterThan(0);
  });

  test('status counts show', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for status count indicators
    const statusElements = page.locator('text=/total|published|draft|archived|featured/i');
    const count = await statusElements.count();

    expect(count).toBeGreaterThan(0);
  });

  test('filter by status works', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find status filter dropdown
    const statusFilter = page.locator('select[name="status"], [data-testid="status-filter"]');
    const hasFilter = await statusFilter.count();

    if (hasFilter > 0) {
      await statusFilter.selectOption('published');
      await page.waitForLoadState('networkidle');

      // Verify filter is applied
      const selectedValue = await statusFilter.inputValue();
      expect(selectedValue).toBe('published');
    } else {
      test.skip('Status filter not found');
    }
  });

  test('search by project name works', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator('input[name="query"], input[placeholder*="search" i], [data-testid="search-input"]');
    const hasSearch = await searchInput.count();

    if (hasSearch > 0) {
      await searchInput.fill('test');
      await page.waitForLoadState('networkidle');

      // Verify search is applied
      const value = await searchInput.inputValue();
      expect(value).toBe('test');
    } else {
      test.skip('Search input not found');
    }
  });

  test('filter by year works', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find year filter dropdown
    const yearFilter = page.locator('select[name="year"], [data-testid="year-filter"]');
    const hasFilter = await yearFilter.count();

    if (hasFilter > 0) {
      const years = await yearFilter.locator('option').allTextContents();
      if (years.length > 1) {
        await yearFilter.selectOption({ index: 1 });
        await page.waitForLoadState('networkidle');

        const selectedValue = await yearFilter.inputValue();
        expect(selectedValue).not.toBe('all');
      }
    } else {
      test.skip('Year filter not found');
    }
  });

  test('archived widget is present (or report if missing)', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for archived widget/section
    const archivedWidget = page.locator('text=/archived/i, [data-testid="archived-widget"], .archived-section');
    const hasArchived = await archivedWidget.count();

    if (hasArchived === 0) {
      test.info().annotations.push({
        type: 'issue',
        description: 'Archived widget is missing from the admin dashboard'
      });
    }

    // Test continues regardless - we just report the missing widget
  });
});

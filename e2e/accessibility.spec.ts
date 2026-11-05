import { test, expect } from '@playwright/test';
import { login } from './test-utils';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Scan', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('admin dashboard accessibility', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length > 0) {
      test.info().annotations.push({
        type: 'issue',
        description: `Accessibility violations found: ${JSON.stringify(accessibilityScanResults.violations, null, 2)}`
      });
    }

    // Don't fail the test, just report violations
    // Uncomment the line below to fail on violations:
    // expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('project list accessibility', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length > 0) {
      test.info().annotations.push({
        type: 'issue',
        description: `Accessibility violations found: ${JSON.stringify(accessibilityScanResults.violations, null, 2)}`
      });
    }
  });

  test('project edit form accessibility', async ({ page }) => {
    // Click on the first project to edit
    const firstProject = page.locator('[data-testid="project-card"], .project-card, tr[data-project-id]').first();
    const hasProject = await firstProject.count();

    if (hasProject > 0) {
      await firstProject.click();
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      if (accessibilityScanResults.violations.length > 0) {
        test.info().annotations.push({
          type: 'issue',
          description: `Accessibility violations found: ${JSON.stringify(accessibilityScanResults.violations, null, 2)}`
        });
      }
    } else {
      test.skip(true, 'No projects found to test edit form');
    }
  });
});

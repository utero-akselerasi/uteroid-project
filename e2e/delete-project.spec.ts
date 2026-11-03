import { test, expect } from './global-setup';
import { login, generateTestName } from './test-utils';

test.describe('Delete Project', () => {
  let projectName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    projectName = generateTestName('delete');

    // Create a test project first
    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill('Test Client');
    await page.click('button:has-text("Save")');
    await page.waitForLoadState('networkidle');
  });

  test('confirmation modal appears with project name', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    await page.click('text=/delete/i');
    await page.waitForSelector('text=/confirm/i', { state: 'visible' });

    // Check if modal is visible
    const modal = page.locator('[role="dialog"], .modal, .confirm-dialog');
    await expect(modal.first()).toBeVisible();

    // Check if project name is in the modal
    const modalText = await modal.textContent();
    expect(modalText).toContain(projectName);
  });

  test('Cancel keeps the project', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    await page.click('text=/delete/i');
    await page.waitForSelector('text=/confirm/i', { state: 'visible' });

    // Click Cancel
    await page.click('button:has-text("Cancel")');
    await page.waitForLoadState('networkidle');

    // Go back to project list
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Verify project still exists
    await expect(page.locator(`text=/${projectName}/i`)).toBeVisible();

    // Clean up
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');
    await page.click('text=/delete/i');
    await page.waitForSelector('text=/confirm/i', { state: 'visible' });
    await page.click('button:has-text("Confirm")');
    await page.waitForLoadState('networkidle');
  });

  test('Confirm deletes the project', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    await page.click('text=/delete/i');
    await page.waitForSelector('text=/confirm/i', { state: 'visible' });

    // Click Confirm
    await page.click('button:has-text("Confirm")');
    await page.waitForLoadState('networkidle');

    // Go back to project list
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Verify project is deleted
    const projectExists = await page.locator(`text=/${projectName}/i`).count();
    expect(projectExists).toBe(0);
  });
});

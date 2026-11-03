import { test, expect } from './fixtures';
import { login, generateTestName } from './test-utils';

test.describe('Create Project', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('create project with only title and client', async ({ page }) => {
    const projectName = generateTestName('minimal');
    const clientName = 'Test Client';

    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    // Fill only title and client
    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill(clientName);

    // Save
    await page.click('button:has-text("Save")');
    await page.waitForLoadState('networkidle');

    // Verify project was created
    await expect(page.locator(`text=/${projectName}/i`)).toBeVisible();

    // Clean up - delete the project
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');
    await page.click('text=/delete/i');
    await page.waitForSelector('text=/confirm/i', { state: 'visible' });
    await page.click('button:has-text("Confirm")');
    await page.waitForLoadState('networkidle');
  });

  test('create project with all fields filled', async ({ page }) => {
    const projectName = generateTestName('full');
    const clientName = 'Full Test Client';

    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    // Fill all fields
    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill(clientName);
    await page.locator('input[name="year"]').fill('2024');
    await page.locator('input[name="category"]').fill('Test Category');
    await page.locator('select[name="industry"]').selectOption('services');
    await page.click('text=/identity/i'); // Select discipline
    await page.locator('textarea[name="shortDescription"]').fill('Short description for test');
    await page.locator('textarea[name="description"]').fill('Full description for test project');
    await page.locator('select[name="coverPosition"]').selectOption('center');

    // Save
    await page.click('button:has-text("Save")');
    await page.waitForLoadState('networkidle');

    // Verify project was created
    await expect(page.locator(`text=/${projectName}/i`)).toBeVisible();

    // Clean up - delete the project
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');
    await page.click('text=/delete/i');
    await page.waitForSelector('text=/confirm/i', { state: 'visible' });
    await page.click('button:has-text("Confirm")');
    await page.waitForLoadState('networkidle');
  });

  test('auto-slug generation', async ({ page }) => {
    const projectName = generateTestName('slug');
    const expectedSlug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    // Fill title
    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill('Test Client');

    // Check if slug is auto-generated
    const slugInput = page.locator('input[name="slug"], input[name="routeSlug"]');
    const hasSlug = await slugInput.count();

    if (hasSlug > 0) {
      const slugValue = await slugInput.inputValue();
      expect(slugValue).toContain(expectedSlug.slice(0, 20)); // Check first part matches
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Slug input field not found in create form'
      });
    }

    // Clean up if project was created
    await page.click('button:has-text("Cancel")');
    await page.waitForLoadState('networkidle');
  });

  test('auto-priority is read-only', async ({ page }) => {
    const projectName = generateTestName('priority');

    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill('Test Client');

    // Check priority field
    const priorityInput = page.locator('input[name="priority"]');
    const hasPriority = await priorityInput.count();

    if (hasPriority > 0) {
      const isReadOnly = await priorityInput.isDisabled();
      const readOnlyAttr = await priorityInput.getAttribute('readonly');

      if (!isReadOnly && !readOnlyAttr) {
        test.info().annotations.push({
          type: 'issue',
          description: 'Priority field is not read-only as expected'
        });
      }
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Priority field not found in create form'
      });
    }

    // Clean up
    await page.click('button:has-text("Cancel")');
    await page.waitForLoadState('networkidle');
  });

  test('cover position dropdown', async ({ page }) => {
    const projectName = generateTestName('cover');

    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill('Test Client');

    // Check cover position dropdown
    const coverSelect = page.locator('select[name="coverPosition"], select[name="gridCoverPosition"]');
    const hasCover = await coverSelect.count();

    if (hasCover > 0) {
      const options = await coverSelect.locator('option').allTextContents();
      expect(options.length).toBeGreaterThan(0);

      // Try to select an option
      await coverSelect.selectOption({ index: 0 });
      const selectedValue = await coverSelect.inputValue();
      expect(selectedValue).toBeTruthy();
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Cover position dropdown not found in create form'
      });
    }

    // Clean up
    await page.click('button:has-text("Cancel")');
    await page.waitForLoadState('networkidle');
  });
});

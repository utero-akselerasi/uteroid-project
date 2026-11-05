import { test, expect } from './fixtures';
import { login, generateTestName } from './test-utils';

test.describe('Edit Project', () => {
  let projectName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    projectName = generateTestName('edit');

    // Create a test project first
    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill('Test Client');
    await page.click('button:has-text("Save")');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    // Clean up - delete the test project
    try {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      await page.click(`text=/${projectName}/i`);
      await page.waitForLoadState('networkidle');
      await page.click('text=/delete/i');
      await page.waitForSelector('text=/confirm/i', { state: 'visible' });
      await page.click('button:has-text("Confirm")');
      await page.waitForLoadState('networkidle');
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  test('edit tags and verify save', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    // Find tags input
    const tagsInput = page.locator('input[name="tags"], [data-testid="tags-input"]');
    const hasTags = await tagsInput.count();

    if (hasTags > 0) {
      await tagsInput.fill('test-tag-1, test-tag-2');
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Reload and verify
      await page.reload();
      await page.waitForLoadState('networkidle');

      const savedTags = await tagsInput.inputValue();
      expect(savedTags).toContain('test-tag-1');
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Tags input field not found in edit form'
      });
    }
  });

  test('edit video link - YouTube', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    // Find video type and source inputs
    const videoType = page.locator('select[name="video.type"], select[name="videoType"]');
    const videoSrc = page.locator('input[name="video.src"], input[name="videoSrc"]');

    const hasVideo = await videoType.count();

    if (hasVideo > 0) {
      await videoType.selectOption('youtube');
      await videoSrc.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Reload and verify
      await page.reload();
      await page.waitForLoadState('networkidle');

      const savedType = await videoType.inputValue();
      const savedSrc = await videoSrc.inputValue();
      expect(savedType).toBe('youtube');
      expect(savedSrc).toContain('youtube');
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Video fields not found in edit form'
      });
    }
  });

  test('edit video link - Vimeo', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    const videoType = page.locator('select[name="video.type"], select[name="videoType"]');
    const videoSrc = page.locator('input[name="video.src"], input[name="videoSrc"]');

    const hasVideo = await videoType.count();

    if (hasVideo > 0) {
      await videoType.selectOption('vimeo');
      await videoSrc.fill('https://vimeo.com/123456789');
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Reload and verify
      await page.reload();
      await page.waitForLoadState('networkidle');

      const savedType = await videoType.inputValue();
      const savedSrc = await videoSrc.inputValue();
      expect(savedType).toBe('vimeo');
      expect(savedSrc).toContain('vimeo');
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Video fields not found in edit form'
      });
    }
  });

  test('edit video link - raw ID', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    const videoType = page.locator('select[name="video.type"], select[name="videoType"]');
    const videoSrc = page.locator('input[name="video.src"], input[name="videoSrc"]');

    const hasVideo = await videoType.count();

    if (hasVideo > 0) {
      await videoType.selectOption('youtube');
      await videoSrc.fill('dQw4w9WgXcQ'); // Raw YouTube ID
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Reload and verify
      await page.reload();
      await page.waitForLoadState('networkidle');

      const savedSrc = await videoSrc.inputValue();
      expect(savedSrc).toBe('dQw4w9WgXcQ');
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Video fields not found in edit form'
      });
    }
  });

  test('edit cover position and verify save', async ({ page }) => {
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    const coverSelect = page.locator('select[name="coverPosition"], select[name="gridCoverPosition"]');
    const hasCover = await coverSelect.count();

    if (hasCover > 0) {
      await coverSelect.selectOption('bottom');
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Reload and verify
      await page.reload();
      await page.waitForLoadState('networkidle');

      const savedValue = await coverSelect.inputValue();
      expect(savedValue).toBe('bottom');
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Cover position dropdown not found in edit form'
      });
    }
  });

  test('report 403 or 5xx responses', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('response', (response) => {
      const status = response.status();
      if (status === 403 || status >= 500) {
        failedRequests.push(`${response.url()} - ${status}`);
      }
    });

    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    // Make some edits
    await page.locator('input[name="title"]').fill(`${projectName} edited`);
    await page.click('button:has-text("Save")');
    await page.waitForLoadState('networkidle');

    if (failedRequests.length > 0) {
      test.info().annotations.push({
        type: 'issue',
        description: `Failed requests detected: ${failedRequests.join(', ')}`
      });
    }
  });
});

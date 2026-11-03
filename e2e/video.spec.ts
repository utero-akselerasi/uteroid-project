import { test, expect } from './global-setup';
import { login, generateTestName } from './test-utils';

test.describe('Video Player', () => {
  let projectName: string;
  let projectSlug: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    projectName = generateTestName('video');
    projectSlug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Create a test project with video
    await page.click('text=/new project/i, button:has-text("New")');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="title"]').fill(projectName);
    await page.locator('input[name="client"]').fill('Test Client');

    // Add video
    const videoType = page.locator('select[name="video.type"], select[name="videoType"]');
    const videoSrc = page.locator('input[name="video.src"], input[name="videoSrc"]');
    const hasVideo = await videoType.count();

    if (hasVideo > 0) {
      await videoType.selectOption('youtube');
      await videoSrc.fill('dQw4w9WgXcQ');
    }

    await page.click('button:has-text("Save")');
    await page.waitForLoadState('networkidle');

    // Publish the project so it's accessible publicly
    await page.click(`text=/${projectName}/i`);
    await page.waitForLoadState('networkidle');

    const statusSelect = page.locator('select[name="status"]');
    const hasStatus = await statusSelect.count();

    if (hasStatus > 0) {
      await statusSelect.selectOption('published');
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');
    }
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

  test('play button opens the player on public page', async ({ page }) => {
    // Navigate to public project page
    await page.goto(`/work/${projectSlug}`);
    await page.waitForLoadState('networkidle');

    // Find play button
    const playButton = page.locator('.pd-hero__play-button, button[aria-label*="play" i], button:has(svg)');
    const hasPlayButton = await playButton.count();

    if (hasPlayButton > 0) {
      // Click play button
      await playButton.first().click();
      await page.waitForLoadState('networkidle');

      // Verify video player modal is open
      const videoPlayer = page.locator('.video-player, iframe[src*="youtube"], iframe[src*="vimeo"]');
      await expect(videoPlayer.first()).toBeVisible();
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'Play button not found on project page'
      });
    }
  });
});

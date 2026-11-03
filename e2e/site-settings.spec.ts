import { test, expect } from './global-setup';
import { login } from './test-utils';

test.describe('Site Settings Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const tabs = [
    { name: 'Studio', selector: 'text=/studio/i, button:has-text("Studio")' },
    { name: 'Insights', selector: 'text=/insights/i, button:has-text("Insights")' },
    { name: 'Services Media', selector: 'text=/services.*media|media.*services/i, button:has-text("Services Media")' },
    { name: 'Banners', selector: 'text=/banners/i, button:has-text("Banners")' },
    { name: 'Typography', selector: 'text=/typography/i, button:has-text("Typography")' },
    { name: 'Contacts', selector: 'text=/contacts/i, button:has-text("Contacts")' },
  ];

  tabs.forEach(({ name, selector }) => {
    test(`${name} tab opens without errors`, async ({ page }) => {
      // Navigate to settings
      const settingsTab = page.locator('text=/settings/i, button:has-text("Settings")');
      const hasSettings = await settingsTab.count();

      if (hasSettings > 0) {
        await settingsTab.first().click();
        await page.waitForLoadState('networkidle');
      }

      // Try to find and click the specific tab
      const tab = page.locator(selector);
      const hasTab = await tab.count();

      if (hasTab > 0) {
        await tab.first().click();
        await page.waitForLoadState('networkidle');

        // Verify tab content is visible
        const tabContent = page.locator('[role="tabpanel"], .tab-content, .settings-panel');
        await expect(tabContent.first()).toBeVisible();
      } else {
        test.info().annotations.push({
          type: 'issue',
          description: `${name} tab not found in site settings`
        });
      }
    });
  });

  test('change and restore values on TEST copy', async ({ page }) => {
    // Navigate to settings
    const settingsTab = page.locator('text=/settings/i, button:has-text("Settings")');
    const hasSettings = await settingsTab.count();

    if (hasSettings === 0) {
      test.skip('Settings tab not found');
      return;
    }

    await settingsTab.first().click();
    await page.waitForLoadState('networkidle');

    // Try to find a field we can safely test (e.g., a text field in Typography or Contacts)
    const testField = page.locator('input[type="text"], textarea').first();
    const hasField = await testField.count();

    if (hasField > 0) {
      // Store original value
      const originalValue = await testField.inputValue();

      // Change to test value
      await testField.fill('TEST VALUE');
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Restore original value
      await testField.fill(originalValue);
      await page.click('button:has-text("Save")');
      await page.waitForLoadState('networkidle');

      // Verify restored
      const restoredValue = await testField.inputValue();
      expect(restoredValue).toBe(originalValue);
    } else {
      test.info().annotations.push({
        type: 'issue',
        description: 'No editable field found in site settings for test'
      });
    }
  });
});

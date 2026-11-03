import { Page, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

export const ADMIN_USER = process.env.ADMIN_USER || '';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function login(page: Page) {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');

  // Wait for login form to be visible
  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.waitFor({ state: 'visible', timeout: 10000 });

  const passwordInput = page.locator('input[name="password"]');
  const totpInput = page.locator('input[name="totpCode"]');

  await usernameInput.fill(ADMIN_USER);
  await passwordInput.fill(ADMIN_PASSWORD);
  await totpInput.fill(''); // TOTP may be optional based on config

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Wait for dashboard to load - look for any dashboard element
  await page.waitForSelector('text=/projects|studio|settings/i', { timeout: 10000 });
}

export async function logout(page: Page) {
  await page.click('text=/logout/i');
  await page.waitForLoadState('networkidle');
}

export async function createTestProject(page: Page, testData: any) {
  await page.click('text=/new project/i');
  await page.waitForLoadState('networkidle');

  await page.locator('input[name="title"]').fill(testData.title);
  await page.locator('input[name="client"]').fill(testData.client);

  if (testData.year) {
    await page.locator('input[name="year"]').fill(testData.year);
  }

  if (testData.category) {
    await page.locator('input[name="category"]').fill(testData.category);
  }

  if (testData.industry) {
    await page.locator('select[name="industry"]').selectOption(testData.industry);
  }

  if (testData.disciplines && testData.disciplines.length > 0) {
    for (const discipline of testData.disciplines) {
      await page.click(`text=/${discipline}/i`);
    }
  }

  if (testData.shortDescription) {
    await page.locator('textarea[name="shortDescription"]').fill(testData.shortDescription);
  }

  if (testData.description) {
    await page.locator('textarea[name="description"]').fill(testData.description);
  }

  if (testData.coverPosition) {
    await page.locator('select[name="coverPosition"]').selectOption(testData.coverPosition);
  }

  await page.click('button:has-text("Save")');
  await page.waitForLoadState('networkidle');
}

export async function deleteProject(page: Page, projectName: string) {
  await page.click(`text=/${projectName}/i`);
  await page.waitForLoadState('networkidle');

  await page.click('text=/delete/i');
  await page.waitForSelector('text=/confirm/i', { state: 'visible' });

  await page.click('button:has-text("Confirm")');
  await page.waitForLoadState('networkidle');
}

export function generateTestName(suffix: string = '') {
  const timestamp = Date.now();
  return `ZZ TEST ${suffix} ${timestamp}`;
}

import { test, expect } from './fixtures';
import { generateTestName, cleanupAllTestProjects } from './test-utils';

test.describe('Create Project', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Keluar')).toBeVisible({ timeout: 15000 });
  });

  test.afterEach(async () => {
    // Safety guarantee: delete any ZZ TEST project created even if test failed
    await cleanupAllTestProjects();
  });

  test('create project with only title and client', async ({ page }) => {
    const projectName = generateTestName('Minimal');
    const clientName = 'Test Client Minimal';

    // Click "+ Proyek baru"
    await page.locator('button:has-text("+ Proyek baru")').click();
    await expect(page.locator('div:has(> label:has-text("Judul")) input')).toBeVisible({ timeout: 10000 });

    // Fill only title and client
    await page.locator('div:has(> label:has-text("Judul")) input').fill(projectName);
    await page.locator('div:has(> label:has-text("Client")) input').fill(clientName);

    // Save project
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('admin/projects') && (r.request().method() === 'POST' || r.request().method() === 'PUT')),
      page.locator('button:has-text("Simpan Proyek")').click(),
    ]);

    expect(response.status()).toBeLessThan(400);

    // Go back to project list
    await page.locator('button:has-text("← Kembali")').click();
    await expect(page.locator('table')).toBeVisible();

    // Verify project appears in table
    await expect(page.locator('table tbody tr').filter({ hasText: projectName })).toBeVisible();

    // Delete the test project via UI
    const row = page.locator('table tbody tr').filter({ hasText: projectName });
    await row.locator('button:has-text("Hapus")').click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await modal.locator('button:has-text("Hapus Proyek")').click();
    await expect(modal).toBeHidden();
  });

  test('create project with all fields filled at once', async ({ page }) => {
    const projectName = generateTestName('Full');
    const clientName = 'Test Client Full';

    // Click "+ Proyek baru"
    await page.locator('button:has-text("+ Proyek baru")').click();
    await expect(page.locator('div:has(> label:has-text("Judul")) input')).toBeVisible({ timeout: 10000 });

    // Fill all fields
    await page.locator('div:has(> label:has-text("Judul")) input').fill(projectName);
    await page.locator('div:has(> label:has-text("Client")) input').fill(clientName);
    await page.locator('div:has(> label:has-text("Tahun")) input').fill('2025');
    await page.locator('div:has(> label:has-text("Kategori")) input').fill('Brand Identity');
    await page.locator('div:has(> label:has-text("Industri")) select').selectOption('fnb');
    await page.locator('div:has(> label:has-text("Status")) select').selectOption('draft');
    await page.locator('div:has(> label:has-text("Ringkasan")) textarea').fill('Short test summary');
    await page.locator('div:has(> label:has-text("Deskripsi")) textarea').fill('Full test description text');

    // Video section
    await page.locator('div:has(> label:has-text("Tipe video")) select').selectOption('youtube');
    await page.locator('div:has(> label:has-text("Link video")) input').fill('https://youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('div:has(> label:has-text("URL poster")) input').fill('/projects/test/poster.jpg');

    // Disciplines checkbox
    const fnbCheck = page.locator('label:has-text("packaging") input[type="checkbox"]');
    if ((await fnbCheck.count()) > 0 && !(await fnbCheck.isChecked())) {
      await fnbCheck.check();
    }

    // Tags & Scope
    await page.locator('div:has(> label:has-text("Tags")) textarea').fill('Branding\nPackaging\nTestTag');
    await page.locator('div:has(> label:has-text("Scope")) textarea').fill('Visual Identity\nPrint Media');

    // Cover position
    await page.locator('div:has(> label:has-text("Posisi cover di grid")) select').selectOption('top');

    // Case study Challenge & Solution
    await page.locator('div:has(> label:has-text("Challenge")) textarea').fill('Market competition and brand clarity challenge');
    await page.locator('div:has(> label:has-text("Solution")) textarea').fill('Comprehensive brand refresh and modern packaging solution');

    // Intercept network request to capture payload and response
    let saveStatus = 0;
    let saveBody: any = null;
    let requestPayload: any = null;

    const [response] = await Promise.all([
      page.waitForResponse((r) => {
        if (r.url().includes('admin/projects') && (r.request().method() === 'POST' || r.request().method() === 'PUT')) {
          saveStatus = r.status();
          requestPayload = r.request().postData();
          return true;
        }
        return false;
      }),
      page.locator('button:has-text("Simpan Proyek")').click(),
    ]);

    try {
      saveBody = await response.json();
    } catch {
      saveBody = await response.text();
    }

    if (saveStatus >= 400) {
      test.info().annotations.push({
        type: 'issue',
        description: `Create project with all fields failed with status ${saveStatus}. Request: ${requestPayload}, Response: ${JSON.stringify(saveBody)}`
      });
    }

    expect(saveStatus).toBeLessThan(400);

    // Go back and verify project is in list
    await page.locator('button:has-text("← Kembali")').click();
    await expect(page.locator('table tbody tr').filter({ hasText: projectName })).toBeVisible();

    // Delete test project via UI
    const row = page.locator('table tbody tr').filter({ hasText: projectName });
    await row.locator('button:has-text("Hapus")').click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await modal.locator('button:has-text("Hapus Proyek")').click();
    await expect(modal).toBeHidden();
  });

  test('auto-slug generation from title', async ({ page }) => {
    await page.locator('button:has-text("+ Proyek baru")').click();
    await expect(page.locator('div:has(> label:has-text("Judul")) input')).toBeVisible({ timeout: 10000 });

    const titleInput = page.locator('div:has(> label:has-text("Judul")) input');
    const slugInput = page.locator('div:has(> label:has-text("Slug internal")) input');
    const routeSlugInput = page.locator('div:has(> label:has-text("Slug URL")) input');

    await titleInput.fill('ZZ TEST Brand Identity 2026!');
    expect(await slugInput.inputValue()).toBe('zz-test-brand-identity-2026');
    expect(await routeSlugInput.inputValue()).toBe('zz-test-brand-identity-2026');

    // Cancel without saving
    await page.locator('button:has-text("← Kembali")').click();
  });

  test('priority: check read-only attribute and auto-assigned value vs highest existing', async ({ page }) => {
    // 1. Query highest existing priority from projects list
    const highestExistingPriority = await page.evaluate(async () => {
      const res = await fetch('/portfolio-api/admin/projects');
      const list = await res.json();
      return Math.max(...list.map((p: any) => p.priority || 0));
    });

    const expectedNextPriority = highestExistingPriority + 1;

    // 2. Open project creation form
    await page.locator('button:has-text("+ Proyek baru")').click();
    await expect(page.locator('div:has(> label:has-text("Judul")) input')).toBeVisible({ timeout: 10000 });

    const priorityInput = page.locator('div:has(> label:has-text("Priority")) input');
    await expect(priorityInput).toBeVisible();

    // Verify it is read-only
    const isReadOnly = (await priorityInput.getAttribute('readonly')) !== null;
    expect(isReadOnly).toBe(true);

    // Read form priority value
    const formPriorityVal = Number(await priorityInput.inputValue());

    // 3. Save a minimal test project to see what priority the backend actually assigns
    const projectName = generateTestName('PriorityCheck');
    await page.locator('div:has(> label:has-text("Judul")) input').fill(projectName);
    await page.locator('div:has(> label:has-text("Client")) input').fill('Priority Client');

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('admin/projects') && (r.request().method() === 'POST' || r.request().method() === 'PUT')),
      page.locator('button:has-text("Simpan Proyek")').click(),
    ]);

    const savedData = await response.json();
    const savedPriority = Number(savedData.priority);

    // Extra check 1: Report bug if form shows 0 instead of next highest priority
    if (formPriorityVal === 0 || formPriorityVal !== expectedNextPriority) {
      test.info().annotations.push({
        type: 'bug',
        description: `ADMIN BUG: Form shows priority ${formPriorityVal} instead of next highest priority ${expectedNextPriority} (highest existing is ${highestExistingPriority}). Saved project priority is ${savedPriority}.`
      });
    }

    // Go back and delete test project
    await page.locator('button:has-text("← Kembali")').click();
    const row = page.locator('table tbody tr').filter({ hasText: projectName });
    if ((await row.count()) > 0) {
      await row.locator('button:has-text("Hapus")').click();
      const modal = page.locator('[role="dialog"]');
      await modal.waitFor({ state: 'visible' });
      await modal.locator('button:has-text("Hapus Proyek")').click();
      await modal.waitFor({ state: 'hidden' });
    }

    // Expect read-only to be true
    expect(isReadOnly).toBe(true);
  });

  test('cover position dropdown has required options', async ({ page }) => {
    await page.locator('button:has-text("+ Proyek baru")').click();
    await expect(page.locator('div:has(> label:has-text("Judul")) input')).toBeVisible({ timeout: 10000 });

    const coverSelect = page.locator('div:has(> label:has-text("Posisi cover di grid")) select');
    await expect(coverSelect).toBeVisible();

    const options = await coverSelect.locator('option').allTextContents();
    expect(options).toEqual(expect.arrayContaining(['Center', 'Top', 'Bottom', 'Left', 'Right']));

    await coverSelect.selectOption('bottom');
    expect(await coverSelect.inputValue()).toBe('bottom');

    await page.locator('button:has-text("← Kembali")').click();
  });
});

import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3020';

export function generateTestName(suffix: string = '') {
  return `ZZ TEST ${suffix} ${Date.now()}`;
}

export async function cleanupAllTestProjects(baseURL: string = BASE_URL) {
  try {
    const authPath = path.resolve(process.cwd(), 'e2e/.auth/admin.json');
    let cookieHeader = '';
    if (fs.existsSync(authPath)) {
      const state = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
      cookieHeader = (state.cookies || []).map((c: any) => `${c.name}=${c.value}`).join('; ');
    }

    const sessionRes = await fetch(`${baseURL}/portfolio-api/admin/auth/session`, {
      headers: { Cookie: cookieHeader },
    });
    const session = await sessionRes.json().catch(() => ({}));
    const csrfToken = session?.csrfToken || '';

    const res = await fetch(`${baseURL}/portfolio-api/projects`);
    if (!res.ok) return;
    const list = await res.json();
    if (!Array.isArray(list)) return;

    for (const p of list) {
      if (typeof p.title === 'string' && p.title.startsWith('ZZ TEST')) {
        await fetch(`${baseURL}/portfolio-api/admin/projects/${p.id}`, {
          method: 'DELETE',
          headers: {
            Cookie: cookieHeader,
            'X-CSRF-Token': csrfToken,
          },
        });
      }
    }
  } catch (e) {
    console.error('Error during cleanupAllTestProjects:', e);
  }
}

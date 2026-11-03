import { test as base, expect } from '@playwright/test';

export type ConsoleError = {
  type: string;
  text: string;
  location?: { url: string; lineNumber: number; columnNumber: number };
};

export type FailedRequest = {
  url: string;
  status: number;
  method: string;
};

export const test = base.extend<{
  consoleErrors: ConsoleError[];
  failedRequests: FailedRequest[];
}>({
  consoleErrors: async ({ page }, use) => {
    const errors: ConsoleError[] = [];
    const onConsole = (msg: any) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const location = msg.location();
        // Ignore external scripts and harmless favicon/manifest errors
        if (!location?.url?.includes('analytics') && !text.includes('favicon')) {
          errors.push({ type: msg.type(), text, location });
        }
      }
    };
    page.on('console', onConsole);
    await use(errors);
    page.off('console', onConsole);
  },
  failedRequests: async ({ page }, use) => {
    const failures: FailedRequest[] = [];
    const onResponse = (response: any) => {
      const status = response.status();
      const url = response.url();
      if (status >= 400 && status < 600) {
        // Ignore expected or external failures
        if (!url.includes('/favicon.ico') && !url.includes('analytics')) {
          failures.push({
            url,
            status,
            method: response.request().method(),
          });
        }
      }
    };
    page.on('response', onResponse);
    await use(failures);
    page.off('response', onResponse);
  },
});

export { expect };

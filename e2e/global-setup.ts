import { test as base } from '@playwright/test';

type ConsoleError = {
  type: string;
  text: string;
  location: { url: string; lineNumber: number; columnNumber: number };
};

type FailedRequest = {
  url: string;
  status: number;
  method: string;
};

export const test = base.extend<{
  consoleErrors: ConsoleError[];
  failedRequests: FailedRequest[];
}>({
  consoleErrors: async ({}, use) => {
    const errors: ConsoleError[] = [];
    await use(errors);
    if (errors.length > 0) {
      throw new Error(`Console errors detected:\n${errors.map(e => `${e.type}: ${e.text} at ${e.location.url}:${e.location.lineNumber}`).join('\n')}`);
    }
  },
  failedRequests: async ({}, use) => {
    const failures: FailedRequest[] = [];
    await use(failures);
    if (failures.length > 0) {
      throw new Error(`Failed network requests detected:\n${failures.map(f => `${f.method} ${f.url} - ${f.status}`).join('\n')}`);
    }
  },
});

test.beforeEach(async ({ page, consoleErrors, failedRequests }) => {
  // Track console errors from our own code
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      const text = msg.text();
      // Filter out errors from third-party scripts
      const location = msg.location();
      if (location && location.url && !location.url.includes('cdn') && !location.url.includes('analytics')) {
        consoleErrors.push({
          type,
          text,
          location,
        });
      }
    }
  });

  // Track failed network requests (4xx/5xx)
  page.on('response', response => {
    const status = response.status();
    if (status >= 400 && status < 600) {
      // Filter out expected failures (e.g., auth during login tests)
      const url = response.url();
      if (!url.includes('login') && !url.includes('auth')) {
        failedRequests.push({
          url,
          status,
          method: response.request().method(),
        });
      }
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  // Check for horizontal overflow at 390px mobile width
  if (testInfo.project.name === 'mobile') {
    const overflow = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return {
        bodyOverflow: body.scrollWidth > body.clientWidth,
        htmlOverflow: html.scrollWidth > html.clientWidth,
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
      };
    });

    if (overflow.bodyOverflow || overflow.htmlOverflow) {
      testInfo.annotations.push({
        type: 'issue',
        description: `Horizontal overflow detected at mobile width: body ${overflow.bodyScrollWidth}px vs ${overflow.bodyClientWidth}px`
      });
    }
  }
});

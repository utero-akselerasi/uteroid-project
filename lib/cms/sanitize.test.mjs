import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeArticleHtml } from "./sanitize.ts";

test("removes scripts, event handlers, and unsafe URLs", () => {
  const result = sanitizeArticleHtml(`
    <p onclick="alert(1)">Safe<script>alert(1)</script></p>
    <a href="javascript:alert(1)">bad link</a>
    <img src="data:text/html;base64,PHNjcmlwdD4=" onerror="alert(1)">
  `);

  assert.doesNotMatch(result, /script|onclick|onerror|javascript:|data:/i);
  assert.match(result, /<p>Safe<\/p>/);
  assert.match(result, /bad link/);
  assert.doesNotMatch(result, /<img/i);
});

test("keeps allowed article markup and hardens external links", () => {
  const result = sanitizeArticleHtml('<h2>Title</h2><a href="https://example.com">Source</a><img src="/image.webp" alt="Preview">');

  assert.match(result, /<h2>Title<\/h2>/);
  assert.match(result, /href="https:\/\/example\.com"/);
  assert.match(result, /target="_blank"/);
  assert.match(result, /rel="noopener noreferrer"/);
  assert.match(result, /src="\/image\.webp"/);
});
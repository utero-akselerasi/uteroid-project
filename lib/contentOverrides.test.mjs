import assert from "node:assert/strict";
import test from "node:test";

import { flattenKeys, getPath, setPath } from "./contentOverrides.ts";

test("content keys omit formatter functions and keep arrays editable", () => {
  const source = { hero: { title: "Hello", slides: ["One", "Two"], label: (count) => `${count} slides` } };
  const keys = flattenKeys(source);

  assert.deepEqual(keys, ["hero.title", "hero.slides"]);
  for (const key of keys) assert.notEqual(getPath(source, key), undefined);

  const updated = structuredClone({ hero: { slides: source.hero.slides } });
  setPath(updated, "hero.slides", ["New"]);
  assert.deepEqual(updated.hero.slides, ["New"]);
});

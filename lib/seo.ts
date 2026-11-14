import "server-only";
import type { Metadata } from "next";
import { getContentOverrides } from "./portfolioApi";
import { applyOverrides } from "./contentOverrides";

// Merge DB "seo" scope overrides (key = dot path into Metadata, locale ""
// or "en") over the page's code-default metadata.
export async function getSeoMetadata(page: string, defaults: Metadata): Promise<Metadata> {
  const overrides = await getContentOverrides();
  const scoped = overrides
    .filter((o) => o.scope === "seo" && (o.locale === "" || o.locale === "en") && o.key.startsWith(`${page}.`))
    .map((o) => ({ ...o, key: o.key.slice(page.length + 1) }));
  return applyOverrides(defaults, scoped, "seo", "en");
}

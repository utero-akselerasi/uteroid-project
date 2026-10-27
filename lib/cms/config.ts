import "server-only";

// ─────────────────────────────────────────────
// CMS Artikel — Public Read API configuration
// ─────────────────────────────────────────────
// Public Read API only. The Automation API (POST, x-api-key,
// supabase.carubra.com) is a different service and is NOT used here.

/**
 * Category slugs pulled into /insights.
 *
 * The Public Read API has no `GET /api/v1/categories` endpoint, and
 * `category` is a required query parameter — so this list cannot be
 * discovered at runtime. Add new slugs by hand when the CMS gains a
 * category that should appear on this site. A slug that does not exist
 * returns `200` with an empty array, not an error, so typos are silent.
 */
export const CMS_CATEGORY_SLUGS = ["insights", "new", "global"] as const;

/** Max allowed by the API. Anything above is silently clamped to 50. */
export const CMS_MAX_LIMIT = 50;

/**
 * Seconds to cache list/detail responses.
 *
 * Must stay well under 3600: every image URL the API returns is a signed
 * URL that expires after one hour. Caching longer than that serves dead
 * images. Next 16 does not cache fetch by default, so this is opt-in.
 *
 * The `export const revalidate` in app/insights/[slug]/page.tsx must
 * match this value. Next reads segment config statically and rejects
 * an imported constant — change both together.
 */
export const CMS_REVALIDATE_SECONDS = 300;

export interface CmsEnv {
  baseUrl: string;
  apiKey: string;
}

/**
 * Reads credentials from the server environment.
 *
 * Returns null instead of throwing when unset: a missing key is a valid
 * state (local dev, first deploy) and the caller falls back to
 * lib/insights.ts rather than breaking the page.
 */
export function readCmsEnv(): CmsEnv | null {
  const baseUrl = process.env.ARTIKEL_API_URL?.trim();
  const apiKey = process.env.ARTIKEL_API_KEY?.trim();

  if (!baseUrl || !apiKey) return null;

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

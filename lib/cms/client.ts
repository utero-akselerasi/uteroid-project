import "server-only";
import { cache } from "react";
import {
  CMS_MAX_LIMIT,
  CMS_REVALIDATE_SECONDS,
  readCmsEnv,
} from "./config";
import type {
  CmsArticleDetail,
  CmsArticleListItem,
  CmsDetailResponse,
  CmsErrorCode,
  CmsListResponse,
} from "./types";

// ─────────────────────────────────────────────
// CMS Artikel — server-only fetch client
// ─────────────────────────────────────────────
// The API key is a backend secret. It must never reach the browser: no
// NEXT_PUBLIC_ prefix, no query string, no log line. `server-only` makes
// importing this from a Client Component a build error.

export class CmsError extends Error {
  readonly status: number;
  readonly code: CmsErrorCode;
  /** Seconds to wait, from `Retry-After`, when the code is RATE_LIMITED. */
  readonly retryAfter: number | null;

  constructor(
    status: number,
    code: CmsErrorCode,
    message: string,
    retryAfter: number | null = null,
  ) {
    super(message);
    this.name = "CmsError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

/** Marks that no credentials are configured — callers fall back silently. */
export class CmsNotConfiguredError extends Error {
  constructor() {
    super("ARTIKEL_API_URL / ARTIKEL_API_KEY are not set");
    this.name = "CmsNotConfiguredError";
  }
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

async function toCmsError(response: Response): Promise<CmsError> {
  let code: CmsErrorCode = "UNKNOWN";
  let message = `HTTP ${response.status}`;

  try {
    const body: unknown = await response.json();
    const error = (body as { error?: unknown }).error;
    // Public Read API nests its error; be defensive in case a proxy
    // in front of it returns the flat Automation-style shape instead.
    if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object") {
      const nested = error as { code?: unknown; message?: unknown };
      if (typeof nested.code === "string") code = nested.code as CmsErrorCode;
      if (typeof nested.message === "string") message = nested.message;
    }
  } catch {
    // Non-JSON body (gateway HTML page, empty 502). Keep the status.
  }

  if (code === "UNKNOWN" && response.status === 429) code = "RATE_LIMITED";

  return new CmsError(
    response.status,
    code,
    message,
    parseRetryAfter(response.headers.get("retry-after")),
  );
}

async function cmsFetch<T>(path: string, query: URLSearchParams): Promise<T> {
  const env = readCmsEnv();
  if (!env) throw new CmsNotConfiguredError();

  const url = `${env.baseUrl}${path}?${query.toString()}`;

  const response = await fetch(url, {
    headers: {
      "x-artikel-key": env.apiKey,
      accept: "application/json",
    },
    // Next 16 does not cache fetch by default. Opt in explicitly, and stay
    // under the 3600s signed-image-URL lifetime.
    next: { revalidate: CMS_REVALIDATE_SECONDS },
  });

  if (!response.ok) throw await toCmsError(response);

  return (await response.json()) as T;
}

/** The API rejects non-integer values (`limit=10.5` → 400), so coerce hard. */
function toPositiveInt(value: number, fallback: number, max?: number): number {
  const int = Math.trunc(value);
  if (!Number.isFinite(int) || int < 1) return fallback;
  return max !== undefined ? Math.min(int, max) : int;
}

export interface ListArticlesOptions {
  /** Category **slug** as stored in the CMS — not a display name. */
  category: string;
  page?: number;
  limit?: number;
}

/**
 * One page of published articles for a category.
 *
 * `category` is validated before auth, so a 400 here proves nothing about
 * the key. An unknown slug returns `200` with an empty array.
 */
export const listArticles = cache(
  async ({
    category,
    page = 1,
    limit = CMS_MAX_LIMIT,
  }: ListArticlesOptions): Promise<CmsListResponse> => {
    const query = new URLSearchParams({
      category,
      page: String(toPositiveInt(page, 1)),
      limit: String(toPositiveInt(limit, CMS_MAX_LIMIT, CMS_MAX_LIMIT)),
    });

    const payload = await cmsFetch<CmsListResponse>("/articles", query);

    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      meta: payload?.meta ?? { page, limit, total: 0 },
    };
  },
);

/** All articles for a category, following pagination to the end. */
export const listAllArticles = cache(
  async (category: string): Promise<CmsArticleListItem[]> => {
    const collected: CmsArticleListItem[] = [];
    let page = 1;

    // Bounded so a wrong `total` cannot spin us into the rate limit.
    const maxPages = 10;

    while (page <= maxPages) {
      const { data, meta } = await listArticles({
        category,
        page,
        limit: CMS_MAX_LIMIT,
      });
      collected.push(...data);

      if (data.length === 0 || collected.length >= (meta.total ?? 0)) break;
      page += 1;
    }

    return collected;
  },
);

/** Single article by slug. Returns null on `404`; other errors propagate. */
export const getArticle = cache(
  async (slug: string): Promise<CmsArticleDetail | null> => {
    try {
      const payload = await cmsFetch<CmsDetailResponse>(
        `/articles/${encodeURIComponent(slug)}`,
        new URLSearchParams(),
      );
      return payload?.data ?? null;
    } catch (error) {
      if (error instanceof CmsError && error.status === 404) return null;
      throw error;
    }
  },
);

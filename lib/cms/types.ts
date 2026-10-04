// ─────────────────────────────────────────────
// CMS Artikel — Public Read API response shapes
// ─────────────────────────────────────────────
// Mirrors the wire format exactly, including its quirks. Do not "tidy"
// these shapes: the nesting below is what the API actually sends.

/** A tag row, reached through the double-nested `article_tags[i].tags`. */
export interface CmsTagRef {
  tags: { name: string; slug: string } | null;
}

export interface CmsCategory {
  name: string;
  slug: string;
}

/** Article as it appears in `GET /articles?category=…`. */
export interface CmsArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  /** Signed URL — expires after 3600s. Never persist or put in a sitemap. */
  featured_image_url: string | null;
  category: CmsCategory | null;
  article_tags?: CmsTagRef[] | null;
}

/** Unknown `addon_type` values must be skipped, not treated as an error. */
export interface CmsAddon {
  addon_type: string;
  [key: string]: unknown;
}

/** Article as it appears in `GET /articles/{slug}`. */
export interface CmsArticleDetail extends CmsArticleListItem {
  /** HTML from the CMS editor. Sanitize before rendering. */
  content: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  /** Signed URL — same 3600s expiry as featured_image_url. */
  og_image_url?: string | null;
  /**
   * Detail responses carry both `category` and `categories` with the same
   * contents. `category` is the one to read.
   */
  categories?: CmsCategory | null;
  addons?: CmsAddon[] | null;
}

export interface CmsListMeta {
  page: number;
  limit: number;
  total: number;
}

export interface CmsListResponse {
  data: CmsArticleListItem[];
  meta: CmsListMeta;
}

export interface CmsDetailResponse {
  data: CmsArticleDetail;
}

/** Public Read API errors are nested: `{"error":{"code","message"}}`. */
export interface CmsErrorResponse {
  error: { code: string; message: string };
}

export type CmsErrorCode =
  | "INVALID_API_KEY"
  | "SITE_INACTIVE"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVER_CONFIGURATION_ERROR"
  | "VALIDATION_ERROR"
  | "UNKNOWN";

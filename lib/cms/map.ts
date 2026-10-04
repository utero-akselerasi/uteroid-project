import type { Insight } from "../types";
import type { CmsArticleDetail, CmsArticleListItem } from "./types";

// ─────────────────────────────────────────────
// CMS article → UI Insight
// ─────────────────────────────────────────────
// The UI reads `Insight` everywhere. CMS field names differ and it has no
// read-time field at all, so that is derived here.

/** Matches the existing local insights: "March 2024". */
function formatDate(publishedAt: string | null): string {
  if (!publishedAt) return "";
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Rough word count from HTML, at ~200 wpm. The CMS does not supply this. */
function estimateReadTime(html: string | null | undefined): string {
  if (!html) return "1 min read";
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function firstNonEmpty(...values: (string | null | undefined)[]): string {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return "";
}

export function mapListItem(article: CmsArticleListItem): Insight {
  return {
    slug: article.slug,
    title: article.title,
    // Display label uses the category NAME; only requests use the slug.
    category: firstNonEmpty(article.category?.name, "Insights"),
    date: formatDate(article.published_at),
    readTime: "",
    excerpt: firstNonEmpty(article.excerpt),
    coverImage: article.featured_image_url ?? undefined,
  };
}

export function mapDetail(article: CmsArticleDetail): Insight {
  return {
    ...mapListItem(article),
    readTime: estimateReadTime(article.content),
    content: article.content ?? "",
  };
}

/** Tag names, flattened out of the double-nested `article_tags[i].tags`. */
export function mapTags(article: CmsArticleListItem): string[] {
  if (!Array.isArray(article.article_tags)) return [];
  return article.article_tags
    .map((entry) => entry?.tags?.name)
    .filter((name): name is string => Boolean(name));
}

/** Newest first; articles with no publish date sort last. */
export function sortByPublishedDesc(
  articles: CmsArticleListItem[],
): CmsArticleListItem[] {
  return [...articles].sort((a, b) => {
    const left = a.published_at ? Date.parse(a.published_at) : 0;
    const right = b.published_at ? Date.parse(b.published_at) : 0;
    return right - left;
  });
}

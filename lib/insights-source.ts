import "server-only";
import fs from "fs";
import path from "path";
import type { Insight } from "./types";
import {
  getAllInsightSlugs as getLocalInsightSlugs,
  getInsightBySlug as getLocalInsightBySlug,
  insights as localInsights,
} from "./insights";
import { CMS_CATEGORY_SLUGS } from "./cms/config";

function getFallbackInsights(): Insight[] {
  try {
    const file = path.join(process.cwd(), "data", "site-settings.json");
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (Array.isArray(data.insights?.articles) && data.insights.articles.length > 0) {
        return data.insights.articles;
      }
    }
  } catch {}
  return localInsights;
}
import {
  CmsNotConfiguredError,
  getArticle,
  listAllArticles,
} from "./cms/client";
import { mapDetail, mapListItem, sortByPublishedDesc } from "./cms/map";
import { sanitizeArticleHtml } from "./cms/sanitize";

// ─────────────────────────────────────────────
// Insights source — CMS primary, local fallback
// ─────────────────────────────────────────────
// The CMS is the real source of articles. The four hardcoded entries in
// lib/insights.ts stay as a fallback so /insights still renders when the
// CMS is unreachable or ARTIKEL_API_KEY is unset. Once the CMS returns
// articles, the local data is not used at all.
//
// Do not delete lib/insights.ts as dead code, and do not replace the
// fallback with a throw — /insights is a public page, not a dashboard.

export type InsightsOrigin = "cms" | "local";

export interface InsightsResult {
  insights: Insight[];
  origin: InsightsOrigin;
}

/** CMS failures degrade to the fallback; they are logged, never displayed. */
function logCmsFailure(context: string, error: unknown): void {
  if (error instanceof CmsNotConfiguredError) {
    // Expected in local dev before the key is provisioned. Not an error.
    return;
  }
  // Error `message` values are for developer logs only — never rendered.
  console.error(`[insights] CMS ${context} failed, using local fallback:`, error);
}

export async function getInsights(): Promise<InsightsResult> {
  try {
    const articles = (
      await Promise.all(
        CMS_CATEGORY_SLUGS.map((slug) => listAllArticles(slug)),
      )
    ).flat();

    if (articles.length > 0) {
      return {
        insights: sortByPublishedDesc(articles).map(mapListItem),
        origin: "cms",
      };
    }
  } catch (error) {
    logCmsFailure("list", error);
  }

  return { insights: getFallbackInsights(), origin: "local" };
}

export interface InsightDetail {
  insight: Insight;
  origin: InsightsOrigin;
  /** Sanitized HTML, present only for CMS articles. */
  contentHtml?: string;
}

export async function getInsight(slug: string): Promise<InsightDetail | null> {
  try {
    const article = await getArticle(slug);
    if (article) {
      return {
        insight: mapDetail(article),
        origin: "cms",
        contentHtml: sanitizeArticleHtml(article.content),
      };
    }
  } catch (error) {
    logCmsFailure(`detail "${slug}"`, error);
  }

  const fallback = getFallbackInsights();
  const local = fallback.find((i) => i.slug === slug) || getLocalInsightBySlug(slug);
  return local ? { insight: local, origin: "local" } : null;
}

/**
 * Slugs for generateStaticParams.
 *
 * Local slugs are always included so the fallback articles keep working;
 * CMS slugs are added when reachable at build time. Pages for slugs not
 * listed here are still rendered on demand.
 */
export async function getInsightSlugs(): Promise<string[]> {
  const fallback = getFallbackInsights();
  const slugs = new Set([...getLocalInsightSlugs(), ...fallback.map((i) => i.slug)]);

  try {
    for (const category of CMS_CATEGORY_SLUGS) {
      for (const article of await listAllArticles(category)) {
        slugs.add(article.slug);
      }
    }
  } catch (error) {
    logCmsFailure("slug list", error);
  }

  return [...slugs];
}

export function getInsightsHeader(): { headerTitle: string; headerDescription: string; headerTag: string } {
  try {
    const file = path.join(process.cwd(), "data", "site-settings.json");
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (data.insights) {
        return {
          headerTitle: data.insights.headerTitle || "Insights",
          headerDescription:
            data.insights.headerDescription ||
            "Critical perspectives, case reflections, and design philosophies on branding, spatial environments, and physical realization.",
          headerTag: data.insights.headerTag || "04 / PUBLICATIONS & PERSPECTIVES",
        };
      }
    }
  } catch {}
  return {
    headerTitle: "Insights",
    headerDescription:
      "Critical perspectives, case reflections, and design philosophies on branding, spatial environments, and physical realization.",
    headerTag: "04 / PUBLICATIONS & PERSPECTIVES",
  };
}

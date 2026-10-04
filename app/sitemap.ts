import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/projects";
import { getAllServiceSlugs } from "@/lib/services";
import { getInsights } from "@/lib/insights-source";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { insights } = await getInsights();
  const paths = [
    "",
    "/work",
    "/services",
    "/services/indoor",
    "/services/space",
    "/studio",
    "/insights",
    "/contact",
    ...getAllSlugs().map((slug) => `/work/${slug}`),
    ...getAllServiceSlugs().map((slug) => `/services/${slug}`),
    ...insights.map(({ slug }) => `/insights/${slug}`),
  ];

  return [...new Set(paths)].map((path) => ({
    url: `https://utero.id${path}`,
  }));
}

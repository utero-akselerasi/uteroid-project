import type { Metadata } from "next";
import { getInsights, getInsightsHeader } from "@/lib/insights-source";
import InsightsContent from "@/components/InsightsContent";

export const metadata: Metadata = {
  title: "Insights & Media — Perspectives from Utero",
  description:
    "Critical reflections, case perspectives, and studio philosophies on branding, environmental spatial design, and execution.",
  openGraph: {
    type: "website",
    title: "Insights & Media — Perspectives from Utero",
    description:
      "Critical reflections, case perspectives, and studio philosophies on branding, environmental spatial design, and execution.",
    url: "https://utero.id/insights",
    images: [
      {
        url: "/img/unnamed.webp",
        width: 1280,
        height: 720,
        alt: "Utero Insights & Perspectives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Media — Perspectives from Utero",
    description:
      "Critical reflections, case perspectives, and studio philosophies on branding, environmental spatial design, and execution.",
    images: ["/img/unnamed.webp"],
  },
  alternates: {
    canonical: "/insights",
  },
};

export default async function InsightsPage() {
  // CMS is the source of truth; lib/insights.ts is the fallback when the
  // CMS is unreachable or unconfigured. See lib/insights-source.ts.
  const { insights } = await getInsights();
  const header = getInsightsHeader();

  return <InsightsContent insights={insights} header={header} />;
}

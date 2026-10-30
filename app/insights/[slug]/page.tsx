import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInsight, getInsightSlugs } from "@/lib/insights-source";
import JsonLd from "@/components/JsonLd";
import InsightArticleContent from "@/components/InsightArticleContent";

// Route-level ISR — see the note in app/insights/page.tsx. Literal, not an
// imported constant: segment config is read statically.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getInsight(slug);

  if (!result) {
    return { title: "Article Not Found" };
  }

  const { insight: article, origin } = result;
  const pageTitle = article.title + " — Insights";
  const stableCoverImage =
    origin === "local" ? article.coverImage || "/img/unnamed.webp" : undefined;
  const articleUrl = "https://utero.id/insights/" + article.slug;

  return {
    title: pageTitle,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: pageTitle,
      description: article.excerpt,
      url: articleUrl,
      ...(stableCoverImage ? { images: [{ url: stableCoverImage, alt: article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: article.excerpt,
      ...(stableCoverImage ? { images: [stableCoverImage] } : {}),
    },
    alternates: { canonical: "/insights/" + article.slug },
  };
}

export default async function InsightsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getInsight(slug);

  if (!result) {
    notFound();
  }

  const { insight: article, origin, contentHtml } = result;
  const articleUrl = "https://utero.id/insights/" + article.slug;
  const articleImageUrl =
    origin === "local" && article.coverImage
      ? new URL(article.coverImage, "https://utero.id").toString()
      : undefined;
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://utero.id" },
          { "@type": "ListItem", position: 2, name: "Insights", item: "https://utero.id/insights" },
          { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
        ],
      },
      {
        "@type": "Article",
        "@id": articleUrl + "#article",
        headline: article.title,
        description: article.excerpt,
        ...(origin === "local" ? { articleBody: article.content } : {}),
        ...(articleImageUrl ? { image: articleImageUrl } : {}),
        author: { "@type": "Organization", name: "PT. Utero Kreatif Indonesia", url: "https://utero.id" },
        publisher: { "@type": "Organization", name: "PT. Utero Kreatif Indonesia", url: "https://utero.id", logo: "https://utero.id/icon.svg" },
        url: articleUrl,
        genre: article.category,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <InsightArticleContent article={article} origin={origin} contentHtml={contentHtml} />
    </>
  );
}

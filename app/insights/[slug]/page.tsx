import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getInsightBySlug, getAllInsightSlugs } from "@/lib/insights";
import RevealOnScroll, { RevealImage } from "@/components/RevealOnScroll";

export async function generateStaticParams() {
  const slugs = getAllInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${article.title} — Insights`,
    description: article.excerpt,
  };
}

export default async function InsightsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <section className="pt-28 md:pt-36 pb-24 bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page max-w-4xl">
        <RevealOnScroll>
          <Link
            href="/insights"
            data-cursor="BACK"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/50 hover:text-[#c91a1f] transition-colors mb-8"
          >
            <span>&larr;</span>
            Back to Insights
          </Link>
        </RevealOnScroll>

        {/* Article Header */}
        <RevealOnScroll delay={1}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
                {article.category} · {article.date} · {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#0a0a0a] mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl font-medium leading-relaxed text-black/80 pb-8 border-b border-black/10">
              {article.excerpt}
            </p>
          </div>
        </RevealOnScroll>

        {/* Article Cover Image */}
        {article.coverImage && (
          <RevealImage>
            <div
              className="relative w-full overflow-hidden bg-[#161616] border border-black/10 mb-12"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </RevealImage>
        )}

        {/* Article Content */}
        <RevealOnScroll delay={2}>
          <div className="space-y-6 text-base md:text-lg leading-relaxed text-black/85">
            <p>{article.content}</p>
            <p>
              At Utero, our commitment to rigorous execution means translating conceptual strategic insights directly into tangible brand artifacts, architectural wayfinding, and tactile packaging that endure in everyday human life.
            </p>
          </div>
        </RevealOnScroll>

        {/* Footer Link */}
        <RevealOnScroll>
          <div className="mt-16 pt-8 border-t border-black/10 flex justify-between items-center">
            <Link
              href="/insights"
              data-cursor="BACK"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-[#0a0a0a] pb-1 hover:text-[#c91a1f] hover:border-[#c91a1f] transition-colors"
            >
              <span>&larr;</span>
              All Articles
            </Link>

            <Link
              href="/contact"
              data-cursor="LET'S TALK"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-[#c91a1f] text-white px-6 py-3 hover:bg-[#0a0a0a] transition-colors"
            >
              Discuss With Us &rarr;
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

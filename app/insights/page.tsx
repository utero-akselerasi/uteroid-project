import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { insights } from "@/lib/insights";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Insights & Media",
  description: "Thoughts, design perspectives, and studio reflections from Utero Indonesia.",
};

export default function InsightsPage() {
  return (
    <section className="pt-28 md:pt-36 pb-24 bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page">
        <RevealOnScroll>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
              04 / PUBLICATIONS &amp; PERSPECTIVES
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={1}>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#0a0a0a] mb-6">
            MEDIA INSIGHTS.
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={2}>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mb-12">
            Critical reflections, case perspectives, and studio philosophies on branding, environmental spatial design, and execution.
          </p>
        </RevealOnScroll>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 border-t border-black/10 pt-12">
          {insights.map((article, idx) => (
            <RevealOnScroll key={article.slug} delay={idx % 2}>
              <Link
                href={`/insights/${article.slug}`}
                data-cursor="READ &rarr;"
                className="group block text-inherit no-underline"
              >
                <article>
                  <div
                    className="relative w-full overflow-hidden bg-[#161616] border border-black/10 mb-4"
                    style={{ aspectRatio: "16/10" }}
                  >
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1e1e1e]" />
                    )}
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-bold tracking-widest text-[#c91a1f] uppercase">
                      {article.category}
                    </span>
                    <span className="text-xs text-black/50">
                      {article.date} · {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-tight text-[#0a0a0a] group-hover:text-[#c91a1f] transition-colors mb-2">
                    {article.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-black/70">
                    {article.excerpt}
                  </p>
                </article>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

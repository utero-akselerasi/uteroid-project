import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getInsightBySlug, getAllInsightSlugs } from "@/lib/insights";

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
    <>
      <style>{`
        .ins-back:hover { color: #c91a1f !important; }
        .ins-cta:hover { background-color: #0a0a0a !important; }
        .ins-all:hover { color: #c91a1f !important; border-color: #c91a1f !important; }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(6rem, 10vw, 9rem)",
          paddingBottom: "clamp(4rem, 8vw, 8rem)",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          color: "#0a0a0a",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          }}
        >
          {/* ── Back Link ────────────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(2rem, 3.5vw, 3.5rem)" }}>
            <Link
              href="/insights"
              data-cursor="BACK"
              className="ins-back"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#555555",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              <span>←</span>
              <span>Back to Insights</span>
            </Link>
          </div>

          {/* ── Article Header ───────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(2.5rem, 4vw, 4rem)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  width: "1.5rem",
                  height: "1px",
                  backgroundColor: "#c91a1f",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                {article.category} · {article.date} · {article.readTime}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.035em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 1.05,
                margin: "0 0 1.5rem",
              }}
            >
              {article.title}
            </h1>

            <p
              style={{
                fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                lineHeight: 1.6,
                color: "#555555",
                margin: 0,
                paddingBottom: "2rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              {article.excerpt}
            </p>
          </div>

          {/* ── Article Cover Image ──────────────────────────────── */}
          {article.coverImage && (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                backgroundColor: "#f5f5f5",
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                marginBottom: "clamp(3rem, 5vw, 5rem)",
              }}
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* ── Article Body Typography ──────────────────────────── */}
          <div
            style={{
              fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
              lineHeight: 1.8,
              color: "#222222",
              marginBottom: "clamp(4rem, 6vw, 6rem)",
            }}
          >
            <p style={{ marginBottom: "1.75rem" }}>
              {article.content}
            </p>

            <blockquote
              style={{
                borderLeft: "2px solid #c91a1f",
                paddingLeft: "1.75rem",
                margin: "2.5rem 0",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 1.25,
              }}
            >
              &ldquo;Design is not cosmetic dressing; it is the visual architecture of organizational purpose.&rdquo;
            </blockquote>

            <p style={{ marginBottom: "1.75rem" }}>
              At Utero, our 25+ years in Indonesian creative production have taught us that strategy without rigorous execution is merely academic. When developing master spatial wayfinding for facilities like Malang Creative Center (MCC) or crafting packaging for retail distribution, attention to micro-tolerances separates lasting influence from fleeting trends.
            </p>

            <p style={{ margin: 0 }}>
              Enduring identity systems do not chase ephemeral aesthetic cycles. Instead, they calibrate contrast, typographic dignity, and material integrity to command unshakeable trust across all consumer touchpoints.
            </p>
          </div>

          {/* ── Bottom Action Bar ────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Link
              href="/insights"
              data-cursor="BACK"
              className="ins-all"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
                paddingBottom: "2px",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
            >
              ← All Articles
            </Link>

            <Link
              href="/contact"
              data-cursor="LET'S TALK"
              className="ins-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 2rem",
                backgroundColor: "#c91a1f",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Discuss With Our Studio →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

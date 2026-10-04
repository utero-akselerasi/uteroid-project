import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getInsight, getInsightSlugs } from "@/lib/insights-source";

// Route-level ISR — see the note in app/insights/page.tsx. Literal, not an
// imported constant: segment config is read statically.
export const revalidate = 300;

function articleTitleFontSize(title: string): string {
  const length = Array.from(title.trim()).length;
  if (length >= 120) return "clamp(1.5rem, 2.1vw, 2.25rem)";
  if (length >= 90) return "clamp(1.65rem, 2.6vw, 2.7rem)";
  if (length >= 65) return "clamp(1.85rem, 3.3vw, 3.3rem)";
  return "clamp(2.25rem, 5vw, 4.5rem)";
}

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

  // No openGraph image here on purpose: CMS image URLs are signed and
  // expire after an hour, so a crawled og:image would break.
  return {
    title: `${result.insight.title} — Insights`,
    description: result.insight.excerpt,
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

  return (
    <>
      <style>{`
        .ins-back:hover { color: #c91a1f !important; }
        .ins-cta:hover { background-color: #0a0a0a !important; }
        .ins-all:hover { color: #c91a1f !important; border-color: #c91a1f !important; }

        /* CMS article body — the HTML comes from the editor, so style by tag. */
        .ins-body > *:last-child { margin-bottom: 0; }
        .ins-body p { margin: 0 0 1.75rem; }
        .ins-body h2, .ins-body h3, .ins-body h4 {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.2;
          margin: 2.5rem 0 1rem;
        }
        .ins-body h2 { font-size: clamp(1.4rem, 2.2vw, 1.9rem); }
        .ins-body h3 { font-size: clamp(1.2rem, 1.8vw, 1.5rem); }
        .ins-body h4 { font-size: clamp(1.05rem, 1.5vw, 1.25rem); }
        .ins-body ul, .ins-body ol { margin: 0 0 1.75rem; padding-left: 1.5rem; }
        .ins-body li { margin-bottom: 0.5rem; }
        .ins-body a { color: #c91a1f; text-decoration: underline; }
        .ins-body strong, .ins-body b { font-weight: 700; }
        .ins-body img { max-width: 100%; height: auto; display: block; margin: 2rem 0; }
        .ins-body figure { margin: 2rem 0; }
        .ins-body figcaption {
          font-size: 0.8rem;
          color: #777777;
          letter-spacing: 0.04em;
          margin-top: 0.6rem;
        }
        .ins-body blockquote {
          border-left: 2px solid #c91a1f;
          padding-left: 1.75rem;
          margin: 2.5rem 0;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.25;
        }
        .ins-body pre {
          background-color: #f4f4f4;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 0 0 1.75rem;
          font-size: 0.875rem;
        }
        .ins-body code { font-family: ui-monospace, monospace; font-size: 0.9em; }
        .ins-body hr { border: 0; border-top: 1px solid #e5e5e5; margin: 3rem 0; }
        .ins-body table { width: 100%; border-collapse: collapse; margin: 0 0 1.75rem; font-size: 0.9rem; }
        .ins-body th, .ins-body td { border: 1px solid #e5e5e5; padding: 0.6rem 0.8rem; text-align: left; }
        .ins-body th { font-weight: 700; background-color: #fafafa; }
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
                {[article.category, article.date, article.readTime]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: articleTitleFontSize(article.title),
                fontWeight: 900,
                letterSpacing: "-0.035em",
                textTransform: "uppercase",
                textWrap: "balance",
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
            {origin === "cms" ? (
              // Sanitized in lib/cms/sanitize.ts before it reaches here.
              <div
                className="ins-body"
                dangerouslySetInnerHTML={{ __html: contentHtml ?? "" }}
              />
            ) : (
              <>
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
              </>
            )}
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

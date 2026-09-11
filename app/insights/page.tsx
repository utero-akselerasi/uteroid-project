import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { insights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights & Media — Perspectives from Utero",
  description:
    "Critical reflections, case perspectives, and studio philosophies on branding, environmental spatial design, and execution.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
        {children}
      </span>
    </div>
  );
}

export default function InsightsPage() {
  const [featured, ...rest] = insights;

  return (
    <>
      <style>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        .insight-card:hover h2, .insight-card:hover h3 { color: #c91a1f !important; transform: translateX(4px); }
        .insight-card:hover img { transform: scale(1.04); }
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
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          }}
        >
          {/* ── Header ───────────────────────────────────────────── */}
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
              marginBottom: "clamp(3.5rem, 6vw, 6rem)",
            }}
          >
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
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#c91a1f",
                  borderRadius: "50%",
                  animation: "pulse-red 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                04 / PUBLICATIONS &amp; PERSPECTIVES
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "1.5rem",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 0.92,
                    margin: 0,
                  }}
                >
                  Insights
                </h1>
                <p
                  style={{
                    marginTop: "1.25rem",
                    fontSize: "clamp(0.85rem, 1vw, 1.05rem)",
                    color: "#555555",
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                    maxWidth: "520px",
                  }}
                >
                  Critical perspectives, case reflections, and design philosophies on branding, spatial environments, and physical realization.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "rgba(0, 0, 0, 0.06)",
                    lineHeight: 1,
                  }}
                >
                  {String(insights.length).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10, 10, 10, 0.35)",
                  }}
                >
                  Articles
                </span>
              </div>
            </div>
          </div>

          {/* ── Featured Lead Essay ──────────────────────────────── */}
          {featured && (
            <div style={{ marginBottom: "clamp(4rem, 7vw, 7rem)" }}>
              <SectionLabel>Featured Publication</SectionLabel>

              <Link
                href={`/insights/${featured.slug}`}
                data-cursor="READ ESSAY →"
                className="insight-card"
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gap: "clamp(1.5rem, 4vw, 4rem)",
                    alignItems: "center",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    padding: "clamp(1.5rem, 3vw, 3rem)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {/* Left: Metadata & Headline */}
                  <div style={{ gridColumn: "span 12" }} className="lg:!col-span-6">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#c91a1f",
                          color: "#ffffff",
                          padding: "3px 10px",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        {featured.category}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#555555",
                          fontWeight: 600,
                        }}
                      >
                        {featured.date} · {featured.readTime}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        textTransform: "uppercase",
                        color: "#0a0a0a",
                        lineHeight: 1.08,
                        margin: "0 0 1.25rem",
                        transition: "color 0.25s ease, transform 0.25s ease",
                      }}
                    >
                      {featured.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                        lineHeight: 1.65,
                        color: "#555555",
                        margin: "0 0 1.5rem",
                      }}
                    >
                      {featured.excerpt}
                    </p>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#c91a1f",
                      }}
                    >
                      <span>Read Essay</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Right: Image */}
                  <div style={{ gridColumn: "span 12" }} className="lg:!col-span-6">
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/10",
                        backgroundColor: "#f5f5f5",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      {featured.coverImage && (
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 600px"
                          style={{
                            objectFit: "cover",
                            transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── More Perspectives Grid ───────────────────────────── */}
          {rest.length > 0 && (
            <div style={{ marginBottom: "clamp(4rem, 7vw, 7rem)" }}>
              <SectionLabel>More Perspectives</SectionLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "clamp(1.5rem, 3vw, 3rem)",
                }}
              >
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/insights/${article.slug}`}
                    data-cursor="READ →"
                    className="insight-card"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <article>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16/10",
                          backgroundColor: "#f5f5f5",
                          overflow: "hidden",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          marginBottom: "1.25rem",
                        }}
                      >
                        {article.coverImage && (
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          />
                        )}
                        <div
                          style={{
                            position: "absolute",
                            top: "1rem",
                            left: "1rem",
                            backgroundColor: "#c91a1f",
                            color: "#ffffff",
                            padding: "3px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                          }}
                        >
                          {article.category}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.72rem",
                          color: "rgba(10, 10, 10, 0.4)",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "1.35rem",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          textTransform: "uppercase",
                          color: "#0a0a0a",
                          lineHeight: 1.15,
                          margin: "0 0 0.6rem",
                          transition: "color 0.25s ease, transform 0.25s ease",
                        }}
                      >
                        {article.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          color: "#555555",
                          margin: 0,
                        }}
                      >
                        {article.excerpt}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom Section ───────────────────────────────────── */}
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
              href="/work"
              data-cursor="VIEW WORKS"
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
              }}
            >
              ← Explore Portfolio Works
            </Link>

            <Link
              href="/contact"
              data-cursor="CONTACT"
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
              }}
            >
              Connect with Studio →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

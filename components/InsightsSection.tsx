"use client";

import Link from "next/link";
import Image from "next/image";
import { insights } from "@/lib/insights";
import RevealOnScroll from "./RevealOnScroll";

export default function InsightsSection() {
  const displayInsights = insights.slice(0, 3);

  return (
    <section
      id="insights"
      style={{
        padding: "clamp(5rem, 9vw, 8.5rem) 0",
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1.5rem",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
            borderBottom: "1px solid rgba(10, 10, 10, 0.12)",
            paddingBottom: "1.5rem",
          }}
        >
          <div>
            <RevealOnScroll>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#e31e24",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#e31e24",
                  }}
                >
                  05 / MEDIA &amp; PUBLICATIONS
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1}>
              <h2
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                MEDIA INSIGHTS
              </h2>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={2}>
            <Link
              href="/insights"
              data-cursor="OPEN"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                borderBottom: "2px solid #e31e24",
                paddingBottom: "4px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e31e24";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#0a0a0a";
              }}
            >
              <span>VIEW ALL ARTICLES</span>
              <span>&rarr;</span>
            </Link>
          </RevealOnScroll>
        </div>

        {/* ─── EDITORIAL PUBLICATION GRID ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          {displayInsights.map((article, idx) => (
            <RevealOnScroll key={article.slug} delay={idx + 1}>
              <Link
                href={`/insights/${article.slug}`}
                data-cursor="READ &rarr;"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  height: "100%",
                }}
              >
                <article
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    borderTop: "1px solid rgba(10, 10, 10, 0.12)",
                    paddingTop: "1.5rem",
                  }}
                >
                  {/* Article Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/10",
                      backgroundColor: "#f5f5f5",
                      overflow: "hidden",
                      marginBottom: "1.25rem",
                      borderRadius: "2px",
                      border: "1px solid rgba(10, 10, 10, 0.06)",
                    }}
                  >
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{
                          objectFit: "cover",
                          transition:
                            "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                    )}
                  </div>

                  {/* Metadata Bar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#e31e24",
                      }}
                    >
                      {article.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(10, 10, 10, 0.5)",
                      }}
                    >
                      {article.date} &bull; {article.readTime}
                    </span>
                  </div>

                  {/* Article Title */}
                  <h3
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(1.15rem, 1.6vw, 1.45rem)",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                      color: "#0a0a0a",
                      margin: "0 0 0.75rem",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      color: "rgba(10, 10, 10, 0.65)",
                      margin: "0 0 1.5rem",
                      flexGrow: 1,
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Read Link */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#e31e24",
                    }}
                  >
                    <span>READ ARTICLE</span>
                    <span>&rarr;</span>
                  </div>
                </article>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
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
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
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
                    backgroundColor: "#c91a1f",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
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
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  lineHeight: 1,
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
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#ffffff",
                textDecoration: "none",
                borderBottom: "2px solid #c91a1f",
                paddingBottom: "2px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#c91a1f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ffffff";
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
                    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                    paddingTop: "1.5rem",
                  }}
                >
                  {/* Article Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/10",
                      backgroundColor: "#161616",
                      overflow: "hidden",
                      marginBottom: "1.5rem",
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
                          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease",
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#1e1e1e" }} />
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
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#c91a1f",
                      }}
                    >
                      {article.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      {article.date} · {article.readTime}
                    </span>
                  </div>

                  {/* Article Title */}
                  <h3
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(1.25rem, 1.8vw, 1.6rem)",
                      fontWeight: 800,
                      lineHeight: 1.25,
                      letterSpacing: "-0.02em",
                      color: "#ffffff",
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
                      color: "rgba(255, 255, 255, 0.65)",
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
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#c91a1f",
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

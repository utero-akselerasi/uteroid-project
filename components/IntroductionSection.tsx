"use client";

import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

export default function IntroductionSection() {
  return (
    <section
      id="about"
      style={{
        padding: "clamp(4.5rem, 8vw, 7.5rem) 0",
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        {/* Section Tag */}
        <RevealOnScroll>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "clamp(2rem, 3.5vw, 3rem)",
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
              01 / ABOUT UTERO INDONESIA
            </span>
          </div>
        </RevealOnScroll>

        {/* Large Editorial Headline */}
        <div style={{ marginBottom: "clamp(2.5rem, 4vw, 4rem)" }}>
          <RevealOnScroll delay={1}>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.6rem)",
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                textTransform: "none",
                color: "#0a0a0a",
                maxWidth: "1150px",
              }}
            >
              A comprehensive branding and design company delivering strategic identity,
              distinctive media, and real-world execution.
            </h2>
          </RevealOnScroll>
        </div>

        {/* Grid: Text & Visual Showcase featuring desain.png */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 5rem)",
            alignItems: "center",
            borderTop: "1px solid rgba(10, 10, 10, 0.12)",
            paddingTop: "clamp(2rem, 3.5vw, 3.5rem)",
          }}
        >
          {/* Column 1: Clean, concise text */}
          <div>
            <RevealOnScroll delay={2}>
              <h3
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#e31e24",
                  marginBottom: "1rem",
                }}
              >
                BRAND CONSULTANT &bull; CREATIVE AGENCY
              </h3>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  lineHeight: 1.6,
                  color: "rgba(10, 10, 10, 0.8)",
                  marginBottom: "1.5rem",
                }}
              >
                Since 1998, Utero has built iconic visual identities, product packaging,
                and environmental spaces for industry leaders across Indonesia. We bridge
                creative vision and functional commercial reality.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={3}>
              <p
                style={{
                  fontSize: "clamp(0.9rem, 1.05vw, 1rem)",
                  lineHeight: 1.6,
                  color: "rgba(10, 10, 10, 0.65)",
                  marginBottom: "2rem",
                }}
              >
                Every solution we produce is engineered for longevity &mdash; balancing
                aesthetic distinction with measurable business impact.
              </p>

              <Link
                href="/studio"
                data-cursor="OPEN"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  textDecoration: "none",
                  borderBottom: "2px solid #e31e24",
                  paddingBottom: "4px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e31e24";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#0a0a0a";
                }}
              >
                <span>EXPLORE STUDIO STORY</span>
                <span>&rarr;</span>
              </Link>
            </RevealOnScroll>
          </div>

          {/* Column 2: Visual Showcase featuring desain.png */}
          <div>
            <RevealOnScroll delay={3}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "2px",
                  overflow: "hidden",
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(10, 10, 10, 0.08)",
                  backgroundColor: "#f9f9f9",
                  aspectRatio: "16 / 10",
                }}
              >
                <Image
                  src="/img/desain.png"
                  alt="Utero Design Work and Portfolio Publications"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.75rem",
                  fontSize: "0.75rem",
                  color: "rgba(10, 10, 10, 0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                <span>STUDIO ARCHIVE &bull; EDITORIAL CATALOG</span>
                <span style={{ color: "#e31e24", fontWeight: 600 }}>VOL. 1998&mdash;2026</span>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Editorial Metadata Strip */}
        <RevealOnScroll delay={4}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.5rem",
              marginTop: "clamp(3rem, 4.5vw, 4rem)",
              backgroundColor: "#fbfbfb",
              padding: "clamp(1.5rem, 2.5vw, 2.25rem)",
              border: "1px solid rgba(10, 10, 10, 0.08)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                  fontWeight: 700,
                  color: "#e31e24",
                  lineHeight: 1,
                }}
              >
                25+
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(10, 10, 10, 0.6)",
                  marginTop: "0.4rem",
                }}
              >
                Years Experience
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                  fontWeight: 700,
                  color: "#0a0a0a",
                  lineHeight: 1,
                }}
              >
                500+
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(10, 10, 10, 0.6)",
                  marginTop: "0.4rem",
                }}
              >
                Brand Projects
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                  fontWeight: 700,
                  color: "#0a0a0a",
                  lineHeight: 1,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(10, 10, 10, 0.6)",
                  marginTop: "0.4rem",
                }}
              >
                Execution Driven
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                  fontWeight: 700,
                  color: "#0a0a0a",
                  lineHeight: 1,
                }}
              >
                ID
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(10, 10, 10, 0.6)",
                  marginTop: "0.4rem",
                }}
              >
                National Reach
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function IntroductionSection() {
  return (
    <section
      id="about"
      style={{
        padding: "clamp(5rem, 9vw, 8rem) 0",
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
              marginBottom: "clamp(2rem, 4vw, 3.5rem)",
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
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c91a1f",
              }}
            >
              01 / ABOUT UTERO INDONESIA
            </span>
          </div>
        </RevealOnScroll>

        {/* Large Editorial Intro Statement */}
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <RevealOnScroll delay={1}>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.85rem, 3.8vw, 3.75rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                maxWidth: "1150px",
              }}
            >
              Welcome to Utero Indonesia, where creativity meets strategy to present design solutions, distinctive branding, and impactful communication. We turn bold vision into living reality.
            </h2>
          </RevealOnScroll>
        </div>

        {/* Two-Column Supporting Narrative & Metadata */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(2rem, 5vw, 5rem)",
            borderTop: "1px solid rgba(10, 10, 10, 0.12)",
            paddingTop: "clamp(2.5rem, 4vw, 4rem)",
          }}
        >
          {/* Column 1: Core positioning */}
          <RevealOnScroll delay={2}>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                marginBottom: "1.25rem",
              }}
            >
              BRAND CONSULTANT &amp; CREATIVE AGENCY
            </h3>
            <p
              style={{
                fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                lineHeight: 1.7,
                color: "rgba(10, 10, 10, 0.75)",
                margin: 0,
              }}
            >
              At Utero Indonesia, our dedicated team of strategists, designers, and innovators focus on building and developing client brands with consistent, targeted identity and sharp market positioning.
            </p>
          </RevealOnScroll>

          {/* Column 2: 25+ Years Experience & Impact */}
          <RevealOnScroll delay={3}>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                marginBottom: "1.25rem",
              }}
            >
              PROVEN TRACK RECORD &amp; BRAND EQUITY
            </h3>
            <p
              style={{
                fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                lineHeight: 1.7,
                color: "rgba(10, 10, 10, 0.75)",
                marginBottom: "2rem",
              }}
            >
              With more than 25 years of experience in the creative industry, a deep grasp of design principles, consumer psychology, and market trends, we are committed to helping organizations achieve their goals and increase brand equity.
            </p>

            <Link
              href="/studio"
              data-cursor="OPEN"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                borderBottom: "2px solid #c91a1f",
                paddingBottom: "3px",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#c91a1f";
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

        {/* Editorial Metadata Strip */}
        <RevealOnScroll delay={4}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.5rem",
              marginTop: "clamp(3rem, 5vw, 4.5rem)",
              backgroundColor: "#ffffff",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              border: "1px solid rgba(10, 10, 10, 0.08)",
            }}
          >
            <div>
              <div style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#c91a1f", lineHeight: 1 }}>
                25+
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(10, 10, 10, 0.6)", marginTop: "0.5rem" }}>
                Years Experience
              </div>
            </div>

            <div>
              <div style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>
                500+
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(10, 10, 10, 0.6)", marginTop: "0.5rem" }}>
                Brand Projects
              </div>
            </div>

            <div>
              <div style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>
                100%
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(10, 10, 10, 0.6)", marginTop: "0.5rem" }}>
                Execution Driven
              </div>
            </div>

            <div>
              <div style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>
                ID
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(10, 10, 10, 0.6)", marginTop: "0.5rem" }}>
                National Reach
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

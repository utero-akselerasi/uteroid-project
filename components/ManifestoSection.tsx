"use client";

import RevealOnScroll from "./RevealOnScroll";

export default function ManifestoSection() {
  return (
    <section
      id="philosophy"
      style={{
        padding: "clamp(6rem, 12vw, 10rem) 0",
        backgroundColor: "#c91a1f",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >


      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Section Label */}
        <RevealOnScroll>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                backgroundColor: "#ffffff",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              03 / PHILOSOPHY &amp; EXECUTION
            </span>
          </div>
        </RevealOnScroll>

        {/* Experience Header */}
        <RevealOnScroll delay={1}>
          <p
            style={{
              fontSize: "clamp(0.9rem, 1.3vw, 1.2rem)",
              fontWeight: 400,
              letterSpacing: "0.01em",
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: "850px",
              marginBottom: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.5,
            }}
          >
            With 25+ years of experience in the field of branding, marketing, and advertising, our core standard has remained resolute:
          </p>
        </RevealOnScroll>

        {/* ─── ICONIC GIANT TYPOGRAPHIC STATEMENT ─── */}
        <RevealOnScroll delay={2}>
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
              margin: "0 0 clamp(2rem, 4vw, 3rem)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "#ffffff",
                margin: 0,
              }}
            >
              IDE TANPA
              <br />
              REALISASI
              <br />
              <span style={{ color: "#ffffff" }}>
                SAMA DENGAN
              </span>
              <br />
              SAMPAH.
            </h2>
          </div>
        </RevealOnScroll>

        {/* Supporting Explanation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            alignItems: "flex-start",
          }}
        >
          <RevealOnScroll delay={3}>
            <p
              style={{
                fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.9)",
                margin: 0,
              }}
            >
              A concept remains sterile until it is brought to life with precision, craftsmanship, and unrelenting attention to detail. We do not just imagine possibilities — we engineer them into existence.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={4}>
            <div
              style={{
                backgroundColor: "#0a0a0a",
                padding: "clamp(1.5rem, 3vw, 2.25rem)",
                borderLeft: "4px solid #ffffff",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                  margin: "0 0 0.4rem",
                }}
              >
                UTERO STANDARD
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Design without execution is mere decoration. Execution without design is noise. We unite both to deliver authentic transformation.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

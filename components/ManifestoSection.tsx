"use client";

import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

export default function ManifestoSection() {
  return (
    <section
      id="philosophy"
      style={{
        padding: "clamp(6rem, 11vw, 9.5rem) 0",
        backgroundColor: "#e31e24",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Texture / Mockup Background using WhatsApp Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.16,
          mixBlendMode: "luminosity",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/img/WhatsApp Image 2026-09-12 at 4.38.10 PM.jpeg"
          alt="Utero Real-World Execution Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          sizes="100vw"
        />
      </div>

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
              marginBottom: "clamp(2rem, 4vw, 3rem)",
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
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.95)",
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
              fontSize: "clamp(0.95rem, 1.3vw, 1.2rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "850px",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: 1.5,
            }}
          >
            With 25+ years of real-world production in branding, marketing, and design, our core standard has remained resolute:
          </p>
        </RevealOnScroll>

        {/* ─── ICONIC GIANT TYPOGRAPHIC STATEMENT ─── */}
        <RevealOnScroll delay={2}>
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.25)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
              padding: "clamp(1.8rem, 3.5vw, 3rem) 0",
              margin: "0 0 clamp(2rem, 4vw, 3rem)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.1,
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
              <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
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
            alignItems: "center",
          }}
        >
          <RevealOnScroll delay={3}>
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.92)",
                margin: 0,
              }}
            >
              A concept remains sterile until it is brought to life with precision,
              craftsmanship, and unrelenting attention to detail. We do not just imagine
              possibilities &mdash; we engineer them into tangible reality.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={4}>
            <div
              style={{
                backgroundColor: "#0d0d0d",
                padding: "clamp(1.5rem, 3vw, 2.25rem)",
                borderLeft: "4px solid #ffffff",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#e31e24",
                  margin: "0 0 0.4rem",
                }}
              >
                UTERO STANDARD
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                Design without execution is mere decoration. Execution without design is noise.
                We unite both to deliver authentic transformation.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

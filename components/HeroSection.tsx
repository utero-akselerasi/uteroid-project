"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#c91a1f",
        color: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "clamp(5.5rem, 10vw, 8rem)",
        paddingBottom: "clamp(2rem, 4vw, 3.5rem)",
      }}
    >
      {/* ─── GEOMETRIC BACKGROUND SHAPES (PRESERVED ART DIRECTION) ─── */}
      <div
        style={{
          position: "absolute",
          width: "clamp(500px, 60vw, 950px)",
          height: "clamp(500px, 60vw, 950px)",
          borderRadius: "50%",
          backgroundColor: "rgba(120, 10, 15, 0.55)",
          top: "-12%",
          right: "-15%",
          pointerEvents: "none",
          transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: mounted ? "scale(1)" : "scale(0.85)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "clamp(400px, 45vw, 750px)",
          height: "clamp(400px, 45vw, 750px)",
          borderRadius: "50%",
          backgroundColor: "rgba(100, 8, 12, 0.5)",
          top: "18%",
          right: "4%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "clamp(300px, 35vw, 550px)",
          height: "clamp(300px, 35vw, 550px)",
          borderRadius: "50%",
          backgroundColor: "rgba(90, 6, 10, 0.45)",
          bottom: "-8%",
          right: "18%",
          pointerEvents: "none",
        }}
      />

      {/* ─── MAIN HERO CONTENT ─── */}
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top Eyebrow / Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
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
              fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            UTERO.ID — BRAND CONSULTANT &amp; CREATIVE AGENCY
          </span>
        </div>

        {/* ─── PRIMARY OVERSIZED TYPOGRAPHY ─── */}
        <div style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(3.2rem, 9.5vw, 9.5rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#ffffff",
              margin: 0,
            }}
          >
            {/* Line 1: DESIGN */}
            <div style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                }}
              >
                DESIGN
              </span>
            </div>

            {/* Line 2: AS A */}
            <div style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  fontWeight: 400,
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s",
                }}
              >
                AS A
              </span>
            </div>

            {/* Line 3: SOLUTION. */}
            <div style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  color: "#ffffff",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                }}
              >
                SOLUTION.
              </span>
            </div>
          </h1>
        </div>

        {/* Supporting Narrative & Capabilities Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            alignItems: "flex-end",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(25px)",
            transition: "opacity 0.9s ease 0.6s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          {/* Paragraph */}
          <div style={{ maxWidth: "480px" }}>
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.85)",
                margin: 0,
              }}
            >
              Professional design solutions for brands, products, spaces, and strategic communication. Transforming vision into impactful reality for over 25 years.
            </p>
          </div>

          {/* Capabilities Pill List */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: "0.5rem",
              }}
            >
              CORE CAPABILITIES
            </p>
            <p
              style={{
                fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "#ffffff",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Brand &nbsp;/&nbsp; Product &nbsp;/&nbsp; Promotion &nbsp;/&nbsp; Space &nbsp;/&nbsp; Digital &nbsp;/&nbsp; Indoor &nbsp;/&nbsp; Outdoor
            </p>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM HERO CONTROLS & SCROLL INDICATOR ─── */}
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          marginTop: "clamp(2rem, 4vw, 3rem)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}
      >
        {/* Link to Recent Work */}
        <Link
          href="#recent-works"
          data-cursor="EXPLORE"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
            paddingBottom: "4px",
            transition: "border-color 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderBottomColor = "#ffffff";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderBottomColor = "rgba(255, 255, 255, 0.4)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span>VIEW OUR WORK</span>
          <span style={{ fontSize: "1.1em" }}>&rarr;</span>
        </Link>

        {/* Scroll Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <span>SCROLL</span>
          <span
            style={{
              display: "inline-block",
              animation: "bounce 2s infinite ease-in-out",
            }}
          >
            &darr;
          </span>
        </div>
      </div>
    </section>
  );
}

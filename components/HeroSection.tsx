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
        height: "100vh",
        backgroundColor: "#B2192B",
        color: "#F7F2EC",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* MAIN CONTENT COLUMN - left 68% */}
      <div
        style={{
          position: "absolute",
          top: "4vh",
          left: 0,
          width: "68vw",
          maxWidth: "1000px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "4.3vw",
          paddingBottom: "70px",
          zIndex: 2,
        }}
      >
        {/* Top Label */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(15px)",
            transition:
              "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          <span
            style={{
              fontSize: "clamp(0.55rem, 0.85vw, 0.75rem)",
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#F7F2EC",
            }}
          >
            UTERO.ID — PROFESSIONAL DESIGN COMPANY
          </span>
        </div>

        {/* HEADLINE */}
        <div
          style={{
            marginTop: "clamp(1.2rem, 3vw, 2.5rem)",
            marginBottom: "clamp(1rem, 2vw, 1.8rem)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.75rem, 9.4vw, 5rem)",
              fontWeight: 400,
              lineHeight: 0.94,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#F7F2EC",
              margin: 0,
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition:
                    "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                }}
              >
                DESIGN
              </span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition:
                    "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s",
                }}
              >
                AS A
              </span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  color: "#F7F2EC",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition:
                    "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                }}
              >
                SOLUTION.
              </span>
            </div>
          </h1>
        </div>

        {/* Description */}
        <div
          style={{
            maxWidth: "420px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.9s ease 0.6s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.8rem, 1.1vw, 1rem)",
              lineHeight: 1.6,
              color: "#F7F2EC",
              margin: 0,
            }}
          >
            Professional design solutions for brands, products, spaces
            <br />
            and communication.
          </p>
        </div>

        {/* Service Categories */}
        <div
          style={{
            marginTop: "clamp(1rem, 2vw, 1.8rem)",
            maxWidth: "420px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.9s ease 0.7s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.5rem, 0.75vw, 0.65rem)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(247, 242, 236, 0.7)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            LOGO / BRANDING / PACKAGING / SIGNAGE / DIGITAL / PRINT / INDOOR /
            <br />
            OUTDOOR
          </p>
        </div>
      </div>

      {/* BOTTOM DIVIDER LINE */}
      <div
        style={{
          position: "absolute",
          bottom: 65,
          left: "4.3vw",
          right: "4.3vw",
          height: "1px",
          backgroundColor: "rgba(247, 242, 236, 0.12)",
          zIndex: 2,
        }}
      />

      {/* BOTTOM LEFT - EXPLORE OUR WORK */}
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: "4.3vw",
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}
      >
        <Link
          href="#recent-works"
          style={{
            fontSize: "clamp(0.5rem, 0.7vw, 0.6rem)",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#F7F2EC",
            textDecoration: "none",
          }}
        >
          EXPLORE OUR WORK &#x2193;
        </Link>
      </div>

      {/* BOTTOM RIGHT - PART OF UTERO INDONESIA */}
      <div
        style={{
          position: "absolute",
          bottom: 25,
          right: "4.3vw",
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}
      >
        <span
          style={{
            fontSize: "clamp(0.5rem, 0.7vw, 0.6rem)",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(247, 242, 236, 0.6)",
          }}
        >
          PART OF UTERO INDONESIA
        </span>
      </div>
    </section>
  );
}

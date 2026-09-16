"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

const slides = [
  {
    id: 1,
    image: "/img/background1.png",
    alt: "Utero Design Studio Visual 1",
  },
  {
    id: 2,
    image: "/img/background2.png",
    alt: "Utero Design Studio Visual 2",
  },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "680px",
        backgroundColor: "#0d0d0d",
        color: "#F7F2EC",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* ─── FULL BACKGROUND IMAGE SLIDER ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              style={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1)" : "scale(1.06)",
                transition: "opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1), transform 7s cubic-bezier(0.25, 1, 0.5, 1)",
                zIndex: isActive ? 2 : 1,
              }}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                sizes="100vw"
              />
            </div>
          );
        })}

        {/* Cinematic Multi-Layer Gradient Overlays for High Contrast & Legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10, 10, 10, 0.55) 0%, rgba(10, 10, 10, 0.4) 40%, rgba(10, 10, 10, 0.75) 80%, rgba(10, 10, 10, 0.95) 100%)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(178, 25, 43, 0.25) 0%, rgba(0, 0, 0, 0.6) 100%)",
            mixBlendMode: "multiply",
            zIndex: 4,
          }}
        />
      </div>

      {/* ─── MAIN HERO CONTENT ─── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(100px, 16vh, 160px)",
          left: "clamp(1rem, 3vw, 4.5rem)",
          right: "clamp(1rem, 3vw, 4.5rem)",
          maxWidth: "1150px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Studio Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "clamp(0.6rem, 1.2vw, 1.2rem)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              backgroundColor: "#e31e24",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(247, 242, 236, 0.85)",
            }}
          >
            UTERO.ID &mdash; BRAND &amp; DESIGN COMPANY
          </span>
        </div>
        {/* Headline */}
        <div style={{ marginBottom: "clamp(0.8rem, 1.5vw, 1.8rem)" }}>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 6vw, 5.8rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
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
                SOLVE PROBLEM
              </span>
            </div>

            <div
              style={{
                overflow: "hidden",
                display: "flex",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: "clamp(0.4rem, 1vw, 1rem)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition:
                    "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s",
                }}
              >
                THROUGH
              </span>

              {/* Bold DESIGN pill inspired by PDF reference */}
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#0d0d0d",
                  color: "#ffffff",
                  padding: "0.05em 0.35em",
                  border: "2px solid #e31e24",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition:
                    "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.42s",
                }}
              >
                DESIGN
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
            maxWidth: "450px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.9s ease 0.6s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.1vw, 1.15rem)",
              lineHeight: 1.5,
              color: "rgba(247, 242, 236, 0.9)",
              margin: 0,
            }}
          >
            A comprehensive branding and design company helping organizations build
            distinctive presence, market authority, and lasting cultural value since 1998.
          </p>
        </div>

        {/* Capabilities Ticker Strip from PDF */}
        <div
          style={{
            marginTop: "clamp(1rem, 2vw, 2.2rem)",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem 1rem",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(15px)",
            transition:
              "opacity 0.9s ease 0.7s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          {["IDENTITY", "PRINTED", "MISC", "DIGITAL", "ENVIRONMENTAL"].map(
            (cap, idx) => (
              <span
                key={cap}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "clamp(0.55rem, 0.7vw, 0.75rem)",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "rgba(247, 242, 236, 0.75)",
                }}
              >
                {cap}
                {idx < 4 && (
                  <span style={{ color: "#e31e24", marginLeft: "0.6rem" }}>/</span>
                )}
              </span>
            )
          )}
        </div>
      </div>

      {/* ─── SLIDE CONTROLLER & INDICATOR ─── */}
      <div
        style={{
          position: "absolute",
          right: "clamp(1rem, 3vw, 4.5rem)",
          bottom: "clamp(60px, 10vh, 90px)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}
      >
        {slides.map((s, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem 0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "#ffffff" : "rgba(247, 242, 236, 0.4)",
                  transition: "color 0.3s ease",
                }}
              >
                0{idx + 1}
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: isActive ? "32px" : "14px",
                  height: "2px",
                  backgroundColor: isActive ? "#e31e24" : "rgba(247, 242, 236, 0.3)",
                  transition: "all 0.4s ease",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ─── BOTTOM DIVIDER & FOOTER INFO ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "45px",
          left: "clamp(1rem, 3vw, 4.5rem)",
          right: "clamp(1rem, 3vw, 4.5rem)",
          height: "1px",
          backgroundColor: "rgba(247, 242, 236, 0.15)",
          zIndex: 10,
        }}
      />

      {/* Bottom Left Link */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          left: "clamp(1rem, 3vw, 4.5rem)",
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}
      >
        <Link
          href="#recent-works"
          style={{
            fontSize: "clamp(0.55rem, 0.7vw, 0.75rem)",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#F7F2EC",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e31e24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#F7F2EC")}
        >
          <span>EXPLORE OUR WORK</span>
          <span>&darr;</span>
        </Link>
      </div>

      {/* Bottom Right Studio Tag */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          right: "clamp(1rem, 3vw, 4.5rem)",
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}
      >
        <span
          style={{
            fontSize: "clamp(0.55rem, 0.7vw, 0.75rem)",
            fontWeight: 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(247, 242, 236, 0.6)",
          }}
        >
          PART OF UTERO INDONESIA &mdash; EST. 1998
        </span>
      </div>
    </section>
  );
}

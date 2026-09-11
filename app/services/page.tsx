"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { servicesData } from "@/lib/services";

export default function ServicesPage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
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
          {/* ── Page Header ──────────────────────────────────────────── */}
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
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
                03 / CAPABILITIES &amp; PRACTICE
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
                  Services
                </h1>
                <p
                  style={{
                    marginTop: "1.25rem",
                    fontSize: "clamp(0.85rem, 1vw, 1.05rem)",
                    color: "#555555",
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                    maxWidth: "540px",
                  }}
                >
                  Seven integrated creative disciplines engineered to resolve complex strategic challenges and command enduring enterprise equity.
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
                  07
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
                  Disciplines
                </span>
              </div>
            </div>
          </div>

          {/* ── Services List ────────────────────────────────────────── */}
          <div
            style={{
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(4rem, 7vw, 7rem)",
            }}
          >
            {servicesData.map((service) => {
              const isHovered = hoveredSlug === service.slug;

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  data-cursor="VIEW DISCIPLINE →"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                    padding: "clamp(2rem, 3.5vw, 3rem) 0",
                    transition: "background-color 0.25s ease, padding 0.25s ease",
                  }}
                  onMouseEnter={() => setHoveredSlug(service.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(12, 1fr)",
                      gap: "clamp(1rem, 2.5vw, 2.5rem)",
                      alignItems: "center",
                    }}
                  >
                    {/* Col 1: Number + Title */}
                    <div
                      style={{
                        gridColumn: "span 12",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "1.25rem",
                      }}
                      className="md:!col-span-5"
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 800,
                          color: "#c91a1f",
                          fontFamily: "monospace",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {service.number}
                      </span>
                      <h2
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                          fontWeight: 900,
                          letterSpacing: "-0.03em",
                          textTransform: "uppercase",
                          color: isHovered ? "#c91a1f" : "#0a0a0a",
                          margin: 0,
                          lineHeight: 1,
                          transform: isHovered ? "translateX(6px)" : "translateX(0)",
                          transition: "color 0.25s ease, transform 0.25s ease",
                        }}
                      >
                        {service.name}
                      </h2>
                    </div>

                    {/* Col 2: Tagline & Description */}
                    <div
                      style={{ gridColumn: "span 12" }}
                      className="md:!col-span-5"
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#0a0a0a",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {service.tagline}
                      </span>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          color: "#555555",
                          margin: 0,
                        }}
                      >
                        {service.description}
                      </p>
                    </div>

                    {/* Col 3: Arrow Indicator */}
                    <div
                      style={{
                        gridColumn: "span 12",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                      className="md:!col-span-2"
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: isHovered ? "#c91a1f" : "rgba(10, 10, 10, 0.4)",
                          transition: "color 0.2s ease, transform 0.2s ease",
                          transform: isHovered ? "translateX(4px)" : "translateX(0)",
                        }}
                      >
                        <span>Explore</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Bottom Section: Inquiries & Works Link ───────────────── */}
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
              ← See Portfolio Works
            </Link>

            <Link
              href="/contact"
              data-cursor="START A PROJECT"
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
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#c91a1f";
              }}
            >
              Inquire Capability →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

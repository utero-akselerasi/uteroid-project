"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { disciplinesData } from "@/lib/disciplines";

export default function ServicesPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();

  const activeDiscipline = disciplinesData[activeIdx] || disciplinesData[0];

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
              paddingBottom: "clamp(2rem, 3vw, 3rem)",
              marginBottom: "clamp(2rem, 3vw, 3rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
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
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 0.95,
                    margin: 0,
                  }}
                >
                  Services
                </h1>
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "clamp(0.85rem, 1vw, 1.05rem)",
                    color: "#555555",
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                    maxWidth: "540px",
                  }}
                >
                  Six integrated design disciplines engineered to resolve complex strategic challenges and command enduring enterprise equity.
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
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "rgba(0, 0, 0, 0.06)",
                    lineHeight: 1,
                  }}
                >
                  06
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

          {/* ── Services List (Homepage-style layout) ────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(2.5rem, 5vw, 5rem)",
              alignItems: "flex-start",
              borderTop: "1px solid rgba(10, 10, 10, 0.12)",
              paddingTop: "clamp(2rem, 3.5vw, 3rem)",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
            }}
          >
            {/* Left Column: 6 Disciplines */}
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {disciplinesData.map((item, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/services/${item.slug}`)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onFocus={() => setActiveIdx(idx)}
                      aria-label={`View ${item.name} services`}
                      data-cursor="EXPLORE"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "clamp(1.1rem, 2vw, 1.6rem) 0",
                        borderBottom: "1px solid rgba(10, 10, 10, 0.1)",
                        backgroundColor: "transparent",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "padding-left 0.25s ease, color 0.2s ease",
                        paddingLeft: isActive ? "14px" : "0",
                        borderLeftColor: isActive ? "#e31e24" : "transparent",
                        borderLeftWidth: isActive ? "4px" : "0px",
                        borderLeftStyle: "solid",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "1.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: isActive ? "#e31e24" : "rgba(10, 10, 10, 0.4)",
                            fontFamily: "monospace",
                          }}
                        >
                          {item.id}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                            fontSize: "clamp(1.2rem, 1.8vw, 1.75rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            color: isActive ? "#e31e24" : "#0a0a0a",
                            transition: "color 0.2s ease",
                          }}
                        >
                          {item.name}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: "1.25rem",
                          color: isActive ? "#e31e24" : "rgba(10, 10, 10, 0.3)",
                          transform: isActive ? "translateX(6px)" : "translateX(0)",
                          transition: "transform 0.2s ease, color 0.2s ease",
                        }}
                      >
                        &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Dynamic Preview Card for Active Discipline */}
            <div>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid rgba(10, 10, 10, 0.08)",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "260px",
                    overflow: "hidden",
                    backgroundColor: "#0a0a0a",
                  }}
                >
                  {activeDiscipline.image && (
                    <Image
                      key={activeDiscipline.slug}
                      src={activeDiscipline.image}
                      alt={activeDiscipline.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 620px"
                      placeholder="blur"
                      blurDataURL={activeDiscipline.imageBlur}
                      style={{
                        objectFit: "cover",
                        objectPosition: activeDiscipline.imagePosition,
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      backgroundColor: "#0d0d0d",
                      color: "#ffffff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.3rem 0.6rem",
                    }}
                  >
                    CATEGORY {activeDiscipline.id}
                  </div>
                </div>

                <div style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
                  <h3
                    style={{
                      fontSize: "clamp(1.1rem, 1.4vw, 1.35rem)",
                      fontWeight: 700,
                      color: "#0a0a0a",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {activeDiscipline.tagline}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "rgba(10, 10, 10, 0.7)",
                      margin: "0 0 1.5rem",
                    }}
                  >
                    {activeDiscipline.description}
                  </p>

                  <div
                    style={{
                      borderTop: "1px solid rgba(10, 10, 10, 0.1)",
                      paddingTop: "1.2rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#e31e24",
                        marginBottom: "0.8rem",
                      }}
                    >
                      CORE DELIVERABLES:
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "0.6rem",
                      }}
                    >
                      {activeDiscipline.deliverables.map((del) => (
                        <div
                          key={del}
                          style={{
                            fontSize: "0.82rem",
                            color: "rgba(10, 10, 10, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span style={{ color: "#e31e24", fontWeight: 700 }}>&bull;</span>
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/services/${activeDiscipline.slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      backgroundColor: "#0d0d0d",
                      padding: "0.65rem 1.25rem",
                      textDecoration: "none",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e31e24")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#0d0d0d")
                    }
                  >
                    <span>VIEW DETAILS &amp; ARCHIVE</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
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

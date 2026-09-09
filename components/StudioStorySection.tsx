"use client";

import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function StudioStorySection() {
  return (
    <section
      id="about"
      style={{
        padding: "clamp(4rem, 8vw, 7rem) 0",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background subtle geometric arc */}
      <div
        style={{
          position: "absolute",
          width: "clamp(400px, 40vw, 700px)",
          height: "clamp(400px, 40vw, 700px)",
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          right: "-10%",
          bottom: "-20%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* Left Column: Editorial Statement */}
          <div>
            <RevealOnScroll>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
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
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  ABOUT UTERO
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1}>
              <h2
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(2rem, 3.8vw, 3.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  marginBottom: "2rem",
                }}
              >
                A DESIGN COMPANY FOCUSED ON SOLVING REAL PROBLEMS.
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={2}>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  lineHeight: 1.7,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "2.5rem",
                  maxWidth: "520px",
                }}
              >
                We believe good design isn&apos;t just decoration — it is a strategic
                tool for transformation. Since 1998 in Malang, Utero has partnered with ambitious
                brands to create meaningful identities, digital experiences, packaging,
                and physical spaces that endure.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={3}>
              <Link
                href="/studio"
                data-cursor="OPEN &rarr;"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textDecoration: "none",
                  paddingBottom: "4px",
                  borderBottom: "2px solid #c91a1f",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                }}
              >
                <span>LEARN MORE ABOUT US</span>
                <span>&rarr;</span>
              </Link>
            </RevealOnScroll>
          </div>

          {/* Right Column: Editorial Visual Card */}
          <div>
            <RevealOnScroll delay={2}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#161616",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "2px",
                  padding: "clamp(2rem, 4vw, 3.5rem)",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                {/* Visual circle overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-20%",
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(201, 26, 31, 0.12)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      color: "#c91a1f",
                    }}
                  >
                    EST. 1998
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    MALANG, INDONESIA
                  </span>
                </div>

                <div style={{ margin: "2rem 0" }}>
                  <div
                    style={{
                      fontSize: "clamp(3rem, 6vw, 5rem)",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "#c91a1f",
                      letterSpacing: "-0.04em",
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    25+
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255, 255, 255, 0.9)",
                      marginTop: "0.5rem",
                    }}
                  >
                    Years of Strategic Design Excellence
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    paddingTop: "1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    BRAND · DIGITAL · SPACES
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    UTERO.ID
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

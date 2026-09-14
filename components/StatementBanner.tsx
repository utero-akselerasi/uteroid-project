"use client";

import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function StatementBanner() {
  return (
    <section
      id="studio-statement"
      style={{
        position: "relative",
        padding: "clamp(5rem, 10vw, 9rem) 0",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Background Image with Cinematic Darkness */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.38,
        }}
      >
        <Image
          src="/img/unnamed.webp"
          alt="Utero Studio Storefront - Creative Since 1998"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          sizes="100vw"
        />
        {/* Gradients to merge seamlessly into dark background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(13, 13, 13, 0.95) 0%, rgba(13, 13, 13, 0.7) 50%, rgba(13, 13, 13, 0.95) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        {/* Tag Header */}
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
              UTERO CREATIVE STANDARD &mdash; EST. 1998
            </span>
          </div>
        </RevealOnScroll>

        {/* Big Impact Statement */}
        <div style={{ maxWidth: "1050px", marginBottom: "clamp(2.5rem, 4.5vw, 4rem)" }}>
          <RevealOnScroll delay={1}>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.8rem, 4.2vw, 3.8rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                margin: 0,
                color: "#ffffff",
              }}
            >
              WE DON&apos;T JUST MAKE THINGS LOOK GOOD.
              <br />
              <span
                style={{
                  color: "#e31e24",
                  display: "inline-block",
                  marginTop: "0.2em",
                }}
              >
                WE DESIGN THINGS TO WORK BETTER.
              </span>
            </h2>
          </RevealOnScroll>
        </div>

        {/* Supporting Narrative & Details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(2rem, 4vw, 4rem)",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          <RevealOnScroll delay={2}>
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.8)",
                margin: 0,
              }}
            >
              From corporate brand identity to spatial environments and public media,
              every project is backed by comprehensive strategic thinking and relentless
              craftsmanship.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  borderLeft: "2px solid #e31e24",
                  paddingLeft: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                  }}
                >
                  MALANG &bull; EAST JAVA &bull; INDONESIA
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    marginTop: "0.25rem",
                  }}
                >
                  Over two decades shaping Indonesian commercial design
                </div>
              </div>

              <Link
                href="/studio"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "0.6rem 1.2rem",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e31e24";
                  e.currentTarget.style.borderColor = "#e31e24";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                DISCOVER OUR STORY &rarr;
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

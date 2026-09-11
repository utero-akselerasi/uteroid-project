"use client";

import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function ProjectCTA() {
  return (
    <section
      id="cta"
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
        <div style={{ maxWidth: "1150px" }}>
          {/* Section Tag */}
          <RevealOnScroll>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
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
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                06 / START A CONVERSATION
              </span>
            </div>
          </RevealOnScroll>

          {/* Subheading Narrative */}
          <RevealOnScroll delay={1}>
            <p
              style={{
                fontSize: "clamp(1.25rem, 2.2vw, 2rem)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              Create something with us that matters.
            </p>
          </RevealOnScroll>

          {/* Oversized Headline */}
          <RevealOnScroll delay={2}>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(3rem, 8.5vw, 8.5rem)",
                fontWeight: 900,
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              LET&apos;S WORK
              <br />
              TOGETHER.
            </h2>
          </RevealOnScroll>

          {/* Action Row & Direct Contact */}
          <RevealOnScroll delay={3}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "clamp(1.5rem, 3vw, 3rem)",
                borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                paddingTop: "clamp(2rem, 3vw, 3rem)",
              }}
            >
              <Link
                href="/contact"
                data-cursor="LET'S TALK &rarr;"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  backgroundColor: "#ffffff",
                  color: "#c91a1f",
                  padding: "clamp(1.1rem, 2vw, 1.35rem) clamp(2rem, 3.5vw, 3rem)",
                  fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "2px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0a0a0a";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.color = "#c91a1f";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>START A PROJECT</span>
                <span style={{ fontSize: "1.2em" }}>&rarr;</span>
              </Link>

              {/* Direct Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  DIRECT EMAIL INQUIRIES
                </span>
                <a
                  href="mailto:marketingutero@gmail.com"
                  data-cursor="EMAIL"
                  style={{
                    fontSize: "clamp(1rem, 1.4vw, 1.35rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
                    paddingBottom: "2px",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderBottomColor = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderBottomColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  marketingutero@gmail.com
                </a>
              </div>

              {/* WhatsApp Quick Chat */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  WHATSAPP CHAT
                </span>
                <a
                  href="https://wa.me/6281999900900"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="CHAT"
                  style={{
                    fontSize: "clamp(1rem, 1.4vw, 1.35rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
                    paddingBottom: "2px",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderBottomColor = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderBottomColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  081 999 900 900 (Wahyu)
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

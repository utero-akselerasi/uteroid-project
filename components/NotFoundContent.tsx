"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/useTranslations";

export default function NotFoundContent() {
  const t = useTranslations();

  return (
    <>
      <style>{`
        .nf-btn-primary {
          background-color: #c91a1f;
          color: #ffffff;
          transition: background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease;
        }
        .nf-btn-primary:hover {
          background-color: #0a0a0a;
          transform: translateY(-1px);
        }
        .nf-btn-primary:active {
          transform: translateY(0);
        }
        .nf-btn-secondary {
          background-color: transparent;
          color: #0a0a0a;
          border: 1px solid rgba(10, 10, 10, 0.2);
          transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease;
        }
        .nf-btn-secondary:hover {
          border-color: #c91a1f;
          color: #c91a1f;
          transform: translateY(-1px);
        }
        .nf-btn-secondary:active {
          transform: translateY(0);
        }
      `}</style>

      <section
        style={{
          minHeight: "calc(100vh - 240px)",
          display: "flex",
          alignItems: "center",
          padding: "clamp(6.5rem, 12vw, 10rem) clamp(1.25rem, 4vw, 3.5rem) clamp(4rem, 8vw, 6rem)",
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ maxWidth: "680px", width: "100%" }}>
            {/* Section label */}
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
                  width: "1.5rem",
                  height: "1px",
                  backgroundColor: "#c91a1f",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                {t.notFound.label}
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2.5rem, 6.5vw, 4.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                lineHeight: 0.95,
                margin: "0 0 1.5rem",
                color: "#0a0a0a",
              }}
            >
              {t.notFound.headline}
            </h1>

            {/* Calm sentence */}
            <p
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                lineHeight: 1.65,
                color: "rgba(10, 10, 10, 0.6)",
                margin: "0 0 2.5rem",
                maxWidth: "520px",
              }}
            >
              {t.notFound.description}
            </p>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.85rem",
              }}
            >
              <Link
                href="/"
                className="nf-btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  borderRadius: "9999px",
                  border: "none",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {t.notFound.backHome}
              </Link>

              <Link
                href="/work"
                className="nf-btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  borderRadius: "9999px",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {t.notFound.viewWork}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

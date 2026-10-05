"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <section
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 3.5rem)",
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
      }}
    >
      <div style={{ maxWidth: "640px", width: "100%" }}>
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "1rem",
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
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c91a1f",
            }}
          >
            Error 500
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            lineHeight: 0.95,
            margin: "0 0 1.25rem",
          }}
        >
          Something broke.
        </h1>

        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.65,
            color: "rgba(10,10,10,0.55)",
            margin: "0 0 2rem",
            maxWidth: "480px",
          }}
        >
          This section failed to load. The rest of the site is still
          available — try again, or head back to the work archive.
        </p>

        {error.digest && (
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              color: "rgba(10,10,10,0.3)",
              margin: "0 0 2rem",
              wordBreak: "break-all",
            }}
          >
            Reference: {error.digest}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#c91a1f",
              color: "#ffffff",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.5rem",
              borderRadius: "9999px",
              border: "1px solid rgba(10,10,10,0.15)",
              color: "#0a0a0a",
              textDecoration: "none",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}
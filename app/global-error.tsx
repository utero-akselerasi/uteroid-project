"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "560px", width: "100%" }}>
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
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#c91a1f",
              }}
            >
              Utero.id
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 7vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              lineHeight: 0.98,
              margin: "0 0 1.25rem",
            }}
          >
            Site failed to load.
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "rgba(10,10,10,0.55)",
              margin: "0 0 2rem",
            }}
          >
            A critical error broke the application shell. Reloading usually
            recovers the page.
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
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
"use client";

import { useTranslations } from "@/lib/useTranslations";

export default function WorkPageContent({ total }: { total: number }) {
  const t = useTranslations();

  return (
    <>
      <style>{`
        .wk-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 2rem;
          margin-bottom: clamp(1.5rem, 2.5vw, 2.5rem);
        }
        .wk-head__count {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          padding-bottom: 0.25rem;
        }
        /* Single column below 640px — the ghost number sits under the
           headline instead of crowding it beside the oversized h1. */
        @media (max-width: 640px) {
          .wk-head {
            grid-template-columns: 1fr;
            align-items: start;
            gap: 1.25rem;
          }
          .wk-head__count {
            align-items: flex-start;
            padding-bottom: 0;
          }
        }
      `}</style>
      <div className="wk-head">
        <div>
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
              {t.work.archive}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(3rem, 6.5vw, 6.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              lineHeight: 0.92,
              margin: 0,
            }}
          >
            {t.nav.work}
          </h1>
        </div>

        {/* Project count — large ghost number */}
        <div className="wk-head__count">
          <span
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "rgba(0,0,0,0.06)",
              lineHeight: 1,
            }}
          >
            {String(total).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(10,10,10,0.28)",
            }}
          >
            {t.work.projects}
          </span>
        </div>
      </div>
    </>
  );
}

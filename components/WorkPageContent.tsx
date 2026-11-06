"use client";

import { useTranslations } from "@/lib/useTranslations";
import PageCounter from "@/components/PageCounter";

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
        /* Single column below 640px — the ghost number sits under the
           headline instead of crowding it beside the oversized h1. */
        @media (max-width: 640px) {
          .wk-head {
            grid-template-columns: 1fr;
            align-items: start;
            gap: 1.25rem;
          }
          .wk-head .page-counter {
            align-items: flex-start !important;
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
                fontFamily: "var(--font-sans, 'Helvetica Neue', Arial, sans-serif)",
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
              fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
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
        <div className="page-counter">
          <PageCounter
            number={String(total).padStart(2, "0")}
            label={t.work.projects}
          />
        </div>
      </div>
    </>
  );
}

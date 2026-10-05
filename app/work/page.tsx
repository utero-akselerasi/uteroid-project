import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjectsByFilters, getFilterCounts } from "@/lib/projects";
import { type WorkFilter } from "@/lib/types";
import WorkFilters from "@/components/WorkFilters";
import WorkPageContent from "@/components/WorkPageContent";
import WorkPageSubtitle from "@/components/WorkPageSubtitle";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Work — Utero",
  description:
    "Selected identities, spaces, products and experiences created by Utero design studio.",
};



// ─────────────────────────────────────────────────────────────────────
// Page — Server Component
// ─────────────────────────────────────────────────────────────────────
export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; industry?: string }>;
}) {
  const params = await searchParams;
  const filter = (params.filter || "all") as WorkFilter;
  const industry = params.industry || "";

  const filtered = getProjectsByFilters({ filter, industry });
  const counts = getFilterCounts();
  const total = counts.all;

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           WORK ARCHIVE — Hover-reveal motion system
           ───────────────────────────────────────────────────────────
           Timing tokens mirror the project detail gallery hover-zoom:
             scale    : 0.7s cubic-bezier(0.16, 1, 0.3, 1)  (ease-out-expo)
             crossfade: 0.35s ease
             overlay  : 0.3s ease
           Border radius: 8px — same as menu-form-panel (Header.tsx L901)
        ═══════════════════════════════════════════════════════════ */

        /* ── Base link ───────────────────────────────────────────── */
        .pe-link { cursor: pointer; }
        .pe-link:active { opacity: 0.9; }

        /* ── Shared image transition ─────────────────────────────── */
        .pe-image {
          transition:
            opacity 0.35s ease,
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Cover: fully visible, scale starts at 1 */
        .pe-image--cover {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        /* Hover state for cover when a hoverImage is present:
           fade out while scaling up together */
        .pe-link:hover .pe-image--cover {
          opacity: 0;
          transform: scale(1.04);
        }

        /* Cover-only card (no hoverImage set): stays visible, just scales */
        .pe-link:hover .pe-image--cover.pe-image--only {
          opacity: 1;
          transform: scale(1.04);
        }

        /* Hover image: invisible by default, crossfades in */
        .pe-image--hover {
          opacity: 0;
          transform: scale(1);
          z-index: 2;
        }
        .pe-link:hover .pe-image--hover {
          opacity: 1;
          transform: scale(1.04);
        }

        /* ── Grid-level dimming ─────────────────────────────────── */
        /* Non-hovered siblings dim to 72% — draws focus without
           making the page feel dark or unreadable */
        .pe-col-item {
          transition: opacity 0.3s ease;
        }
        .pe-grid-root:hover .pe-col-item {
          opacity: 0.72;
        }
        .pe-grid-root:hover .pe-col-item:hover {
          opacity: 1;
          transition: opacity 0.15s ease;
        }

        /* ── Title color transition ───────────────────────────────── */
        .pe-title { transition: color 0.2s ease; }
        .pe-link:hover .pe-title { color: #c91a1f !important; }

        /* ── Overlay: scope summary + CTA ───────────────────────── */
        /* Layered above both image layers (z-index 3).
           Gradient scrim ensures legibility over any image colour.
           Fades in + inner content slides 6px upward. */
        .pe-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: flex-end;
          pointer-events: none;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.62) 0%,
            rgba(0, 0, 0, 0.18) 45%,
            transparent 75%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pe-link:hover .pe-overlay {
          opacity: 1;
        }

        .pe-overlay__inner {
          width: 100%;
          padding: 1rem 1rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          transform: translateY(6px);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pe-link:hover .pe-overlay__inner {
          transform: translateY(0);
        }

        .pe-overlay__scope {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.3;
        }

        .pe-overlay__cta {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1;
        }

        /* ── Mobile fallback ─────────────────────────────────────── */
        /* Touch devices have no :hover equivalent for the crossfade.
           .pe-scope-mobile is always shown at the bottom of the image
           at reduced opacity, giving access to the extra info without
           needing hover. */
        .pe-scope-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          /* Disable desktop overlay on touch breakpoints */
          .pe-overlay { display: none; }

          /* Show static scope pill at image bottom */
          .pe-scope-mobile {
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.55rem 0.75rem;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.48) 0%,
              transparent 100%
            );
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 0.57rem;
            font-weight: 700;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.68);
            pointer-events: none;
          }

          /* No dimming on mobile — each card is full opacity */
          .pe-grid-root:hover .pe-col-item {
            opacity: 1;
          }
        }

        /* ── Grid layout (unchanged) ─────────────────────────────── */
        .pe-grid-root {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.5rem, 2.5vw, 2.5rem);
        }
        @media (max-width: 1024px) {
          .pe-grid-root {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .pe-grid-root {
            grid-template-columns: 1fr;
          }
        }

        .wk-grid-wrap {
          scroll-margin-top: clamp(4rem, 6vw, 5rem);
        }

        .pe-col-item {
          grid-column: auto;
          min-width: 0;
        }

        /* ── Page intro animation ────────────────────────────────── */
        @keyframes wk-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wk-intro {
          animation: wk-fadein 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .wk-subtitle {
          animation: wk-fadein 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .wk-filter-bar {
          animation: wk-fadein 0.5s 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .wk-grid-wrap {
          animation: wk-fadein 0.5s 0.26s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* ── Divider ─────────────────────────────────────────────── */
        .wk-rule {
          width: 100%;
          height: 1px;
          background: rgba(0,0,0,0.07);
          border: none;
          margin: 0;
        }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(5rem, 7vw, 7.5rem)",
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
          {/* ── Page Introduction ───────────────────────────────────── */}
          <WorkPageContent total={total} />

          {/* Subtitle */}
          <WorkPageSubtitle />

          <hr className="wk-rule" style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }} />

          {/* ── Filter Bar ──────────────────────────────────────────── */}
          <div className="wk-filter-bar">
            <Suspense fallback={<div style={{ height: "1.5rem" }} />}>
              <WorkFilters filteredCount={filtered.length} counts={counts} />
            </Suspense>
          </div>

          {/* ── Project Grid ─────────────────────────────────────────── */}
          <div className="wk-grid-wrap">
            <ProjectGrid projects={filtered} />
          </div>
        </div>
      </section>
    </>
  );
}

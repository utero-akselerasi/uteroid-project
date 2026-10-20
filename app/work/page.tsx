import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjectsByFilters, getFilterCounts } from "@/lib/projects";
import { type WorkFilter } from "@/lib/types";
import WorkFilters from "@/components/WorkFilters";
import WorkPageContent from "@/components/WorkPageContent";
import WorkPageSubtitle from "@/components/WorkPageSubtitle";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Work — Selected Projects",
  description:
    "Explore selected brand identities, packaging, digital systems, environmental wayfinding, and spatial experiences by Utero design studio.",
  openGraph: {
    type: "website",
    title: "Work — Selected Projects",
    description:
      "Explore selected brand identities, packaging, digital systems, environmental wayfinding, and spatial experiences by Utero design studio.",
    url: "https://utero.id/work",
    images: [
      {
        url: "/img/unnamed.webp",
        width: 1280,
        height: 720,
        alt: "Utero Design Studio Work Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — Selected Projects",
    description:
      "Explore selected brand identities, packaging, digital systems, environmental wayfinding, and spatial experiences by Utero design studio.",
    images: ["/img/unnamed.webp"],
  },
  alternates: {
    canonical: "/work",
  },
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

        /* ── Grid layout: Pinterest-inspired uniform 4-column ─────── */
        .pe-grid-root {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1rem, 1.8vw, 1.75rem);
        }
        @media (max-width: 1140px) {
          .pe-grid-root {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
        }
        @media (max-width: 768px) {
          .pe-grid-root {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        @media (max-width: 440px) {
          .pe-grid-root {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.65rem;
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

        /* ── Pinterest-inspired Card Styling ──────────────────────── */
        .pe-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
        }

        .pe-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          margin-bottom: 0.75rem;
          border-radius: 12px;
          background-color: #f1efe9;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }

        .pe-link:hover .pe-image-wrap {
          box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.05);
        }

        /* ── Floating Index Badge (Pinterest Pin indicator) ─────── */
        .pe-card__badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 4;
          padding: 3px 7px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #111111;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          pointer-events: none;
          transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
        }
        .pe-link:hover .pe-card__badge {
          background: #e31e24;
          color: #ffffff;
        }

        /* ── Editorial Placeholder for projects without images ───── */
        .pe-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #f7f6f2 0%, #ebe8e1 100%);
          color: #0a0a0a;
          padding: 1.5rem;
          text-align: center;
          gap: 0.35rem;
        }
        .pe-placeholder__num {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: rgba(227, 30, 36, 0.25);
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .pe-placeholder__logo {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          color: rgba(10, 10, 10, 0.6);
        }
        .pe-placeholder__cat {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.38);
        }

        /* ── Pinterest-style Floating Action Button ──────────────── */
        .pe-overlay__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #e31e24;
          color: #ffffff;
          padding: 0.45rem 0.85rem;
          border-radius: 9999px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1;
          box-shadow: 0 4px 14px rgba(227, 30, 36, 0.45);
          transform: translateY(4px);
          transition: transform 0.25s ease;
          align-self: flex-start;
        }
        .pe-link:hover .pe-overlay__btn {
          transform: translateY(0);
        }

        /* ── Card Metadata (Uniform heights across all items) ───── */
        .pe-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0 0.15rem;
        }

        .pe-meta__top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          height: 1rem;
          overflow: hidden;
        }

        .pe-meta__discipline {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        /* Title: strictly 2-line fixed height box for seamless row alignment */
        .pe-meta__title {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(0.88rem, 1.05vw, 1.05rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.2;
          margin: 0;
          height: 2.4em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .pe-meta__bottom {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
          height: 1.15rem;
          overflow: hidden;
        }

        .pe-meta__client {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          color: rgba(10, 10, 10, 0.45);
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .pe-meta__year {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          color: rgba(10, 10, 10, 0.32);
          letter-spacing: 0.06em;
          flex-shrink: 0;
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
            maxWidth: "1520px",
            margin: "0 auto",
            padding: "0 clamp(1.25rem, 3.5vw, 3rem)",
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

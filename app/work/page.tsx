import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getProjectsByFilters, getFilterCounts } from "@/lib/projects";
import { disciplineLabels, type WorkFilter } from "@/lib/types";
import WorkFilters from "@/components/WorkFilters";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work — Utero",
  description:
    "Selected identities, spaces, products and experiences created by Utero design studio.",
};

// ─────────────────────────────────────────────────────────────────────
// ProjectEntry — editorial card with hover crossfade + info reveal
//
// Implementation: pure CSS, server component safe (no client JS).
//
// Image layers:
//   – .pe-image--cover: z-index 1, opacity 1 → 0 on hover (if hoverImage)
//   – .pe-image--cover.pe-image--only: z-index 1, opacity stays 1 (no hoverImage)
//   – .pe-image--hover: z-index 2, opacity 0 → 1 on hover
// Both scale 1 → 1.04 simultaneously.
//
// Overlay (.pe-overlay): z-index 3, gradient scrim + scope + CTA.
// Fades in + slides up from bottom on :hover.
//
// Grid dimming: .pe-grid-root:hover dims siblings to 0.72.
//
// Border radius: 8px — matches menu-form-panel in Header.tsx L901.
//
// Mobile (≤768px): overlay hidden; .pe-scope-mobile always shown
// at the bottom of the image with reduced opacity.
// ─────────────────────────────────────────────────────────────────────
function ProjectEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  // Grid base image: prefer the curated AI cover when one exists, else the
  // project's own cover. Scoped to the grid only — the detail hero
  // (ProjectDetailClient) still uses coverImage, and hoverSrc below is
  // independent so the crossfade is unaffected.
  const coverSrc =
    project.homepageCoverImage || project.coverImage || project.heroImage || "";
  const hoverSrc = project.hoverImage ?? null;
  const num = String(index + 1).padStart(2, "0");
  const disciplines = project.disciplines
    .map((d) => disciplineLabels[d])
    .join(" · ");

  // Scope summary: first 2 scope items joined, fallback to category
  const scopeSummary =
    project.details?.scope && project.details.scope.length > 0
      ? project.details.scope.slice(0, 2).join(" · ")
      : project.category;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="pe-link"
      aria-label={`${project.title} — ${project.client}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <article>
        {/* ── Image container ── */}
        <div
          className="pe-image-wrap"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            overflow: "hidden",
            marginBottom: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f0efed",
          }}
        >
          {/* Layer 1: Cover image */}
          {coverSrc && (
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                objectPosition: project.gridCoverPosition || "center",
              }}
              className={
                hoverSrc
                  ? "pe-image pe-image--cover"
                  : "pe-image pe-image--cover pe-image--only"
              }
            />
          )}

          {/* Layer 2: Hover image (crossfades in on hover) */}
          {hoverSrc && (
            <Image
              src={hoverSrc}
              alt={`${project.title} — gallery detail`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="pe-image pe-image--hover"
              aria-hidden="true"
            />
          )}

          {/* ── Overlay: scope summary + View Project CTA ── */}
          {/* Fades + slides up from bottom on card hover (desktop) */}
          <div className="pe-overlay" aria-hidden="true">
            <div className="pe-overlay__inner">
              <span className="pe-overlay__scope">{scopeSummary}</span>
              <span className="pe-overlay__cta">View Project →</span>
            </div>
          </div>

          {/* ── Mobile fallback: scope line always visible ── */}
          {/* On touch devices hover never fires; show info statically */}
          <div className="pe-scope-mobile" aria-hidden="true">
            <span>{scopeSummary}</span>
          </div>
        </div>

        {/* ── Metadata below image ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          {/* Row 1: number · disciplines */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: "#c91a1f",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                lineHeight: 1,
              }}
            >
              {num}
            </span>
            <span
              style={{
                width: "0.75rem",
                height: "1px",
                backgroundColor: "rgba(201,26,31,0.35)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(10,10,10,0.4)",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
                flexShrink: 1,
              }}
            >
              {disciplines}
            </span>
          </div>

          {/* Row 2: Project title */}
          <h3
            className="pe-title"
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(1rem, 1.4vw, 1.3rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {project.title}
          </h3>

          {/* Row 3: client · year */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "rgba(10,10,10,0.42)",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {project.client}
            </span>
            {project.year && (
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "rgba(10,10,10,0.3)",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                {project.year}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        padding: "6rem 0",
        borderTop: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: "clamp(1rem, 2vw, 1.4rem)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          color: "#0a0a0a",
          marginBottom: "1.5rem",
        }}
      >
        No projects match the current filters.
      </p>
      <Link
        href="/work"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#c91a1f",
          textDecoration: "none",
          borderBottom: "1px solid rgba(201,26,31,0.4)",
          paddingBottom: "2px",
        }}
      >
        Clear Filters →
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Project Grid — strict 3/2/1 column layout, uniform aspect ratio
// Grid structure intentionally unchanged.
// ─────────────────────────────────────────────────────────────────────
function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />;

  return (
    <div className="pe-grid-root">
      {projects.map((project, index) => (
        <div key={project.slug} className="pe-col-item">
          <ProjectEntry project={project} index={index} />
        </div>
      ))}
    </div>
  );
}

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
  const total = getFilterCounts().all;

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "end",
              gap: "2rem",
              marginBottom: "clamp(1.5rem, 2.5vw, 2.5rem)",
            }}
          >
            <div>
              {/* Section label */}
              <div
                className="wk-intro"
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
                  Archive
                </span>
              </div>

              {/* Headline */}
              <h1
                className="wk-intro"
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
                Work
              </h1>
            </div>

            {/* Project count — large ghost number */}
            <div
              className="wk-intro"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.25rem",
                paddingBottom: "0.25rem",
              }}
            >
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
                Projects
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            className="wk-subtitle"
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(0.875rem, 1.1vw, 1.05rem)",
              color: "rgba(10,10,10,0.45)",
              letterSpacing: "0.01em",
              lineHeight: 1.6,
              maxWidth: "460px",
              margin: "0 0 clamp(2.5rem, 4vw, 4rem) 0",
            }}
          >
            Selected identities, spaces, products, campaigns and experiences
            created by Utero.
          </p>

          <hr className="wk-rule" style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }} />

          {/* ── Filter Bar ──────────────────────────────────────────── */}
          <div className="wk-filter-bar">
            <Suspense fallback={<div style={{ height: "1.5rem" }} />}>
              <WorkFilters filteredCount={filtered.length} />
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

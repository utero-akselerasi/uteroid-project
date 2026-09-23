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
// ProjectEntry — editorial card
// Hover: CSS class only (scale 1 → 1.025), no JS state, no image swap.
// Metadata below image: project number · disciplines / title / client · year
// ─────────────────────────────────────────────────────────────────────
function ProjectEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const coverSrc = project.coverImage || project.heroImage || "";
  const num = String(index + 1).padStart(2, "0");
  const disciplines = project.disciplines
    .map((d) => disciplineLabels[d])
    .join(" · ");

  return (
    <Link
      href={`/work/${project.slug}`}
      className="pe-link"
      aria-label={`${project.title} — ${project.client}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <article>
        {/* ── Image ── */}
        <div
          className="pe-image-wrap"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            backgroundColor: "#f0efed",
            overflow: "hidden",
            marginBottom: "1rem",
          }}
        >
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
              className="pe-image"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#e8e8e8" }} />
          )}
        </div>

        {/* ── Metadata ── */}
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
// Editorial Grid
// 2-column primary. Every 5th project (index 4, 9, 14, …) spans full width.
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
        /* ── Work archive styles ─────────────────────────────────── */

        /* Hover: image scale only, no JS */
        .pe-link { cursor: pointer; }
        .pe-link:active { opacity: 0.9; }
        .pe-image-wrap { will-change: transform; }
        .pe-link:hover .pe-image {
          transform: scale(1.025) !important;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .pe-image {
          transition: transform 0.5s ease !important;
        }
        .pe-link:hover .pe-title { color: #c91a1f !important; }
        .pe-title { transition: color 0.2s ease; }

        /* Grid: strict 3 desktop / 2 tablet / 1 mobile */
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

        /* Never hide the top row behind the fixed header when anchored */
        .wk-grid-wrap {
          scroll-margin-top: clamp(4rem, 6vw, 5rem);
        }

        .pe-col-item {
          grid-column: auto;
          min-width: 0;
        }

        /* Page intro text animation */
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

        /* Divider line */
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

"use client";

import { useState, useEffect, Suspense } from "react";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getProjectsByFilters, getFilterCounts } from "@/lib/projects";
import { disciplineLabels, type WorkFilter } from "@/lib/types";
import WorkFilters from "@/components/WorkFilters";
import type { Project } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────
// Individual Project Card
// ─────────────────────────────────────────────────────────────────────

function ProjectItem({
  project,
  index,
  layout = "normal",
}: {
  project: Project;
  index: number;
  layout?: "featured" | "wide" | "normal" | "tall";
}) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  const isFeatured = layout === "featured";
  const isWide = layout === "wide";
  const isTall = layout === "tall";

  const aspectRatio = isFeatured ? "21/9" : isWide ? "16/7" : isTall ? "3/4" : "4/3";
  const minHeight = isFeatured ? "380px" : isWide ? "300px" : isTall ? "380px" : "260px";

  const coverSrc = project.coverImage || project.heroImage;

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="VIEW CASE →"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article>
        {/* Image container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio,
            minHeight,
            backgroundColor: "#f5f5f5",
            overflow: "hidden",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            marginBottom: "1.25rem",
          }}
        >
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              sizes={isFeatured ? "(max-width: 1400px) 100vw, 1400px" : "(max-width: 768px) 100vw, 50vw"}
              style={{
                objectFit: "cover",
                transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#eeeeee" }} />
          )}

          {/* Subtle overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Category badge */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.25rem",
              backgroundColor: "#c91a1f",
              color: "#ffffff",
              padding: "3px 10px",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              zIndex: 2,
            }}
          >
            {project.category}
          </div>

          {/* Year badge */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              backgroundColor: "rgba(10, 10, 10, 0.6)",
              backdropFilter: "blur(4px)",
              color: "#ffffff",
              padding: "3px 8px",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              zIndex: 2,
            }}
          >
            {project.year}
          </div>

          {/* View label that slides up on hover */}
          <div
            style={{
              position: "absolute",
              bottom: "1.25rem",
              right: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "5px 12px",
              backgroundColor: "#0a0a0a",
              color: "#ffffff",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              zIndex: 2,
            }}
          >
            <span>View Case</span>
            <span>→</span>
          </div>
        </div>

        {/* Text metadata */}
        <div>
          {/* Disciplines */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              {project.disciplines.map((d) => disciplineLabels[d]).join(" / ")}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(10, 10, 10, 0.4)",
              }}
            >
              {project.client}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: isFeatured ? "clamp(1.75rem, 3vw, 2.75rem)" : "clamp(1.2rem, 2vw, 1.6rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              color: hovered ? "#c91a1f" : "#0a0a0a",
              lineHeight: 1.05,
              margin: "0 0 0.6rem",
              transition: "color 0.25s ease, transform 0.25s ease",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
            }}
          >
            {project.title}
          </h3>

          {/* Short description — only for featured / wide */}
          {(isFeatured || isWide) && (
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.65,
                color: "#555555",
                maxWidth: "560px",
                margin: 0,
              }}
            >
              {project.shortDescription || project.excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Project Grid — editorial asymmetric layout
// ─────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        padding: "6rem 0",
        textAlign: "center",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
      }}
    >
      <p
        style={{
          fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
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
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#c91a1f",
          textDecoration: "none",
          borderBottom: "1px solid rgba(201,26,31,0.5)",
          paddingBottom: "2px",
        }}
      >
        Clear Filters →
      </Link>
    </div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />;

  const items = projects;

  const rendered: React.ReactElement[] = [];
  let i = 0;

  while (i < items.length) {
    const blockStart = i;

    if (i === 0) {
      // First item: featured full-width
      rendered.push(
        <div key={`block-${blockStart}`} style={{ marginBottom: "clamp(3rem, 5vw, 5rem)" }}>
          <ProjectItem project={items[i]} index={i} layout="featured" />
        </div>
      );
      i += 1;
    } else if (i % 6 === 1 || (i > 0 && (i - 1) % 6 === 0 && i + 1 < items.length)) {
      // Two side-by-side (4/3)
      const pair = items.slice(i, i + 2);
      rendered.push(
        <div
          key={`block-${blockStart}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            marginBottom: "clamp(3rem, 5vw, 5rem)",
          }}
        >
          {pair.map((p, pi) => (
            <ProjectItem key={p.slug} project={p} index={i + pi} layout="normal" />
          ))}
        </div>
      );
      i += pair.length;
    } else if (i % 6 === 3) {
      // Wide full-width
      if (items[i]) {
        rendered.push(
          <div key={`block-${blockStart}`} style={{ marginBottom: "clamp(3rem, 5vw, 5rem)" }}>
            <ProjectItem project={items[i]} index={i} layout="wide" />
          </div>
        );
        i += 1;
      } else {
        i += 1;
      }
    } else {
      // Fallback: pair
      const pair = items.slice(i, i + 2);
      rendered.push(
        <div
          key={`block-${blockStart}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            marginBottom: "clamp(3rem, 5vw, 5rem)",
          }}
        >
          {pair.map((p, pi) => (
            <ProjectItem key={p.slug} project={p} index={i + pi} layout="normal" />
          ))}
        </div>
      );
      i += pair.length;
    }
  }

  return <div>{rendered}</div>;
}

// ─────────────────────────────────────────────────────────────────────
// Inner page content (needs Suspense because it reads searchParams)
// ─────────────────────────────────────────────────────────────────────

function WorkPageContent() {
  const searchParams = useSearchParams();
  const filter   = (searchParams.get("filter")   || "all") as WorkFilter;
  const industry = searchParams.get("industry") || "";

  const filtered = getProjectsByFilters({ filter, industry });
  const total    = getFilterCounts().all;

  return (
    <>
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
          marginBottom: "clamp(2.5rem, 4vw, 4rem)",
        }}
      >
        {/* Label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {/* Pulsating red dot */}
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              backgroundColor: "#c91a1f",
              borderRadius: "50%",
              animation: "pulse-red 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c91a1f",
            }}
          >
            01 / Archive
          </span>
        </div>

        {/* Headline + meta row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 0.92,
                margin: 0,
              }}
            >
              Works
            </h1>
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                color: "#555555",
                letterSpacing: "0.02em",
                lineHeight: 1.6,
                maxWidth: "420px",
              }}
            >
              Selected work across branding,{" "}
              promotion, product, space and digital.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "rgba(0, 0, 0, 0.06)",
                lineHeight: 1,
              }}
            >
              {String(total).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(10, 10, 10, 0.35)",
              }}
            >
              Projects
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <Suspense fallback={<div style={{ height: "60px" }} />}>
        <WorkFilters />
      </Suspense>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <ProjectGrid projects={filtered} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────────────

export default function WorkPage() {
  return (
    <>
      {/* Inject pulse animation keyframes */}
      <style>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        /* hide scrollbar for filter rows */
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(6rem, 10vw, 9rem)",
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
          <Suspense fallback={
            <div style={{ paddingTop: "4rem", color: "rgba(10, 10, 10, 0.4)", fontSize: "0.875rem" }}>
              Loading…
            </div>
          }>
            <WorkPageContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}

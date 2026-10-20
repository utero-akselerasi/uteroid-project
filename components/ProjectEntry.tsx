"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { getProjectCover, getProjectHover } from "@/lib/projectMedia";
import type { Project } from "@/lib/types";
import { disciplineLabels } from "@/lib/types";

export default function ProjectEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const t = useTranslations();

  const coverSrc = getProjectCover(project);
  const hoverSrc = getProjectHover(project);
  const num = String(index + 1).padStart(2, "0");
  const disciplines = project.disciplines
    .map((d) => disciplineLabels[d])
    .join(" · ");

  const scopeSummary =
    project.details?.scope && project.details.scope.length > 0
      ? project.details.scope.slice(0, 2).join(" · ")
      : project.category;

  return (
    <Link
      href={`/work/${project.routeSlug}`}
      className="pe-link"
      aria-label={`${project.title} — ${project.client}`}
    >
      <article className="pe-card">
        {/* ── Image Container (Strict 4:3 Aspect Ratio) ──────────── */}
        <div className="pe-image-wrap">
          {coverSrc ? (
            <>
              <Image
                src={coverSrc}
                alt={`${project.title} — ${project.client}`}
                fill
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
                sizes="(max-width: 440px) 50vw, (max-width: 768px) 50vw, (max-width: 1140px) 33vw, 25vw"
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

              {hoverSrc && (
                <Image
                  src={hoverSrc}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 440px) 50vw, (max-width: 768px) 50vw, (max-width: 1140px) 33vw, 25vw"
                  style={{ objectFit: "cover" }}
                  className="pe-image pe-image--hover"
                  aria-hidden="true"
                />
              )}
            </>
          ) : (
            /* Elegant editorial fallback for projects without covers */
            <div className="pe-placeholder">
              <span className="pe-placeholder__num">{num}</span>
              <span className="pe-placeholder__logo">UTERO.ID</span>
              <span className="pe-placeholder__cat">{project.category}</span>
            </div>
          )}

          {/* Pinterest-inspired floating corner index pill */}
          <div className="pe-card__badge" aria-hidden="true">
            <span>{num}</span>
          </div>

          {/* Hover overlay with Pinterest-style action pill */}
          <div className="pe-overlay" aria-hidden="true">
            <div className="pe-overlay__inner">
              <span className="pe-overlay__scope">{scopeSummary}</span>
              <div className="pe-overlay__btn">
                <span>{t.work.viewProject}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile persistent scope tag */}
          <div className="pe-scope-mobile" aria-hidden="true">
            <span>{scopeSummary}</span>
          </div>
        </div>

        {/* ── Metadata Area (Strictly uniform heights across all cards) ── */}
        <div className="pe-meta">
          {/* Top row: Discipline indicator */}
          <div className="pe-meta__top">
            <span className="pe-meta__discipline">{disciplines}</span>
          </div>

          {/* Title: 2 lines height allocated for exact grid row alignment */}
          <h3 className="pe-title pe-meta__title">
            {project.title}
          </h3>

          {/* Bottom row: Client & Year */}
          <div className="pe-meta__bottom">
            <span className="pe-meta__client">{project.client}</span>
            {project.year && (
              <span className="pe-meta__year">{project.year}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

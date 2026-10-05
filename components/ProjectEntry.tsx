"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
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

  const coverSrc =
    project.homepageCoverImage || project.coverImage || project.heroImage || "";
  const hoverSrc = project.hoverImage ?? null;
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
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <article>
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

          <div className="pe-overlay" aria-hidden="true">
            <div className="pe-overlay__inner">
              <span className="pe-overlay__scope">{scopeSummary}</span>
              <span className="pe-overlay__cta">{t.work.viewProject}</span>
            </div>
          </div>

          <div className="pe-scope-mobile" aria-hidden="true">
            <span>{scopeSummary}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type React from "react";
import { getProjectBySlug, getAllSlugs, getAdjacentProjects } from "@/lib/projects";
import { disciplineLabels, industryLabels } from "@/lib/types";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Case Study`,
    description:
      project.shortDescription ||
      project.excerpt ||
      `${project.title} — ${project.client}`,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Gallery — server-renderable, auto-layout
// ─────────────────────────────────────────────────────────────────────
function GalleryImage({
  src,
  alt,
  aspectRatio,
  sizes = "(max-width: 1400px) 100vw, 1400px",
}: {
  src: string;
  alt: string;
  aspectRatio: string;
  sizes?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        border: "1px solid rgba(0, 0, 0, 0.08)",
      }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
    </div>
  );
}

function ProjectGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  const [first, ...rest] = images;

  // Lay out remaining images as 2-col pairs with occasional full-width
  const rows: React.ReactNode[] = [];
  let j = 0;
  while (j < rest.length) {
    const isAlone = j + 1 >= rest.length || j % 5 === 2;
    if (isAlone) {
      rows.push(
        <GalleryImage
          key={`g-${j}`}
          src={rest[j]}
          alt={`Project image ${j + 2}`}
          aspectRatio="16/7"
        />
      );
      j += 1;
    } else {
      rows.push(
        <div
          key={`g-pair-${j}`}
          className="proj-gallery-pair"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
          }}
        >
          <GalleryImage
            src={rest[j]}
            alt={`Project image ${j + 2}`}
            aspectRatio="4/3"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <GalleryImage
            src={rest[j + 1]}
            alt={`Project image ${j + 3}`}
            aspectRatio="4/3"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      );
      j += 2;
    }
  }

  return (
    <div style={{ marginBottom: "clamp(4rem, 7vw, 7rem)" }}>
      {/* Gallery label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "2rem",
          paddingTop: "clamp(3rem, 5vw, 5rem)",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <span
          style={{
            width: "1.5rem",
            height: "1px",
            backgroundColor: "#c91a1f",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#c91a1f",
          }}
        >
          Project Gallery
        </span>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 1.5rem)" }}
      >
        <GalleryImage src={first} alt="Project image 1" aspectRatio="21/9" />
        {rows}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section label helper
// ─────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      <span
        style={{
          width: "1.5rem",
          height: "1px",
          backgroundColor: "#c91a1f",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#c91a1f",
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(project.slug);
  const coverSrc = project.coverImage || project.heroImage;
  const gallery  = project.galleryImages || project.gallery || [];

  return (
    <>
      <style>{`
        .proj-back:hover   { color: #c91a1f !important; }
        .proj-cta:hover    { background-color: #0a0a0a !important; }
        .proj-allwork:hover { color: #c91a1f !important; border-color: #c91a1f !important; }
        .proj-adj:hover    { border-color: rgba(201,26,31,0.5) !important; background: rgba(201,26,31,0.03) !important; }
        @media (max-width: 640px) {
          .proj-meta-grid  { grid-template-columns: 1fr 1fr !important; }
          .proj-adj-wrap   { flex-direction: column !important; }
          .proj-adj        { max-width: 100% !important; }
          .proj-gallery-pair { grid-template-columns: 1fr !important; }
        }
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
          {/* ── Back link ─────────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(2.5rem, 4vw, 4rem)" }}>
            <Link
              href="/work"
              data-cursor="BACK"
              className="proj-back"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#555555",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              <span>←</span>
              <span>Back to Works</span>
            </Link>
          </div>

          {/* ── Project Header ─────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(2.5rem, 4vw, 4rem)" }}>
            {/* Category + year label */}
            <SectionLabel>
              {project.category} · {project.year}
            </SectionLabel>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(3rem, 7vw, 7rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 0.92,
                margin: "0 0 clamp(2.5rem, 4vw, 4rem)",
              }}
            >
              {project.title}
            </h1>

            {/* Metadata table */}
            <div
              className="proj-meta-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                borderLeft: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              {(
                [
                  { label: "Client",      value: project.client },
                  { label: "Year",        value: project.year },
                  { label: "Industry",    value: industryLabels[project.industry] },
                  { label: "Disciplines", value: project.disciplines.map((d) => disciplineLabels[d]).join(" / ") },
                ] as const
              ).map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderRight: "1px solid rgba(0, 0, 0, 0.08)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(10, 10, 10, 0.4)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#0a0a0a",
                      lineHeight: 1.4,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Hero Image ───────────────────────────────────────── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "21/9",
              minHeight: "280px",
              backgroundColor: "#f5f5f5",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
            }}
          >
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "#eeeeee" }} />
            )}
          </div>

          {/* ── Project Overview ─────────────────────────────────── */}
          <div style={{ maxWidth: "900px", marginBottom: "clamp(3rem, 5vw, 5rem)" }}>
            <SectionLabel>Project Overview</SectionLabel>
            <p
              style={{
                fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                lineHeight: 1.65,
                color: "#0a0a0a",
                marginBottom: "1.5rem",
                fontWeight: 400,
              }}
            >
              {project.description}
            </p>
            {project.shortDescription &&
              project.shortDescription !== project.description && (
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "#555555",
                  }}
                >
                  {project.shortDescription}
                </p>
              )}
          </div>

          {/* ── Case Study Details ──────────────────────────────── */}
          {project.details && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                marginBottom: "clamp(3rem, 5vw, 5rem)",
                paddingTop: "clamp(2.5rem, 4vw, 4rem)",
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              {project.details.scope && project.details.scope.length > 0 && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(10, 10, 10, 0.4)",
                      marginBottom: "1rem",
                    }}
                  >
                    Scope
                  </span>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {project.details.scope.map((s) => (
                      <li
                        key={s}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          fontSize: "0.875rem",
                          color: "#333333",
                          padding: "0.4rem 0",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                        }}
                      >
                        <span style={{ color: "#c91a1f", fontSize: "0.45rem" }}>■</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.details.challenge && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(10, 10, 10, 0.4)",
                      marginBottom: "1rem",
                    }}
                  >
                    Challenge
                  </span>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "#555555",
                    }}
                  >
                    {project.details.challenge}
                  </p>
                </div>
              )}

              {project.details.solution && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(10, 10, 10, 0.4)",
                      marginBottom: "1rem",
                    }}
                  >
                    Approach
                  </span>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "#555555",
                    }}
                  >
                    {project.details.solution}
                  </p>
                </div>
              )}

              {project.details.deliverables &&
                project.details.deliverables.length > 0 && (
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(10, 10, 10, 0.4)",
                        marginBottom: "1rem",
                      }}
                    >
                      Deliverables
                    </span>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {project.details.deliverables.map((d) => (
                        <li
                          key={d}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            fontSize: "0.875rem",
                            color: "#333333",
                            padding: "0.4rem 0",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                          }}
                        >
                          <span style={{ color: "#c91a1f", fontSize: "0.45rem" }}>■</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* ── Gallery ─────────────────────────────────────────── */}
          <ProjectGallery images={gallery} />

          {/* ── Tags ────────────────────────────────────────────── */}
          {project.tags && project.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "clamp(3rem, 5vw, 5rem)",
                paddingTop: "2rem",
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "0.3rem 0.75rem",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#555555",
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Prev / Next ──────────────────────────────────────── */}
          <div
            className="proj-adj-wrap"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1px",
              paddingTop: "clamp(2rem, 4vw, 4rem)",
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
            }}
          >
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                data-cursor="PREV"
                className="proj-adj"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  padding: "1.5rem",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  textDecoration: "none",
                  color: "inherit",
                  maxWidth: "48%",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10, 10, 10, 0.4)",
                  }}
                >
                  ← Previous
                </span>
                <span
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 1.1,
                  }}
                >
                  {prev.title}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#555555",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {prev.category}
                </span>
              </Link>
            ) : (
              <div style={{ flex: 1, maxWidth: "48%" }} />
            )}

            {next ? (
              <Link
                href={`/work/${next.slug}`}
                data-cursor="NEXT"
                className="proj-adj"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                  padding: "1.5rem",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "right",
                  maxWidth: "48%",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10, 10, 10, 0.4)",
                  }}
                >
                  Next →
                </span>
                <span
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 1.1,
                  }}
                >
                  {next.title}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#555555",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {next.category}
                </span>
              </Link>
            ) : (
              <div style={{ flex: 1, maxWidth: "48%", textAlign: "right" }} />
            )}
          </div>

          {/* ── Bottom CTA ──────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Link
              href="/work"
              data-cursor="BACK"
              className="proj-allwork"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
                paddingBottom: "2px",
              }}
            >
              ← All Projects
            </Link>

            <Link
              href="/contact"
              data-cursor="START A PROJECT"
              className="proj-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 2rem",
                backgroundColor: "#c91a1f",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Start Similar Project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

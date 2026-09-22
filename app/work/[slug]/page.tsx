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
    title: `${project.title} — Utero`,
    description:
      project.shortDescription ||
      project.excerpt ||
      `${project.title} — ${project.client}`,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Gallery — editorial layout
// Full-width first image, then 2-col pairs with occasional full-width
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
        backgroundColor: "#f0efed",
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

function ProjectGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  const [first, ...rest] = images;

  // Build rows: pairs of 2 with every 3rd (index 2, 5, 8…) as full-width
  const rows: React.ReactNode[] = [];
  let j = 0;
  while (j < rest.length) {
    const isFullWidth = j % 3 === 2 || j + 1 >= rest.length;
    if (isFullWidth) {
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
          className="sg-pair"
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
    <div style={{ marginBottom: "clamp(5rem, 8vw, 8rem)" }}>
      {/* Gallery section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1.75rem",
          paddingTop: "clamp(3rem, 5vw, 5rem)",
          borderTop: "1px solid rgba(0,0,0,0.07)",
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
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "0.62rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c91a1f",
          }}
        >
          Selected Work
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
        }}
      >
        <GalleryImage src={first} alt="Project image 1" aspectRatio="16/9" />
        {rows}
      </div>
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
  const gallery = project.galleryImages || project.gallery || [];

  // Sorted project index (same sort as archive)
  const allSlugs = getAllSlugs();
  const projectIndex = allSlugs.indexOf(project.slug);
  const num = String(projectIndex + 1).padStart(2, "0");

  const disciplines = project.disciplines.map((d) => disciplineLabels[d]).join(" · ");

  return (
    <>
      <style>{`
        .sd-back:hover  { color: #c91a1f !important; }
        .sd-cta:hover   { background-color: #0a0a0a !important; }
        .sd-adj:hover   { border-color: rgba(201,26,31,0.35) !important; }
        .sd-adj:hover .sd-adj-arrow { color: #c91a1f !important; }
        @media (max-width: 640px) {
          .sg-pair    { grid-template-columns: 1fr !important; }
          .sd-meta    { grid-template-columns: 1fr 1fr !important; }
          .sd-adj-row { flex-direction: column !important; }
          .sd-adj     { max-width: 100% !important; }
          .sd-hero    { aspect-ratio: 4/3 !important; }
        }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(7rem, 11vw, 10rem)",
          paddingBottom: "clamp(5rem, 10vw, 10rem)",
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
          {/* ── Back link ─────────────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(3rem, 5vw, 5rem)" }}>
            <Link
              href="/work"
              className="sd-back"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(10,10,10,0.45)",
                textDecoration: "none",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                transition: "color 0.2s ease",
              }}
            >
              <span>←</span>
              <span>All Work</span>
            </Link>
          </div>

          {/* ── Project Header ────────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(3rem, 5vw, 5rem)" }}>
            {/* Project number */}
            <div
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#c91a1f",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
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
              {num}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2.75rem, 6.5vw, 7rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 0.92,
                margin: "0 0 clamp(2rem, 3.5vw, 3.5rem)",
              }}
            >
              {project.title}
            </h1>

            {/* Metadata row — 4-column grid */}
            <div
              className="sd-meta"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderTop: "1px solid rgba(0,0,0,0.07)",
                borderLeft: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              {(
                [
                  { label: "Client",      value: project.client },
                  { label: "Year",        value: project.year || "—" },
                  { label: "Industry",    value: industryLabels[project.industry] },
                  { label: "Disciplines", value: disciplines },
                ] as const
              ).map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: "1.1rem 1.25rem",
                    borderRight: "1px solid rgba(0,0,0,0.07)",
                    borderBottom: "1px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(10,10,10,0.35)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.8rem",
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

          {/* ── Hero Image ───────────────────────────────────────────── */}
          <div
            className="sd-hero"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "21/9",
              minHeight: "240px",
              backgroundColor: "#f0efed",
              overflow: "hidden",
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
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "#e8e8e8" }} />
            )}
          </div>

          {/* ── Project Overview ──────────────────────────────────────── */}
          <div
            style={{
              maxWidth: "820px",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
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
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                Overview
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
                lineHeight: 1.65,
                color: "#0a0a0a",
                fontWeight: 400,
                margin: 0,
              }}
            >
              {project.description}
            </p>
          </div>

          {/* ── Case Study Details ────────────────────────────────────── */}
          {project.details && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                marginBottom: "clamp(3rem, 5vw, 5rem)",
                paddingTop: "clamp(2rem, 4vw, 3.5rem)",
                borderTop: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              {project.details.scope && project.details.scope.length > 0 && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(10,10,10,0.35)",
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
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "0.82rem",
                          color: "#333333",
                          padding: "0.35rem 0",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          lineHeight: 1.4,
                        }}
                      >
                        <span
                          style={{
                            color: "#c91a1f",
                            fontSize: "0.4rem",
                            marginTop: "0.35em",
                            flexShrink: 0,
                          }}
                        >
                          ■
                        </span>
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
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(10,10,10,0.35)",
                      marginBottom: "1rem",
                    }}
                  >
                    Challenge
                  </span>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.82rem",
                      lineHeight: 1.7,
                      color: "#555555",
                      margin: 0,
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
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(10,10,10,0.35)",
                      marginBottom: "1rem",
                    }}
                  >
                    Approach
                  </span>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "0.82rem",
                      lineHeight: 1.7,
                      color: "#555555",
                      margin: 0,
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
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "rgba(10,10,10,0.35)",
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
                            alignItems: "flex-start",
                            gap: "0.5rem",
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                            fontSize: "0.82rem",
                            color: "#333333",
                            padding: "0.35rem 0",
                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                            lineHeight: 1.4,
                          }}
                        >
                          <span
                            style={{
                              color: "#c91a1f",
                              fontSize: "0.4rem",
                              marginTop: "0.35em",
                              flexShrink: 0,
                            }}
                          >
                            ■
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* ── Gallery ───────────────────────────────────────────────── */}
          <ProjectGallery images={gallery} />

          {/* ── Prev / Next ────────────────────────────────────────────── */}
          <div
            className="sd-adj-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              paddingTop: "clamp(2rem, 4vw, 4rem)",
              borderTop: "1px solid rgba(0,0,0,0.07)",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
            }}
          >
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className="sd-adj"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  padding: "1.25rem 1.5rem",
                  border: "1px solid rgba(0,0,0,0.08)",
                  textDecoration: "none",
                  color: "inherit",
                  maxWidth: "48%",
                  transition: "border-color 0.2s ease",
                }}
              >
                <span
                  className="sd-adj-arrow"
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10,10,10,0.35)",
                    transition: "color 0.2s ease",
                  }}
                >
                  ← Previous
                </span>
                <span
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
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
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "0.65rem",
                    color: "rgba(10,10,10,0.35)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {prev.year}
                </span>
              </Link>
            ) : (
              <div style={{ flex: 1, maxWidth: "48%" }} />
            )}

            {next ? (
              <Link
                href={`/work/${next.slug}`}
                className="sd-adj"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.4rem",
                  padding: "1.25rem 1.5rem",
                  border: "1px solid rgba(0,0,0,0.08)",
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "right",
                  maxWidth: "48%",
                  transition: "border-color 0.2s ease",
                }}
              >
                <span
                  className="sd-adj-arrow"
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10,10,10,0.35)",
                    transition: "color 0.2s ease",
                  }}
                >
                  Next →
                </span>
                <span
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
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
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "0.65rem",
                    color: "rgba(10,10,10,0.35)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {next.year}
                </span>
              </Link>
            ) : (
              <div style={{ flex: 1, maxWidth: "48%", textAlign: "right" }} />
            )}
          </div>

          {/* ── Bottom CTA ─────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <Link
              href="/work"
              className="sd-back"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(10,10,10,0.55)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.18)",
                paddingBottom: "2px",
                transition: "color 0.2s ease",
              }}
            >
              ← All Projects
            </Link>

            <Link
              href="/contact"
              className="sd-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 2rem",
                backgroundColor: "#c91a1f",
                color: "#ffffff",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Start a Project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/services";
import { getProjectBySlug } from "@/lib/projects";

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} — Capabilities & Practice`,
    description: service.description,
  };
}

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

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedProjects = service.relatedProjectSlugs
    .map((pSlug) => getProjectBySlug(pSlug))
    .filter(Boolean);

  return (
    <>
      <style>{`
        .serv-back:hover { color: #c91a1f !important; }
        .serv-cta:hover { background-color: #0a0a0a !important; }
        .serv-all:hover { color: #c91a1f !important; border-color: #c91a1f !important; }
        .serv-proj-card:hover h3 { color: #c91a1f !important; transform: translateX(4px); }
        .serv-proj-card:hover img { transform: scale(1.04); }
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
          {/* ── Back Link ────────────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(2.5rem, 4vw, 4rem)" }}>
            <Link
              href="/services"
              data-cursor="BACK"
              className="serv-back"
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
              <span>Back to Services</span>
            </Link>
          </div>

          {/* ── Header ───────────────────────────────────────────── */}
          <div style={{ marginBottom: "clamp(2rem, 3vw, 3rem)" }}>
            <SectionLabel>
              Discipline {service.number} · {service.name}
            </SectionLabel>

            <h1
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 1.1,
                margin: "0 0 1rem",
              }}
            >
              {service.tagline}
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                lineHeight: 1.5,
                color: "#555555",
                maxWidth: "800px",
                margin: 0,
                fontWeight: 400,
              }}
            >
              {service.heroHeadline}
            </p>
          </div>

          {/* ── Hero Image ───────────────────────────────────────── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              minHeight: "280px",
              maxHeight: "500px",
              backgroundColor: "#0a0a0a",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(2rem, 3vw, 3rem)",
            }}
          >
            {service.image && (
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1400px) 100vw, 1400px"
                placeholder="blur"
                blurDataURL={service.imageBlur}
                style={{
                  objectFit: "cover",
                  objectPosition: service.imagePosition,
                }}
              />
            )}
          </div>

          {/* ── Overview & Approach (2 Columns) ─────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(1.5rem, 3vw, 3rem)",
              paddingBottom: "clamp(2rem, 3vw, 3rem)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(2rem, 3vw, 3rem)",
            }}
          >
            <div>
              <SectionLabel>Discipline Overview</SectionLabel>
              <p
                style={{
                  fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
                  lineHeight: 1.7,
                  color: "#0a0a0a",
                  margin: 0,
                }}
              >
                {service.overview}
              </p>
            </div>

            <div>
              <SectionLabel>Strategic Approach</SectionLabel>
              <p
                style={{
                  fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                  lineHeight: 1.75,
                  color: "#555555",
                  margin: 0,
                }}
              >
                {service.approach}
              </p>
            </div>
          </div>

          {/* ── Capabilities Breakdown Cards ────────────────────── */}
          <div style={{ marginBottom: "clamp(2rem, 3vw, 3rem)" }}>
            <SectionLabel>Core Capabilities</SectionLabel>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "clamp(1rem, 1.5vw, 1.5rem)",
              }}
            >
              {service.capabilities.map((cap, i) => (
                <div
                  key={cap.title}
                  style={{
                    padding: "2rem",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: "#c91a1f",
                        fontFamily: "monospace",
                        marginBottom: "1rem",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        letterSpacing: "-0.02em",
                        textTransform: "uppercase",
                        color: "#0a0a0a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {cap.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: 1.65,
                        color: "#555555",
                        margin: 0,
                      }}
                    >
                      {cap.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Scope of Deliverables ────────────────────────────── */}
          <div
            style={{
              paddingBottom: "clamp(2rem, 3vw, 3rem)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(2rem, 3vw, 3rem)",
            }}
          >
            <SectionLabel>Scope of Deliverables</SectionLabel>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {service.deliverables.map((del) => (
                <div
                  key={del}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem 1.25rem",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#0a0a0a",
                  }}
                >
                  <span style={{ color: "#c91a1f", fontSize: "0.5rem" }}>■</span>
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Selected Projects ────────────────────────── */}
          {relatedProjects.length > 0 && (
            <div style={{ marginBottom: "clamp(2.5rem, 4vw, 4rem)" }}>
              <SectionLabel>Selected Work in this Discipline</SectionLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "clamp(1rem, 2vw, 2rem)",
                }}
              >
                {relatedProjects.map((proj) => {
                  if (!proj) return null;
                  const cover = proj.coverImage || proj.heroImage;

                  return (
                    <Link
                      key={proj.slug}
                      href={`/work/${proj.slug}`}
                      className="serv-proj-card"
                      data-cursor="VIEW CASE →"
                      style={{
                        display: "block",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16/10",
                          backgroundColor: "#f5f5f5",
                          overflow: "hidden",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          marginBottom: "1.25rem",
                        }}
                      >
                        {cover && (
                          <Image
                            src={cover}
                            alt={proj.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          />
                        )}
                        <div
                          style={{
                            position: "absolute",
                            top: "1rem",
                            left: "1rem",
                            backgroundColor: "#c91a1f",
                            color: "#ffffff",
                            padding: "3px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                          }}
                        >
                          {proj.category}
                        </div>
                      </div>

                      <span
                        style={{
                          display: "block",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(10, 10, 10, 0.4)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {proj.client} · {proj.year}
                      </span>

                      <h3
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "1.35rem",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          textTransform: "uppercase",
                          color: "#0a0a0a",
                          margin: 0,
                          lineHeight: 1.1,
                          transition: "color 0.2s ease, transform 0.2s ease",
                        }}
                      >
                        {proj.title}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Bottom Action Bar ────────────────────────────────── */}
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
              href="/services"
              data-cursor="BACK"
              className="serv-all"
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
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
            >
              ← All Services
            </Link>

            <Link
              href="/contact"
              data-cursor="START A PROJECT"
              className="serv-cta"
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
              Inquire {service.name} Project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

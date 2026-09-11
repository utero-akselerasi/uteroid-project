import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Studio — About Utero Indonesia",
  description:
    "About Utero — an Indonesian brand consultancy and multidisciplinary creative design studio based in Malang since 1998.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.25rem",
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

export default function StudioPage() {
  return (
    <>
      <style>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        .studio-cta:hover { background-color: #0a0a0a !important; }
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
          {/* ── Header ───────────────────────────────────────────── */}
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
              marginBottom: "clamp(3.5rem, 6vw, 6rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
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
                02 / ABOUT UTERO INDONESIA
              </span>
            </div>

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
                  Studio
                </h1>
                <p
                  style={{
                    marginTop: "1.25rem",
                    fontSize: "clamp(0.95rem, 1.3vw, 1.25rem)",
                    color: "#555555",
                    letterSpacing: "0.01em",
                    lineHeight: 1.6,
                    maxWidth: "680px",
                  }}
                >
                  A multidisciplinary brand consultancy and spatial design studio founded in Malang in 1998. We bridge strategic intellect with industrial fabrication.
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
                  1998
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
                  Established
                </span>
              </div>
            </div>
          </div>

          {/* ── Key Metrics Grid ─────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              borderLeft: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(4rem, 7vw, 7rem)",
            }}
          >
            {[
              { num: "25+", label: "Years of Practice", sub: "Continuous operation since 1998" },
              { num: "07", label: "Integrated Disciplines", sub: "Brand, Product, Space & Digital" },
              { num: "500+", label: "Completed Projects", sub: "Corporate, Public & Commercial" },
              { num: "Malang", label: "Studio Headquarters", sub: "East Java, Indonesia" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  borderRight: "1px solid rgba(0, 0, 0, 0.08)",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "#0a0a0a",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {stat.num}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                    marginBottom: "0.35rem",
                  }}
                >
                  {stat.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    color: "#555555",
                    lineHeight: 1.4,
                  }}
                >
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>

          {/* ── Studio Narrative (2 Columns) ─────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "clamp(2rem, 5vw, 5rem)",
              paddingBottom: "clamp(4rem, 7vw, 7rem)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(4rem, 7vw, 7rem)",
            }}
          >
            <div style={{ gridColumn: "span 12" }} className="lg:!col-span-6">
              <SectionLabel>The Execution Philosophy</SectionLabel>
              <blockquote
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  lineHeight: 1.1,
                  margin: "0 0 1.5rem",
                }}
              >
                &ldquo;Ide tanpa realisasi sama dengan sampah.&rdquo;
              </blockquote>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  lineHeight: 1.7,
                  color: "#555555",
                  margin: 0,
                }}
              >
                Strategy without physical manifestation is merely theoretical. Over our quarter-century journey, Utero has earned its reputation by rejecting purely cosmetic design in favor of rigorous, end-to-end execution. We conceptualize, prototype, engineer, and fabricate.
              </p>
            </div>

            <div style={{ gridColumn: "span 12" }} className="lg:!col-span-6">
              <SectionLabel>Integrated Disciplines</SectionLabel>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  lineHeight: 1.7,
                  color: "#555555",
                  marginBottom: "1.5rem",
                }}
              >
                Unlike specialized boutique agencies that isolate digital from physical, Utero houses identity designers, industrial packaging craftsmen, spatial wayfinding architects, and structural sign engineers under a single unified philosophy.
              </p>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  lineHeight: 1.7,
                  color: "#555555",
                  margin: 0,
                }}
              >
                Whether developing master public wayfinding for the Malang Creative Center (MCC) or scaling consumer packaged goods for national distribution, our teams deliver seamless brand continuity across all sensory dimensions.
              </p>
            </div>
          </div>

          {/* ── Studio Culture & Craft (Visual Spread) ──────────── */}
          <div style={{ marginBottom: "clamp(4rem, 7vw, 7rem)" }}>
            <SectionLabel>Studio Culture &amp; Infrastructure</SectionLabel>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "clamp(1.5rem, 2.5vw, 2rem)",
                marginTop: "2rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/10",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                  alt="Utero Studio Workspace"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/10",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop"
                  alt="Studio Planning & Design Review"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* ── Client Sectors Served ────────────────────────────── */}
          <div
            style={{
              paddingBottom: "clamp(4rem, 7vw, 7rem)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "clamp(4rem, 7vw, 7rem)",
            }}
          >
            <SectionLabel>Client Sectors Served</SectionLabel>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
                marginTop: "2rem",
              }}
            >
              {[
                { sector: "Government & Public Sector", desc: "Municipal creative centers, cultural bureaus, civic wayfinding systems." },
                { sector: "Corporate & Financial", desc: "Enterprise brand guidelines, annual reporting, headquarters spatial branding." },
                { sector: "Food & Beverage (F&B)", desc: "End-to-end cafe branding, retail packaging, menu systems, and physical signage." },
                { sector: "Real Estate & Architecture", desc: "Residential pylons, architectural totems, directional signage, marketing suites." },
                { sector: "Higher Education", desc: "University identity systems, campus wayfinding, and institutional publications." },
                { sector: "Arts & Public Culture", desc: "Exhibition identity, city creative festivals, and artistic publication catalogues." },
              ].map((item) => (
                <div
                  key={item.sector}
                  style={{
                    padding: "1.75rem",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#0a0a0a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.sector}
                  </span>
                  <p
                    style={{
                      fontSize: "0.825rem",
                      lineHeight: 1.6,
                      color: "#555555",
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom CTA ──────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                  marginBottom: "0.35rem",
                }}
              >
                Collaborate with Utero
              </span>
              <p
                style={{
                  fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  color: "#0a0a0a",
                  margin: 0,
                }}
              >
                Ready to solve your brand or spatial challenge?
              </p>
            </div>

            <Link
              href="/contact"
              data-cursor="START A PROJECT"
              className="studio-cta"
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
              Connect with our Studio →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

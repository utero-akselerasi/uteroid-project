"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

interface Capability {
  id: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string[];
  image: string;
  slug: string;
}

const capabilities: Capability[] = [
  {
    id: "01",
    name: "IDENTITY",
    tagline: "Strategic Brand Systems & Guidelines",
    description:
      "Crafting distinctive visual identities, logos, brand architecture, and meticulous guidelines that position organizations with authority and emotional resonance.",
    deliverables: [
      "Visual Identity & Logo Systems",
      "Brand Guidelines & Manuals",
      "Corporate Stationery & Collateral",
      "Brand Architecture & Naming",
    ],
    image: "/img/remote/brand.jpg",
    slug: "brand",
  },
  {
    id: "02",
    name: "PRINTED",
    tagline: "Editorial, Publications & Packaging",
    description:
      "Engineering tactile print media, company profiles, catalogs, annual reports, and physical product packaging with world-class typographic precision and print finishing.",
    deliverables: [
      "Company Profiles & Annual Reports",
      "Catalogs & Editorial Publications",
      "Product Packaging & Label Systems",
      "Brochures & Marketing Print",
    ],
    image: "/img/remote/product.jpg",
    slug: "product",
  },
  {
    id: "03",
    name: "MISC",
    tagline: "Merchandise, Uniforms & Collateral",
    description:
      "Designing branded merchandise, corporate uniforms, event collateral, calendars, and bespoke physical items that turn employees and clients into passionate brand advocates.",
    deliverables: [
      "Corporate Uniforms & Apparel",
      "Bespoke Merchandise & Swag",
      "Event Systems & Exhibition Kits",
      "Executive Gift Sets & Souvenirs",
    ],
    image: "/img/remote/promotion.jpg",
    slug: "promotion",
  },
  {
    id: "04",
    name: "DIGITAL",
    tagline: "Websites, UI/UX & Digital Media",
    description:
      "Building high-performance websites, user interfaces, social media design frameworks, and interactive digital assets that communicate seamlessly across screens.",
    deliverables: [
      "Bespoke Web Design & UI/UX",
      "Interactive Digital Experiences",
      "Social Media Design Systems",
      "Digital Branding & Motion Assets",
    ],
    image: "/img/remote/digital.jpg",
    slug: "digital",
  },
  {
    id: "05",
    name: "ENVIRONMENTAL",
    tagline: "Signage, Wayfinding & Spatial Graphics",
    description:
      "Transforming architecture and physical environments into experiential branded spaces through large-scale directional signage, architectural graphics, and outdoor media.",
    deliverables: [
      "Wayfinding & Directional Signage",
      "Indoor Office Branding & Graphics",
      "Outdoor Billboards & Architectural Pylons",
      "Exhibition & Event Space Design",
    ],
    image: "/img/remote/space.jpg",
    slug: "space",
  },
];

export default function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeCapability = capabilities[activeIdx] || capabilities[0];

  return (
    <section
      id="capabilities"
      style={{
        padding: "clamp(5rem, 9vw, 8.5rem) 0",
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4.5rem)" }}>
          <RevealOnScroll>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#e31e24",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#e31e24",
                }}
              >
                04 / CREATIVE CAPABILITIES
              </span>
            </div>
          </RevealOnScroll>

          {/* Heading from PDF reference */}
          <RevealOnScroll delay={1}>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 1.05,
                margin: 0,
                maxWidth: "1100px",
              }}
            >
              WHAT CAN WE{" "}
              <span style={{ color: "#e31e24" }}>DESIGN FOR YOU?</span>
            </h2>
          </RevealOnScroll>

          {/* Supporting Statement */}
          <RevealOnScroll delay={2}>
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)",
                lineHeight: 1.6,
                color: "rgba(10, 10, 10, 0.7)",
                maxWidth: "850px",
                marginTop: "1.2rem",
              }}
            >
              Comprehensive design services tailored to your strategic needs &mdash; from
              foundational brand identity to physical packaging, digital platforms, and
              three-dimensional architectural spaces.
            </p>
          </RevealOnScroll>
        </div>

        {/* ─── INTERACTIVE CAPABILITIES GRID ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 5rem)",
            alignItems: "flex-start",
            borderTop: "1px solid rgba(10, 10, 10, 0.12)",
            paddingTop: "clamp(2rem, 3.5vw, 3rem)",
          }}
        >
          {/* Left Column: 5 Capabilities matching PDF */}
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {capabilities.map((item, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    data-cursor="EXPLORE"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "clamp(1.1rem, 2vw, 1.6rem) 0",
                      borderBottom: "1px solid rgba(10, 10, 10, 0.1)",
                      backgroundColor: "transparent",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "padding-left 0.25s ease, color 0.2s ease",
                      paddingLeft: isActive ? "14px" : "0",
                      borderLeftColor: isActive ? "#e31e24" : "transparent",
                      borderLeftWidth: isActive ? "4px" : "0px",
                      borderLeftStyle: "solid",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "1.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: isActive ? "#e31e24" : "rgba(10, 10, 10, 0.4)",
                          fontFamily: "monospace",
                        }}
                      >
                        {item.id}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "clamp(1.2rem, 1.8vw, 1.75rem)",
                          fontWeight: 700,
                          letterSpacing: "-0.01em",
                          textTransform: "uppercase",
                          color: isActive ? "#e31e24" : "#0a0a0a",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "1.25rem",
                        color: isActive ? "#e31e24" : "rgba(10, 10, 10, 0.3)",
                        transform: isActive ? "translateX(6px)" : "translateX(0)",
                        transition: "transform 0.2s ease, color 0.2s ease",
                      }}
                    >
                      &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Preview Card for Active Capability */}
          <div>
            <div
              style={{
                backgroundColor: "#f9f9f9",
                border: "1px solid rgba(10, 10, 10, 0.08)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "260px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={activeCapability.image}
                  alt={activeCapability.name}
                  fill
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    backgroundColor: "#0d0d0d",
                    color: "#ffffff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.3rem 0.6rem",
                  }}
                >
                  CATEGORY {activeCapability.id}
                </div>
              </div>

              <div style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
                <h3
                  style={{
                    fontSize: "clamp(1.1rem, 1.4vw, 1.35rem)",
                    fontWeight: 700,
                    color: "#0a0a0a",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {activeCapability.tagline}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "rgba(10, 10, 10, 0.7)",
                    margin: "0 0 1.5rem",
                  }}
                >
                  {activeCapability.description}
                </p>

                <div
                  style={{
                    borderTop: "1px solid rgba(10, 10, 10, 0.1)",
                    paddingTop: "1.2rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#e31e24",
                      marginBottom: "0.8rem",
                    }}
                  >
                    CORE DELIVERABLES:
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "0.6rem",
                    }}
                  >
                    {activeCapability.deliverables.map((del) => (
                      <div
                        key={del}
                        style={{
                          fontSize: "0.82rem",
                          color: "rgba(10, 10, 10, 0.8)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ color: "#e31e24", fontWeight: 700 }}>&bull;</span>
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/services/${activeCapability.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    backgroundColor: "#0d0d0d",
                    padding: "0.65rem 1.25rem",
                    textDecoration: "none",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e31e24")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0d0d0d")
                  }
                >
                  <span>VIEW DETAILS &amp; ARCHIVE</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

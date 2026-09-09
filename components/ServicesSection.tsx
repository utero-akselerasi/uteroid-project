"use client";

import { useState } from "react";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

interface Capability {
  id: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string[];
  image: string;
}

const capabilities: Capability[] = [
  {
    id: "01",
    name: "BRAND",
    tagline: "Strategic Identity & Positioning",
    description: "Crafting comprehensive brand identities, naming, guidelines, and visual architectures that establish unforgettable market presence.",
    deliverables: ["Visual Identity Systems", "Brand Architecture", "Brand Guidelines", "Naming & Tone of Voice"],
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "02",
    name: "PRODUCT",
    tagline: "Physical & Digital Artifacts",
    description: "Designing tactile product packaging, physical merchandise, and interactive product interfaces with supreme ergonomic craft.",
    deliverables: ["Packaging Design", "Structural Form", "Merchandise Systems", "Label Systems"],
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "03",
    name: "PROMOTION",
    tagline: "High-Impact Creative Campaigns",
    description: "Conceptualizing strategic promotional campaigns, launch narratives, and print/digital assets that drive consumer action.",
    deliverables: ["Campaign Strategy", "Key Visuals", "Marketing Collateral", "Social Assets"],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "04",
    name: "SPACE",
    tagline: "Wayfinding & Environmental Graphics",
    description: "Translating brand DNA into three-dimensional architecture, directional wayfinding, and spatial experiences for public and private venues.",
    deliverables: ["Wayfinding Systems", "Environmental Typography", "Exhibition Design", "Interior Branding"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "05",
    name: "DIGITAL",
    tagline: "Connected Brand Experiences",
    description: "Designing bespoke websites, web applications, and digital platforms that combine aesthetic power with high performance and accessibility.",
    deliverables: ["Web Design & UI/UX", "Design Systems", "Interactive Prototypes", "Accessible Platforms"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "06",
    name: "INDOOR",
    tagline: "Commercial & Office Visuals",
    description: "Developing indoor signage, wall graphics, acoustic branding, and interior communication elements for institutions and businesses.",
    deliverables: ["Office Graphics", "Indoor Signage", "Acoustic Panels", "Bespoke Installations"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "07",
    name: "OUTDOOR",
    tagline: "Large-Scale Public Visibility",
    description: "Engineering massive outdoor billboards, building wraps, pylons, and architectural banners that dominate cityscapes with dignity.",
    deliverables: ["City Billboards", "Architectural Pylons", "Building Graphics", "Transit Media"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
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
        backgroundColor: "#f5efe6",
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
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
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
                  backgroundColor: "#c91a1f",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                04 / CREATIVE APPROACH &amp; CAPABILITIES
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={1}>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                lineHeight: 1.05,
                margin: 0,
                maxWidth: "1100px",
              }}
            >
              Our philosophy is built on people addicted to creating, learning, and growing together — discovering what others miss.
            </h2>
          </RevealOnScroll>

          {/* Supporting Philosophy statement */}
          <RevealOnScroll delay={2}>
            <p
              style={{
                fontSize: "clamp(1rem, 1.25vw, 1.2rem)",
                lineHeight: 1.7,
                color: "rgba(10, 10, 10, 0.75)",
                maxWidth: "850px",
                marginTop: "1.5rem",
              }}
            >
              Using progressive design systems and modern technologies, we ensure that every brand experience is visible, accessible, and treads lightly on the environment — driving digital arts and engaging human connections.
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
            borderTop: "2px solid #0a0a0a",
            paddingTop: "clamp(2rem, 4vw, 3rem)",
          }}
        >
          {/* Left Column: List of 7 Capabilities */}
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
                      padding: "clamp(1rem, 2vw, 1.5rem) 0",
                      borderBottom: "1px solid rgba(10, 10, 10, 0.12)",
                      backgroundColor: "transparent",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "padding-left 0.25s ease, color 0.2s ease",
                      paddingLeft: isActive ? "12px" : "0",
                      borderLeftColor: isActive ? "#c91a1f" : "transparent",
                      borderLeftWidth: isActive ? "4px" : "0px",
                      borderLeftStyle: "solid",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: isActive ? "#c91a1f" : "rgba(10, 10, 10, 0.4)",
                          fontFamily: "monospace",
                        }}
                      >
                        {item.id}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          textTransform: "uppercase",
                          color: isActive ? "#c91a1f" : "#0a0a0a",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "1.25rem",
                        color: isActive ? "#c91a1f" : "rgba(10, 10, 10, 0.3)",
                        transform: isActive ? "translateX(4px)" : "translateX(0)",
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
          <div
            style={{
              position: "sticky",
              top: "120px",
              backgroundColor: "#0a0a0a",
              color: "#ffffff",
              padding: "clamp(2rem, 3.5vw, 3rem)",
              border: "1px solid rgba(10, 10, 10, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
            }}
          >
            {/* Image Preview */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                backgroundColor: "#161616",
                overflow: "hidden",
              }}
            >
              <Image
                key={activeCapability.id}
                src={activeCapability.image}
                alt={activeCapability.name}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  backgroundColor: "#c91a1f",
                  color: "#ffffff",
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                }}
              >
                {activeCapability.id} / {activeCapability.name}
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  color: "#ffffff",
                  marginBottom: "0.5rem",
                }}
              >
                {activeCapability.tagline}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.75)",
                  margin: 0,
                }}
              >
                {activeCapability.description}
              </p>
            </div>

            {/* Deliverables tags */}
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                  marginBottom: "0.75rem",
                }}
              >
                DELIVERABLES
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {activeCapability.deliverables.map((del) => (
                  <span
                    key={del}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      padding: "4px 10px",
                      borderRadius: "2px",
                    }}
                  >
                    {del}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

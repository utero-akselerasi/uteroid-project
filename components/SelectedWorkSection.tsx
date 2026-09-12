"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/projects";
import { disciplineLabels } from "@/lib/types";
import RevealOnScroll, { RevealImage } from "./RevealOnScroll";

export default function SelectedWorkSection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Take the primary 4 real showcase projects
  const recentProjects = projects.slice(0, 4);

  return (
    <section
      id="recent-works"
      style={{
        padding: "clamp(2rem, 4vw, 3rem) 0",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 2vw, 2rem)",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
            marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: "1rem",
          }}
        >
          <div>
            <RevealOnScroll>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
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
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                  }}
                >
                  02 / PORTFOLIO
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1}>
              <h2
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(1.2rem, 2vw, 2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                RECENT WORKS
              </h2>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={2}>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                / 2021 — 2024
              </span>

              <Link
                href="/work"
                data-cursor="OPEN"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderBottom: "1px solid #c91a1f",
                  paddingBottom: "2px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#c91a1f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                <span>SEE ALL WORKS</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        {/* ─── UNIFORM 2x2 GRID LAYOUT ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {recentProjects.map((project, idx) => {
            const projectNumber = `0${idx + 1}`;
            const isHovered = hoveredSlug === project.slug;

            return (
              <RevealOnScroll key={project.slug} delay={idx + 1}>
                <Link
                  href={`/work/${project.slug}`}
                  data-cursor="VIEW PROJECT &rarr;"
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  onMouseEnter={() => setHoveredSlug(project.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  <article>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "4/3",
                        backgroundColor: "#161616",
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {project.heroImage ? (
                        <Image
                          src={project.heroImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{
                            objectFit: "cover",
                            objectPosition: project.slug === "garageplug" ? "center 20%" : project.slug === "stamford" ? "center 15%" : "center",
                            transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease",
                            transform: isHovered ? "scale(1.03)" : "scale(1)",
                            filter: isHovered ? "brightness(1.05)" : "brightness(0.9)",
                          }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", backgroundColor: "#1e1e1e" }} />
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ fontSize: "0.65rem", color: "#c91a1f", fontWeight: 500, letterSpacing: "0.06em" }}>
                          {projectNumber} / {project.year}
                        </span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" }}>
                          {project.disciplines.map((d) => disciplineLabels[d]).join(" · ")}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "clamp(0.85rem, 1.2vw, 1.2rem)",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          textTransform: "uppercase",
                          margin: "0 0 0.25rem",
                          color: isHovered ? "#c91a1f" : "#ffffff",
                          transition: "color 0.2s ease, transform 0.2s ease",
                          transform: isHovered ? "translateX(2px)" : "translateX(0)",
                        }}
                      >
                        {project.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "0.7rem",
                          lineHeight: 1.4,
                          color: "rgba(255, 255, 255, 0.65)",
                          margin: 0,
                        }}
                      >
                        {project.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

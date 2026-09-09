"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/projects";
import { disciplineLabels } from "@/lib/types";
import RevealOnScroll, { RevealImage } from "./RevealOnScroll";

export default function SelectedWorkSection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Take the primary 5 real showcase projects
  const recentProjects = projects.slice(0, 5);

  return (
    <section
      id="recent-works"
      style={{
        padding: "clamp(5rem, 9vw, 8.5rem) 0",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1.5rem",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: "1.5rem",
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
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
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
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  lineHeight: 1,
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
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
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
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderBottom: "2px solid #c91a1f",
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

        {/* ─── CURATED EDITORIAL ASYMMETRIC PROJECT LAYOUT ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(3.5rem, 7vw, 6.5rem)" }}>
          {/* Project 01: Large Featured Case Study (Amarta Wisesa) */}
          {recentProjects[0] && (
            <RevealOnScroll>
              <Link
                href={`/work/${recentProjects[0].slug}`}
                data-cursor="VIEW PROJECT &rarr;"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
                onMouseEnter={() => setHoveredSlug(recentProjects[0].slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <article>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "21/9",
                      minHeight: "340px",
                      backgroundColor: "#161616",
                      overflow: "hidden",
                      marginBottom: "1.75rem",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {recentProjects[0].heroImage ? (
                      <Image
                        src={recentProjects[0].heroImage}
                        alt={recentProjects[0].title}
                        fill
                        sizes="(max-width: 1400px) 100vw, 1400px"
                        style={{
                          objectFit: "cover",
                          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease",
                          transform: hoveredSlug === recentProjects[0].slug ? "scale(1.03)" : "scale(1)",
                          filter: hoveredSlug === recentProjects[0].slug ? "brightness(1.05)" : "brightness(0.9)",
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#1e1e1e" }} />
                    )}

                    {/* Red accent corner tag */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1.25rem",
                        left: "1.25rem",
                        backgroundColor: "#c91a1f",
                        color: "#ffffff",
                        padding: "4px 10px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                      }}
                    >
                      FEATURED CASE STUDY
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "1.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#c91a1f", fontWeight: 700, letterSpacing: "0.1em" }}>
                        01 / {recentProjects[0].category}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "clamp(1.75rem, 3.2vw, 3rem)",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          textTransform: "uppercase",
                          margin: "0.4rem 0 0",
                          color: hoveredSlug === recentProjects[0].slug ? "#c91a1f" : "#ffffff",
                          transition: "color 0.2s ease, transform 0.2s ease",
                          transform: hoveredSlug === recentProjects[0].slug ? "translateX(6px)" : "translateX(0)",
                        }}
                      >
                        {recentProjects[0].title}
                      </h3>
                    </div>

                    <div style={{ maxWidth: "520px" }}>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          color: "rgba(255, 255, 255, 0.7)",
                          margin: "0 0 1rem",
                        }}
                      >
                        {recentProjects[0].excerpt}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#c91a1f",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <span>SHOW PROJECT</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </RevealOnScroll>
          )}

          {/* Projects 02 & 03: 2-Column Asymmetric Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(2rem, 4vw, 3.5rem)",
            }}
          >
            {recentProjects.slice(1, 3).map((project, idx) => {
              const projectNumber = `0${idx + 2}`;
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
                          aspectRatio: idx === 0 ? "4/3" : "16/10",
                          backgroundColor: "#161616",
                          overflow: "hidden",
                          marginBottom: "1.25rem",
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
                            marginBottom: "0.35rem",
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", color: "#c91a1f", fontWeight: 700, letterSpacing: "0.1em" }}>
                            {projectNumber} / {project.year}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" }}>
                            {project.disciplines.map((d) => disciplineLabels[d]).join(" · ")}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                            fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            textTransform: "uppercase",
                            margin: "0 0 0.5rem",
                            color: isHovered ? "#c91a1f" : "#ffffff",
                            transition: "color 0.2s ease, transform 0.2s ease",
                            transform: isHovered ? "translateX(4px)" : "translateX(0)",
                          }}
                        >
                          {project.title}
                        </h3>

                        <p
                          style={{
                            fontSize: "0.9rem",
                            lineHeight: 1.6,
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

          {/* Project 04 & 05: Asymmetric Horizontal + Offset visual */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(2rem, 4vw, 3.5rem)",
            }}
          >
            {recentProjects.slice(3, 5).map((project, idx) => {
              const projectNumber = `0${idx + 4}`;
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
                          aspectRatio: idx === 0 ? "16/9" : "4/3",
                          backgroundColor: "#161616",
                          overflow: "hidden",
                          marginBottom: "1.25rem",
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
                            marginBottom: "0.35rem",
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", color: "#c91a1f", fontWeight: 700, letterSpacing: "0.1em" }}>
                            {projectNumber} / {project.year}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" }}>
                            {project.disciplines.map((d) => disciplineLabels[d]).join(" · ")}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                            fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            textTransform: "uppercase",
                            margin: "0 0 0.5rem",
                            color: isHovered ? "#c91a1f" : "#ffffff",
                            transition: "color 0.2s ease, transform 0.2s ease",
                            transform: isHovered ? "translateX(4px)" : "translateX(0)",
                          }}
                        >
                          {project.title}
                        </h3>

                        <p
                          style={{
                            fontSize: "0.9rem",
                            lineHeight: 1.6,
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
      </div>
    </section>
  );
}

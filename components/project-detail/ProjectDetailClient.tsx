"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProjectGallery from "./ProjectGallery";
import ProjectNavigation from "./ProjectNavigation";

interface ProjectDetailClientProps {
  project: Project;
  prev: Pick<Project, "slug" | "title" | "year" | "coverImage"> | null;
  next: Pick<Project, "slug" | "title" | "year" | "coverImage"> | null;
  projectNum: string;
  disciplines: string;
  industryLabel: string;
}

export default function ProjectDetailClient({
  project,
  prev,
  next,
  projectNum,
  disciplines,
  industryLabel,
}: ProjectDetailClientProps) {
  const coverSrc = project.coverImage || project.heroImage;
  const gallery = project.galleryImages || project.gallery || [];

  // Reliable scroll to top on mount and route/slug change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [project.slug]);

  // Determine which detail fields exist
  const hasScope = project.details?.scope && project.details.scope.length > 0;
  const hasChallenge = !!project.details?.challenge;
  const hasSolution = !!project.details?.solution;
  const hasDeliverables =
    project.details?.deliverables && project.details.deliverables.length > 0;
  const hasAnyDetails =
    hasScope || hasChallenge || hasSolution || hasDeliverables;

  return (
    <>
      {/* ── HERO (Calmed & Refined) ─────────────────────────────── */}
      <section className="pd-hero">
        {/* Cover image with subtle scale-in animation */}
        <div className="pd-hero__image-wrap">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              priority
              loading="eager"
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#0d0d0d",
              }}
            />
          )}
        </div>

        {/* Filmic subtle gradient vignette — clean, no heavy black bar */}
        <div className="pd-hero__overlay" />

        {/* Content: number, calm editorial title, metadata */}
        <div className="pd-hero__content">
          <div className="pd-hero__number">
            <span />
            <span>{projectNum}</span>
          </div>

          <h1 className="pd-hero__title">{project.title}</h1>

          <div className="pd-hero__meta">
            <div className="pd-hero__meta-item">
              <span className="pd-hero__meta-label">Client</span>
              <span className="pd-hero__meta-value">{project.client}</span>
            </div>
            <div className="pd-hero__meta-item">
              <span className="pd-hero__meta-label">Year</span>
              <span className="pd-hero__meta-value">{project.year || "—"}</span>
            </div>
            <div className="pd-hero__meta-item">
              <span className="pd-hero__meta-label">Industry</span>
              <span className="pd-hero__meta-value">{industryLabel}</span>
            </div>
            <div className="pd-hero__meta-item">
              <span className="pd-hero__meta-label">Disciplines</span>
              <span className="pd-hero__meta-value">{disciplines}</span>
            </div>
          </div>
        </div>

        {/* Subtle scroll cue */}
        <div className="pd-scroll-cue">
          <div className="pd-scroll-cue__line" />
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", minHeight: "50vh" }}>
        <div className="pd-body">
          {/* Back link */}
          <Link href="/work" className="pd-back" style={{ display: "block" }}>
            <span>←</span>
            <span>All Work</span>
          </Link>

          {/* ── Overview ────────────────────────────────── */}
          <RevealOnScroll>
            <div className="pd-section">
              <div className="pd-section__label">
                <span className="pd-section__label-line" />
                <span className="pd-section__label-text">Overview</span>
              </div>
              <p className="pd-section__text">{project.description}</p>
            </div>
          </RevealOnScroll>

          {/* ── Case Study Details ───────────────────────── */}
          {hasAnyDetails && (
            <RevealOnScroll>
              <div className="pd-section">
                <div className="pd-details-grid">
                  {/* Left column: Challenge + Approach */}
                  <div className="pd-details-grid__col">
                    {hasChallenge && (
                      <div>
                        <span className="pd-detail-block__label">
                          Challenge
                        </span>
                        <p className="pd-detail-block__text">
                          {project.details!.challenge}
                        </p>
                      </div>
                    )}
                    {hasSolution && (
                      <div>
                        <span className="pd-detail-block__label">Approach</span>
                        <p className="pd-detail-block__text">
                          {project.details!.solution}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right column: Scope + Deliverables */}
                  <div className="pd-details-grid__col">
                    {hasScope && (
                      <div>
                        <span className="pd-detail-block__label">Scope</span>
                        <ul className="pd-detail-block__list">
                          {project.details!.scope!.map((s) => (
                            <li key={s}>
                              <span>■</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hasDeliverables && (
                      <div>
                        <span className="pd-detail-block__label">
                          Deliverables
                        </span>
                        <ul className="pd-detail-block__list">
                          {project.details!.deliverables!.map((d) => (
                            <li key={d}>
                              <span>■</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* ── Gallery ──────────────────────────────────── */}
          <ProjectGallery images={gallery} />

          {/* ── Prev / Next Navigation ────────────────────── */}
          <RevealOnScroll type="fade">
            <ProjectNavigation prev={prev} next={next} />
          </RevealOnScroll>

          {/* ── Bottom CTA ─────────────────────────────────── */}
          <div className="pd-bottom-cta">
            <Link href="/work" className="pd-bottom-cta__back">
              ← All Projects
            </Link>
            <Link href="/contact" className="pd-bottom-cta__contact">
              Start a Project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

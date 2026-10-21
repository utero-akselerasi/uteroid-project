// ─────────────────────────────────────────────────────────────
// UTERO.ID — Project media helpers
// ─────────────────────────────────────────────────────────────
// The SINGLE source of truth for choosing a project's image
// fields. Every code path (homepage rotation pool + server
// default set, /work grid, detail hero, prev/next navigation,
// services, metadata/OG, hover layer) MUST resolve covers
// through these helpers so the paths can never disagree.

import type { Project } from "./types";

/**
 * Primary cover used for grids (homepage + /work) and the detail hero.
 * Falls back to the legacy `heroImage` alias.
 */
export function getProjectCover(
  project: Pick<Project, "coverImage" | "heroImage">
): string {
  return project.coverImage || project.heroImage || "";
}

/**
 * Case-study gallery images. Falls back to the legacy `gallery` alias.
 */
export function getProjectGallery(
  project: Pick<Project, "galleryImages" | "gallery">
): string[] {
  return project.galleryImages || project.gallery || [];
}

/**
 * Curated hover image for the /work grid crossfade, or null.
 */
export function getProjectHover(
  project: Pick<Project, "hoverImage">
): string | null {
  return project.hoverImage ?? null;
}

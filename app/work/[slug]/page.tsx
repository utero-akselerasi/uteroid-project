import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllSlugs, getAdjacentProjects } from "@/lib/projects";
import { disciplineLabels, industryLabels } from "@/lib/types";
import ProjectDetailClient from "@/components/project-detail/ProjectDetailClient";

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
// Page (Server Component — thin data layer)
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

  // Project index for display number
  const allSlugs = getAllSlugs();
  const projectIndex = allSlugs.indexOf(project.slug);
  const num = String(projectIndex + 1).padStart(2, "0");

  // Formatted discipline labels
  const disciplines = project.disciplines
    .map((d) => disciplineLabels[d] || d)
    .join(" · ");

  // Industry label
  const industryLabel = industryLabels[project.industry] || project.industry;

  return (
    <ProjectDetailClient
      project={project}
      prev={prev ? { slug: prev.slug, title: prev.title, year: prev.year, coverImage: prev.coverImage } : null}
      next={next ? { slug: next.slug, title: next.title, year: next.year, coverImage: next.coverImage } : null}
      projectNum={num}
      disciplines={disciplines}
      industryLabel={industryLabel}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectByRouteSlug, getAllRouteSlugs, getAdjacentProjects } from "@/lib/projects";
import { getProjectCover } from "@/lib/projectMedia";
import { disciplineLabels, industryLabels } from "@/lib/types";
import ProjectDetailClient from "@/components/project-detail/ProjectDetailClient";

export async function generateStaticParams() {
  return getAllRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectByRouteSlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Utero`,
    description:
      project.shortDescription ||
      project.excerpt ||
      `${project.title} — ${project.client}`,
    openGraph: {
      title: `${project.title} — Utero`,
      description:
        project.shortDescription ||
        project.excerpt ||
        `${project.title} — ${project.client}`,
      images: [{ url: getProjectCover(project) }],
    },
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
  const project = getProjectByRouteSlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(project.routeSlug);

  // Project index for display number
  const allRouteSlugs = getAllRouteSlugs();
  const projectIndex = allRouteSlugs.indexOf(project.routeSlug);
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
      prev={prev ? { slug: prev.routeSlug, title: prev.title, year: prev.year, coverImage: getProjectCover(prev) } : null}
      next={next ? { slug: next.routeSlug, title: next.title, year: next.year, coverImage: getProjectCover(next) } : null}
      projectNum={num}
      disciplines={disciplines}
      industryLabel={industryLabel}
    />
  );
}

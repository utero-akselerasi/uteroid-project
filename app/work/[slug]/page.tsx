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
  if (!project) notFound();

  const pageTitle = `${project.title} — ${project.client}`;
  const description =
    project.excerpt ||
    project.shortDescription ||
    `${project.title} designed for ${project.client} by Utero.`;
  const coverUrl = getProjectCover(project) || "/img/unnamed.webp";

  return {
    title: pageTitle,
    description,
    openGraph: {
      type: "article",
      title: pageTitle,
      description,
      url: `https://utero.id/work/${project.routeSlug}`,
      images: [
        {
          url: coverUrl,
          alt: `${project.title} by Utero`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [coverUrl],
    },
    alternates: {
      canonical: `/work/${project.routeSlug}`,
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

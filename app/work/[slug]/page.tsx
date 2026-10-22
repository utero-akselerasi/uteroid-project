import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPortfolioProject, getPortfolioProjects } from "@/lib/portfolioApi";
import { getProjectCover } from "@/lib/projectMedia";
import { disciplineLabels, industryLabels } from "@/lib/types";
import JsonLd from "@/components/JsonLd";
import ProjectDetailClient from "@/components/project-detail/ProjectDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) notFound();
  if (project.routeSlug !== slug) redirect(`/work/${project.routeSlug}`);

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
  const project = await getPortfolioProject(slug);
  if (!project) notFound();

  const allProjects = await getPortfolioProjects();
  const currentIndex = allProjects.findIndex((item) => item.routeSlug === project.routeSlug);
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  // Project index for display number
  const allRouteSlugs = allProjects.map((item) => item.routeSlug);
  const projectIndex = allRouteSlugs.indexOf(project.routeSlug);
  const num = String(projectIndex + 1).padStart(2, "0");

  // Formatted discipline labels
  const disciplines = project.disciplines
    .map((d) => disciplineLabels[d] || d)
    .join(" · ");

  // Industry label
  const industryLabel = industryLabels[project.industry] || project.industry;

  const rawCover = getProjectCover(project);
  const coverUrl = rawCover
    ? rawCover.startsWith("http")
      ? rawCover
      : `https://utero.id${rawCover}`
    : "https://utero.id/img/unnamed.webp";

  const projectSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://utero.id",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Work",
            "item": "https://utero.id/work",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": project.title,
            "item": `https://utero.id/work/${project.routeSlug}`,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `https://utero.id/work/${project.routeSlug}#creativework`,
        "name": project.title,
        "headline": `${project.title} — ${project.client}`,
        "description":
          project.shortDescription ||
          project.excerpt ||
          project.description,
        "dateCreated": project.year,
        "creator": {
          "@type": "Organization",
          "name": "PT. Utero Kreatif Indonesia",
          "url": "https://utero.id",
        },
        "customer": {
          "@type": "Organization",
          "name": project.client,
        },
        "image": coverUrl,
        "url": `https://utero.id/work/${project.routeSlug}`,
        "genre": project.category,
        ...(project.tags ? { keywords: project.tags.join(", ") } : {}),
      },
    ],
  };

  return (
    <>
      <JsonLd data={projectSchema} />
      <ProjectDetailClient
        project={project}
        prev={prev ? { slug: prev.routeSlug, title: prev.title, year: prev.year, coverImage: getProjectCover(prev) } : null}
        next={next ? { slug: next.routeSlug, title: next.title, year: next.year, coverImage: getProjectCover(next) } : null}
        projectNum={num}
        disciplines={disciplines}
        industryLabel={industryLabel}
      />
    </>
  );
}

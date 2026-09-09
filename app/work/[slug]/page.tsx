import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, getAllSlugs } from "@/lib/projects";
import { disciplineLabels, industryLabels } from "@/lib/types";
import RevealOnScroll, { RevealImage } from "@/components/RevealOnScroll";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Case Study`,
    description: project.excerpt || `${project.title} — ${project.client}`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="pt-28 md:pt-36 pb-[var(--space-3xl)] md:pb-[var(--space-4xl)] bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page">
        {/* Back Link */}
        <RevealOnScroll>
          <Link
            href="/work"
            data-cursor="BACK"
            className="inline-flex items-center gap-2 text-[var(--text-small)] uppercase tracking-[var(--tracking-wide)] text-[var(--color-gray-500)] hover:text-[#c91a1f] transition-colors duration-[var(--duration-fast)] mb-[var(--space-xl)]"
          >
            <span>&larr;</span>
            Back to Work
          </Link>
        </RevealOnScroll>

        {/* Hero Image */}
        <RevealImage>
          <div
            className="relative w-full overflow-hidden bg-[#161616] border border-black/10 mb-[var(--space-2xl)]"
            style={{ aspectRatio: "21/9", minHeight: "360px" }}
          >
            {project.heroImage ? (
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1e1e1e]" />
            )}
          </div>
        </RevealImage>

        {/* Project Header */}
        <RevealOnScroll>
          <div className="mb-[var(--space-2xl)]">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
                {project.category || "Case Study"} · {project.year}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#0a0a0a] mb-8">
              {project.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-y border-black/10 py-8">
              {/* Client & Metadata */}
              <div className="md:col-span-4 space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-black/50 block mb-1">
                    Client
                  </span>
                  <span className="text-base font-bold text-[#0a0a0a]">
                    {project.client}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-black/50 block mb-1">
                    Industry
                  </span>
                  <span className="text-base font-bold text-[#0a0a0a]">
                    {industryLabels[project.industry]}
                  </span>
                </div>
              </div>

              {/* Disciplines */}
              <div className="md:col-span-8 md:col-start-6">
                <span className="text-xs uppercase tracking-widest text-black/50 block mb-3">
                  Disciplines &amp; Scope
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.disciplines.map((d) => (
                    <span
                      key={d}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-[#0a0a0a] text-white"
                    >
                      {disciplineLabels[d]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Project Description & Narrative */}
        <RevealOnScroll delay={1}>
          <div className="max-w-3xl my-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#c91a1f] mb-4">
              Project Overview
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#0a0a0a]/90 mb-6">
              {project.description}
            </p>
            {project.excerpt && (
              <p className="text-base leading-relaxed text-black/70">
                {project.excerpt}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Bottom Navigation */}
        <RevealOnScroll>
          <div className="pt-12 border-t border-black/10 flex justify-between items-center">
            <Link
              href="/work"
              data-cursor="BACK"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-[#0a0a0a] pb-1 hover:text-[#c91a1f] hover:border-[#c91a1f] transition-colors"
            >
              <span>&larr;</span>
              All Projects
            </Link>

            <Link
              href="/contact"
              data-cursor="START A PROJECT"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-[#c91a1f] text-white px-6 py-3 hover:bg-[#0a0a0a] transition-colors"
            >
              Start Similar Project &rarr;
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

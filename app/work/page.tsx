import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProjectsByFilters } from "@/lib/projects";
import { disciplineLabels, industryLabels } from "@/lib/types";
import WorkFilters from "@/components/WorkFilters";
import RevealOnScroll, { RevealImage } from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Utero — brand, product, promotion, space, digital, indoor, and outdoor design.",
};

function EmptyState() {
  return (
    <div className="py-24 text-center">
      <p className="text-2xl font-black uppercase mb-4 text-[#0a0a0a]">
        NO PROJECTS FOUND MATCHING FILTERS.
      </p>
      <Link
        href="/work"
        className="inline-block text-sm font-bold uppercase tracking-widest border-b-2 border-[#0a0a0a] pb-1 hover:text-[#c91a1f] hover:border-[#c91a1f] transition-colors"
      >
        Clear Filters &rarr;
      </Link>
    </div>
  );
}

function ProjectGrid({
  discipline,
  industry,
}: {
  discipline?: string;
  industry?: string;
}) {
  const filteredProjects = getProjectsByFilters({ discipline, industry });

  if (filteredProjects.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {filteredProjects.map((project, index) => {
          const isWide = index === 0 || index % 3 === 0;

          return (
            <RevealOnScroll
              key={project.slug}
              delay={Math.min((index % 2) + 1, 2)}
              className={isWide ? "md:col-span-2" : ""}
            >
              <Link
                href={`/work/${project.slug}`}
                data-cursor="VIEW PROJECT &rarr;"
                className="group block text-inherit no-underline"
              >
                <article>
                  <div
                    className="relative w-full overflow-hidden bg-[#161616] border border-black/10 mb-4"
                    style={{
                      aspectRatio: isWide ? "21/9" : "4/3",
                      minHeight: isWide ? "320px" : "260px",
                    }}
                  >
                    {project.heroImage ? (
                      <Image
                        src={project.heroImage}
                        alt={project.title}
                        fill
                        sizes={isWide ? "(max-width: 1400px) 100vw, 1400px" : "(max-width: 768px) 100vw, 50vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1e1e1e]" />
                    )}

                    <div className="absolute top-4 left-4 bg-[#c91a1f] text-white text-[11px] font-bold tracking-widest uppercase px-2.5 py-1">
                      {project.category || "Case Study"}
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold tracking-widest text-[#c91a1f] uppercase">
                      {project.year} · {industryLabels[project.industry]}
                    </span>
                    <span className="text-xs text-black/50 uppercase">
                      {project.disciplines.map((d) => disciplineLabels[d]).join(" / ")}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#0a0a0a] group-hover:text-[#c91a1f] transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-black/70 max-w-2xl">
                    {project.excerpt}
                  </p>
                </article>
              </Link>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; industry?: string }>;
}) {
  return (
    <section className="pt-28 md:pt-36 pb-24 bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page">
        {/* Header */}
        <RevealOnScroll>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
              01 / ARCHIVE
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={1}>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#0a0a0a] mb-8">
            WORKS ARCHIVE.
          </h1>
        </RevealOnScroll>

        <Suspense fallback={<div className="py-8 text-sm">Loading filters...</div>}>
          <WorkFilters />
        </Suspense>

        <Suspense fallback={<div className="py-12 text-sm">Loading projects...</div>}>
          <WorkGridWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function WorkGridWrapper({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; industry?: string }>;
}) {
  const params = await searchParams;
  return (
    <ProjectGrid
      discipline={params.discipline}
      industry={params.industry}
    />
  );
}

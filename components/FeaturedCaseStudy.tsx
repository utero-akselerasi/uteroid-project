import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { disciplineLabels, industryLabels } from "@/lib/types";
import RevealOnScroll, { RevealImage } from "./RevealOnScroll";

export default function FeaturedCaseStudy() {
  const project = getProjectBySlug("festival-mbois");

  if (!project) return null;

  return (
    <section className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] bg-[var(--color-white)]">
      <div className="container-page">
        <RevealOnScroll>
          <div className="section-label">
            <span className="section-label__number">07</span>
            <span className="section-label__text">Featured Case Study</span>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-12 gap-[var(--grid-gap)]">
          <div className="col-span-12 lg:col-span-8">
            <RevealImage>
              <div className="media-frame mb-[var(--space-lg)]" style={{ aspectRatio: "21/9" }}>
                <div className="media-frame__content">
                  <span className="media-frame__label">[{project.title}]</span>
                </div>
              </div>
            </RevealImage>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <RevealOnScroll delay={1}>
              <span className="type-micro text-[var(--color-red)] block mb-3">
                {project.year}
              </span>
              <h3 className="text-[var(--text-h2)] font-bold text-[var(--color-black)] leading-[var(--leading-tight)] mb-4">
                {project.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div>
                  <span className="type-micro text-[var(--color-gray-400)] block mb-1">
                    Client
                  </span>
                  <span className="text-[var(--text-small)]">{project.client}</span>
                </div>
                <div>
                  <span className="type-micro text-[var(--color-gray-400)] block mb-1">
                    Disciplines
                  </span>
                  <span className="text-[var(--text-small)]">
                    {project.disciplines.map((d) => disciplineLabels[d]).join(" / ")}
                  </span>
                </div>
                <div>
                  <span className="type-micro text-[var(--color-gray-400)] block mb-1">
                    Industry
                  </span>
                  <span className="text-[var(--text-small)]">
                    {industryLabels[project.industry]}
                  </span>
                </div>
              </div>

              {project.excerpt && (
                <p className="text-[var(--text-body)] text-[var(--color-gray-500)] leading-[var(--leading-body)] mb-6">
                  {project.excerpt}
                </p>
              )}

              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-2 text-[var(--text-small)] uppercase tracking-[var(--tracking-wide)] font-medium border-b border-[var(--color-black)] pb-1 hover:text-[var(--color-red)] hover:border-[var(--color-red)] transition-colors duration-[var(--duration-fast)]"
              >
                View Case Study
                <span>&rarr;</span>
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

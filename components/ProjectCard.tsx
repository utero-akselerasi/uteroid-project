import Link from "next/link";

interface ProjectCardProps {
  title: string;
  client: string;
  discipline: string;
  industry: string;
  year: string;
  slug: string;
  image?: string;
}

export default function ProjectCard({
  title,
  client,
  discipline,
  industry,
  year,
  slug,
}: ProjectCardProps) {
  return (
    <Link href={`/work/${slug}`} className="group block">
      <article>
        <div
          className="media-frame media-frame--dark mb-4"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="media-frame__content">
            <span className="media-frame__label">[{title}]</span>
          </div>
        </div>

        <h3 className="font-bold text-[var(--text-h4)] leading-[var(--leading-tight)] mb-2 group-hover:text-[var(--color-red)] transition-colors duration-[var(--duration-fast)]">
          {title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--text-label)] uppercase tracking-[var(--tracking-wide)] text-[var(--color-gray-500)]">
          <span>{client}</span>
          <span>{discipline}</span>
          <span>{industry}</span>
          <span>{year}</span>
        </div>
      </article>
    </Link>
  );
}

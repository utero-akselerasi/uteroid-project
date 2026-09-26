import { servicesData } from "./services";

export interface Discipline {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
  imageBlur: string;
}

/**
 * List-level view of the six disciplines, used by the homepage teaser and the
 * /services list. Derived from `servicesData` so the list pages and the
 * detail pages can never drift out of sync.
 */
export const disciplinesData: Discipline[] = servicesData.map((s) => ({
  id: s.number,
  slug: s.slug,
  name: s.name,
  tagline: s.tagline,
  description: s.description,
  deliverables: s.deliverables,
  image: s.image,
  imageAlt: s.imageAlt,
  imagePosition: s.imagePosition,
  imageBlur: s.imageBlur,
}));

export function getDisciplineBySlug(slug: string): Discipline | undefined {
  return disciplinesData.find((d) => d.slug === slug);
}

export function getAllDisciplineSlugs(): string[] {
  return disciplinesData.map((d) => d.slug);
}

"use client";

import { servicesData, type ServiceItem } from "./services";
import { type Discipline } from "./disciplines";
import { useTranslations } from "./useTranslations";

type DisciplineKey = "brand" | "product" | "promotion" | "digital" | "environmental" | "outdoor";

const slugToDisciplineKey: Record<string, DisciplineKey> = {
  brand: "brand",
  product: "product",
  promotion: "promotion",
  digital: "digital",
  environmental: "environmental",
  outdoor: "outdoor",
};

/**
 * Returns the full servicesData list with all user-visible text replaced by
 * the current language's translations. Non-text fields (slug, number, image,
 * relatedProjectSlugs, etc.) are passed through unchanged.
 *
 * This is the SINGLE source of truth for translated service/discipline text,
 * shared by the homepage ServicesSection, /services list, and /services/[slug].
 */
export function useTranslatedServices(): ServiceItem[] {
  const t = useTranslations();

  return servicesData.map((s) => {
    const key = slugToDisciplineKey[s.slug];
    if (!key) return s;

    const d = t.disciplines[key];
    return {
      ...s,
      name: d.name,
      tagline: d.tagline,
      heroHeadline: d.heroHeadline,
      description: d.description,
      overview: d.overview,
      approach: d.approach,
      deliverables: d.deliverables,
      capabilities: d.capabilities,
      imageAlt: d.imageAlt,
      inquiryLabel: d.inquiryLabel,
    };
  });
}

/**
 * Returns a single translated service item by slug.
 */
export function useTranslatedService(slug: string): ServiceItem | undefined {
  const services = useTranslatedServices();
  return services.find((s) => s.slug === slug);
}

/**
 * Returns the 6 disciplines formatted for list/preview components
 * (Homepage ServicesSection & /services list page), matching the Discipline interface.
 */
export function useTranslatedDisciplines(): Discipline[] {
  const services = useTranslatedServices();
  return services.map((s) => ({
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
}

/**
 * Returns inquiry labels in the active language, in discipline order.
 */
export function useTranslatedInquiryLabels(): string[] {
  const services = useTranslatedServices();
  return services.map((s) => s.inquiryLabel);
}

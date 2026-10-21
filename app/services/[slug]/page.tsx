import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/services";
import { getProjectBySlug } from "@/lib/projects";
import ServiceDetailClient from "@/components/service-detail/ServiceDetailClient";

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const pageTitle = `${service.name} — Capabilities & Practice`;
  return {
    title: pageTitle,
    description: service.description,
    openGraph: {
      type: "website",
      title: pageTitle,
      description: service.description,
      url: `https://utero.id/services/${service.slug}`,
      images: [
        {
          url: service.image,
          alt: service.imageAlt || `${service.name} capabilities by Utero`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: service.description,
      images: [service.image],
    },
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedProjects = service.relatedProjectSlugs
    .map((pSlug) => getProjectBySlug(pSlug))
    .filter(Boolean);

  return (
    <ServiceDetailClient
      initialService={service}
      relatedProjects={relatedProjects}
    />
  );
}

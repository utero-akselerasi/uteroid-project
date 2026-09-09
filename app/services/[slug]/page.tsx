import type { Metadata } from "next";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Service",
};

export default function ServicesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <section className="pt-28 md:pt-32 pb-[var(--space-3xl)] md:pb-[var(--space-4xl)] bg-[var(--color-white)]">
      <div className="container-page">
        <RevealOnScroll>
          <div className="section-label">
            <span className="section-label__number">02</span>
            <span className="section-label__text">Services</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={1}>
          <h1 className="type-display text-[var(--color-black)]">Service</h1>
        </RevealOnScroll>

        <RevealOnScroll delay={2}>
          <p className="mt-6 text-[var(--text-body-lg)] text-[var(--color-gray-500)] max-w-xl">
            Service detail page — content coming soon.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

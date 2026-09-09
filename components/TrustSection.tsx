import RevealOnScroll from "./RevealOnScroll";

export default function TrustSection() {
  return (
    <section className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] bg-[var(--color-white)]">
      <div className="container-page">
        <div className="grid grid-cols-12 gap-[var(--grid-gap)] items-center">
          <div className="col-span-12 lg:col-span-4">
            <RevealOnScroll>
              <span className="type-micro text-[var(--color-gray-400)] block mb-4">
                08 / Track Record
              </span>
              <span className="type-hero text-[var(--color-black)] block leading-none">
                25+
              </span>
              <span className="type-label text-[var(--color-gray-500)] block mt-2">
                Years of Design Excellence
              </span>
            </RevealOnScroll>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <RevealOnScroll delay={1}>
              <p className="text-[var(--text-body-lg)] text-[var(--color-gray-500)] leading-[var(--leading-relaxed)] mb-6">
                Over two decades of delivering design excellence across Indonesia
                and beyond. Trusted by brands, institutions, and organizations
                across diverse industries.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={2}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { value: "250+", label: "Projects" },
                  { value: "80+", label: "Clients" },
                  { value: "7", label: "Disciplines" },
                  { value: "25+", label: "Years" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="text-[var(--text-h3)] font-bold text-[var(--color-red)] block">
                      {stat.value}
                    </span>
                    <span className="type-micro text-[var(--color-gray-400)]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

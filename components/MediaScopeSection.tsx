import RevealOnScroll from "./RevealOnScroll";

const scopes = [
  {
    name: "Online",
    description: "Digital platforms, social media, web, and application design.",
  },
  {
    name: "Offline",
    description: "Print, packaging, collateral, and physical brand materials.",
  },
  {
    name: "Indoor",
    description: "Interior environments, retail spaces, and exhibition design.",
  },
  {
    name: "Outdoor",
    description: "Billboards, environmental graphics, and large-format displays.",
  },
];

export default function MediaScopeSection() {
  return (
    <section className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] bg-[var(--color-black)] text-[var(--color-white)]">
      <div className="container-page">
        <RevealOnScroll>
          <div className="section-label">
            <span className="section-label__number">06</span>
            <span className="section-label__text" style={{ color: "var(--color-gray-400)" }}>
              Media Scope
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={1}>
          <h2 className="type-display text-[var(--color-white)] mb-[var(--space-2xl)] md:mb-[var(--space-3xl)]">
            Every
            <br />
            Touchpoint
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-gray-700)]">
          {scopes.map((scope, i) => (
            <RevealOnScroll key={scope.name} delay={Math.min(i + 1, 4)}>
              <div className="bg-[var(--color-black)] p-6 md:p-8 group hover:bg-[var(--color-black-soft)] transition-colors duration-[var(--duration-base)]">
                <span className="type-micro text-[var(--color-red)] block mb-4">
                  0{i + 1}
                </span>
                <h3 className="text-[var(--text-h3)] font-bold text-[var(--color-white)] mb-3">
                  {scope.name}
                </h3>
                <p className="text-[var(--text-small)] text-[var(--color-gray-500)] leading-[var(--leading-body)]">
                  {scope.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

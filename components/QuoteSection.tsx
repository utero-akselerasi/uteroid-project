import RevealOnScroll from "./RevealOnScroll";

export default function QuoteSection() {
  return (
    <section className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] bg-[var(--color-red)] text-[var(--color-white-pure)] overflow-hidden">
      <div className="container-page">
        <div className="grid grid-cols-12 gap-[var(--grid-gap)] items-center">
          <div className="col-span-12 lg:col-span-2">
            <RevealOnScroll>
              <span className="type-micro text-[var(--color-white-pure)]/50">
                04 / Philosophy
              </span>
            </RevealOnScroll>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <RevealOnScroll>
              <blockquote className="text-[var(--text-display)] font-bold leading-[var(--leading-display)] tracking-[var(--tracking-tighter)]">
                Design
                <br />
                Is a
                <br />
                <span className="text-[var(--color-white-pure)]/80">Solution.</span>
              </blockquote>
            </RevealOnScroll>
          </div>

          <div className="col-span-12 lg:col-span-2 flex lg:justify-end">
            <RevealOnScroll delay={2}>
              <div className="mt-8 lg:mt-0">
                <div className="scroll-indicator text-[var(--color-white-pure)]/40 mx-auto lg:mx-0" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

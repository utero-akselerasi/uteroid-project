import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Studio",
  description: "About Utero — an Indonesian brand consultant and creative design studio based in Malang since 1998.",
};

export default function StudioPage() {
  return (
    <section className="pt-28 md:pt-36 pb-24 bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <RevealOnScroll>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
                  02 / ABOUT UTERO INDONESIA
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1}>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#0a0a0a] mb-6">
                STUDIO.
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={2}>
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#0a0a0a]/90 mb-6">
                A multidisciplinary design studio and brand consultancy based in Malang, Indonesia.
              </p>
              <p className="text-base leading-relaxed text-black/70">
                We bring together strategists, designers, and craftspeople to solve complex brand, spatial, product, and communication problems through design.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={3}>
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-black/10 pt-8">
                <div>
                  <span className="text-4xl md:text-5xl font-black text-[#c91a1f] block">25+</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-black/50">Years of Practice</span>
                </div>
                <div>
                  <span className="text-4xl md:text-5xl font-black text-[#0a0a0a] block">7</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-black/50">Core Disciplines</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 mt-8 lg:mt-0 space-y-8">
            <RevealOnScroll delay={2}>
              <div className="bg-[#0a0a0a] text-white p-8 md:p-12 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#c91a1f] block">
                  Studio Philosophy
                </span>
                <blockquote className="text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight">
                  &ldquo;Ide tanpa realisasi sama dengan sampah.&rdquo;
                </blockquote>
                <p className="text-sm leading-relaxed text-white/70">
                  Strategy without execution is purely academic. For over 25 years, our team in Malang has engineered brands, wayfinding systems, packaging, and spatial media with uncompromising craft and attention to detail.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="/contact"
                    data-cursor="LET'S TALK"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c91a1f] hover:text-white transition-colors"
                  >
                    <span>Connect with our studio in Malang</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

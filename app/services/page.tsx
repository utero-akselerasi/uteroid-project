import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description: "Design capabilities by Utero — Brand, Product, Promotion, Space, Digital, Indoor, and Outdoor design.",
};

const services = [
  {
    id: "01",
    name: "BRAND",
    tagline: "Strategic Brand Identity Systems",
    description: "Visual identity design, brand architecture, typography guidelines, naming, and brand manuals.",
  },
  {
    id: "02",
    name: "PRODUCT",
    tagline: "Packaging & Structural Forms",
    description: "Physical product packaging, structural containers, label design, and bespoke merchandise.",
  },
  {
    id: "03",
    name: "PROMOTION",
    tagline: "High-Impact Creative Campaigns",
    description: "Launch campaigns, key visual development, print collateral, social assets, and marketing toolkits.",
  },
  {
    id: "04",
    name: "SPACE",
    tagline: "Wayfinding & Environmental Design",
    description: "Architectural wayfinding, public creative hub signage, directional systems, and spatial branding.",
  },
  {
    id: "05",
    name: "DIGITAL",
    tagline: "Web Design & Digital Experiences",
    description: "Modern websites, web platforms, UI/UX systems, digital product design, and interactive experiences.",
  },
  {
    id: "06",
    name: "INDOOR",
    tagline: "Interior Graphics & Commercial Signs",
    description: "Indoor signage, corporate office wall graphics, environmental typography, and interior visual identity.",
  },
  {
    id: "07",
    name: "OUTDOOR",
    tagline: "Large-Scale Public Communication",
    description: "City billboards, building banners, architectural pylons, transit advertising, and urban installations.",
  },
];

export default function ServicesPage() {
  return (
    <section className="pt-28 md:pt-36 pb-24 bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page">
        <RevealOnScroll>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
              03 / CAPABILITIES &amp; PRACTICE
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={1}>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#0a0a0a] mb-6">
            SERVICES.
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={2}>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mb-12">
            A complete suite of design disciplines engineered to solve complex strategic problems and increase brand equity.
          </p>
        </RevealOnScroll>

        <div className="divide-y divide-black/10 border-t border-b border-black/10 mb-16">
          {services.map((service, i) => (
            <RevealOnScroll key={service.id} delay={Math.min(i % 3, 2)}>
              <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline group hover:pl-4 transition-all duration-300">
                <div className="md:col-span-4 flex items-baseline gap-4">
                  <span className="text-xs font-mono font-bold text-[#c91a1f] w-8">
                    {service.id}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[#0a0a0a] group-hover:text-[#c91a1f] transition-colors">
                    {service.name}
                  </h2>
                </div>

                <div className="md:col-span-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-black/80 block">
                    {service.tagline}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <span className="text-sm text-black/60 leading-relaxed block">
                    {service.description}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="flex flex-wrap justify-between items-center gap-6 p-8 bg-[#0a0a0a] text-white">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c91a1f] block mb-1">
                Custom Scope
              </span>
              <p className="text-xl font-bold m-0">
                Have a multidisciplinary challenge?
              </p>
            </div>

            <Link
              href="/contact"
              data-cursor="LET'S TALK"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-[#c91a1f] text-white px-6 py-3 hover:bg-white hover:text-[#0a0a0a] transition-colors"
            >
              <span>Consult Our Team in Malang</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

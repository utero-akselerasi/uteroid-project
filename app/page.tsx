import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import IntroductionSection from "@/components/IntroductionSection";
import StatementBanner from "@/components/StatementBanner";
import SelectedWorkSection from "@/components/SelectedWorkSection";
import ManifestoSection from "@/components/ManifestoSection";
import ServicesSection from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: {
    absolute: "UTERO.ID — Design as a Solution",
  },
  description:
    "Indonesian creative design studio based in Malang since 1998. Crafting enduring brand systems, packaging, interactive digital experiences, and environmental spatial wayfinding.",
  openGraph: {
    type: "website",
    title: "UTERO.ID — Design as a Solution",
    description:
      "Indonesian creative design studio based in Malang since 1998. Crafting enduring brand systems, packaging, interactive digital experiences, and environmental spatial wayfinding.",
    url: "https://utero.id",
    images: [
      {
        url: "/img/unnamed.webp",
        width: 1280,
        height: 720,
        alt: "UTERO.ID — Design as a Solution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UTERO.ID — Design as a Solution",
    description:
      "Indonesian creative design studio based in Malang since 1998. Crafting enduring brand systems, packaging, interactive digital experiences, and environmental spatial wayfinding.",
    images: ["/img/unnamed.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      {/* 01 — HERO WITH BACKGROUND SLIDER & INTEGRATED NAV */}
      <HeroSection />

      {/* 02 — INTRODUCTION / POSITIONING WITH DESAIN.PNG */}
      <IntroductionSection />

      {/* 02B — STATEMENT BANNER WITH STUDIO STOREFRONT */}
      <StatementBanner />

      {/* 03 — RECENT WORKS */}
      <SelectedWorkSection />

      {/* 04 — EXPERIENCE / PHILOSOPHY & REALISASI */}
      <ManifestoSection />

      {/* 05 — WHAT CAN WE DESIGN FOR YOU */}
      <ServicesSection />
    </>
  );
}

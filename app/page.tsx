import HeroSection from "@/components/HeroSection";
import IntroductionSection from "@/components/IntroductionSection";
import StatementBanner from "@/components/StatementBanner";
import SelectedWorkSection from "@/components/SelectedWorkSection";
import ManifestoSection from "@/components/ManifestoSection";
import ServicesSection from "@/components/ServicesSection";

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

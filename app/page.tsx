import HeroSection from "@/components/HeroSection";
import IntroductionSection from "@/components/IntroductionSection";
import SelectedWorkSection from "@/components/SelectedWorkSection";
import ManifestoSection from "@/components/ManifestoSection";
import ServicesSection from "@/components/ServicesSection";
import InsightsSection from "@/components/InsightsSection";
import ProjectCTA from "@/components/ProjectCTA";

export default function Home() {
  return (
    <>
      {/* 01 — HERO */}
      <HeroSection />

      {/* 02 — INTRODUCTION / POSITIONING */}
      <IntroductionSection />

      {/* 03 — RECENT WORKS */}
      <SelectedWorkSection />

      {/* 04 — EXPERIENCE / PHILOSOPHY */}
      <ManifestoSection />

      {/* 05 — CREATIVE APPROACH / CAPABILITIES */}
      <ServicesSection />

      {/* 06 — MEDIA INSIGHTS / POSTS */}
      <InsightsSection />

      {/* 07 — FINAL CTA */}
      <ProjectCTA />
    </>
  );
}

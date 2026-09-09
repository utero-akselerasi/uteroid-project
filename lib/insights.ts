import type { Insight } from "./types";

export const insights: Insight[] = [
  {
    slug: "power-of-identity-in-digital-noise",
    title: "The Power of Identity in the Age of Digital Noise",
    category: "Design Strategy",
    date: "March 2024",
    readTime: "4 min read",
    excerpt: "Why surface-level trends fail and how enduring identity systems create long-term enterprise equity in fragmented digital landscapes.",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    content: "Design is not cosmetic dressing; it is the visual architecture of purpose. In a crowded marketplace where attention spans are measured in milliseconds, clarity and distinctiveness become an organization's most valuable strategic assets.",
  },
  {
    slug: "environmental-graphics-and-spatial-experience",
    title: "Environmental Graphics: Bridging Physical Space and Brand Emotion",
    category: "Signage & Spaces",
    date: "January 2024",
    readTime: "5 min read",
    excerpt: "Examining the psychological impact of wayfinding, architectural typography, and human navigation in massive public creative centers.",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    content: "When visitors step into a physical facility, every sign, typography choice, and spatial junction tells a story. Environmental design transforms inert architecture into an active dialogue with human beings.",
  },
  {
    slug: "packaging-as-the-first-physical-handshake",
    title: "Packaging as the First Physical Handshake",
    category: "Packaging Design",
    date: "November 2023",
    readTime: "3 min read",
    excerpt: "Engineering tactile packaging systems that balance consumer desirability, logistical efficiency, and sustainable material choices.",
    coverImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop",
    content: "Before a customer tastes a product or experiences its utility, their hands touch the container. The weight, texture, and opening ritual of packaging define perceived value instantly.",
  },
  {
    slug: "ide-tanpa-realisasi-execution-philosophy",
    title: "Ide Tanpa Realisasi: The Philosophy of Rigorous Execution",
    category: "Studio Culture",
    date: "August 2023",
    readTime: "6 min read",
    excerpt: "Why 25+ years in Indonesian creative industries taught us that strategy without ruthless craft execution is purely theoretical.",
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop",
    content: "Great ideas are common; the discipline to resolve millimeter tolerances, print calibrations, and scalable identity guidelines across hundreds of applications is what separates real impact from wishful thinking.",
  },
];

export function getInsightBySlug(slug: string): Insight | undefined {
  return insights.find((item) => item.slug === slug);
}

export function getAllInsightSlugs(): string[] {
  return insights.map((item) => item.slug);
}

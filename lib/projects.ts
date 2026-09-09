import type { Project, Discipline, Industry } from "./types";

export const projects: Project[] = [
  {
    slug: "amarta-wisesa",
    title: "Amarta Wisesa",
    client: "PT Amarta Wisesa Indonesia",
    year: "2024",
    category: "Identity / Case Study",
    industry: "corporate",
    disciplines: ["identity", "digital", "print"],
    excerpt: "Comprehensive brand identity redesign and corporate communication system establishing market leadership.",
    description: "When launching their new visual identity, Amarta Wisesa partnered with Utero to craft a progressive design system that communicates strength, precision, and modern corporate agility.",
    heroImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    slug: "baiturrokhman",
    title: "Baiturrokhman Tour Travel",
    client: "Baiturrokhman Tour & Travel",
    year: "2024",
    category: "Branding & Spatial",
    industry: "services",
    disciplines: ["identity", "signage", "print"],
    excerpt: "Holistic visual identity, service collaterals, and customer experience touchpoints for pilgrimage travel.",
    description: "Developing a trustworthy and elegant brand presence that provides peace of mind, clarity, and distinguished customer touchpoints for umrah and hajj services.",
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    slug: "festival-mbois-8",
    title: "Festival Mbois 8",
    client: "Malang Creative Community",
    year: "2023",
    category: "Event Visual Identity",
    industry: "arts",
    disciplines: ["identity", "campaign", "outdoor", "digital"],
    excerpt: "Dynamic visual identity and city-wide campaign system celebrating regional creative economy.",
    description: "A bold, energetic identity combining contemporary typography with regional cultural motifs to unite artists, makers, and innovators across East Java.",
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    slug: "bank-sidoarjo",
    title: "Bank Sidoarjo",
    client: "PT BPR Bank Sidoarjo",
    year: "2023",
    category: "Corporate & Signage",
    industry: "corporate",
    disciplines: ["identity", "signage", "indoor"],
    excerpt: "Modern regional banking corporate identity and branch signage environmental graphics.",
    description: "Transforming the visual language of a longstanding financial institution to appeal to a new generation of entrepreneurs while cementing institutional stability.",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    slug: "tech-link",
    title: "Tech Link",
    client: "Tech Link Asia",
    year: "2024",
    category: "Digital Platform",
    industry: "services",
    disciplines: ["digital", "identity"],
    excerpt: "Digital product system, brand identity, and design system for next-gen enterprise networking.",
    description: "Designing a sophisticated digital identity and UI/UX component library enabling seamless connection between enterprise services and developer tooling.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    slug: "malang-creative-center",
    title: "Malang Creative Center",
    client: "Dinas Perindustrian dan Perdagangan Kota Malang",
    year: "2023",
    category: "Wayfinding & Environmental",
    industry: "government",
    disciplines: ["signage", "identity", "indoor"],
    excerpt: "Wayfinding system and environmental graphic design for a 9-story creative powerhouse.",
    description: "A comprehensive spatial navigation system guiding thousands of daily creators, students, and visitors across multi-floor creative facilities.",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    featured: false,
  },
  {
    slug: "mie-gacoan",
    title: "Mie Gacoan",
    client: "PT Pesta Pora Abadi",
    year: "2023",
    category: "Packaging & Retail",
    industry: "fnb",
    disciplines: ["packaging", "identity", "outdoor"],
    excerpt: "High-volume packaging design system and environmental identity for nationwide culinary chain.",
    description: "Engineering durable, sustainable, and unmistakable visual packaging for one of Indonesia's most beloved and rapidly expanding culinary brands.",
    heroImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1600&auto=format&fit=crop",
    featured: false,
  },
  {
    slug: "universitas-widyagama",
    title: "Universitas Widyagama",
    client: "Yayasan Pembina Pendidikan Indonesia Widyagama",
    year: "2022",
    category: "Institutional Identity",
    industry: "education",
    disciplines: ["identity", "print", "signage"],
    excerpt: "Academic branding overhaul and institutional identity guidelines for higher education.",
    description: "Unifying academic faculties, publications, and campus signage under a cohesive, dignified visual banner.",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByFilters(params: {
  discipline?: string;
  industry?: string;
}): Project[] {
  let filtered = [...projects];

  if (params.discipline && params.discipline !== "all") {
    filtered = filtered.filter((p) =>
      p.disciplines.includes(params.discipline as Discipline)
    );
  }

  if (params.industry && params.industry !== "all") {
    filtered = filtered.filter((p) => p.industry === (params.industry as Industry));
  }

  return filtered;
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}

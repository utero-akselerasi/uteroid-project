// ─────────────────────────────────────────────────────────────────────
// UTERO.ID — Project Data
// ─────────────────────────────────────────────────────────────────────
//
// HOW TO ADD A REAL PROJECT:
//   1. Add a new object to the `projects` array below.
//   2. Drop the cover image + gallery images into /public/work/[slug]/
//   3. Update coverImage and galleryImages paths.
//   4. Set featured: true for the first ~4 most recent showcase works.
//
// All UI components (archive grid, homepage selection, detail page)
// read from this single array — no other changes needed.
// ─────────────────────────────────────────────────────────────────────

import type { Project, Discipline, Industry, WorkFilter } from "./types";
import { filterToDisciplines } from "./types";

export const projects: Project[] = [
  // ── 01 ─────────────────────────────────────────────────────────────
  {
    slug: "amarta-wisesa",
    title: "Amarta Wisesa",
    client: "PT Amarta Wisesa Indonesia",
    year: "2024",
    category: "Corporate Identity",
    industry: "corporate",
    disciplines: ["identity", "digital", "print"],
    shortDescription:
      "Comprehensive brand identity redesign and corporate communication system establishing market leadership.",
    description:
      "When launching their new visual identity, Amarta Wisesa partnered with Utero to craft a progressive design system that communicates strength, precision, and modern corporate agility. The resulting identity spans digital platforms, print collaterals, and environmental applications.",
    excerpt:
      "Comprehensive brand identity redesign and corporate communication system establishing market leadership.",
    coverImage:
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: true,
    tags: ["corporate", "identity", "system"],
    details: {
      scope: ["Brand Strategy", "Visual Identity", "Print Collaterals", "Digital Assets"],
      challenge:
        "Reposition an established corporate entity under a modern, agile identity without losing institutional credibility.",
      solution:
        "Developed a typographic-led identity system anchored in Swiss editorial precision, deploying across print, digital, and environmental touchpoints.",
      deliverables: ["Logo System", "Brand Guidelines", "Stationery Suite", "Digital Templates"],
    },
  },

  // ── 02 ─────────────────────────────────────────────────────────────
  {
    slug: "baiturrokhman",
    title: "Baiturrokhman Tour Travel",
    client: "Baiturrokhman Tour & Travel",
    year: "2024",
    category: "Branding & Spatial",
    industry: "services",
    disciplines: ["identity", "signage", "print"],
    shortDescription:
      "Holistic visual identity, service collaterals, and customer experience touchpoints for pilgrimage travel.",
    description:
      "Developing a trustworthy and elegant brand presence that provides peace of mind, clarity, and distinguished customer touchpoints for umrah and hajj services. Every touchpoint — from signage to collateral — was crafted to reflect the dignity and gravitas of the journey.",
    excerpt:
      "Holistic visual identity, service collaterals, and customer experience touchpoints for pilgrimage travel.",
    coverImage:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: true,
    tags: ["branding", "spatial", "travel"],
    details: {
      scope: ["Brand Identity", "Signage System", "Print Collaterals"],
      challenge:
        "Create a brand that inspires trust and conveys the spiritual significance of the service category.",
      solution:
        "A restrained, calligraphic-influenced identity pairing refined typography with considered spatial applications.",
      deliverables: ["Logo & Identity", "Environmental Signage", "Collateral Suite"],
    },
  },

  // ── 03 ─────────────────────────────────────────────────────────────
  {
    slug: "festival-mbois-8",
    title: "Festival Mbois 8",
    client: "Malang Creative Community",
    year: "2023",
    category: "Event Visual Identity",
    industry: "arts",
    disciplines: ["identity", "campaign", "outdoor", "digital"],
    shortDescription:
      "Dynamic visual identity and city-wide campaign system celebrating regional creative economy.",
    description:
      "A bold, energetic identity combining contemporary typography with regional cultural motifs to unite artists, makers, and innovators across East Java. The campaign system extended across outdoor media, digital activations, and merchandise.",
    excerpt:
      "Dynamic visual identity and city-wide campaign system celebrating regional creative economy.",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: true,
    tags: ["event", "campaign", "outdoor", "culture"],
    details: {
      scope: ["Visual Identity", "Campaign System", "Outdoor Media", "Digital Activation"],
      challenge:
        "Create a unifying identity for a diverse creative festival that energizes both participants and the public.",
      solution:
        "Layered typographic compositions with regional cultural references deployed across an integrated campaign system.",
      deliverables: ["Identity System", "Outdoor Banners", "Social Media Kit", "Merchandise"],
    },
  },

  // ── 04 ─────────────────────────────────────────────────────────────
  {
    slug: "bank-sidoarjo",
    title: "Bank Sidoarjo",
    client: "PT BPR Bank Sidoarjo",
    year: "2023",
    category: "Corporate & Signage",
    industry: "corporate",
    disciplines: ["identity", "signage", "indoor"],
    shortDescription:
      "Modern regional banking corporate identity and branch signage environmental graphics.",
    description:
      "Transforming the visual language of a longstanding financial institution to appeal to a new generation of entrepreneurs while cementing institutional stability. The work spans corporate identity through to full environmental signage deployment.",
    excerpt:
      "Modern regional banking corporate identity and branch signage environmental graphics.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: true,
    tags: ["corporate", "banking", "signage", "environmental"],
    details: {
      scope: ["Brand Identity", "Environmental Signage", "Indoor Graphics"],
      challenge:
        "Modernise a traditional financial institution identity while maintaining institutional gravitas.",
      solution:
        "Clean typographic identity with structured environmental graphic system for branch interiors and exteriors.",
      deliverables: ["Identity Refresh", "Branch Signage System", "Indoor Environmental Graphics"],
    },
  },

  // ── 05 ─────────────────────────────────────────────────────────────
  {
    slug: "tech-link",
    title: "Tech Link",
    client: "Tech Link Asia",
    year: "2024",
    category: "Digital Platform",
    industry: "services",
    disciplines: ["digital", "identity"],
    shortDescription:
      "Digital product system, brand identity, and design system for next-gen enterprise networking.",
    description:
      "Designing a sophisticated digital identity and UI/UX component library enabling seamless connection between enterprise services and developer tooling. The design system prioritises clarity, speed, and scalability.",
    excerpt:
      "Digital product system, brand identity, and design system for next-gen enterprise networking.",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: false,
    tags: ["digital", "platform", "identity", "tech"],
    details: {
      scope: ["Brand Identity", "Digital Design System", "UI/UX"],
      challenge:
        "Build a scalable digital identity that works across complex enterprise product surfaces.",
      solution:
        "Modular component library with systematic design tokens and clear hierarchy principles.",
      deliverables: ["Brand Identity", "Design System", "UI Component Library"],
    },
  },

  // ── 06 ─────────────────────────────────────────────────────────────
  {
    slug: "malang-creative-center",
    title: "Malang Creative Center",
    client: "Dinas Perindustrian dan Perdagangan Kota Malang",
    year: "2023",
    category: "Wayfinding & Environmental",
    industry: "government",
    disciplines: ["signage", "identity", "indoor"],
    shortDescription:
      "Wayfinding system and environmental graphic design for a 9-story creative powerhouse.",
    description:
      "A comprehensive spatial navigation system guiding thousands of daily creators, students, and visitors across multi-floor creative facilities. The work integrates identity, wayfinding, and environmental graphics into a cohesive spatial experience.",
    excerpt:
      "Wayfinding system and environmental graphic design for a 9-story creative powerhouse.",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: false,
    tags: ["wayfinding", "environmental", "government", "spatial"],
    details: {
      scope: ["Wayfinding System", "Environmental Graphics", "Spatial Identity"],
      challenge:
        "Design a clear wayfinding system for a complex multi-storey creative facility serving diverse user groups.",
      solution:
        "Structured typographic wayfinding with colour-coded floor zoning and environmental graphic interventions.",
      deliverables: ["Wayfinding System", "Floor Maps", "Environmental Graphics", "Signage Specs"],
    },
  },

  // ── 07 ─────────────────────────────────────────────────────────────
  {
    slug: "mie-gacoan",
    title: "Mie Gacoan",
    client: "PT Pesta Pora Abadi",
    year: "2023",
    category: "Packaging & Retail",
    industry: "fnb",
    disciplines: ["packaging", "identity", "outdoor"],
    shortDescription:
      "High-volume packaging design system and environmental identity for nationwide culinary chain.",
    description:
      "Engineering durable, sustainable, and unmistakable visual packaging for one of Indonesia's most beloved and rapidly expanding culinary brands. The work spans product packaging through retail environmental graphics.",
    excerpt:
      "High-volume packaging design system and environmental identity for nationwide culinary chain.",
    coverImage:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: false,
    tags: ["packaging", "fnb", "retail", "outdoor"],
    details: {
      scope: ["Packaging Design", "Retail Identity", "Outdoor Media"],
      challenge:
        "Design packaging that stands out at scale while remaining cost-effective for high-volume production.",
      solution:
        "Bold typographic packaging system with a strong visual hierarchy and consistent brand colour application.",
      deliverables: ["Packaging System", "Retail Signage", "Outdoor Advertising"],
    },
  },

  // ── 08 ─────────────────────────────────────────────────────────────
  {
    slug: "universitas-widyagama",
    title: "Universitas Widyagama",
    client: "Yayasan Pembina Pendidikan Indonesia Widyagama",
    year: "2022",
    category: "Institutional Identity",
    industry: "education",
    disciplines: ["identity", "print", "signage"],
    shortDescription:
      "Academic branding overhaul and institutional identity guidelines for higher education.",
    description:
      "Unifying academic faculties, publications, and campus signage under a cohesive, dignified visual banner. The identity system brought clarity and distinction to a multi-faculty institution across all communications.",
    excerpt:
      "Academic branding overhaul and institutional identity guidelines for higher education.",
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
    ],
    featured: false,
    tags: ["education", "institutional", "identity"],
    details: {
      scope: ["Brand Identity", "Print System", "Campus Signage"],
      challenge:
        "Bring visual cohesion to a multi-faculty institution with inconsistent historical branding.",
      solution:
        "A restrained, authoritative identity system with flexible faculty sub-brand logic and clear publication standards.",
      deliverables: ["Identity Guidelines", "Publication System", "Campus Signage"],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────
// Query helpers
// ─────────────────────────────────────────────────────────────────────

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(count = 4): Project[] {
  const featured = projects.filter((p) => p.featured);
  return featured.slice(0, count);
}

export function getProjectsByFilters(params: {
  filter?: string;        // WorkFilter value
  discipline?: string;    // Backwards-compat: direct Discipline key
  industry?: string;
}): Project[] {
  let filtered = [...projects];

  // Primary: WorkFilter-based filtering (new filter bar)
  if (params.filter && params.filter !== "all") {
    const disciplines = filterToDisciplines[params.filter as WorkFilter];
    if (disciplines) {
      filtered = filtered.filter((p) =>
        p.disciplines.some((d) => disciplines.includes(d))
      );
    }
  }

  // Backwards-compat: direct discipline param (old URL format)
  if (!params.filter && params.discipline && params.discipline !== "all") {
    filtered = filtered.filter((p) =>
      p.disciplines.includes(params.discipline as Discipline)
    );
  }

  if (params.industry && params.industry !== "all") {
    filtered = filtered.filter(
      (p) => p.industry === (params.industry as Industry)
    );
  }

  return filtered;
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Returns a count of projects for each WorkFilter */
export function getFilterCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: projects.length };

  const filters: Array<WorkFilter> = [
    "brand", "product", "promotion", "space", "digital", "indoor", "outdoor",
  ];

  for (const filter of filters) {
    const disciplines = filterToDisciplines[filter];
    if (disciplines) {
      counts[filter] = projects.filter((p) =>
        p.disciplines.some((d) => disciplines.includes(d))
      ).length;
    }
  }

  return counts;
}

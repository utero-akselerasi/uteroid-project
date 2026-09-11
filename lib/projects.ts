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
    slug: "garageplug",
    title: "GaragePlug Indonesia",
    client: "PT. Era Automotive Revolution",
    year: "2024",
    category: "Brand Identity & Design System",
    industry: "services",
    disciplines: ["identity", "digital", "print", "indoor", "outdoor"],
    shortDescription:
      "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
    description:
      "GaragePlug adalah perangkat lunak berbasis cloud easy-to-use yang menyediakan platform digital end-to-end untuk bengkel mobil dan detailing center. Sebagai platform premium cloud untuk industri pelayanan otomotif yang dipercaya lebih dari 5.000 pengguna di seluruh dunia, GaragePlug berekspansi ke Indonesia di bawah naungan PT. Era Automotive Revolution. Utero merancang sistem standarisasi identitas visual (GSM) menyeluruh mencakup logogram generator tenaga, konfigurasi logo horizontal & vertikal, sistem warna hijau tua (#003D2E) dan supergraphic, sarana korporasi, seragam teknisi, merchandise, sarana penanda (totem & neonbox), media promosi, hingga livery armada transportasi.",
    excerpt:
      "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
    coverImage: "/projects/garageplug/cover.webp",
    heroImage: "/projects/garageplug/cover.webp",
    galleryImages: [
      "/projects/garageplug/01-page-08.webp",
      "/projects/garageplug/02-page-10.webp",
      "/projects/garageplug/03-page-12.webp",
      "/projects/garageplug/04-page-15.webp",
      "/projects/garageplug/05-page-20.webp",
      "/projects/garageplug/06-page-22.webp",
      "/projects/garageplug/07-page-26.webp",
      "/projects/garageplug/08-page-27.webp",
      "/projects/garageplug/09-page-29.webp",
      "/projects/garageplug/10-page-30.webp",
      "/projects/garageplug/11-page-31.webp",
      "/projects/garageplug/12-page-32.webp",
      "/projects/garageplug/13-page-33.webp",
      "/projects/garageplug/14-page-41.webp",
      "/projects/garageplug/15-page-45.webp",
      "/projects/garageplug/16-page-52.webp",
      "/projects/garageplug/17-page-55.webp",
      "/projects/garageplug/18-page-58.webp",
      "/projects/garageplug/19-page-60.webp",
      "/projects/garageplug/20-page-64.webp",
      "/projects/garageplug/21-page-66.webp",
      "/projects/garageplug/22-page-70.webp",
      "/projects/garageplug/23-page-72.webp",
      "/projects/garageplug/24-page-74.webp",
    ],
    featured: true,
    tags: ["cloud", "automotive", "identity", "gsm", "fleet"],
    details: {
      scope: [
        "Pedoman Identitas Brand (GSM)",
        "Standarisasi & Grid Konstruksi Logo",
        "Palet Warna & Supergraphic",
        "Sarana Korporasi (Stationery)",
        "Seragam & Workwear",
        "Sarana Penanda (Signage)",
        "Media Periklanan",
        "Branding Armada Transportasi",
      ],
      challenge:
        "Membangun sistem standarisasi identitas visual jangka panjang untuk platform teknologi otomotif global di Indonesia, menjamin konsistensi mutlak di seluruh media digital, seragam kerja, merchandise, periklanan, dan armada operasional.",
      solution:
        "Mengembangkan pedoman identitas visual berbasis logogram generator yang merepresentasikan pembangkit tenaga dan penggerak energi. Dipadukan palet warna hijau tua (#003D2E) lambang pertumbuhan dan go green, sistem diterapkan secara terpadu pada sarana korporasi, apparel, penanda, hingga livery kendaraan.",
      deliverables: [
        "Buku Pedoman Identitas Brand (GSM)",
        "Konfigurasi Logo Horizontal & Vertical",
        "Stationery (Kop Surat, Amplop, Map, Kartu Nama, ID Card)",
        "Apparel (Kemeja, Polo, Wearpack, Topi)",
        "Merchandise (Mug, Tumbler, Totebag, Jam Dinding)",
        "Sarana Penanda (Totem, Mini Totem, Neonbox)",
        "Media Iklan (Roll Banner, Umbul-umbul, Billboard, Social Media)",
        "Livery Armada (Granmax, Alphard, Bus, Box Pick Up)",
      ],
    },
  },

  // ── 02 ─────────────────────────────────────────────────────────────
  {
    slug: "mcc",
    title: "Malang Creative Center",
    client: "Malang Creative Center (MCC)",
    year: "2023",
    category: "Creative Hub Identity & Ambience",
    industry: "arts",
    disciplines: ["identity", "signage", "exhibition", "indoor", "outdoor"],
    shortDescription:
      "Pedoman grafis dan identitas visual pusat inovasi dan kolaborasi industri kreatif terbesar di Jawa Timur.",
    description:
      "Malang Creative Center (MCC) adalah episentrum ekosistem kreatif Kota Malang yang mengintegrasikan 17 subsektor ekonomi kreatif. Utero merancang pedoman identitas brand komprehensif, mentransformasikan filosofi kolaborasi dan pertumbuhan kultural ke dalam sistem visual dinamis, penanda ruang, dan aplikasi lingkungan fisik.",
    excerpt:
      "Pedoman grafis dan identitas visual pusat inovasi dan kolaborasi industri kreatif terbesar di Jawa Timur.",
    coverImage: "/projects/mcc/cover.webp",
    heroImage: "/projects/mcc/cover.webp",
    galleryImages: [
      "/projects/mcc/01-page-02.webp",
      "/projects/mcc/02-page-03.webp",
      "/projects/mcc/03-page-04.webp",
      "/projects/mcc/04-page-05.webp",
      "/projects/mcc/05-page-06.webp",
      "/projects/mcc/06-page-07.webp",
      "/projects/mcc/07-page-08.webp",
      "/projects/mcc/08-page-09.webp",
      "/projects/mcc/09-page-10.webp",
      "/projects/mcc/10-page-11.webp",
      "/projects/mcc/11-page-12.webp",
      "/projects/mcc/12-page-13.webp",
      "/projects/mcc/13-page-14.webp",
      "/projects/mcc/14-page-15.webp",
      "/projects/mcc/15-page-16.webp",
      "/projects/mcc/16-page-17.webp",
      "/projects/mcc/17-page-18.webp",
      "/projects/mcc/18-page-19.webp",
      "/projects/mcc/19-page-20.webp",
      "/projects/mcc/20-page-21.webp",
    ],
    featured: true,
    tags: ["creative-hub", "culture", "identity", "spatial"],
    details: {
      scope: [
        "Pedoman Identitas Brand (GSM)",
        "Standarisasi Logo & Konstruksi Grid",
        "Sistem Warna & Tipografi",
        "Environmental Signage",
        "Aplikasi Media Komunikasi",
        "Elemen Grafis & Supergraphic",
      ],
      challenge:
        "Merancang sistem identitas visual yang mampu merepresentasikan keberagaman 17 subsektor ekonomi kreatif dalam satu platform visual yang kohesif dan dinamis di Kota Malang.",
      solution:
        "Mengembangkan sistem visual yang fleksibel dan modular berbasis identitas kultural Malang, diterapkan pada ruang fisik, penanda, dan media komunikasi di seluruh gedung MCC.",
      deliverables: [
        "Buku Pedoman Identitas Brand (GSM)",
        "Logo & Sistem Identitas Visual",
        "Environmental Signage & Wayfinding",
        "Supergraphic System",
        "Media Komunikasi Digital & Cetak",
      ],
    },
  },

  // ── 03 ─────────────────────────────────────────────────────────────
  {
    slug: "stamford",
    title: "Stamford Indonesia FC",
    client: "Stamford Indonesia FC",
    year: "2021",
    category: "Sports Academy Brand Identity",
    industry: "education",
    disciplines: ["identity", "campaign", "print"],
    shortDescription:
      "Identitas visual dan pedoman brand akademi sepak bola terpadu bertaraf internasional 'Beyond Dreams'.",
    description:
      "Stamford Indonesia FC (SIFC) adalah pusat pelatihan sepak bola terpadu yang memadukan pendidikan formal, kurikulum Filanesia, dan lisensi AFC. Utero menyusun pedoman identitas brand dari sketsa konsep hingga implementasi jersey, apparel, dan sarana fasilitas.",
    excerpt:
      "Identitas visual dan pedoman brand akademi sepak bola terpadu bertaraf internasional 'Beyond Dreams'.",
    coverImage: "/projects/stamford/cover.webp",
    heroImage: "/projects/stamford/cover.webp",
    galleryImages: [
      "/projects/stamford/01-page-02.webp",
      "/projects/stamford/02-page-03.webp",
      "/projects/stamford/03-page-04.webp",
      "/projects/stamford/04-page-05.webp",
      "/projects/stamford/05-page-06.webp",
      "/projects/stamford/06-page-07.webp",
      "/projects/stamford/07-page-08.webp",
      "/projects/stamford/08-page-09.webp",
      "/projects/stamford/09-page-10.webp",
      "/projects/stamford/10-page-11.webp",
      "/projects/stamford/11-page-12.webp",
      "/projects/stamford/12-page-13.webp",
      "/projects/stamford/13-page-14.webp",
      "/projects/stamford/14-page-15.webp",
      "/projects/stamford/15-page-16.webp",
      "/projects/stamford/16-page-17.webp",
      "/projects/stamford/17-page-18.webp",
      "/projects/stamford/18-page-19.webp",
      "/projects/stamford/19-page-20.webp",
      "/projects/stamford/20-page-21.webp",
    ],
    featured: true,
    tags: ["sports", "academy", "football", "identity"],
    details: {
      scope: [
        "Konsep & Strategi Brand",
        "Identitas Logo & Maskot",
        "Sistem Warna & Tipografi",
        "Jersey & Apparel Akademi",
        "Sarana Media Promosi",
        "Fasilitas & Signage",
      ],
      challenge:
        "Membangun identitas brand akademi sepak bola profesional yang mampu mengangkat citra standar internasional sekaligus merepresentasikan semangat lokal dan aspirasi generasi muda.",
      solution:
        "Mengembangkan identitas visual berbasis tagline 'Beyond Dreams' dengan logotype atletik, palet warna klub yang kuat, serta sistem aplikasi menyeluruh dari jersey hingga fasilitas pelatihan.",
      deliverables: [
        "Logo & Brand Identity System",
        "Jersey Design (Home, Away, Goalkeeper)",
        "Apparel (Jaket, Polo, Kaos Training)",
        "Sarana Media & Promosi",
        "Signage Fasilitas Akademi",
      ],
    },
  },

  // ── 04 ─────────────────────────────────────────────────────────────
  {
    slug: "chatten",
    title: "Chatten Coffee & Floats",
    client: "Chatten Cafe",
    year: "2023",
    category: "F&B Visual Identity & Packaging",
    industry: "fnb",
    disciplines: ["identity", "packaging", "indoor"],
    shortDescription:
      "Identitas visual retro pop dan pedoman packaging gerai kopi dan sajian float modern.",
    description:
      "Chatten Coffee & Floats menghadirkan nuansa klasik hangat dengan sentuhan pop kontemporer. Utero menyusun pedoman identitas merek meliputi maskot, tipografi retro, kemasan produk, dan elemen interior cafe.",
    excerpt:
      "Identitas visual retro pop dan pedoman packaging gerai kopi dan sajian float modern.",
    coverImage: "/projects/chatten/cover.webp",
    heroImage: "/projects/chatten/cover.webp",
    galleryImages: [
      "/projects/chatten/01-page-02.webp",
      "/projects/chatten/02-page-03.webp",
      "/projects/chatten/03-page-04.webp",
      "/projects/chatten/04-page-05.webp",
      "/projects/chatten/05-page-06.webp",
      "/projects/chatten/06-page-07.webp",
      "/projects/chatten/07-page-08.webp",
      "/projects/chatten/08-page-09.webp",
      "/projects/chatten/09-page-10.webp",
      "/projects/chatten/10-page-11.webp",
      "/projects/chatten/11-page-12.webp",
      "/projects/chatten/12-page-13.webp",
      "/projects/chatten/13-page-14.webp",
      "/projects/chatten/14-page-15.webp",
      "/projects/chatten/15-page-16.webp",
      "/projects/chatten/16-page-17.webp",
      "/projects/chatten/17-page-18.webp",
      "/projects/chatten/18-page-19.webp",
      "/projects/chatten/19-page-20.webp",
      "/projects/chatten/20-page-21.webp",
    ],
    featured: true,
    tags: ["fnb", "coffee", "retro", "packaging"],
    details: {
      scope: [
        "Konsep & Strategi Brand",
        "Identitas Visual & Maskot",
        "Sistem Tipografi Retro",
        "Kemasan Produk (Packaging)",
        "Elemen Interior Cafe",
        "Media Promosi Digital",
      ],
      challenge:
        "Menciptakan identitas merek yang hangat dan memorable untuk cafe kopi dan float, menonjol di tengah persaingan ketat industri F&B dengan karakter visual retro pop yang autentik.",
      solution:
        "Membangun ekosistem visual berbasis maskot karakter retro yang kuat, dipadu sistem tipografi vintage dan palet warna hangat, diterapkan konsisten di seluruh kemasan, interior, dan komunikasi brand.",
      deliverables: [
        "Logo & Brand Identity",
        "Maskot Brand",
        "Packaging System (Cup, Box, Bag)",
        "Interior Graphic Elements",
        "Social Media Kit & Template",
      ],
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

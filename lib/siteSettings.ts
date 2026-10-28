export interface BannerSlide {
  id: number;
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

export interface StatementBannerConfig {
  image: string;
  tag: string;
  quote: string;
  ctaText: string;
  ctaHref: string;
}

export interface PageBannersConfig {
  servicesHeroImage: string;
  insightsHeroImage: string;
  studioHeroImage: string;
  contactHeroImage: string;
}

export interface TypographyConfig {
  typeface: string;
  customFont?: string;
  googleFontFamily?: string;
}

export interface ContactsConfig {
  phone: string;
  whatsapp: string;
  email: string;
  secondaryEmail?: string;
  address: string;
  googleMapsUrl?: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin?: string;
}

export interface StudioMetric {
  num: string;
  label: string;
  sub: string;
}

export interface StudioConfig {
  heading: string;
  description: string;
  established: string;
  philosophyQuote: string;
  philosophyText: string;
  disciplinesText1: string;
  disciplinesText2: string;
  workspaceImage1: string;
  workspaceImage2: string;
  metrics: StudioMetric[];
}

export interface InsightArticleConfig {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  content: string;
}

export interface InsightsConfig {
  headerTitle: string;
  headerDescription: string;
  headerTag: string;
  articles: InsightArticleConfig[];
}

export interface SiteSettings {
  typography: TypographyConfig;
  banners: {
    heroSlides: BannerSlide[];
    statementBanner: StatementBannerConfig;
    pageBanners: PageBannersConfig;
  };
  serviceImages: Record<string, string>;
  contacts: ContactsConfig;
  studio: StudioConfig;
  insights: InsightsConfig;
  updatedAt?: string;
}

export interface TypefaceOption {
  id: string;
  name: string;
  fontFamily: string;
  category: "sans-serif" | "display" | "serif";
  googleFontFamily?: string;
  googleFontUrl?: string;
  description: string;
  badge: string;
}

export const AVAILABLE_TYPEFACES: TypefaceOption[] = [
  {
    id: "helvetica",
    name: "Helvetica Neue / Arial",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    category: "sans-serif",
    description: "Font asli Utero.id — Swiss modernist yang tegas, abadi, dan netral.",
    badge: "Default Studio",
  },
  {
    id: "plus-jakarta-sans",
    name: "Plus Jakarta Sans",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    category: "sans-serif",
    googleFontFamily: "Plus+Jakarta+Sans:wght@400;500;600;700;800;900",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap",
    description: "Geometric grotesque modern karya desainer Indonesia — segar, dinamis, dan sangat tajam.",
    badge: "Indonesian Modern",
  },
  {
    id: "inter",
    name: "Inter",
    fontFamily: "'Inter', sans-serif",
    category: "sans-serif",
    googleFontFamily: "Inter:wght@400;500;600;700;800;900",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
    description: "Standar industri global untuk antarmuka digital dan keterbacaan mikro tinggi.",
    badge: "High Legibility",
  },
  {
    id: "syne",
    name: "Syne",
    fontFamily: "'Syne', sans-serif",
    category: "display",
    googleFontFamily: "Syne:wght@500;700;800",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&display=swap",
    description: "Tipografi avant-garde Prancis yang eksentrik, berani, dan artistik untuk studio desain.",
    badge: "Creative Brutalist",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    fontFamily: "'Space Grotesk', sans-serif",
    category: "display",
    googleFontFamily: "Space+Grotesk:wght@400;500;600;700",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
    description: "Proporsi brutalist yang terinspirasi teknologi, ruang angkasa, dan arsitektur.",
    badge: "Tech & Architecture",
  },
  {
    id: "outfit",
    name: "Outfit",
    fontFamily: "'Outfit', sans-serif",
    category: "sans-serif",
    googleFontFamily: "Outfit:wght@400;500;600;700;800;900",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap",
    description: "Karakter geometris bersih dengan sudut halus untuk visual brand kontemporer.",
    badge: "Brand Geometric",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    fontFamily: "'Montserrat', sans-serif",
    category: "sans-serif",
    googleFontFamily: "Montserrat:wght@400;500;600;700;800;900",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap",
    description: "Terinspirasi poster dan plakat tradisional perkotaan, megah dan bervolume.",
    badge: "Urban Monumental",
  },
  {
    id: "oswald",
    name: "Oswald",
    fontFamily: "'Oswald', sans-serif",
    category: "display",
    googleFontFamily: "Oswald:wght@500;600;700",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    description: "Condensed headline grotesque untuk judul berbobot berat dan gaya koran/poster cetak.",
    badge: "Condensed Impact",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    fontFamily: "'Playfair Display', serif",
    category: "serif",
    googleFontFamily: "Playfair+Display:wght@600;700;900",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&display=swap",
    description: "Serif berkelas tinggi dengan kontras tajam ala majalah fashion dan editorial seni.",
    badge: "Luxury Editorial",
  },
];

export const defaultSiteSettings: SiteSettings = {
  typography: {
    typeface: "'Helvetica Neue', Arial, sans-serif",
    customFont: "",
  },
  banners: {
    heroSlides: [
      {
        id: 1,
        image: "/img/Creative Print Studio in Action.png",
        alt: "Creative Print Studio in Action",
        title: "DESIGN AS A SOLUTION",
        subtitle: "EST. 1998 — MALANG, INDONESIA",
      },
      {
        id: 2,
        image: "/img/Creative Moodboard in Red and Black.png",
        alt: "Creative Moodboard in Red and Black",
        title: "STRATEGIC BRAND SYSTEMS",
        subtitle: "PHYSICAL EXECUTION & SPATIAL WAYFINDING",
      },
      {
        id: 3,
        image: "/img/Sunlit Creative Studio Workshop.png",
        alt: "Sunlit Creative Studio Workshop",
        title: "ENDURING CRAFT & IMPACT",
        subtitle: "HOLISTIC VISUAL & PHYSICAL ENVIRONMENTS",
      },
    ],
    statementBanner: {
      image: "/img/Collaborative Design Moodboard Workspace.png",
      tag: "STUDIO STATEMENT // 02B",
      quote:
        "“Kami percaya desain bukan sekadar dekorasi, melainkan instrumen strategis yang mengakselerasi pertumbuhan bisnis dan memperjelas identitas kultural.”",
      ctaText: "Pelajari Studio Utero",
      ctaHref: "/studio",
    },
    pageBanners: {
      servicesHeroImage: "/img/Services/brand.png",
      insightsHeroImage: "/img/unnamed.webp",
      studioHeroImage: "/img/unnamed.webp",
      contactHeroImage: "/img/unnamed.webp",
    },
  },
  serviceImages: {
    brand: "/img/Services/brand.png",
    product: "/img/Services/product.png",
    promotion: "/img/Services/promotion.png",
    digital: "/img/Services/digital.png",
    environmental: "/img/Services/environment.png",
    outdoor: "/img/Services/outdoor.png",
  },
  contacts: {
    phone: "+62-819-9990-0900",
    whatsapp: "6281999900900",
    email: "marketingutero@gmail.com",
    secondaryEmail: "uterobranding@gmail.com",
    address: "Jl. Bantaran 1 No. 25, Purwantoro, Blimbing, Kota Malang, Jawa Timur 65141",
    googleMapsUrl: "https://maps.google.com/?q=Utero+Indonesia+Malang",
    instagram: "https://www.instagram.com/uteroindonesia/?hl=en",
    facebook: "https://www.facebook.com/uteroadvertisingindonesia/",
    youtube: "https://www.youtube.com/@uteroindonesia",
    linkedin: "https://www.linkedin.com/company/utero-indonesia",
  },
  studio: {
    heading: "STUDIO",
    description: "An Indonesian creative design studio and brand consultancy based in Malang, delivering strategic brand, packaging, spatial, and digital solutions since 1998.",
    established: "EST. 1998",
    philosophyQuote: "“IDE TANPA REALISASI ADALAH ILUSI.”",
    philosophyText: "Desain sejati tidak berhenti di layar monitor atau lembar presentasi. Keberhasilan sebuah identitas dibuktikan saat ia diimplementasikan di dunia nyata: pada material cetak presisi, kemasan fungsional di rak ritel, hingga sistem wayfinding yang memandu ribuan manusia setiap hari.",
    disciplinesText1: "Sejak 1998, Utero telah berevolusi dari studio periklanan independen menjadi firma konsultan desain multidisiplin dengan workshop fabrikasi dan fasilitas produksi internal di Malang, Jawa Timur.",
    disciplinesText2: "Pendekatan hibrida ini memastikan setiap gagasan konseptual memiliki kelayakan produksi mutlak tanpa kompromi kualitas estetika.",
    workspaceImage1: "/img/studio.png",
    workspaceImage2: "/img/stodio.png",
    metrics: [
      { num: "25+", label: "TAHUN PENGALAMAN", sub: "Solusi desain berkelanjutan sejak 1998" },
      { num: "06", label: "DISIPLIN UTAMA", sub: "Identitas, Kemasan, Spasial, Kampanye, Digital, Outdoor" },
      { num: "500+", label: "PROYEK SELESAI", sub: "Brand nasional, UMKM, korporasi & institusi" },
      { num: "Malang", label: "KANTOR PUSAT", sub: "Studio kreatif & workshop terintegrasi" },
    ],
  },
  insights: {
    headerTitle: "Insights",
    headerDescription: "Critical perspectives, case reflections, and design philosophies on branding, spatial environments, and physical realization.",
    headerTag: "04 / PUBLICATIONS & PERSPECTIVES",
    articles: [
      {
        slug: "power-of-identity-in-digital-noise",
        title: "The Power of Identity in the Age of Digital Noise",
        category: "Design Strategy",
        date: "March 2024",
        readTime: "4 min read",
        excerpt: "Why surface-level trends fail and how enduring identity systems create long-term enterprise equity in fragmented digital landscapes.",
        coverImage: "/img/remote/insight-identity.jpg",
        content: "Design is not cosmetic dressing; it is the visual architecture of purpose. In a crowded marketplace where attention spans are measured in milliseconds, clarity and distinctiveness become an organization's most valuable strategic assets.",
      },
      {
        slug: "environmental-graphics-and-spatial-experience",
        title: "Environmental Graphics: Bridging Physical Space and Brand Emotion",
        category: "Signage & Spaces",
        date: "January 2024",
        readTime: "5 min read",
        excerpt: "Examining the psychological impact of wayfinding, architectural typography, and human navigation in massive public creative centers.",
        coverImage: "/img/remote/space.jpg",
        content: "When visitors step into a physical facility, every sign, typography choice, and spatial junction tells a story. Environmental design transforms inert architecture into an active dialogue with human beings.",
      },
      {
        slug: "packaging-as-the-first-physical-handshake",
        title: "Packaging as the First Physical Handshake",
        category: "Packaging Design",
        date: "November 2023",
        readTime: "3 min read",
        excerpt: "Engineering tactile packaging systems that balance consumer desirability, logistical efficiency, and sustainable material choices.",
        coverImage: "/img/remote/product.jpg",
        content: "Before a customer tastes a product or experiences its utility, their hands touch the container. The weight, texture, and opening ritual of packaging define perceived value instantly.",
      },
      {
        slug: "ide-tanpa-realisasi-execution-philosophy",
        title: "Ide Tanpa Realisasi: The Philosophy of Rigorous Execution",
        category: "Studio Culture",
        date: "August 2023",
        readTime: "6 min read",
        excerpt: "Why 25+ years in Indonesian creative industries taught us that strategy without ruthless craft execution is purely theoretical.",
        coverImage: "/img/remote/insight-philosophy.jpg",
        content: "Great ideas are common; the discipline to resolve millimeter tolerances, print calibrations, and scalable identity guidelines across hundreds of applications is what separates real impact from wishful thinking.",
      },
    ],
  },
};

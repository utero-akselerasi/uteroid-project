// ─────────────────────────────────────────────
// UTERO.ID — Project Data Types
// ─────────────────────────────────────────────
// When adding a new project, you only need to add an entry
// to lib/projects.ts — all UI components read from there.

export type Discipline =
  | "identity"
  | "packaging"
  | "signage"
  | "campaign"
  | "print"
  | "digital"
  | "exhibition"
  | "indoor"
  | "outdoor";

export type Industry =
  | "fnb"
  | "corporate"
  | "government"
  | "education"
  | "property"
  | "retail"
  | "arts"
  | "event"
  | "services"
  | "products";

// Filter category groupings that map to disciplines
export type WorkFilter =
  | "all"
  | "brand"       // → identity
  | "product"     // → packaging
  | "promotion"   // → campaign, print
  | "space"       // → signage, exhibition
  | "digital"     // → digital
  | "indoor"      // → indoor
  | "outdoor";    // → outdoor

export interface ProjectDetails {
  scope?: string[];
  challenge?: string;
  solution?: string;
  deliverables?: string[];
}

export interface Project {
  // ── Core identity (required) ──────────────────────────────
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;            // Display string, e.g. "Brand Identity & Spatial"
  industry: Industry;
  disciplines: Discipline[];

  // ── Text content ─────────────────────────────────────────
  shortDescription: string;    // 1–2 sentence summary for archive grid
  description: string;         // Longer narrative for case study
  excerpt?: string;            // Backwards-compat alias for shortDescription

  // ── Media ────────────────────────────────────────────────
  coverImage: string;          // Primary cover image for grid + detail hero
  heroImage?: string;          // Backwards-compat alias for coverImage
  galleryImages?: string[];    // Case study gallery (1–N images)
  gallery?: string[];          // Backwards-compat alias for galleryImages

  // ── Flags & metadata ─────────────────────────────────────
  featured?: boolean;          // Show prominently on homepage (top ~3–4)
  tags?: string[];             // Optional tags for future filtering

  // ── Case study content (fill from PDF) ───────────────────
  details?: ProjectDetails;
}

// ─────────────────────────────────────────────
// Display labels
// ─────────────────────────────────────────────

export const disciplineLabels: Record<Discipline, string> = {
  identity: "Identity",
  packaging: "Packaging",
  signage: "Signage / Environment",
  campaign: "Campaign",
  print: "Print",
  digital: "Digital",
  exhibition: "Exhibition",
  indoor: "Indoor Visuals",
  outdoor: "Outdoor & Environmental",
};

export const industryLabels: Record<Industry, string> = {
  fnb: "F&B",
  corporate: "Corporate",
  government: "Government",
  education: "Education",
  property: "Property & Hospitality",
  retail: "Retail",
  arts: "Arts & Culture",
  event: "Event",
  services: "Services",
  products: "Products",
};

export const workFilterLabels: Record<WorkFilter, string> = {
  all: "All",
  brand: "Brand",
  product: "Product",
  promotion: "Promotion",
  space: "Space",
  digital: "Digital",
  indoor: "Indoor",
  outdoor: "Outdoor",
};

// Maps each WorkFilter to the discipline keys it covers
export const filterToDisciplines: Record<WorkFilter, Discipline[] | null> = {
  all: null,
  brand: ["identity"],
  product: ["packaging"],
  promotion: ["campaign", "print"],
  space: ["signage", "exhibition"],
  digital: ["digital"],
  indoor: ["indoor"],
  outdoor: ["outdoor"],
};

// ─────────────────────────────────────────────
// Insight type (unchanged)
// ─────────────────────────────────────────────

export interface Insight {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
}

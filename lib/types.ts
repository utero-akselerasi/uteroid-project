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

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  category?: string;
  industry: Industry;
  disciplines: Discipline[];
  description: string;
  excerpt: string;
  heroImage?: string;
  gallery?: string[];
  featured?: boolean;
  href?: string;
}

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

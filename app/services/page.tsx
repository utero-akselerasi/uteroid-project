import type { Metadata } from "next";
import ServicesContent from "@/components/ServicesContent";

export const metadata: Metadata = {
  title: "Services — Design Disciplines & Capabilities",
  description:
    "Explore Utero's core design disciplines: Brand Identity, Product Packaging, Promotion Campaigns, Digital Systems, Environmental Spatial Wayfinding, and Large-Scale Outdoor Design.",
  openGraph: {
    type: "website",
    title: "Services — Design Disciplines & Capabilities",
    description:
      "Explore Utero's core design disciplines: Brand Identity, Product Packaging, Promotion Campaigns, Digital Systems, Environmental Spatial Wayfinding, and Large-Scale Outdoor Design.",
    url: "https://utero.id/services",
    images: [
      {
        url: "/img/unnamed.webp",
        width: 1280,
        height: 720,
        alt: "Utero Design Disciplines and Capabilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Design Disciplines & Capabilities",
    description:
      "Explore Utero's core design disciplines: Brand Identity, Product Packaging, Promotion Campaigns, Digital Systems, Environmental Spatial Wayfinding, and Large-Scale Outdoor Design.",
    images: ["/img/unnamed.webp"],
  },
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}

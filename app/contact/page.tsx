import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Initiate a project inquiry with Utero design studio. Reach our team in Malang, Indonesia for brand, spatial, packaging, and digital design collaborations.",
  openGraph: {
    type: "website",
    title: "Contact — Start a Project",
    description:
      "Initiate a project inquiry with Utero design studio. Reach our team in Malang, Indonesia for brand, spatial, packaging, and digital design collaborations.",
    url: "https://utero.id/contact",
    images: [
      {
        url: "/img/unnamed.webp",
        width: 1280,
        height: 720,
        alt: "Contact Utero Design Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Start a Project",
    description:
      "Initiate a project inquiry with Utero design studio. Reach our team in Malang, Indonesia for brand, spatial, packaging, and digital design collaborations.",
    images: ["/img/unnamed.webp"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}

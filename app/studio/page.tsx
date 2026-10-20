import type { Metadata } from "next";
import StudioContent from "@/components/StudioContent";

export const metadata: Metadata = {
  title: "Studio — About Utero Indonesia",
  description:
    "About Utero: an Indonesian multidisciplinary creative design studio and brand consultancy based in Malang, East Java, delivering strategic design solutions since 1998.",
  openGraph: {
    type: "website",
    title: "Studio — About Utero Indonesia",
    description:
      "About Utero: an Indonesian multidisciplinary creative design studio and brand consultancy based in Malang, East Java, delivering strategic design solutions since 1998.",
    url: "https://utero.id/studio",
    images: [
      {
        url: "/img/studio.png",
        width: 1672,
        height: 941,
        alt: "Utero Design Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio — About Utero Indonesia",
    description:
      "About Utero: an Indonesian multidisciplinary creative design studio and brand consultancy based in Malang, East Java, delivering strategic design solutions since 1998.",
    images: ["/img/studio.png"],
  },
  alternates: {
    canonical: "/studio",
  },
};

export default function StudioPage() {
  return <StudioContent />;
}

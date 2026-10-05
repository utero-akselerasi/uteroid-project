import type { Metadata } from "next";
import StudioContent from "@/components/StudioContent";

export const metadata: Metadata = {
  title: "Studio — About Utero Indonesia",
  description:
    "About Utero — an Indonesian brand consultancy and multidisciplinary creative design studio based in Malang since 1998.",
};

export default function StudioPage() {
  return <StudioContent />;
}

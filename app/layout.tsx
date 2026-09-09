import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: {
    default: "UTERO.ID — Design as a Solution",
    template: "%s | UTERO.ID",
  },
  description:
    "Utero is a premier Indonesian design company delivering brand, product, promotion, space, digital, indoor, and outdoor design solutions since 1998.",
  keywords: [
    "design company",
    "brand consultant",
    "branding agency",
    "product design",
    "graphic design",
    "environmental graphics",
    "Indonesia",
    "Utero",
  ],
  authors: [{ name: "Utero Indonesia" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "utero.id",
    title: "UTERO.ID — Design as a Solution",
    description:
      "Utero is an Indonesian design company delivering brand, product, promotion, space, digital, indoor, and outdoor design solutions since 1998.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

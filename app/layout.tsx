import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://utero.id"),
  title: {
    default: "UTERO.ID — Design as a Solution",
    template: "%s | Utero.id",
  },
  description:
    "Utero is an Indonesian brand consultancy and multidisciplinary creative design studio based in Malang, delivering brand, product, digital, spatial, and environmental design solutions since 1998.",
  keywords: [
    "design company",
    "brand consultant",
    "branding agency",
    "product design",
    "graphic design",
    "environmental graphics",
    "wayfinding",
    "Indonesia",
    "Malang",
    "Utero",
  ],
  authors: [{ name: "Utero Indonesia", url: "https://utero.id" }],
  creator: "Utero Indonesia",
  publisher: "Utero Indonesia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://utero.id",
    siteName: "Utero.id",
    title: "UTERO.ID — Design as a Solution",
    description:
      "Utero is an Indonesian brand consultancy and multidisciplinary creative design studio based in Malang, delivering brand, product, digital, spatial, and environmental design solutions since 1998.",
    images: [
      {
        url: "/img/unnamed.webp",
        width: 1280,
        height: 720,
        alt: "UTERO.ID — Design as a Solution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UTERO.ID — Design as a Solution",
    description:
      "Utero is an Indonesian brand consultancy and multidisciplinary creative design studio based in Malang, delivering brand, product, digital, spatial, and environmental design solutions since 1998.",
    images: ["/img/unnamed.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e31e24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth">
      <body className="antialiased">
        <LanguageProvider>
          <SmoothScroll>
            <CustomCursor />
            <Header />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}

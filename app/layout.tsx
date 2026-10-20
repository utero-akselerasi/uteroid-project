import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import JsonLd from "@/components/JsonLd";
import SkipToContent from "@/components/SkipToContent";
import { LanguageProvider } from "@/lib/LanguageContext";

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://utero.id/#organization",
      name: "PT. Utero Kreatif Indonesia",
      alternateName: ["Utero.id", "UTERO.ID", "Utero Indonesia"],
      url: "https://utero.id",
      logo: "https://utero.id/icon.svg",
      foundingDate: "1998",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Bantaran 1 No. 25, Purwantoro, Blimbing",
        addressLocality: "Malang",
        addressRegion: "Jawa Timur",
        postalCode: "65141",
        addressCountry: "ID",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+62-819-9990-0900",
          contactType: "customer service",
          email: "marketingutero@gmail.com",
          availableLanguage: ["Indonesian", "English"],
        },
      ],
      sameAs: [
        "https://www.instagram.com/uteroindonesia/?hl=en",
        "https://www.facebook.com/uteroadvertisingindonesia/",
        "https://www.youtube.com/@uteroindonesia",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://utero.id/#website",
      name: "Utero.id",
      alternateName: "PT. Utero Kreatif Indonesia",
      url: "https://utero.id",
      description:
        "Utero is an Indonesian brand consultancy and multidisciplinary creative design studio based in Malang, delivering brand, product, digital, spatial, and environmental design solutions since 1998.",
      publisher: {
        "@id": "https://utero.id/#organization",
      },
    },
  ],
};

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <JsonLd data={siteStructuredData} />
        <LanguageProvider>
          <SmoothScroll>
            <SkipToContent />
            <CustomCursor />
            <Header />
            <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}

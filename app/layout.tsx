import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { LanguageProvider } from "@/lib/LanguageContext";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import SiteShell from "@/components/SiteShell";

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

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const verification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL("https://utero.id"),
  ...(verification ? { verification: { google: verification } } : {}),
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`,
              }}
            />
          </>
        )}
        {gtmId && (
          <Script id="google-tag-manager" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(i)+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
          </Script>
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <JsonLd data={siteStructuredData} />
        <SiteSettingsProvider>
          <LanguageProvider>
            <SiteShell>{children}</SiteShell>
          </LanguageProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

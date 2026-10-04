import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const verification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL("https://utero.id"),
  ...(verification ? { verification: { google: verification } } : {}),
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
    <html lang="en" data-scroll-behavior="smooth">
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
      <body className="antialiased">
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

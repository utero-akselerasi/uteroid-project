"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import SkipToContent from "@/components/SkipToContent";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>{children}</main>;
  }
  return <SmoothScroll>
    <SkipToContent />
    <CustomCursor />
    <Header />
    <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
      <PageTransition>{children}</PageTransition>
    </main>
    <Footer />
  </SmoothScroll>;
}

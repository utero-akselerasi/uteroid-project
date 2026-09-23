"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Stop the browser from restoring the previous page's scroll position
    // on client-side navigations (App Router default restores it, which,
    // combined with Lenis' virtual scroll, leaves the viewer landed
    // mid-page and the project hero out of view).
    history.scrollRestoration = "manual";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On every route change, jump straight back to the top so the new page
  // (especially the project hero) is immediately visible. Both the native
  // scroll and Lenis' virtual scroll are reset — instantly, no smooth tween
  // — and it runs again after the transition completes to absorb any
  // late layout shift from images.
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    };

    resetScroll();
    const t = setTimeout(resetScroll, 60);
    const t2 = setTimeout(resetScroll, 400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [pathname]);

  return <>{children}</>;
}
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { notePopNavigation, wasRecentPopNavigation } from "@/lib/scrollState";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isFirstPath = useRef(true);

  useEffect(() => {
    // Let the browser restore scroll on reload and Back/Forward
    // (scrollRestoration "auto"). Client-side push navigations are still
    // forced to the top by the pathname effect below.
    history.scrollRestoration = "auto";

    const onPopState = () => {
      notePopNavigation();
    };
    window.addEventListener("popstate", onPopState);

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
      window.removeEventListener("popstate", onPopState);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On client-side route changes (link clicks), jump straight back to the
  // top so the new page is immediately visible. Skipped on:
  //  - initial mount (browser restores scroll on reload),
  //  - popstate navigations (browser/Next restores the history entry's
  //    scroll position — Back/Forward must land where the user left off),
  //  - same-pathname updates (search-param filter changes don't touch
  //    scroll because usePathname doesn't change).
  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    if (wasRecentPopNavigation()) return;
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

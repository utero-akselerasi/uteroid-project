"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { notePopNavigation, wasRecentPopNavigation } from "@/lib/scrollState";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isFirstPath = useRef(true);
  const suppressStableUntilRef = useRef(0);

  useEffect(() => {
    // Let the browser restore scroll on reload and Back/Forward
    // (scrollRestoration "auto"). Client-side push navigations are still
    // forced to the top by the pathname effect below.
    history.scrollRestoration = "auto";

    // After a popstate the browser/Next restores scroll immediately, but a
    // still-loading page clamps it to the short document. Retry the saved
    // position until the page is tall enough, and never fight the user.
    const restoreTimers: number[] = [];
    let restoreCancelled = false;
    let restorePending = false;
    const scheduleHistoryRestore = () => {
      restoreCancelled = false;
      const state = history.state as { __uteroScrollYStable?: number; __uteroScrollY?: number } | null;
      const saved = state?.__uteroScrollYStable ?? state?.__uteroScrollY;
      if (typeof saved !== "number" || saved < 80) {
        restorePending = false;
        return;
      }
      restorePending = true;
      const cancel = () => {
        restoreCancelled = true;
        restorePending = false;
        window.removeEventListener("wheel", cancel, true);
        window.removeEventListener("touchstart", cancel, true);
        window.removeEventListener("keydown", cancel, true);
      };
      window.addEventListener("wheel", cancel, { capture: true, passive: true });
      window.addEventListener("touchstart", cancel, { capture: true, passive: true });
      window.addEventListener("keydown", cancel, { capture: true });
      let attempts = 0;
      const finish = () => {
        restoreCancelled = true;
        restorePending = false;
        window.removeEventListener("wheel", cancel, true);
        window.removeEventListener("touchstart", cancel, true);
        window.removeEventListener("keydown", cancel, true);
      };
      const attempt = () => {
        if (restoreCancelled || ++attempts > 40) { finish(); return; }
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        if (Math.abs(scrollY - saved) <= 40) { finish(); return; }
        if (maxY >= saved - 40) {
          window.scrollTo({ top: saved, left: 0, behavior: "instant" as ScrollBehavior });
          lenisRef.current?.scrollTo(saved, { immediate: true, force: true });
        }
        restoreTimers.push(window.setTimeout(attempt, attempts < 8 ? 150 : 400));
      };
      restoreTimers.push(window.setTimeout(attempt, 60));
      restoreTimers.push(window.setTimeout(attempt, 300));
      restoreTimers.push(window.setTimeout(attempt, 800));
      restoreTimers.push(window.setTimeout(attempt, 1600));
      restoreTimers.push(window.setTimeout(attempt, 2600));
      restoreTimers.push(window.setTimeout(attempt, 4000));
    };

    const onPopState = () => {
      notePopNavigation();
      scheduleHistoryRestore();
    };
    window.addEventListener("popstate", onPopState);
    // On reload the browser restores scroll immediately but clamps it if
    // the document is still short; retry once the page has grown.
    scheduleHistoryRestore();

    // Remember each history entry's scroll position so Back/Forward can
    // restore it even when the target page is still loading (the browser
    // clamps the restore to the short document and never retries).
    // Two values are kept per entry:
    //  - __uteroScrollY: live position, updated while scrolling.
    //  - __uteroScrollYStable: position committed after ~450ms of scroll
    //    idle (and on pointerdown, before any click navigation). Next.js
    //    animates scroll-to-top BEFORE pushState on link clicks, which
    //    would otherwise overwrite the departing entry's saved position
    //    with ~0; the stable value survives that.
    let lastSave = 0;
    let idleTimer: number | null = null;
    // Next.js animates scroll-to-top BEFORE pushState on link clicks.
    // Suppress stable commits during that window so the departing
    // entry keeps the position the user actually stopped at.
    const writeState = (patch: Record<string, number>) => {
      try {
        const state = history.state;
        history.replaceState({ ...(state && typeof state === "object" ? state : {}), ...patch }, "");
      } catch {}
    };
    const commitStable = () => {
      idleTimer = null;
      if (restorePending || Date.now() < suppressStableUntilRef.current) return;
      const y = Math.round(scrollY);
      const state = history.state as { __uteroScrollYStable?: number } | null;
      if (state?.__uteroScrollYStable !== y) {
        writeState({ __uteroScrollYStable: y });
      }
    };
    const saveScroll = () => {
      const now = Date.now();
      if (now - lastSave >= 120 && !restorePending) {
        lastSave = now;
        const y = Math.round(scrollY);
        const state = history.state as { __uteroScrollY?: number } | null;
        if (state?.__uteroScrollY !== y) writeState({ __uteroScrollY: y });
      }
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(commitStable, 450);
    };
    const flushStable = () => {
      commitStable();
    };
    const noteLinkClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("a")) suppressStableUntilRef.current = Date.now() + 2500;
    };
    window.addEventListener("scroll", saveScroll, { passive: true });
    window.addEventListener("pointerdown", flushStable, { capture: true, passive: true });
    window.addEventListener("click", noteLinkClick, { capture: true, passive: true });

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
      restoreCancelled = true;
      restoreTimers.forEach(clearTimeout);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", saveScroll);
      window.removeEventListener("pointerdown", flushStable, { capture: true });
      window.removeEventListener("click", noteLinkClick, { capture: true });
      if (idleTimer !== null) window.clearTimeout(idleTimer);
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
    // Cover the tail of Next's pre-push scroll animation plus any residual
    // scroll events after the new entry is pushed.
    suppressStableUntilRef.current = Date.now() + 1200;
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

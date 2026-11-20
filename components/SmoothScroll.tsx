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
    // Use manual scroll restoration to control when and how scroll is restored.
    // This prevents the browser from restoring stale scroll positions on reload
    // when the user hasn't meaningfully navigated to that page.
    history.scrollRestoration = "manual";

    const currentPathKey = () => (typeof window !== "undefined" ? window.location.pathname + window.location.search : "");

    const isReload = () => {
      try {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
        }
        return (performance as any).navigation?.type === 1;
      } catch {
        return false;
      }
    };

    // After a popstate the browser/Next restores scroll immediately, but a
    // still-loading page clamps it to the short document. Retry the saved
    // position until the page is tall enough, and never fight the user.
    const restoreTimers: number[] = [];
    let restoreCancelled = false;
    let restorePending = false;
    const scheduleHistoryRestore = () => {
      restoreCancelled = false;
      const state = history.state as { __uteroScrollPath?: string; __uteroScrollYStable?: number; __uteroScrollY?: number } | null;
      if (!state || state.__uteroScrollPath !== currentPathKey()) {
        restorePending = false;
        return;
      }
      const saved = state.__uteroScrollYStable ?? state.__uteroScrollY;
      if (typeof saved !== "number" || saved < 80) {
        restorePending = false;
        return;
      }
      restorePending = true;
      const cancel = () => {
        restoreCancelled = true;
        restorePending = false;
        restoreTimers.forEach(clearTimeout);
        restoreTimers.length = 0;
        window.removeEventListener("wheel", cancel, true);
        window.removeEventListener("touchstart", cancel, true);
        window.removeEventListener("pointerdown", cancel, true);
        window.removeEventListener("mousedown", cancel, true);
        window.removeEventListener("keydown", cancel, true);
      };
      window.addEventListener("wheel", cancel, { capture: true, passive: true });
      window.addEventListener("touchstart", cancel, { capture: true, passive: true });
      window.addEventListener("pointerdown", cancel, { capture: true, passive: true });
      window.addEventListener("mousedown", cancel, { capture: true, passive: true });
      window.addEventListener("keydown", cancel, { capture: true });
      let attempts = 0;
      const finish = () => {
        restoreCancelled = true;
        restorePending = false;
        restoreTimers.forEach(clearTimeout);
        restoreTimers.length = 0;
        window.removeEventListener("wheel", cancel, true);
        window.removeEventListener("touchstart", cancel, true);
        window.removeEventListener("pointerdown", cancel, true);
        window.removeEventListener("mousedown", cancel, true);
        window.removeEventListener("keydown", cancel, true);
      };
      const attempt = () => {
        if (restoreCancelled) return;
        if (++attempts > 8) { finish(); return; }
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        if (maxY >= saved - 40) {
          window.scrollTo({ top: saved, left: 0, behavior: "instant" as ScrollBehavior });
          lenisRef.current?.scrollTo(saved, { immediate: true, force: true });
          finish();
          return;
        }
        restoreTimers.push(window.setTimeout(attempt, 100));
      };
      restoreTimers.push(window.setTimeout(attempt, 50));
      restoreTimers.push(window.setTimeout(attempt, 200));
      restoreTimers.push(window.setTimeout(attempt, 500));
      restoreTimers.push(window.setTimeout(attempt, 1000));
    };

    const onPopState = () => {
      notePopNavigation();
      scheduleHistoryRestore();
    };
    window.addEventListener("popstate", onPopState);
    // On reload, only restore scroll if we have a meaningful saved position
    // for this specific path. This prevents restoring stale positions from
    // unrelated navigation history.
    if (isReload()) {
      const state = history.state as { __uteroScrollPath?: string; __uteroScrollYStable?: number; __uteroScrollY?: number } | null;
      if (state && state.__uteroScrollPath === currentPathKey()) {
        const saved = state.__uteroScrollYStable ?? state.__uteroScrollY;
        if (typeof saved === "number" && saved >= 80) {
          scheduleHistoryRestore();
        }
      }
    }

    // Remember each history entry's scroll position so Back/Forward can
    // restore it even when the target page is still loading.
    let lastSave = 0;
    let idleTimer: number | null = null;
    const writeState = (patch: Record<string, unknown>) => {
      try {
        const state = history.state;
        history.replaceState({
          ...(state && typeof state === "object" ? state : {}),
          __uteroScrollPath: currentPathKey(),
          ...patch
        }, "");
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
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
      allowNestedScroll: true,
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
  //  - popstate navigations (browser/Next restores the history entry's
  //    scroll position — Back/Forward must land where the user left off),
  //  - same-pathname updates (search-param filter changes don't touch
  //    scroll because usePathname doesn't change).
  useEffect(() => {
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

    // On first mount, check if browser restored a stale scroll position
    // that doesn't match our saved state. If so, reset to top.
    if (isFirstPath.current) {
      isFirstPath.current = false;
      const state = history.state as { __uteroScrollPath?: string; __uteroScrollYStable?: number; __uteroScrollY?: number } | null;
      const currentScrollY = window.scrollY;
      const savedY = state?.__uteroScrollYStable ?? state?.__uteroScrollY;
      const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
      // If browser restored a scroll position but we don't have a matching
      // saved position for this path, it's stale from a previous visit.
      if (currentScrollY > 50 && (!state || state.__uteroScrollPath !== currentPath || savedY === undefined)) {
        resetScroll();
        const t = setTimeout(resetScroll, 50);
        const t2 = setTimeout(resetScroll, 200);
        return () => {
          clearTimeout(t);
          clearTimeout(t2);
        };
      }
      return;
    }

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

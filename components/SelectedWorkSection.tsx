"use client";
// ─────────────────────────────────────────────────────────────────────────────
// SelectedWorkSection — Homepage "02 / PORTFOLIO" section
//
// ROTATION CONSTANTS (change here, nowhere else)
const ROTATE_INTERVAL_MS = 7000;
const CROSSFADE_MS       = 600;
const SLOT_COUNT         = 4;

// ─────────────────────────────────────────────────────────────────────────────

import Link        from "next/link";
import Image       from "next/image";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
}                  from "react";
import type { Project } from "@/lib/types";
import { getProjectCover, getProjectHover } from "@/lib/projectMedia";
import { disciplineLabels } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslations } from "@/lib/useTranslations";

// ── Pool helpers ──────────────────────────────────────────────────────────────
type PoolProject = Project;

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeBag(pool: PoolProject[]): PoolProject[] {
  return shuffle([...pool]);
}

function pickNext(
  bag: PoolProject[],
  displayed: PoolProject[],
  pool: PoolProject[]
): [PoolProject, PoolProject[]] {
  let currentBag = bag.length ? [...bag] : makeBag(pool);
  const displayedSlugs = new Set(displayed.map((p) => p.routeSlug));
  for (let i = 0; i < currentBag.length; i++) {
    if (!displayedSlugs.has(currentBag[i].routeSlug)) {
      const picked = currentBag[i];
      currentBag.splice(i, 1);
      return [picked, currentBag];
    }
  }
  currentBag = shuffle(
    [...pool].filter((p) => !displayedSlugs.has(p.routeSlug))
  );
  if (currentBag.length === 0) return [pool[0], []];
  const picked = currentBag.shift()!;
  return [picked, currentBag];
}

function preloadImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

function coverSrc(p: PoolProject): string {
  return getProjectCover(p);
}

// ── Card sub-components ───────────────────────────────────────────────────────
interface CardState {
  project: PoolProject;
  key: number;
}

interface WorkCardProps {
  slot: number;
  current: CardState;
  incoming: CardState | null;
  crossfadeMs: number;
  hoveredSlug: string | null;
  onMouseEnter: (slug: string) => void;
  onMouseLeave: () => void;
  onFocus: (slug: string) => void;
  onBlur: () => void;
}

function WorkCard({
  slot,
  current,
  incoming,
  crossfadeMs,
  hoveredSlug,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: WorkCardProps) {
  const t = useTranslations();
  const { project: cur } = current;
  const { project: inc } = incoming ?? { project: cur };
  const isSwapping = incoming !== null;
  const num = String(slot + 1).padStart(2, "0");

  const curCover = coverSrc(cur);
  const curHover = getProjectHover(cur);
  const incCover = coverSrc(inc);
  const incHover = getProjectHover(inc);

  const curDisciplines = cur.disciplines.map((d) => disciplineLabels[d]).join(" · ");
  const incDisciplines = inc.disciplines.map((d) => disciplineLabels[d]).join(" · ");

  const curScope =
    cur.details?.scope && cur.details.scope.length > 0
      ? cur.details.scope.slice(0, 2).join(" · ")
      : cur.category;
  const incScope =
    inc.details?.scope && inc.details.scope.length > 0
      ? inc.details.scope.slice(0, 2).join(" · ")
      : inc.category;

  const targetSlug = isSwapping ? inc.routeSlug : cur.routeSlug;

  return (
    <Link
      href={`/work/${targetSlug}`}
      className="pe-link"
      data-cursor="VIEW PROJECT →"
      onMouseEnter={() => onMouseEnter(targetSlug)}
      onMouseLeave={onMouseLeave}
      onFocus={() => onFocus(targetSlug)}
      onBlur={onBlur}
      aria-label={`${cur.title} — ${cur.client}`}
    >
      <article className="pe-card">
        {/* ── Image Container (Strict 4:3 Aspect Ratio with 12px frame) ── */}
        <div className="pe-image-wrap">
          {/* Bottom layer: current project (fades out on swap) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: isSwapping ? 0 : 1,
              transition: isSwapping ? `opacity ${crossfadeMs}ms ease` : "none",
              zIndex: 1,
            }}
          >
            {curCover && (
              <Image
                src={curCover}
                alt={`${cur.title} — ${cur.client}`}
                fill
                sizes="(max-width: 580px) 100vw, (max-width: 1080px) 50vw, 25vw"
                style={{
                  objectFit: "cover",
                  objectPosition: cur.gridCoverPosition || "center",
                }}
                className={curHover ? "pe-image pe-image--cover" : "pe-image pe-image--cover pe-image--only"}
              />
            )}
            {curHover && (
              <Image
                src={curHover}
                alt=""
                fill
                sizes="(max-width: 580px) 100vw, (max-width: 1080px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
                className="pe-image pe-image--hover"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Top layer: incoming project (fades in on swap) */}
          {isSwapping && (
            <div style={{ position: "absolute", inset: 0, opacity: 1, zIndex: 2 }}>
              {incCover && (
                <Image
                  src={incCover}
                  alt={`${inc.title} — ${inc.client}`}
                  fill
                  sizes="(max-width: 580px) 100vw, (max-width: 1080px) 50vw, 25vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: inc.gridCoverPosition || "center",
                  }}
                  className={incHover ? "pe-image pe-image--cover" : "pe-image pe-image--cover pe-image--only"}
                />
              )}
              {incHover && (
                <Image
                  src={incHover}
                  alt=""
                  fill
                  sizes="(max-width: 580px) 100vw, (max-width: 1080px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                  className="pe-image pe-image--hover"
                  aria-hidden="true"
                />
              )}
            </div>
          )}

          {/* Floating Index Badge */}
          <div className="pe-card__badge" aria-hidden="true">
            <span>{num}</span>
          </div>

          {/* Hover Overlay with red action button */}
          <div className="pe-overlay" aria-hidden="true">
            <div className="pe-overlay__inner">
              <span className="pe-overlay__scope">{isSwapping ? incScope : curScope}</span>
              <div className="pe-overlay__btn">
                <span>{t.work.viewProject}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Metadata Area ── */}
        <div style={{ position: "relative", height: "4.75rem" }}>
          {/* Current metadata (fades out on swap) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: isSwapping ? 0 : 1,
              transition: isSwapping ? `opacity ${crossfadeMs}ms ease` : "none",
            }}
          >
            <CardMeta project={cur} disciplinesStr={curDisciplines} />
          </div>

          {/* Incoming metadata (fades in on swap) */}
          {isSwapping && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 }}>
              <CardMeta project={inc} disciplinesStr={incDisciplines} />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function CardMeta({ project, disciplinesStr }: { project: PoolProject; disciplinesStr: string }) {
  return (
    <div className="pe-meta">
      <div className="pe-meta__top">
        <span className="pe-meta__discipline">{disciplinesStr}</span>
      </div>
      <h3 className="pe-title pe-meta__title">
        {project.title}
      </h3>
      <div className="pe-meta__bottom">
        <span className="pe-meta__client">{project.client}</span>
        {project.year && <span className="pe-meta__year">{project.year}</span>}
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function SelectedWorkSection({ sourceProjects }: { sourceProjects: Project[] }) {
  const t = useTranslations();
  const pool = useMemo(() => sourceProjects.filter((project) => project.homepageVisible !== false), [sourceProjects]);
  const serverDefault = useMemo(() => [...pool].sort((first, second) => (second.priority ?? 0) - (first.priority ?? 0)).slice(0, SLOT_COUNT), [pool]);

  // Server-renders SERVER_DEFAULT so crawlers always see real links.
  // Client randomises on mount to ensure per-reload variety.
  const [displayedProjects, setDisplayedProjects] = useState<PoolProject[]>(serverDefault);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);
  const [incomingBySlot, setIncomingBySlot] = useState<(CardState | null)[]>([null, null, null, null]);
  const [slotKeys, setSlotKeys] = useState<number[]>([0, 1, 2, 3]);

  const bagRef     = useRef<PoolProject[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const nextSlotRef = useRef(0);

  const [inViewport,    setInViewport]    = useState(false);
  const [tabVisible,    setTabVisible]    = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Randomise initial set on mount (client-only)
  useEffect(() => {
    setDisplayedProjects(shuffle([...pool]).slice(0, SLOT_COUNT));
    bagRef.current = makeBag(pool);
  }, [pool]);

  // IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tab visibility
  useEffect(() => {
    const handler = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Swap one slot
  const performSwap = useCallback(() => {
    if (pool.length === 0) return;
    const activeSlug = hoveredSlug || focusedSlug;
    setDisplayedProjects((prev) => {
      // Find a slot not under pointer/focus
      let slotToSwap = nextSlotRef.current;
      let attempts = 0;
      while (prev[slotToSwap]?.routeSlug === activeSlug && attempts < SLOT_COUNT) {
        slotToSwap = (slotToSwap + 1) % SLOT_COUNT;
        attempts++;
      }
      if (prev[slotToSwap]?.routeSlug === activeSlug) return prev; // all hovered — skip

      const [incoming, newBag] = pickNext(bagRef.current, prev, pool);
      bagRef.current = newBag;

      // Preload only the next image
      const src = coverSrc(incoming);
      if (src) preloadImage(src);

      const incomingCard: CardState = { project: incoming, key: Date.now() };
      setIncomingBySlot((ib) => {
        const next = [...ib];
        next[slotToSwap] = incomingCard;
        return next;
      });

      // Commit after crossfade completes
      setTimeout(() => {
        setDisplayedProjects((p) => {
          const updated = [...p];
          updated[slotToSwap] = incoming;
          return updated;
        });
        setSlotKeys((k) => {
          const updated = [...k];
          updated[slotToSwap] = updated[slotToSwap] + 4;
          return updated;
        });
        setIncomingBySlot((ib) => {
          const next = [...ib];
          next[slotToSwap] = null;
          return next;
        });
      }, CROSSFADE_MS);

      nextSlotRef.current = (slotToSwap + 1) % SLOT_COUNT;
      return prev;
    });
  }, [hoveredSlug, focusedSlug, pool]);

  // Rotation interval — pauses on all conditions
  useEffect(() => {
    if (reducedMotion) return;
    const shouldPause = !inViewport || !tabVisible || !!hoveredSlug || !!focusedSlug;
    if (shouldPause) return;
    const id = setInterval(performSwap, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion, inViewport, tabVisible, hoveredSlug, focusedSlug, performSwap]);

  // Year range from entire eligible pool (not just displayed cards)
  const yearRangeText = useMemo(() => {
    const validYears = pool.map((p) => parseInt(p.year, 10)).filter((y) => !isNaN(y));
    if (!validYears.length) return "";
    return `/ ${Math.min(...validYears)} — ${Math.max(...validYears)}`;
  }, [pool]);

  // Touch pause (3 s)
  const handleTouchStart = useCallback(() => {
    setHoveredSlug("__touch__");
    setTimeout(() => {
      setHoveredSlug((h) => (h === "__touch__" ? null : h));
    }, 3000);
  }, []);

  if (pool.length === 0) return null;

  return (
    <section
      id="works"
      ref={sectionRef}
      aria-live="off"
      style={{
        padding: "clamp(2.5rem, 4.5vh, 3.5rem) 0",
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
        position: "relative",
      }}
      onTouchStart={handleTouchStart}
    >
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           HOMEPAGE SELECTED WORKS — 4-Card Editorial Showcase
           Mirrors the /work archive frame, borders & hover motions
           ═══════════════════════════════════════════════════════════ */

        .pe-link {
          text-decoration: none;
          color: inherit;
          display: block;
          cursor: pointer;
        }
        .pe-link:active { opacity: 0.9; }

        .pe-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
        }

        /* ── Image container & frame (White background /work style) ── */
        .pe-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          margin-bottom: 0.65rem;
          border-radius: 12px;
          background-color: #f1efe9;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }

        .pe-link:hover .pe-image-wrap {
          box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.05);
        }

        /* ── Image transitions ────────────────────────────────────── */
        .pe-image {
          transition:
            opacity 0.35s ease,
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pe-image--cover {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        .pe-link:hover .pe-image--cover {
          opacity: 0;
          transform: scale(1.04);
        }

        .pe-link:hover .pe-image--cover.pe-image--only {
          opacity: 1;
          transform: scale(1.04);
        }

        .pe-image--hover {
          opacity: 0;
          transform: scale(1);
          z-index: 2;
        }

        .pe-link:hover .pe-image--hover {
          opacity: 1;
          transform: scale(1.04);
        }

        /* ── Floating Index Pill ──────────────────────────────────── */
        .pe-card__badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 4;
          padding: 3px 7px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #111111;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          pointer-events: none;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        .pe-link:hover .pe-card__badge {
          background: #e31e24;
          color: #ffffff;
        }

        /* ── Hover Overlay with red action button ─────────────────── */
        .pe-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: flex-end;
          pointer-events: none;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.62) 0%,
            rgba(0, 0, 0, 0.18) 45%,
            transparent 75%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .pe-link:hover .pe-overlay {
          opacity: 1;
        }

        .pe-overlay__inner {
          width: 100%;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transform: translateY(6px);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pe-link:hover .pe-overlay__inner {
          transform: translateY(0);
        }

        .pe-overlay__scope {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.3;
        }

        .pe-overlay__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #e31e24;
          color: #ffffff;
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1;
          box-shadow: 0 4px 14px rgba(227, 30, 36, 0.45);
          transform: translateY(4px);
          transition: transform 0.25s ease;
          align-self: flex-start;
        }

        .pe-link:hover .pe-overlay__btn {
          transform: translateY(0);
        }

        /* ── Metadata Area ────────────────────────────────────────── */
        .pe-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0 0.15rem;
        }

        .pe-meta__top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          height: 1rem;
          overflow: hidden;
        }

        .pe-meta__discipline {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .pe-meta__title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.85rem, 0.95vw, 1.05rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.25;
          margin: 0;
          height: 2.5em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .pe-link:hover .pe-meta__title {
          color: #e31e24 !important;
        }

        .pe-meta__bottom {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
          height: 1.15rem;
          overflow: hidden;
        }

        .pe-meta__client {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.68rem;
          font-weight: 500;
          color: rgba(10, 10, 10, 0.45);
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .pe-meta__year {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 700;
          color: rgba(10, 10, 10, 0.32);
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        /* ── Grid Layout & Siblings Dimming ───────────────────────── */
        .sw-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1rem, 1.6vw, 1.5rem);
        }

        .sw-grid:hover .pe-col-item {
          opacity: 0.72;
        }

        .sw-grid:hover .pe-col-item:hover {
          opacity: 1;
          transition: opacity 0.15s ease;
        }

        .pe-col-item {
          transition: opacity 0.3s ease;
          min-width: 0;
        }

        @media (max-width: 1080px) {
          .sw-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }

        @media (max-width: 580px) {
          .sw-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
      <div
        style={{
          width: "90%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: 0,
        }}
      >
        {/* ── Section Header ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
            marginBottom: "clamp(1rem, 1.8vh, 1.4rem)",
            borderBottom: "1px solid rgba(10, 10, 10, 0.08)",
            paddingBottom: "0.75rem",
          }}
        >
          <div>
            <RevealOnScroll>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.6rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#c91a1f",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                  }}
                >
                  {t.home.recentWorksLabel || "03 / PORTFOLIO"}
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1}>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {t.home.worksHeading}
              </h2>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={2}>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                  color: "rgba(10, 10, 10, 0.45)",
                }}
              >
                {yearRangeText}
              </span>
              <Link
                href="/work"
                data-cursor="OPEN"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  textDecoration: "none",
                  borderBottom: "1px solid #c91a1f",
                  paddingBottom: "2px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c91a1f"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#0a0a0a"; }}
              >
                <span>{t.home.recentWorksCta ? t.home.recentWorksCta.toUpperCase() : "SEE ALL WORKS"}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        {/* ── 4-Column Card Grid ── */}
        <div className="sw-grid">
          {displayedProjects.map((project, idx) => (
            <div key={slotKeys[idx]} className="pe-col-item">
              <RevealOnScroll delay={idx + 1}>
                <WorkCard
                  slot={idx}
                  current={{ project, key: slotKeys[idx] }}
                  incoming={incomingBySlot[idx]}
                  crossfadeMs={CROSSFADE_MS}
                  hoveredSlug={hoveredSlug}
                  onMouseEnter={setHoveredSlug}
                  onMouseLeave={() => setHoveredSlug(null)}
                  onFocus={setFocusedSlug}
                  onBlur={() => setFocusedSlug(null)}
                />
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
// ─────────────────────────────────────────────────────────────────────────────
// SelectedWorkSection — Homepage "02 / PORTFOLIO" section
//
// ROTATION CONSTANTS (change here, nowhere else)
const ROTATE_INTERVAL_MS = 7000;
const CROSSFADE_MS       = 600;
const SLOT_COUNT         = 4;

// EXCLUDED SLUGS — routeSlug values that must never appear on the homepage grid
export const HOMEPAGE_EXCLUDED_SLUGS: readonly string[] = [
  "wajan-giok",
  "baiturrohman",
  "wismari-sign-system",
];
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
import { projects } from "@/lib/projects";
import { getProjectCover } from "@/lib/projectMedia";
import { disciplineLabels } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslations } from "@/lib/useTranslations";

// ── Pool helpers ──────────────────────────────────────────────────────────────
type PoolProject = (typeof projects)[number];

const POOL: PoolProject[] = projects.filter(
  (p) => !HOMEPAGE_EXCLUDED_SLUGS.includes(p.routeSlug)
);

const SERVER_DEFAULT: PoolProject[] = [...POOL]
  .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
  .slice(0, SLOT_COUNT);

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeBag(): PoolProject[] {
  return shuffle([...POOL]);
}

function pickNext(
  bag: PoolProject[],
  displayed: PoolProject[]
): [PoolProject, PoolProject[]] {
  let currentBag = bag.length ? [...bag] : makeBag();
  const displayedSlugs = new Set(displayed.map((p) => p.routeSlug));
  for (let i = 0; i < currentBag.length; i++) {
    if (!displayedSlugs.has(currentBag[i].routeSlug)) {
      const picked = currentBag[i];
      currentBag.splice(i, 1);
      return [picked, currentBag];
    }
  }
  currentBag = shuffle(
    [...POOL].filter((p) => !displayedSlugs.has(p.routeSlug))
  );
  if (currentBag.length === 0) return [POOL[0], []];
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
  current,
  incoming,
  crossfadeMs,
  hoveredSlug,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: WorkCardProps) {
  const { project: cur } = current;
  const { project: inc } = incoming ?? { project: cur };
  const isSwapping = incoming !== null;
  const isHovered = hoveredSlug === cur.routeSlug;
  const disciplinesStr = cur.disciplines.map((d) => disciplineLabels[d]).join(" · ");
  const incDisciplinesStr = inc.disciplines.map((d) => disciplineLabels[d]).join(" · ");

  return (
    <Link
      href={`/work/${isSwapping ? inc.routeSlug : cur.routeSlug}`}
      data-cursor="VIEW PROJECT →"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => onMouseEnter(isSwapping ? inc.routeSlug : cur.routeSlug)}
      onMouseLeave={onMouseLeave}
      onFocus={() => onFocus(isSwapping ? inc.routeSlug : cur.routeSlug)}
      onBlur={onBlur}
    >
      <article>
        {/* Fixed 4:3 image box with dual-layer crossfade */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            backgroundColor: "#161616",
            overflow: "hidden",
            marginBottom: "0.5rem",
          }}
        >
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
            {coverSrc(cur) && (
              <Image
                src={coverSrc(cur)}
                alt={cur.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  objectPosition: cur.gridCoverPosition || "center",
                  transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease",
                  transform: isHovered ? "scale(1.03)" : "scale(1)",
                  filter: isHovered ? "brightness(1.05)" : "brightness(0.9)",
                }}
              />
            )}
          </div>
          {/* Top layer: incoming project (fades in) */}
          {isSwapping && (
            <div style={{ position: "absolute", inset: 0, opacity: 1, zIndex: 2 }}>
              {coverSrc(inc) && (
                <Image
                  src={coverSrc(inc)}
                  alt={inc.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: inc.gridCoverPosition || "center",
                    filter: "brightness(0.9)",
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Fixed-height text block — prevents CLS when cards swap */}
        <div style={{ position: "relative", height: "5rem" }}>
          {/* Current text (fades out) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: isSwapping ? 0 : 1,
              transition: isSwapping ? `opacity ${crossfadeMs}ms ease` : "none",
            }}
          >
            <CardMeta project={cur} disciplinesStr={disciplinesStr} isHovered={isHovered && !isSwapping} />
          </div>
          {/* Incoming text (fades in simultaneously) */}
          {isSwapping && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 }}>
              <CardMeta project={inc} disciplinesStr={incDisciplinesStr} isHovered={false} />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

interface CardMetaProps {
  project: PoolProject;
  disciplinesStr: string;
  isHovered: boolean;
}

function CardMeta({ project, disciplinesStr, isHovered }: CardMetaProps) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.2rem",
          gap: "0.5rem",
        }}
      >
        {/* Year — omitted (no text) when blank */}
        <span
          style={{
            fontSize: "0.65rem",
            color: "#c91a1f",
            fontWeight: 500,
            letterSpacing: "0.06em",
            flexShrink: 0,
          }}
        >
          {project.year ? `/ ${project.year}` : ""}
        </span>
        {/* Discipline tags — single line, overflow ellipsis */}
        <span
          style={{
            fontSize: "0.6rem",
            color: "rgba(255, 255, 255, 0.4)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
            letterSpacing: "0.04em",
          }}
        >
          {disciplinesStr}
        </span>
      </div>
      {/* Title — clamped to 1 line */}
      <h3
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: "clamp(0.85rem, 1.2vw, 1.2rem)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
          margin: "0 0 0.2rem",
          color: isHovered ? "#c91a1f" : "#ffffff",
          transition: "color 0.2s ease, transform 0.2s ease",
          transform: isHovered ? "translateX(2px)" : "translateX(0)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
      >
        {project.title}
      </h3>
      {/* Excerpt — clamped to 2 lines */}
      <p
        style={{
          fontSize: "0.7rem",
          lineHeight: 1.4,
          color: "rgba(255, 255, 255, 0.65)",
          margin: 0,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {project.excerpt || project.shortDescription}
      </p>
    </>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function SelectedWorkSection() {
  const t = useTranslations();

  // Server-renders SERVER_DEFAULT so crawlers always see real links.
  // Client randomises on mount to ensure per-reload variety.
  const [displayedProjects, setDisplayedProjects] = useState<PoolProject[]>(SERVER_DEFAULT);
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
    setDisplayedProjects(shuffle([...POOL]).slice(0, SLOT_COUNT));
    bagRef.current = makeBag();
  }, []);

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

      const [incoming, newBag] = pickNext(bagRef.current, prev);
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
  }, [hoveredSlug, focusedSlug]);

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
    const validYears = POOL.map((p) => parseInt(p.year, 10)).filter((y) => !isNaN(y));
    if (!validYears.length) return "";
    return `/ ${Math.min(...validYears)} — ${Math.max(...validYears)}`;
  }, []);

  // Touch pause (3 s)
  const handleTouchStart = useCallback(() => {
    setHoveredSlug("__touch__");
    setTimeout(() => {
      setHoveredSlug((h) => (h === "__touch__" ? null : h));
    }, 3000);
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      aria-live="off"
      style={{
        padding: "clamp(2rem, 4vw, 3rem) 0",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
        position: "relative",
      }}
      onTouchStart={handleTouchStart}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 2vw, 2rem)",
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
            marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: "1rem",
          }}
        >
          <div>
            <RevealOnScroll>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
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
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                  }}
                >
                  02 / PORTFOLIO
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1}>
              <h2
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(1.2rem, 2vw, 2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#ffffff",
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
                  color: "rgba(255, 255, 255, 0.5)",
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
                  color: "#ffffff",
                  textDecoration: "none",
                  borderBottom: "1px solid #c91a1f",
                  paddingBottom: "2px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c91a1f"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#ffffff"; }}
              >
                <span>SEE ALL WORKS</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        {/* ── 2×2 Card Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {displayedProjects.map((project, idx) => (
            <RevealOnScroll key={slotKeys[idx]} delay={idx + 1}>
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
          ))}
        </div>
      </div>
    </section>
  );
}

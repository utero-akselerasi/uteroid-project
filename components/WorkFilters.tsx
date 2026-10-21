"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  workFilterLabels,
  type WorkFilter,
  industryLabels,
  type Industry,
} from "@/lib/types";
import {
  useTranslations,
  type Translations,
  type IndustryTranslationKey,
} from "@/lib/useTranslations";

type IndustryType = Industry | "";

const PRIMARY_FILTERS: WorkFilter[] = [
  "all",
  "brand",
  "product",
  "promotion",
  "space",
  "digital",
  "indoor",
  "outdoor",
];

function isValidWorkFilter(value: string): value is WorkFilter {
  return value in workFilterLabels;
}

function isValidIndustry(value: string): value is IndustryTranslationKey {
  return value in industryLabels;
}

/** Derive a short label for the "currently active" state shown in the bar */
function getActiveLabel(
  activeFilter: WorkFilter,
  activeIndustry: IndustryType,
  totalFiltered: number,
  t: Translations
): string {
  const parts: string[] = [];
  if (activeFilter !== "all") parts.push(workFilterLabels[activeFilter].toUpperCase());
  if (activeIndustry && activeIndustry in t.industries) {
    parts.push(t.industries[activeIndustry as IndustryTranslationKey].toUpperCase());
  }
  const label = parts.length > 0 ? parts.join(" · ") : t.work.allWork;
  return `${label} · ${totalFiltered} ${totalFiltered === 1 ? t.work.project : t.work.projects}`;
}

interface WorkFiltersProps {
  filteredCount: number;
  counts: Record<string, number>;
}

export default function WorkFilters({ filteredCount, counts }: WorkFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const filterParam = searchParams.get("filter") || "all";
  const activeFilter: WorkFilter = isValidWorkFilter(filterParam)
    ? filterParam
    : "all";

  const industryParam = searchParams.get("industry") || "";
  const activeIndustry: IndustryType = isValidIndustry(industryParam)
    ? (industryParam as Industry)
    : "";

  const hasActiveFilters = activeFilter !== "all" || activeIndustry !== "";

  const createQuery = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (val) params.set(key, val);
        else params.delete(key);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (filter: WorkFilter) => {
    const qs = createQuery({ filter: filter === "all" ? "" : filter });
    router.push(`/work?${qs}`, { scroll: false });
  };

  const setIndustry = (industry: IndustryType) => {
    const qs = createQuery({ industry: industry || "" });
    router.push(`/work?${qs}`, { scroll: false });
  };

  const clearAll = () => {
    router.push("/work", { scroll: false });
    setOpen(false);
  };

  const activeLabel = getActiveLabel(activeFilter, activeIndustry, filteredCount, t);

  return (
    <>
      <style>{`
        .wf-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          transition: color 0.2s ease;
        }
        .wf-toggle:hover { color: #c91a1f; }
        .wf-toggle-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border: 1px solid #0a0a0a;
          font-size: 0.65rem;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .wf-toggle:hover .wf-toggle-icon,
        .wf-toggle.open .wf-toggle-icon {
          border-color: #c91a1f;
          background: #c91a1f;
          color: #fff;
        }
        .wf-status {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(10,10,10,0.42);
        }
        .wf-status-active {
          color: #c91a1f;
        }
        .wf-drawer {
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          max-height: 0;
          opacity: 0;
        }
        .wf-drawer.open {
          /* Cap on the viewport, not a fixed px value: the 18 discipline +
             industry chips overflow short phone screens, so let it scroll. */
          max-height: min(1200px, 78vh);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          opacity: 1;
        }
        .wf-drawer-inner {
          padding: 1.75rem 0 2rem;
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .wf-section-label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(10,10,10,0.35);
          margin-bottom: 0.75rem;
        }
        .wf-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }
        .wf-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.75rem;
          border: 1px solid rgba(0,0,0,0.12);
          background: transparent;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0a0a0a;
          cursor: pointer;
          transition: border-color 0.18s ease, color 0.18s ease;
          white-space: nowrap;
        }
        .wf-chip:hover {
          border-color: #c91a1f;
          color: #c91a1f;
        }
        .wf-chip.active {
          border-color: #c91a1f;
          color: #c91a1f;
          border-bottom-width: 2px;
        }
        .wf-chip-count {
          font-size: 0.6rem;
          opacity: 0.5;
          letter-spacing: 0;
        }
        .wf-clear {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c91a1f;
          border-bottom: 1px solid rgba(201,26,31,0.4);
          padding-bottom: 1px;
          transition: opacity 0.2s;
        }
        .wf-clear:hover { opacity: 0.7; }
      `}</style>

      {/* ── Control Bar ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: open ? "0" : "clamp(3rem, 5vw, 5rem)",
          paddingBottom: open ? "1rem" : "0",
          borderBottom: open ? "none" : "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <button
          className={`wf-toggle${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="wf-drawer"
          aria-label={open ? t.work.closeFilter : t.work.openFilter}
        >
          <span className="wf-toggle-icon">{open ? "×" : "+"}</span>
          <span>{t.work.filter}</span>
        </button>

        <span className={`wf-status${hasActiveFilters ? " wf-status-active" : ""}`}>
          {activeLabel}
        </span>
      </div>

      {/* ── Drawer ───────────────────────────────────────────────────── */}
      <div
        id="wf-drawer"
        className={`wf-drawer${open ? " open" : ""}`}
        role="region"
        aria-label={t.work.filterAria}
        style={{ marginBottom: open ? "clamp(3rem, 5vw, 5rem)" : "0" }}
      >
        <div className="wf-drawer-inner">

          {/* Discipline */}
          <div className="wf-section-label">{t.work.byDiscipline}</div>
          <div className="wf-chips">
            {PRIMARY_FILTERS.map((f) => {
              const isActive = f === activeFilter;
              const count = counts[f] ?? 0;
              return (
                <button
                  key={f}
                  className={`wf-chip${isActive ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  <span>{workFilterLabels[f]}</span>
                  {f !== "all" && count > 0 && (
                    <span className="wf-chip-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Industry */}
          <div className="wf-section-label">{t.work.byIndustry}</div>
          <div className="wf-chips">
            <button
              className={`wf-chip${!activeIndustry ? " active" : ""}`}
              onClick={() => setIndustry("")}
            >
              {t.work.allIndustries}
            </button>
            {Object.entries(t.industries).map(([key, label]) => (
              <button
                key={key}
                className={`wf-chip${activeIndustry === key ? " active" : ""}`}
                onClick={() => setIndustry(activeIndustry === key ? "" : (key as IndustryType))}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button className="wf-clear" onClick={clearAll}>
              {t.work.clearAll}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

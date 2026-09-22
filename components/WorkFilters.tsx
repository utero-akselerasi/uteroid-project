"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  workFilterLabels,
  type WorkFilter,
  industryLabels,
  type Industry,
} from "@/lib/types";
import { getFilterCounts } from "@/lib/projects";

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

const INDUSTRY_FILTERS: Array<{ key: Industry; label: string }> = [
  { key: "corporate", label: "Corporate" },
  { key: "fnb", label: "F&B" },
  { key: "government", label: "Government" },
  { key: "education", label: "Education" },
  { key: "arts", label: "Arts & Culture" },
  { key: "services", label: "Services" },
  { key: "retail", label: "Retail" },
  { key: "property", label: "Property" },
  { key: "event", label: "Event" },
];

// Derive a short label for the "currently active" state shown in the bar
function getActiveLabel(
  activeFilter: WorkFilter,
  activeIndustry: string,
  totalFiltered: number,
  totalAll: number
): string {
  const parts: string[] = [];
  if (activeFilter !== "all") parts.push(workFilterLabels[activeFilter].toUpperCase());
  if (activeIndustry) {
    const ind = INDUSTRY_FILTERS.find((f) => f.key === activeIndustry);
    if (ind) parts.push(ind.label.toUpperCase());
  }
  const label = parts.length > 0 ? parts.join(" · ") : "ALL WORK";
  return `${label} · ${totalFiltered} ${totalFiltered === 1 ? "PROJECT" : "PROJECTS"}`;
}

export default function WorkFilters({ filteredCount }: { filteredCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeFilter = (searchParams.get("filter") || "all") as WorkFilter;
  const activeIndustry = searchParams.get("industry") || "";
  const counts = getFilterCounts();
  const totalAll = counts.all;

  const hasActiveFilters = activeFilter !== "all" || activeIndustry;

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

  const setIndustry = (industry: Industry | "") => {
    const qs = createQuery({ industry });
    router.push(`/work?${qs}`, { scroll: false });
  };

  const clearAll = () => {
    router.push("/work", { scroll: false });
    setOpen(false);
  };

  const activeLabel = getActiveLabel(activeFilter, activeIndustry, filteredCount, totalAll);

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
          max-height: 600px;
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
        >
          <span className="wf-toggle-icon">{open ? "×" : "+"}</span>
          <span>Filter</span>
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
        aria-label="Work filters"
        style={{ marginBottom: open ? "clamp(3rem, 5vw, 5rem)" : "0" }}
      >
        <div className="wf-drawer-inner">

          {/* Discipline */}
          <div className="wf-section-label">By Discipline</div>
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
          <div className="wf-section-label">By Industry</div>
          <div className="wf-chips">
            <button
              className={`wf-chip${!activeIndustry ? " active" : ""}`}
              onClick={() => setIndustry("")}
            >
              All Industries
            </button>
            {INDUSTRY_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                className={`wf-chip${activeIndustry === key ? " active" : ""}`}
                onClick={() => setIndustry(activeIndustry === key ? "" : key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button className="wf-clear" onClick={clearAll}>
              Clear All ×
            </button>
          )}
        </div>
      </div>
    </>
  );
}

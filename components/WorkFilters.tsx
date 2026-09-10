"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { workFilterLabels, type WorkFilter, industryLabels, type Industry } from "@/lib/types";
import { getFilterCounts } from "@/lib/projects";

const PRIMARY_FILTERS: WorkFilter[] = [
  "all", "brand", "product", "promotion", "space", "digital", "indoor", "outdoor",
];

const INDUSTRY_FILTERS: Array<{ key: Industry; label: string }> = [
  { key: "corporate",  label: "Corporate" },
  { key: "fnb",        label: "F&B" },
  { key: "government", label: "Government" },
  { key: "education",  label: "Education" },
  { key: "arts",       label: "Arts & Culture" },
  { key: "services",   label: "Services" },
  { key: "retail",     label: "Retail" },
  { key: "property",   label: "Property" },
  { key: "event",      label: "Event" },
];

export default function WorkFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilter   = (searchParams.get("filter")   || "all") as WorkFilter;
  const activeIndustry = searchParams.get("industry") || "";

  const counts = getFilterCounts();

  const createQuery = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (filter: WorkFilter) => {
    const qs = createQuery({ filter: filter === "all" ? "" : filter });
    router.push(`/work?${qs}`);
  };

  const setIndustry = (industry: Industry | "") => {
    const qs = createQuery({ industry });
    router.push(`/work?${qs}`);
  };

  const hasActiveFilters = activeFilter !== "all" || activeIndustry;

  return (
    <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
      {/* ── Primary discipline filters ────────────────────────────── */}
      <div
        style={{
          marginBottom: "clamp(1rem, 2vw, 1.5rem)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            paddingBottom: "4px",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {PRIMARY_FILTERS.map((filter) => {
            const isActive = filter === activeFilter || (filter === "all" && activeFilter === "all");
            const count = counts[filter] ?? 0;
            return (
              <button
                key={filter}
                onClick={() => setFilter(filter)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 1.1rem",
                  border: isActive ? "1px solid #c91a1f" : "1px solid rgba(0, 0, 0, 0.12)",
                  backgroundColor: isActive ? "#c91a1f" : "transparent",
                  color: isActive ? "#ffffff" : "#0a0a0a",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#c91a1f";
                    e.currentTarget.style.color = "#c91a1f";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.12)";
                    e.currentTarget.style.color = "#0a0a0a";
                  }
                }}
              >
                <span>{workFilterLabels[filter]}</span>
                {filter !== "all" && count > 0 && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      opacity: isActive ? 0.9 : 0.45,
                      letterSpacing: "0",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Industry filters ─────────────────────────────────────────── */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            paddingBottom: "4px",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(10, 10, 10, 0.4)",
              paddingRight: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            Industry
          </span>
          <button
            onClick={() => setIndustry("")}
            style={{
              padding: "0.35rem 0.75rem",
              border: !activeIndustry ? "1px solid #0a0a0a" : "1px solid rgba(0, 0, 0, 0.1)",
              backgroundColor: !activeIndustry ? "#0a0a0a" : "transparent",
              color: !activeIndustry ? "#ffffff" : "rgba(10, 10, 10, 0.5)",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeIndustry) {
                e.currentTarget.style.color = "#0a0a0a";
                e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeIndustry) {
                e.currentTarget.style.color = "rgba(10, 10, 10, 0.5)";
                e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            All
          </button>
          {INDUSTRY_FILTERS.map(({ key, label }) => {
            const isActive = activeIndustry === key;
            return (
              <button
                key={key}
                onClick={() => setIndustry(isActive ? "" : key)}
                style={{
                  padding: "0.35rem 0.75rem",
                  border: isActive ? "1px solid #c91a1f" : "1px solid rgba(0, 0, 0, 0.1)",
                  backgroundColor: isActive ? "rgba(201, 26, 31, 0.08)" : "transparent",
                  color: isActive ? "#c91a1f" : "rgba(10, 10, 10, 0.5)",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#0a0a0a";
                    e.currentTarget.style.borderColor = "#c91a1f";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(10, 10, 10, 0.5)";
                    e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
                  }
                }}
              >
                {label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={() => {
                router.push("/work");
              }}
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#c91a1f",
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(201, 26, 31, 0.4)",
                paddingBottom: "1px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s ease",
              }}
            >
              Clear ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

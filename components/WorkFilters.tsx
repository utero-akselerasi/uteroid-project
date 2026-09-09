"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  disciplineLabels,
  industryLabels,
  type Discipline,
  type Industry,
} from "@/lib/types";

export default function WorkFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeDiscipline = searchParams.get("discipline") || "";
  const activeIndustry = searchParams.get("industry") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleDisciplineChange = (discipline: Discipline | "") => {
    router.push(`/work?${createQueryString("discipline", discipline)}`);
  };

  const handleIndustryChange = (industry: Industry | "") => {
    router.push(`/work?${createQueryString("industry", industry)}`);
  };

  const hasFilters = activeDiscipline || activeIndustry;

  return (
    <div className="mb-[var(--space-2xl)] md:mb-[var(--space-3xl)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-xl)]">
        {/* Discipline Filter */}
        <div>
          <span className="type-micro text-[var(--color-gray-400)] block mb-4">
            Discipline
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDisciplineChange("")}
              className={`text-[var(--text-small)] px-4 py-2 border transition-all duration-[var(--duration-fast)] ${
                !activeDiscipline
                  ? "border-[var(--color-black)] bg-[var(--color-black)] text-[var(--color-white)]"
                  : "border-[var(--color-gray-300)] hover:border-[var(--color-black)]"
              }`}
            >
              All
            </button>
            {(Object.entries(disciplineLabels) as [Discipline, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleDisciplineChange(key)}
                  className={`text-[var(--text-small)] px-4 py-2 border transition-all duration-[var(--duration-fast)] ${
                    activeDiscipline === key
                      ? "border-[var(--color-red)] bg-[var(--color-red)] text-[var(--color-white-pure)]"
                      : "border-[var(--color-gray-300)] hover:border-[var(--color-black)]"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Industry Filter */}
        <div>
          <span className="type-micro text-[var(--color-gray-400)] block mb-4">
            Industry
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleIndustryChange("")}
              className={`text-[var(--text-small)] px-4 py-2 border transition-all duration-[var(--duration-fast)] ${
                !activeIndustry
                  ? "border-[var(--color-black)] bg-[var(--color-black)] text-[var(--color-white)]"
                  : "border-[var(--color-gray-300)] hover:border-[var(--color-black)]"
              }`}
            >
              All
            </button>
            {(Object.entries(industryLabels) as [Industry, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleIndustryChange(key)}
                  className={`text-[var(--text-small)] px-4 py-2 border transition-all duration-[var(--duration-fast)] ${
                    activeIndustry === key
                      ? "border-[var(--color-red)] bg-[var(--color-red)] text-[var(--color-white-pure)]"
                      : "border-[var(--color-gray-300)] hover:border-[var(--color-black)]"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      {hasFilters && (
        <div className="mt-[var(--space-lg)]">
          <a
            href="/work"
            className="text-[var(--text-small)] uppercase tracking-[var(--tracking-wide)] text-[var(--color-red)] hover:text-[var(--color-red-dark)] transition-colors duration-[var(--duration-fast)]"
          >
            Clear Filters &rarr;
          </a>
        </div>
      )}
    </div>
  );
}

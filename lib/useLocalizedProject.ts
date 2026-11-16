"use client";

import { useMemo } from "react";
import { useLanguage } from "./LanguageContext";
import type { Project } from "./types";

// Project fields that may be localized via content overrides
// (scope "projects", key "<routeSlug>.<field>", locale "en"/"id").
// Anything not overridden falls back to the original project content.
const LOCALIZABLE_FIELDS = [
  "shortDescription",
  "description",
  "excerpt",
  "category",
] as const;

type LocalizableField = (typeof LOCALIZABLE_FIELDS)[number];

export function useLocalizedProject(project: Project): Project {
  const { language, contentOverrides } = useLanguage();

  return useMemo(() => {
    const overrides = new Map<string, string>();
    for (const o of contentOverrides) {
      if (o.scope !== "projects") continue;
      if (o.locale && o.locale !== language) continue;
      if (typeof o.value === "string" && o.value.trim()) {
        overrides.set(o.key, o.value);
      }
    }
    if (!overrides.size) return project;

    const localized = { ...project };
    for (const field of LOCALIZABLE_FIELDS) {
      const value = overrides.get(`${project.routeSlug}.${field}`);
      if (value !== undefined) {
        (localized as Record<LocalizableField, unknown>)[field] = value;
      }
    }
    return localized;
  }, [project, language, contentOverrides]);
}

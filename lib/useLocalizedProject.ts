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

// Project fields with built-in English translations in projects.json
const BUILTIN_EN_FIELDS = [
  "shortDescriptionEn",
  "categoryEn",
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

    const localized = { ...project };

    // First, apply content overrides (highest priority)
    for (const field of LOCALIZABLE_FIELDS) {
      const value = overrides.get(`${project.routeSlug}.${field}`);
      if (value !== undefined) {
        (localized as Record<LocalizableField, unknown>)[field] = value;
      }
    }

    // If English and no override, use built-in English fields
    if (language === "en") {
      if (!overrides.has(`${project.routeSlug}.shortDescription`) && (project as any).shortDescriptionEn) {
        localized.shortDescription = (project as any).shortDescriptionEn;
      }
      if (!overrides.has(`${project.routeSlug}.category`) && (project as any).categoryEn) {
        localized.category = (project as any).categoryEn;
      }
    }

    return localized;
  }, [project, language, contentOverrides]);
}

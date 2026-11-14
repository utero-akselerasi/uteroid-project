"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ContentOverride } from "./contentOverrides";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  contentOverrides: ContentOverride[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "utero-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [contentOverrides, setContentOverrides] = useState<ContentOverride[]>([]);

  // Load content overrides once (DB-driven EN/ID text wins over code defaults)
  useEffect(() => {
    let cancelled = false;
    fetch("/portfolio-api/content-overrides", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { overrides: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.overrides)) setContentOverrides(data.overrides);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") {
      setLanguageState(stored);
    }
  }, []);

  // Synchronize document.documentElement.lang
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "id" : "en";
    setLanguage(nextLang);
  };

  // Always provide the context to avoid hook errors
  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, contentOverrides }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

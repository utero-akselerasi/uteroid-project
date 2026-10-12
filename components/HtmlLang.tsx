"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useEffect } from "react";

export default function HtmlLang() {
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}

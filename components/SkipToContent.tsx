"use client";

import { useTranslations } from "@/lib/useTranslations";

export default function SkipToContent() {
  const t = useTranslations();

  return (
    <a href="#main-content" className="skip-to-content">
      {t.accessibility.skipToContent}
    </a>
  );
}

"use client";

import { useTranslations } from "@/lib/useTranslations";

export default function WorkPageSubtitle() {
  const t = useTranslations();

  return (
    <p
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: "clamp(0.875rem, 1.1vw, 1.05rem)",
        color: "rgba(10,10,10,0.45)",
        letterSpacing: "0.01em",
        lineHeight: 1.6,
        maxWidth: "460px",
        margin: "0 0 clamp(2.5rem, 4vw, 4rem) 0",
      }}
    >
      {t.work.subtitle}
    </p>
  );
}
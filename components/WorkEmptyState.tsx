"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/useTranslations";

export default function WorkEmptyState() {
  const t = useTranslations();

  return (
    <div
      style={{
        padding: "6rem 0",
        borderTop: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: "clamp(1rem, 2vw, 1.4rem)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          color: "#0a0a0a",
          marginBottom: "1.5rem",
        }}
      >
        {t.work.noProjects}
      </p>
      <Link
        href="/work"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#c91a1f",
          textDecoration: "none",
          borderBottom: "1px solid rgba(201,26,31,0.4)",
          paddingBottom: "2px",
        }}
      >
        {t.work.clearFilters}
      </Link>
    </div>
  );
}

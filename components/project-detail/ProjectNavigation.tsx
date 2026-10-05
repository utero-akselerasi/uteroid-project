"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { useTranslations } from "@/lib/useTranslations";

interface ProjectNavigationProps {
  prev: Pick<Project, "slug" | "title" | "year" | "coverImage"> | null;
  next: Pick<Project, "slug" | "title" | "year" | "coverImage"> | null;
}

export default function ProjectNavigation({ prev, next }: ProjectNavigationProps) {
  const t = useTranslations();
  return (
    <div className="pd-nav">
      {prev ? (
        <Link href={`/work/${prev.slug}`} className="pd-nav__link">
          <div className="pd-nav__link-thumb">
            <Image
              src={prev.coverImage}
              alt={prev.title}
              fill
              sizes="100px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="pd-nav__link-info">
            <span className="pd-nav__link-dir">{t.projectDetail.previous}</span>
            <span className="pd-nav__link-title">{prev.title}</span>
            <span className="pd-nav__link-year">{prev.year}</span>
          </div>
        </Link>
      ) : (
        <div className="pd-nav__spacer" />
      )}

      {next ? (
        <Link href={`/work/${next.slug}`} className="pd-nav__link pd-nav__link--next">
          <div className="pd-nav__link-thumb">
            <Image
              src={next.coverImage}
              alt={next.title}
              fill
              sizes="100px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="pd-nav__link-info">
            <span className="pd-nav__link-dir">{t.projectDetail.next}</span>
            <span className="pd-nav__link-title">{next.title}</span>
            <span className="pd-nav__link-year">{next.year}</span>
          </div>
        </Link>
      ) : (
        <div className="pd-nav__spacer" style={{ textAlign: "right" }} />
      )}
    </div>
  );
}

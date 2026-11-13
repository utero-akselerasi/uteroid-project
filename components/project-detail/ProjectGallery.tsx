"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

// ─────────────────────────────────────────────
// Scroll-reveal wrapper for individual gallery items
// ─────────────────────────────────────────────
function GalleryReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pd-gallery-reveal ${visible ? "pd-gallery-reveal--visible" : ""}`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Gallery Image
// ─────────────────────────────────────────────
function GalleryImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <div
      className="pd-gallery-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View ${alt} in fullscreen`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// ProjectGallery Component
// ─────────────────────────────────────────────
export default function ProjectGallery({
  images,
  projectTitle,
}: {
  images: string[];
  projectTitle?: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (!images || images.length === 0) return null;

  // Limit to maximum 4 images
  const displayImages = images.slice(0, 4);

  return (
    <>
      <div className="pd-gallery pd-section">
        {/* Section label */}
        <div className="pd-section__label">
          <span className="pd-section__label-line" />
          <span className="pd-section__label-text">Highlights</span>
        </div>

        {/* Gallery grid - 2x2 uniform grid */}
        <div className="pd-gallery__grid">
          {displayImages.map((src, index) => {
            const alt = projectTitle ? `${projectTitle} — visual highlight ${index + 1}` : `Project image ${index + 1}`;
            return (
              <GalleryReveal key={index}>
                <GalleryImage
                  src={src}
                  alt={alt}
                  onClick={() => openLightbox(index)}
                />
              </GalleryReveal>
            );
          })}
        </div>

        <p className="pd-gallery__note">
          A few highlights from the full presentation below.
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          projectTitle={projectTitle}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

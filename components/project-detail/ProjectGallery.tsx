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
  variant,
  sizes = "(max-width: 1400px) 100vw, 1400px",
  onClick,
}: {
  src: string;
  alt: string;
  variant: "full" | "half" | "inset";
  sizes?: string;
  onClick: () => void;
}) {
  const variantClass =
    variant === "full"
      ? "pd-gallery-item--full"
      : variant === "half"
        ? "pd-gallery-item--half"
        : "pd-gallery-item--inset";

  return (
    <div
      className={`pd-gallery-item ${variantClass}`}
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
        sizes={sizes}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Gallery Layout Algorithm
// ─────────────────────────────────────────────
// Cycle: full → pair → full → pair → inset → pair
// Position within cycle determines layout:
//   0: full-width
//   1-2: side-by-side pair
//   3: full-width
//   4-5: side-by-side pair
//   6: inset (narrower, centered)
//   7-8: side-by-side pair
//   Then repeat from 0.

type LayoutSlot =
  | { type: "full" }
  | { type: "inset" }
  | { type: "pair"; indices: [number, number] };

function buildLayout(count: number): LayoutSlot[] {
  const cycle = [
    "full", "pair-start", "pair-end",
    "full", "pair-start", "pair-end",
    "inset", "pair-start", "pair-end",
  ] as const;

  const slots: LayoutSlot[] = [];
  let i = 0;

  while (i < count) {
    const pos = i % cycle.length;
    const role = cycle[pos];

    if (role === "full" || role === "inset") {
      slots.push({ type: role === "inset" ? "inset" : "full" });
      i++;
    } else if (role === "pair-start") {
      // If there's a next image for the pair
      if (i + 1 < count) {
        const cycleNext = cycle[(i + 1) % cycle.length];
        if (cycleNext === "pair-end") {
          slots.push({ type: "pair", indices: [i, i + 1] });
          i += 2;
        } else {
          // Shouldn't happen with the cycle, but fallback to full
          slots.push({ type: "full" });
          i++;
        }
      } else {
        // Single remaining image — make it full
        slots.push({ type: "full" });
        i++;
      }
    } else {
      // pair-end without a pair-start (shouldn't happen normally)
      slots.push({ type: "full" });
      i++;
    }
  }

  return slots;
}

// ─────────────────────────────────────────────
// ProjectGallery Component
// ─────────────────────────────────────────────
export default function ProjectGallery({ images }: { images: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (!images || images.length === 0) return null;

  const layout = buildLayout(images.length);

  // Track which image index we're at for rendering
  let imageIdx = 0;

  const renderSlot = (slot: LayoutSlot, slotIndex: number) => {
    if (slot.type === "pair") {
      const idx1 = slot.indices[0];
      const idx2 = slot.indices[1];
      imageIdx = idx2 + 1;
      return (
        <GalleryReveal key={`slot-${slotIndex}`}>
          <div className="pd-gallery__row-pair">
            <GalleryImage
              src={images[idx1]}
              alt={`Project image ${idx1 + 1}`}
              variant="half"
              sizes="(max-width: 768px) 100vw, 50vw"
              onClick={() => openLightbox(idx1)}
            />
            <GalleryImage
              src={images[idx2]}
              alt={`Project image ${idx2 + 1}`}
              variant="half"
              sizes="(max-width: 768px) 100vw, 50vw"
              onClick={() => openLightbox(idx2)}
            />
          </div>
        </GalleryReveal>
      );
    }

    const idx = imageIdx;
    imageIdx++;
    return (
      <GalleryReveal key={`slot-${slotIndex}`}>
        <GalleryImage
          src={images[idx]}
          alt={`Project image ${idx + 1}`}
          variant={slot.type === "inset" ? "inset" : "full"}
          onClick={() => openLightbox(idx)}
        />
      </GalleryReveal>
    );
  };

  return (
    <>
      <div className="pd-gallery pd-section">
        {/* Section label */}
        <div className="pd-section__label">
          <span className="pd-section__label-line" />
          <span className="pd-section__label-text">Selected Work</span>
        </div>

        {/* Gallery grid */}
        <div className="pd-gallery__grid">
          {layout.map((slot, i) => renderSlot(slot, i))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface DeckManifest {
  slug: string;
  total_pages: number;
  deck_images: string[];
  aspect_ratios: number[];
  thumbnails: string[];
}

interface PDFDeckSliderProps {
  slug: string;
}

export default function PDFDeckSlider({ slug }: PDFDeckSliderProps) {
  const [manifest, setManifest] = useState<DeckManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([0, 1]));

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Load manifest safely
  useEffect(() => {
    let isMounted = true;

    async function loadManifest() {
      try {
        const response = await fetch(`/projects/${slug}/deck/manifest.json`);
        if (!response.ok) {
          throw new Error("Manifest not found");
        }
        const data: DeckManifest = await response.json();
        if (isMounted) {
          setManifest(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadManifest();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Keep loaded pages set updated: load current, previous 1, and next 2 pages
  useEffect(() => {
    if (!manifest) return;
    setLoadedPages((prev) => {
      const next = new Set(prev);
      const total = manifest.total_pages;
      const start = Math.max(0, currentPage - 1);
      const end = Math.min(total - 1, currentPage + 2);
      let changed = false;
      for (let i = start; i <= end; i++) {
        if (!next.has(i)) {
          next.add(i);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [currentPage, manifest]);

  // Lock body scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullscreen]);

  // Scroll to page
  const goToPage = useCallback(
    (pageIndex: number) => {
      if (!manifest || !scrollContainerRef.current) return;
      const clampedIndex = Math.max(0, Math.min(pageIndex, manifest.total_pages - 1));
      setCurrentPage(clampedIndex);

      const container = scrollContainerRef.current;
      const targetPage = container.children[clampedIndex] as HTMLElement | undefined;
      if (targetPage) {
        container.scrollTo({
          left: targetPage.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }

      // Also ensure active thumbnail is visible in thumbnail strip if open
      if (thumbnailStripRef.current) {
        const thumbEl = thumbnailStripRef.current.children[clampedIndex] as HTMLElement | undefined;
        if (thumbEl) {
          thumbnailStripRef.current.scrollTo({
            left: thumbEl.offsetLeft - thumbnailStripRef.current.offsetLeft - 40,
            behavior: "smooth",
          });
        }
      }
    },
    [manifest]
  );

  // Sync current page on scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !manifest) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < children.length; i++) {
      const distance = Math.abs(children[i].offsetLeft - container.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== currentPage) {
      setCurrentPage(closestIndex);
    }
  }, [manifest, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!manifest) return;

      // Don't intercept if user is typing in an input/textarea
      if (
        document.activeElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        goToPage(currentPage + 1);
      } else if (e.key === "ArrowLeft") {
        goToPage(currentPage - 1);
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === "f" || e.key === "F") {
        if (!e.metaKey && !e.ctrlKey) {
          setIsFullscreen((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [manifest, currentPage, isFullscreen, goToPage]);

  if (loading) {
    return (
      <div className="pd-deck-slider pd-section">
        <div className="pd-section__label">
          <span className="pd-section__label-line" />
          <span className="pd-section__label-text">Full Presentation</span>
        </div>
        <div className="pd-deck-slider__loading">Loading presentation deck...</div>
      </div>
    );
  }

  // Gracefully render nothing if no PDF presentation exists for this project
  if (!manifest || manifest.total_pages === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`pd-deck-slider pd-section ${isFullscreen ? "pd-deck-slider--fullscreen" : ""}`}
      data-lenis-prevent
      aria-label="Full Presentation Deck"
    >
      <div className="pd-deck-slider__header">
        <div className="pd-section__label">
          <span className="pd-section__label-line" />
          <span className="pd-section__label-text">Full Presentation</span>
        </div>

        <div className="pd-deck-slider__controls">
          <button
            className="pd-deck-slider__control-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div className="pd-deck-slider__counter">
            <span className="pd-deck-slider__counter-current">
              {String(currentPage + 1).padStart(2, "0")}
            </span>
            <span className="pd-deck-slider__counter-separator"> / </span>
            <span className="pd-deck-slider__counter-total">
              {String(manifest.total_pages).padStart(2, "0")}
            </span>
          </div>

          <button
            className="pd-deck-slider__control-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === manifest.total_pages - 1}
            aria-label="Next slide"
          >
            →
          </button>

          <button
            className={`pd-deck-slider__control-btn pd-deck-slider__control-btn--secondary ${
              showThumbnails ? "pd-deck-slider__control-btn--active" : ""
            }`}
            onClick={() => setShowThumbnails((prev) => !prev)}
            aria-label="Toggle thumbnails"
            title="Thumbnails"
          >
            ☰
          </button>

          <button
            className="pd-deck-slider__control-btn pd-deck-slider__control-btn--secondary"
            onClick={() => setIsFullscreen((prev) => !prev)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? "✕" : "⛶"}
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="pd-deck-slider__scroll-container"
        onScroll={handleScroll}
        data-lenis-prevent
      >
        {manifest.deck_images.map((image, index) => {
          const aspectRatio = manifest.aspect_ratios[index] || 1.414;
          const isLoaded = loadedPages.has(index);

          return (
            <div
              key={index}
              className="pd-deck-slider__page"
              style={{
                aspectRatio: `${aspectRatio}`,
                minWidth: "100%",
              }}
            >
              {isLoaded ? (
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                  style={{ objectFit: "contain" }}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="pd-deck-slider__page-placeholder" />
              )}
            </div>
          );
        })}
      </div>

      {showThumbnails && (
        <div
          ref={thumbnailStripRef}
          className="pd-deck-slider__thumbnails"
          data-lenis-prevent
        >
          {manifest.thumbnails.map((thumb, index) => (
            <button
              key={index}
              type="button"
              className={`pd-deck-slider__thumbnail ${
                currentPage === index ? "pd-deck-slider__thumbnail--active" : ""
              }`}
              onClick={() => goToPage(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={thumb}
                alt={`Slide ${index + 1} thumbnail`}
                fill
                sizes="100px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
              <span className="pd-deck-slider__thumbnail-number">{index + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

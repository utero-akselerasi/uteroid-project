"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import VideoPlayer from "@/components/project-detail/VideoPlayer";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { ProjectVideo } from "@/lib/types";

export default function TransitionCampaignSpotlight() {
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null);

  const handlePlayVideo = (src: string, triggerEl: HTMLElement | null) => {
    lastActiveTriggerRef.current = triggerEl;
    setActiveVideo({
      type: "file",
      src,
      aspectRatio: "3 / 4",
    });
  };

  return (
    <section
      id="transition-feed-campaign"
      className="tfc-section"
      aria-label="02 / Studio Campaign — Transition Feed Campaign"
    >
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           TRANSITION FEED CAMPAIGN — Refined Editorial 3-Grid
           ═══════════════════════════════════════════════════════════ */

        .tfc-section {
          position: relative;
          background-color: #ffffff;
          color: #0a0a0a;
          padding: clamp(3rem, 5vw, 4.75rem) 0;
          overflow: hidden;
          width: 100%;
        }

        /* Balanced content container (~92% viewport width, max 1440px) */
        .tfc-container {
          width: 92%;
          max-width: 1440px;
          margin: 0 auto;
        }

        /* ── Header Area ─────────────────────────────────────────── */
        .tfc-header {
          margin-bottom: clamp(1.5rem, 2.8vw, 2.25rem);
          border-bottom: 1px solid rgba(10, 10, 10, 0.08);
          padding-bottom: clamp(1rem, 1.8vw, 1.5rem);
        }

        .tfc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.5rem;
        }

        .tfc-badge__dot {
          width: 7px;
          height: 7px;
          background-color: #e31e24;
          border-radius: 50%;
        }

        .tfc-badge__label {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #e31e24;
        }

        .tfc-header__row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        /* Editorial Heading: 44–54px on desktop, single-line when space permits */
        .tfc-title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.85rem, 3.4vw, 3.25rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.05;
          margin: 0;
        }

        @media (min-width: 900px) {
          .tfc-title {
            white-space: nowrap;
          }
        }

        .tfc-header__meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .tfc-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          background-color: #0a0a0a;
          color: #ffffff;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: 2px;
        }

        .tfc-handle {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e31e24;
        }

        .tfc-subtitle {
          margin-top: 0.5rem;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.85rem, 1vw, 0.98rem);
          line-height: 1.55;
          color: #555555;
          max-width: 680px;
        }

        /* ── Three-Panel Grid Composition ────────────────────────── */
        /* Moderate, consistent gap (20–24px) for coordinated 3-grid look */
        .tfc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(18px, 1.8vw, 24px);
          width: 100%;
        }

        .tfc-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          border: none;
          min-width: 0;
        }

        /* Media Container: 4/5 portrait ratio, equal proportions across all 3 */
        .tfc-card__media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #c5201b;
          border-radius: 3px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }

        .tfc-card:hover .tfc-card__media-wrap {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
        }

        /* Displays entire artwork with zero cropping or cutoffs */
        .tfc-card__video,
        .tfc-card__img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        /* Video Play Button */
        .tfc-card__play-btn {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.18);
          border: none;
          cursor: pointer;
          transition: background 0.25s ease;
          padding: 0;
        }

        .tfc-card__play-btn:hover {
          background: rgba(0, 0, 0, 0.32);
        }

        .tfc-card__play-btn:focus-visible {
          outline: 3px solid #ffffff;
          outline-offset: -3px;
        }

        .tfc-card__play-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #e31e24;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
        }

        .tfc-card__play-btn:hover .tfc-card__play-icon {
          transform: scale(1.1);
          background-color: #0a0a0a;
        }

        /* ── Caption & Hierarchy ─────────────────────────────────── */
        .tfc-card__caption {
          padding-top: clamp(0.85rem, 1.2vw, 1.25rem);
          display: flex;
          flex-direction: column;
          border-top: 1.5px solid rgba(10, 10, 10, 0.12);
          margin-top: clamp(0.85rem, 1.2vw, 1.25rem);
        }

        .tfc-card__meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.45rem;
        }

        .tfc-card__pos {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e31e24;
        }

        .tfc-card__headline {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.05rem, 1.3vw, 1.35rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.15;
          margin: 0 0 0.5rem 0;
        }

        .tfc-card__role {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.8rem, 0.88vw, 0.88rem);
          line-height: 1.6;
          color: #555555;
          margin: 0;
        }

        /* ── Responsive Behavior ─────────────────────────────────── */
        @media (max-width: 1024px) {
          .tfc-grid {
            gap: 16px;
          }
          .tfc-card__play-icon {
            width: 46px;
            height: 46px;
          }
        }

        @media (max-width: 860px) {
          .tfc-grid {
            grid-template-columns: 1fr;
            gap: 2.75rem;
          }
          .tfc-card__media-wrap {
            max-width: 480px;
            margin: 0 auto;
          }
          .tfc-card__caption {
            max-width: 480px;
            margin: 0.85rem auto 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="tfc-container">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="tfc-header">
            <div className="tfc-badge">
              <span className="tfc-badge__dot" />
              <span className="tfc-badge__label">02 / STUDIO CAMPAIGN</span>
            </div>

            <div className="tfc-header__row">
              <div>
                <h2 className="tfc-title">TRANSITION FEED CAMPAIGN</h2>
                <p className="tfc-subtitle">
                  A visual bridge introducing Utero Indonesia&apos;s new design era through a coordinated three-part
                  Instagram sequence.
                </p>
              </div>

              <div className="tfc-header__meta">
                <span className="tfc-pill">INSTAGRAM 3-GRID TEASER</span>
                <span className="tfc-handle">@UTERO.DESIGN</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3-Panel Connected Grid Composition */}
        <RevealOnScroll delay={1}>
          <div className="tfc-grid">
            {/* Post 1 - Posisi Kiri (Video) */}
            <article className="tfc-card">
              <div className="tfc-card__media-wrap">
                <video
                  src="/projects/transition-feed-campaign/video-left.mp4#t=0.1"
                  preload="metadata"
                  playsInline
                  muted
                  className="tfc-card__video"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="tfc-card__play-btn"
                  onClick={(e) =>
                    handlePlayVideo("/projects/transition-feed-campaign/video-left.mp4", e.currentTarget)
                  }
                  aria-label="Putar video: NEW ERA OF DESIGN"
                >
                  <span className="tfc-card__play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="tfc-card__caption">
                <div className="tfc-card__meta-bar">
                  <span className="tfc-card__pos">POSISI KIRI · VIDEO</span>
                </div>
                <h3 className="tfc-card__headline">NEW ERA OF DESIGN</h3>
                <p className="tfc-card__role">
                  Konten ini berfungsi sebagai penanda bahwa Utero Indonesia memasuki fase visual yang baru. Pesan
                  ini menjadi simbol transisi sekaligus penegasan bahwa pembaruan yang dilakukan bukan sekadar
                  pergantian tampilan, tetapi sebuah langkah menuju pendekatan desain yang lebih segar, terarah, dan
                  relevan.
                </p>
              </div>
            </article>

            {/* Post 2 - Posisi Tengah (Feed Image) */}
            <article className="tfc-card">
              <div className="tfc-card__media-wrap">
                <Image
                  src="/projects/transition-feed-campaign/feed-middle.webp"
                  alt="UTERO HAS SOMETHING BIG FOR YOU — Utero Indonesia"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className="tfc-card__img"
                  priority
                />
              </div>

              <div className="tfc-card__caption">
                <div className="tfc-card__meta-bar">
                  <span className="tfc-card__pos">POSISI TENGAH · FEED</span>
                </div>
                <h3 className="tfc-card__headline">UTERO HAS SOMETHING BIG FOR YOU</h3>
                <p className="tfc-card__role">
                  Konten tengah menjadi pesan utama dari rangkaian transisi. Layout dibuat lebih sederhana dan fokus
                  pada typography agar menjadi pusat perhatian dalam komposisi tiga grid. CTA “Take a Look” digunakan
                  sebagai ajakan yang ringan, langsung, dan tetap terasa engaging, sehingga audiens terdorong untuk
                  memperhatikan perubahan visual yang sedang diperkenalkan.
                </p>
              </div>
            </article>

            {/* Post 3 - Posisi Kanan (Video) */}
            <article className="tfc-card">
              <div className="tfc-card__media-wrap">
                <video
                  src="/projects/transition-feed-campaign/video-right.mp4#t=0.1"
                  preload="metadata"
                  playsInline
                  muted
                  className="tfc-card__video"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="tfc-card__play-btn"
                  onClick={(e) =>
                    handlePlayVideo("/projects/transition-feed-campaign/video-right.mp4", e.currentTarget)
                  }
                  aria-label="Putar video: ARE YOU READY?"
                >
                  <span className="tfc-card__play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="tfc-card__caption">
                <div className="tfc-card__meta-bar">
                  <span className="tfc-card__pos">POSISI KANAN · VIDEO</span>
                </div>
                <h3 className="tfc-card__headline">ARE YOU READY?</h3>
                <p className="tfc-card__role">
                  Konten ini menjadi pembuka teaser dengan pendekatan yang membangun curiosity. Visual dapat
                  menampilkan seseorang yang mengangkat telepon yang sedang berdering, sebagai metafora bahwa sebuah
                  pesan atau perubahan penting sedang datang. Pesan ini berfungsi untuk memancing perhatian audiens
                  sebelum mereka melihat pengumuman utama di post berikutnya.
                </p>
              </div>
            </article>
          </div>
        </RevealOnScroll>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          poster="/projects/transition-feed-campaign/cover-9b98f119.webp"
          onClose={() => {
            setActiveVideo(null);
            lastActiveTriggerRef.current?.focus();
          }}
        />
      )}
    </section>
  );
}

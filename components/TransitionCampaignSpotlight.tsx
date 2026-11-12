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
           TRANSITION FEED CAMPAIGN — Full-Width Agency Presentation
           ═══════════════════════════════════════════════════════════ */

        .tfc-section {
          position: relative;
          background-color: #ffffff;
          color: #0a0a0a;
          padding: clamp(4.5rem, 8vw, 7.5rem) 0;
          overflow: hidden;
          width: 100%;
        }

        /* Full-width container using the entire browser viewport with generous edge gutters */
        .tfc-container {
          width: 100%;
          max-width: 100%;
          padding: 0 clamp(1.5rem, 4vw, 4.5rem);
          margin: 0;
        }

        /* ── Header Area ─────────────────────────────────────────── */
        .tfc-header {
          margin-bottom: clamp(2rem, 4vw, 3.5rem);
          border-bottom: 1px solid rgba(10, 10, 10, 0.1);
          padding-bottom: clamp(1.5rem, 2.5vw, 2.25rem);
        }

        .tfc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: clamp(0.75rem, 1.5vw, 1.25rem);
        }

        .tfc-badge__dot {
          width: 8px;
          height: 8px;
          background-color: #e31e24;
          border-radius: 50%;
        }

        .tfc-badge__label {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.75rem;
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
          gap: 1.5rem;
        }

        .tfc-title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(2.2rem, 5.5vw, 5.2rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 0.95;
          margin: 0;
        }

        .tfc-header__meta {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .tfc-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 0.9rem;
          background-color: #0a0a0a;
          color: #ffffff;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: 2px;
        }

        .tfc-handle {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e31e24;
        }

        .tfc-subtitle {
          margin-top: 1rem;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.95rem, 1.25vw, 1.15rem);
          line-height: 1.6;
          color: #555555;
          max-width: 820px;
        }

        /* ── Full-Width 3-Column Campaign Grid ──────────────────── */
        .tfc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.25rem, 2.5vw, 2.75rem);
          width: 100%;
        }

        .tfc-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          border: none;
          min-width: 0;
        }

        /* Large Campaign Media Container */
        .tfc-card__media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #c5201b;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .tfc-card:hover .tfc-card__media-wrap {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
        }

        /* Preserves complete artwork without any crop or distortion */
        .tfc-card__video,
        .tfc-card__img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        /* Video Play Button Overlay */
        .tfc-card__play-btn {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          border: none;
          cursor: pointer;
          transition: background 0.25s ease;
          padding: 0;
        }

        .tfc-card__play-btn:hover {
          background: rgba(0, 0, 0, 0.35);
        }

        .tfc-card__play-btn:focus-visible {
          outline: 3px solid #ffffff;
          outline-offset: -3px;
        }

        .tfc-card__play-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: #e31e24;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .tfc-card__play-btn:hover .tfc-card__play-icon {
          transform: scale(1.12);
          background-color: #0a0a0a;
        }

        /* ── Caption & Hierarchy ─────────────────────────────────── */
        .tfc-card__caption {
          padding-top: clamp(1.25rem, 2vw, 1.75rem);
          display: flex;
          flex-direction: column;
          border-top: 2px solid #0a0a0a;
          margin-top: clamp(1.25rem, 2vw, 1.75rem);
        }

        .tfc-card__meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .tfc-card__pos {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #e31e24;
        }

        .tfc-card__cta {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffffff;
          background-color: #e31e24;
          padding: 0.25rem 0.65rem;
          border-radius: 2px;
        }

        .tfc-card__headline {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.25rem, 1.8vw, 1.85rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.1;
          margin: 0 0 0.85rem 0;
        }

        .tfc-card__role {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.88rem, 1vw, 0.98rem);
          line-height: 1.65;
          color: #4a4a4a;
          margin: 0;
        }

        /* ── Responsive Breakpoints ─────────────────────────────── */
        @media (max-width: 1024px) {
          .tfc-grid {
            gap: 1.5rem;
          }
          .tfc-card__play-icon {
            width: 54px;
            height: 54px;
          }
        }

        @media (max-width: 860px) {
          .tfc-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .tfc-card__media-wrap {
            max-width: 600px;
            margin: 0 auto;
          }
          .tfc-card__caption {
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
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

        {/* 3-Column Full-Width Composition */}
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
                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
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
                  <span className="tfc-card__cta">CTA: TAKE A LOOK</span>
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
                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
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

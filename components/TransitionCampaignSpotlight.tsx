"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import VideoPlayer from "@/components/project-detail/VideoPlayer";
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
    <aside
      id="transition-feed-campaign"
      className="tfc-spotlight"
      aria-label="Transition Feed Campaign Spotlight"
    >
      <style>{`
        .tfc-spotlight {
          max-width: 1000px;
          margin: 0 auto clamp(2rem, 3.5vw, 3rem);
          padding: 0;
          background: transparent;
          border: none;
        }

        .tfc-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: clamp(1rem, 2vw, 1.5rem);
          padding-bottom: clamp(0.6rem, 1vw, 0.85rem);
          border-bottom: 1px solid rgba(10, 10, 10, 0.08);
        }

        .tfc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #e31e24;
          margin-bottom: 0.35rem;
        }

        .tfc-badge__dot {
          width: 5px;
          height: 5px;
          background-color: #e31e24;
          border-radius: 50%;
        }

        .tfc-title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.3rem, 2vw, 1.75rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.05;
          margin: 0;
        }

        .tfc-tag {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.6rem;
          background-color: #0a0a0a;
          color: #ffffff;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: 2px;
        }

        /* 3-grid row: tight gap like Instagram 3-grid */
        .tfc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.5rem, 1vw, 0.85rem);
        }

        .tfc-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          border: none;
          border-radius: 0;
          overflow: visible;
        }

        .tfc-card__media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #0d0d0d;
          border-radius: 3px;
          overflow: hidden;
        }

        .tfc-card__video,
        .tfc-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .tfc-card__play-btn {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.22);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          min-width: 44px;
          min-height: 44px;
          padding: 0;
        }

        .tfc-card__play-btn:hover {
          background: rgba(0, 0, 0, 0.38);
        }

        .tfc-card__play-btn:focus-visible {
          outline: 2px solid #e31e24;
          outline-offset: -2px;
        }

        .tfc-card__play-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #e31e24;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .tfc-card__play-btn:hover .tfc-card__play-icon {
          transform: scale(1.08);
          background-color: #b7151a;
        }

        .tfc-card__caption {
          padding: 0.75rem 0.15rem 0;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .tfc-card__pos {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e31e24;
          margin-bottom: 0.35rem;
        }

        .tfc-card__headline {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.95rem, 1.15vw, 1.12rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.15;
          margin: 0 0 0.45rem 0;
        }

        .tfc-card__cta {
          display: inline-block;
          align-self: flex-start;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          background-color: #f0ede8;
          padding: 0.2rem 0.48rem;
          border-radius: 2px;
          margin-bottom: 0.55rem;
        }

        .tfc-card__role {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.78rem;
          line-height: 1.55;
          color: #555555;
          margin: 0;
        }

        @media (max-width: 860px) {
          .tfc-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="tfc-head">
        <div>
          <div className="tfc-badge">
            <span className="tfc-badge__dot" />
            <span>Studio Feature · Instagram 3-Grid Teaser</span>
          </div>
          <h2 className="tfc-title">Transition Feed Campaign</h2>
        </div>
        <span className="tfc-tag">Instagram Series</span>
      </div>

      {/* 3 Posts Grid */}
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
              onClick={(e) => handlePlayVideo("/projects/transition-feed-campaign/video-left.mp4", e.currentTarget)}
              aria-label="Putar video: NEW ERA OF DESIGN"
            >
              <span className="tfc-card__play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>
          <div className="tfc-card__caption">
            <span className="tfc-card__pos">Posisi Kiri · Video</span>
            <h3 className="tfc-card__headline">NEW ERA OF DESIGN</h3>
            <p className="tfc-card__role">
              Konten ini berfungsi sebagai penanda bahwa Utero Indonesia memasuki fase visual yang baru. Pesan ini menjadi simbol transisi sekaligus penegasan bahwa pembaruan yang dilakukan bukan sekadar pergantian tampilan, tetapi sebuah langkah menuju pendekatan desain yang lebih segar, terarah, dan relevan.
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
            />
          </div>
          <div className="tfc-card__caption">
            <span className="tfc-card__pos">Posisi Tengah · Feed</span>
            <h3 className="tfc-card__headline">UTERO HAS SOMETHING BIG FOR YOU</h3>
            <div className="tfc-card__cta">CTA: TAKE A LOOK</div>
            <p className="tfc-card__role">
              Konten tengah menjadi pesan utama dari rangkaian transisi. Layout dibuat lebih sederhana dan fokus pada typography agar menjadi pusat perhatian dalam komposisi tiga grid. CTA “Take a Look” digunakan sebagai ajakan yang ringan, langsung, dan tetap terasa engaging, sehingga audiens terdorong untuk memperhatikan perubahan visual yang sedang diperkenalkan.
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
              onClick={(e) => handlePlayVideo("/projects/transition-feed-campaign/video-right.mp4", e.currentTarget)}
              aria-label="Putar video: ARE YOU READY?"
            >
              <span className="tfc-card__play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>
          <div className="tfc-card__caption">
            <span className="tfc-card__pos">Posisi Kanan · Video</span>
            <h3 className="tfc-card__headline">ARE YOU READY?</h3>
            <p className="tfc-card__role">
              Konten ini menjadi pembuka teaser dengan pendekatan yang membangun curiosity. Visual dapat menampilkan seseorang yang mengangkat telepon yang sedang berdering, sebagai metafora bahwa sebuah pesan atau perubahan penting sedang datang. Pesan ini berfungsi untuk memancing perhatian audiens sebelum mereka melihat pengumuman utama di post berikutnya.
            </p>
          </div>
        </article>
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
    </aside>
  );
}


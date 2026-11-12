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
          margin: 0 0 clamp(3rem, 5vw, 4.5rem) 0;
          padding: clamp(1.75rem, 3.5vw, 3rem);
          background-color: #faf9f6;
          border: 1px solid rgba(10, 10, 10, 0.1);
          border-left: 4px solid #e31e24;
          border-radius: 4px;
        }

        .tfc-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
          padding-bottom: clamp(1.25rem, 2vw, 1.75rem);
          border-bottom: 1px solid rgba(10, 10, 10, 0.08);
        }

        .tfc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e31e24;
          margin-bottom: 0.5rem;
        }

        .tfc-badge__dot {
          width: 6px;
          height: 6px;
          background-color: #e31e24;
          border-radius: 50%;
        }

        .tfc-title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
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

        .tfc-konsep {
          margin-bottom: clamp(2rem, 3.5vw, 3rem);
          max-width: 960px;
        }

        .tfc-konsep__label {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.45);
          margin-bottom: 0.6rem;
          display: block;
        }

        .tfc-konsep__text {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.92rem, 1.2vw, 1.05rem);
          line-height: 1.7;
          color: #333333;
          margin: 0 0 0.85rem 0;
        }

        /* 3-grid row */
        .tfc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.25rem, 2.5vw, 2.25rem);
        }

        .tfc-card {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          border: 1px solid rgba(10, 10, 10, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        .tfc-card__media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #0d0d0d;
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
          background: rgba(0, 0, 0, 0.25);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          min-width: 44px;
          min-height: 44px;
          padding: 0;
        }

        .tfc-card__play-btn:hover {
          background: rgba(0, 0, 0, 0.4);
        }

        .tfc-card__play-btn:focus-visible {
          outline: 2px solid #e31e24;
          outline-offset: -2px;
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
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .tfc-card__play-btn:hover .tfc-card__play-icon {
          transform: scale(1.1);
          background-color: #b7151a;
        }

        .tfc-card__caption {
          padding: clamp(1rem, 2vw, 1.5rem);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .tfc-card__pos {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #e31e24;
          margin-bottom: 0.45rem;
        }

        .tfc-card__headline {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.1rem, 1.35vw, 1.3rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.15;
          margin: 0 0 0.6rem 0;
        }

        .tfc-card__cta {
          display: inline-block;
          align-self: flex-start;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          background-color: #f0ede8;
          padding: 0.25rem 0.55rem;
          border-radius: 2px;
          margin-bottom: 0.75rem;
        }

        .tfc-card__role {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.85rem;
          line-height: 1.6;
          color: #555555;
          margin: 0;
        }

        @media (max-width: 860px) {
          .tfc-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
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

      {/* Konsep */}
      <div className="tfc-konsep">
        <span className="tfc-konsep__label">Konsep</span>
        <p className="tfc-konsep__text">
          Transition Feed Campaign digunakan sebagai jembatan visual dari tampilan Instagram lama menuju sistem visual yang baru. Tiga konten diunggah secara berurutan untuk menciptakan rasa penasaran, memberi sinyal perubahan, sekaligus memperkenalkan arah baru Utero Indonesia secara bertahap.
        </p>
        <p className="tfc-konsep__text">
          Konsep ini dirancang sebagai satu rangkaian teaser, bukan tiga konten yang berdiri sendiri. Setiap post memiliki fungsi komunikasi yang berbeda, namun tetap saling terhubung melalui tone visual, typography, warna, dan storytelling yang konsisten.
        </p>
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
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
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
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
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


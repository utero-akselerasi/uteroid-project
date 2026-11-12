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
        .tfc-section {
          position: relative;
          background-color: #ffffff;
          color: #0a0a0a;
          padding: clamp(3rem, 6vh, 4.5rem) 0;
          overflow: hidden;
        }

        .tfc-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 3.5rem);
        }

        .tfc-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
          padding-bottom: clamp(0.6rem, 1.2vh, 0.85rem);
          border-bottom: 1px solid rgba(10, 10, 10, 0.08);
        }

        .tfc-title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.5rem, 2.8vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.05;
          margin: 0;
        }

        .tfc-tag {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.45);
        }

        /* 3-grid row: compact height to fit viewport without scrolling */
        .tfc-grid-wrap {
          max-width: 1040px;
          margin: 0 auto;
        }

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
          overflow: visible;
        }

        .tfc-card__media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          max-height: 40vh;
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
          width: 42px;
          height: 42px;
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
          padding: 0.65rem 0.15rem 0;
          display: flex;
          flex-direction: column;
        }

        .tfc-card__pos {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e31e24;
          margin-bottom: 0.25rem;
        }

        .tfc-card__headline {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.92rem, 1.1vw, 1.08rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.15;
          margin: 0 0 0.35rem 0;
        }

        .tfc-card__cta {
          display: inline-block;
          align-self: flex-start;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.56rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          background-color: #f0ede8;
          padding: 0.18rem 0.45rem;
          border-radius: 2px;
          margin-bottom: 0.4rem;
        }

        .tfc-card__role {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.76rem;
          line-height: 1.5;
          color: #555555;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 860px) {
          .tfc-card__media-wrap {
            max-height: none;
          }
          .tfc-card__role {
            -webkit-line-clamp: none;
          }
          .tfc-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
        }
      `}</style>

      <div className="tfc-container">
        {/* Section Badge (Consistent with 01, 02, etc.) */}
        <RevealOnScroll>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "clamp(0.75rem, 1.5vh, 1.25rem)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                backgroundColor: "#e31e24",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#e31e24",
              }}
            >
              02 / STUDIO CAMPAIGN
            </span>
          </div>
        </RevealOnScroll>

        {/* Section Header */}
        <RevealOnScroll delay={1}>
          <div className="tfc-head">
            <h2 className="tfc-title">Transition Feed Campaign</h2>
            <span className="tfc-tag">Instagram 3-Grid Teaser · @utero.design</span>
          </div>
        </RevealOnScroll>

        {/* 3 Posts Grid */}
        <div className="tfc-grid-wrap">
          <RevealOnScroll delay={2}>
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
                  />
                </div>
                <div className="tfc-card__caption">
                  <span className="tfc-card__pos">Posisi Tengah · Feed</span>
                  <h3 className="tfc-card__headline">UTERO HAS SOMETHING BIG FOR YOU</h3>
                  <div className="tfc-card__cta">CTA: TAKE A LOOK</div>
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

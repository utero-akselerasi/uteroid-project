"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import VideoPlayer from "@/components/project-detail/VideoPlayer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useLanguage } from "@/lib/LanguageContext";
import { resolveCampaignConfig } from "@/lib/campaignDefaults";
import type { CampaignConfig, CampaignLocaleConfig, CampaignPostConfig } from "@/lib/siteSettings";
import type { ProjectVideo } from "@/lib/types";

type MergedPost = CampaignPostConfig & { position: string; headline: string; description: string; playAria?: string };
type MergedCampaign = Omit<CampaignLocaleConfig, "postLeft" | "postMiddle" | "postRight"> & {
  postLeft: MergedPost;
  postMiddle: MergedPost;
  postRight: MergedPost;
};

export default function TransitionCampaignSpotlight({ config }: { config?: CampaignConfig }) {
  const { language } = useLanguage();
  const resolved = resolveCampaignConfig(config);
  const campaign = resolved[language] as unknown as MergedCampaign;
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null);

  const handlePlayVideo = (post: MergedPost, triggerEl: HTMLElement | null) => {
    lastActiveTriggerRef.current = triggerEl;
    setActiveVideo({
      type: "file",
      src: post.src || "",
      poster: post.poster,
      aspectRatio: "3 / 4",
    });
  };

  const renderPostMedia = (post: MergedPost) => {
    if (post.mediaType === "image" || !post.src) {
      return (
        <Image
          src={post.src || "/projects/transition-feed-campaign/feed-middle.webp"}
          alt={post.headline || "UTERO campaign"}
          fill
          sizes="(max-width: 840px) 100vw, 33vw"
          className="tfc-card__img"
          priority
        />
      );
    }
    return (
      <>
        <video
          src={`${post.src}#t=0.1`}
          preload="metadata"
          playsInline
          muted
          className="tfc-card__video"
          aria-hidden="true"
        />
        <button
          type="button"
          className="tfc-card__play-btn"
          onClick={(e) => handlePlayVideo(post, e.currentTarget)}
          aria-label={post.playAria || post.headline}
        >
          <span className="tfc-card__play-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </>
    );
  };

  return (
    <section
      id="transition-feed-campaign"
      className="tfc-section"
      aria-label={campaign.sectionAria}
    >
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           TRANSITION FEED CAMPAIGN — Compact Editorial 3-Grid
           Balanced for 100% browser zoom
           ═══════════════════════════════════════════════════════════ */

        .tfc-section {
          position: relative;
          background-color: #ffffff;
          color: #0a0a0a;
          padding: clamp(2.5rem, 4.5vh, 3.5rem) 0;
          overflow: hidden;
          width: 100%;
        }

        /* Compact, balanced content container (matches ~80% feel at 100% zoom) */
        .tfc-container {
          width: 90%;
          max-width: 1140px;
          margin: 0 auto;
        }

        /* ── Header Area ─────────────────────────────────────────── */
        .tfc-header {
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
          border-bottom: 1px solid rgba(10, 10, 10, 0.08);
          padding-bottom: clamp(0.65rem, 1.2vh, 0.95rem);
        }

        .tfc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: 0.35rem;
        }

        .tfc-badge__dot {
          width: 6px;
          height: 6px;
          background-color: #e31e24;
          border-radius: 50%;
        }

        .tfc-badge__label {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.68rem;
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
          gap: 1rem;
        }

        /* Scaled heading: ~36–42px on desktop, single line when space allows */
        .tfc-title {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(1.6rem, 2.6vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.05;
          margin: 0;
        }

        @media (min-width: 860px) {
          .tfc-title {
            white-space: nowrap;
          }
        }

        .tfc-header__meta {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        /* ── Category / Format Pill ──────────────────────────────── */
        .tfc-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.38rem 0.75rem;
          background-color: rgba(10, 10, 10, 0.04);
          border: 1px solid rgba(10, 10, 10, 0.08);
          border-radius: 9999px;
          color: #555555;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1;
          user-select: none;
        }

        .tfc-badge-pill__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #e31e24;
          opacity: 0.9;
        }

        /* ── Instagram Action Button ─────────────────────────────── */
        .tfc-ig-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.38rem 0.85rem;
          background-color: #0a0a0a;
          color: #ffffff;
          border: 1px solid #0a0a0a;
          border-radius: 9999px;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          line-height: 1;
          transition:
            background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .tfc-ig-btn:hover {
          background-color: #e31e24;
          border-color: #e31e24;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(227, 30, 36, 0.35);
        }

        .tfc-ig-btn:active {
          transform: translateY(0);
        }

        .tfc-ig-btn:focus-visible {
          outline: 2px solid #e31e24;
          outline-offset: 2px;
        }

        .tfc-ig-btn__icon {
          flex-shrink: 0;
          opacity: 0.9;
        }

        .tfc-ig-btn__arrow {
          flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tfc-ig-btn:hover .tfc-ig-btn__arrow {
          transform: translate(2px, -2px);
        }

        .tfc-subtitle {
          margin-top: 0.35rem;
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.82rem, 0.9vw, 0.9rem);
          line-height: 1.5;
          color: #555555;
          max-width: 620px;
        }

        /* ── Coordinated 3-Panel Grid (Tight Instagram Gap) ──────── */
        .tfc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 1.1vw, 14px);
          width: 100%;
        }

        .tfc-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          border: none;
          min-width: 0;
        }

        /* 4/5 portrait ratio, equal proportions across all 3 panels */
        .tfc-card__media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #c5201b;
          border-radius: 3px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }

        .tfc-card:hover .tfc-card__media-wrap {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.09);
        }

        /* Preserves complete artwork with zero cropping */
        .tfc-card__video,
        .tfc-card__img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        /* Play Button */
        .tfc-card__play-btn {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.16);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          padding: 0;
        }

        .tfc-card__play-btn:hover {
          background: rgba(0, 0, 0, 0.28);
        }

        .tfc-card__play-btn:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: -2px;
        }

        .tfc-card__play-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background-color: #e31e24;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
        }

        .tfc-card__play-btn:hover .tfc-card__play-icon {
          transform: scale(1.08);
          background-color: #0a0a0a;
        }

        /* ── Caption: Aligned Structure & Starting Positions ─────── */
        .tfc-card__caption {
          padding-top: clamp(0.75rem, 1vw, 0.95rem);
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(10, 10, 10, 0.12);
          margin-top: clamp(0.75rem, 1vw, 0.95rem);
        }

        .tfc-card__meta-bar {
          display: flex;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .tfc-card__pos {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e31e24;
        }

        /* Consistent min-height ensures all descriptions start at the exact same Y position */
        .tfc-card__headline {
          font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.95rem, 1.15vw, 1.15rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.15;
          margin: 0 0 0.5rem 0;
          min-height: 2.3em;
        }

        /* Full natural description without artificial ellipsis */
        .tfc-card__role {
          font-family: var(--font-sans, "Helvetica Neue", Arial, sans-serif);
          font-size: clamp(0.76rem, 0.8vw, 0.82rem);
          line-height: 1.6;
          color: #505050;
          margin: 0;
        }

        /* ── Responsive Behavior ─────────────────────────────────── */
        @media (max-width: 1024px) {
          .tfc-card__headline {
            min-height: auto;
          }
        }

        @media (max-width: 840px) {
          .tfc-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .tfc-card__media-wrap {
            max-width: 440px;
            margin: 0 auto;
          }
          .tfc-card__caption {
            max-width: 440px;
            margin: 0.75rem auto 0;
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
              <span className="tfc-badge__label">{campaign.badgeLabel}</span>
            </div>

            <div className="tfc-header__row">
              <div>
                <h2 className="tfc-title">{campaign.title}</h2>
                <p className="tfc-subtitle">{campaign.subtitle}</p>
              </div>

              <div className="tfc-header__meta">
                <span className="tfc-badge-pill">
                  <span className="tfc-badge-pill__icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="3.5" height="12" rx="1" />
                      <rect x="6.25" y="2" width="3.5" height="12" rx="1" />
                      <rect x="11.5" y="2" width="3.5" height="12" rx="1" />
                    </svg>
                  </span>
                  <span>{campaign.tagPill}</span>
                </span>

                <a
                  href="https://www.instagram.com/utero.design/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tfc-ig-btn"
                  aria-label="Visit Utero Design on Instagram (opens in new tab)"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tfc-ig-btn__icon"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>{campaign.handle || "@UTERO.DESIGN"}</span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tfc-ig-btn__arrow"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3-Panel Connected Grid Composition */}
        <RevealOnScroll delay={1}>
          <div className="tfc-grid">
            {/* Post 1 - Posisi Kiri */}
            <article className="tfc-card">
              <div className="tfc-card__media-wrap">
                {renderPostMedia(campaign.postLeft)}
              </div>

              <div className="tfc-card__caption">
                <div className="tfc-card__meta-bar">
                  <span className="tfc-card__pos">{campaign.postLeft.position}</span>
                </div>
                <h3 className="tfc-card__headline">{campaign.postLeft.headline}</h3>
                <p className="tfc-card__role">{campaign.postLeft.description}</p>
              </div>
            </article>

            {/* Post 2 - Posisi Tengah */}
            <article className="tfc-card">
              <div className="tfc-card__media-wrap">
                {renderPostMedia(campaign.postMiddle)}
              </div>

              <div className="tfc-card__caption">
                <div className="tfc-card__meta-bar">
                  <span className="tfc-card__pos">{campaign.postMiddle.position}</span>
                </div>
                <h3 className="tfc-card__headline">{campaign.postMiddle.headline}</h3>
                <p className="tfc-card__role">{campaign.postMiddle.description}</p>
              </div>
            </article>

            {/* Post 3 - Posisi Kanan */}
            <article className="tfc-card">
              <div className="tfc-card__media-wrap">
                {renderPostMedia(campaign.postRight)}
              </div>

              <div className="tfc-card__caption">
                <div className="tfc-card__meta-bar">
                  <span className="tfc-card__pos">{campaign.postRight.position}</span>
                </div>
                <h3 className="tfc-card__headline">{campaign.postRight.headline}</h3>
                <p className="tfc-card__role">{campaign.postRight.description}</p>
              </div>
            </article>
          </div>
        </RevealOnScroll>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          poster={activeVideo.poster || "/projects/transition-feed-campaign/cover-9b98f119.webp"}
          onClose={() => {
            setActiveVideo(null);
            lastActiveTriggerRef.current?.focus();
          }}
        />
      )}
    </section>
  );
}

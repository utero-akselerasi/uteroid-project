"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/lib/useTranslations";
import type { ProjectVideo } from "@/lib/types";

interface VideoPlayerProps {
  video: ProjectVideo;
  poster?: string;
  onClose: () => void;
}

function getEmbedUrl(video: ProjectVideo): string {
  if (video.type === "youtube") {
    let videoId = video.src.trim();
    // Parse common YouTube URL patterns:
    // - https://www.youtube.com/watch?v=ID
    // - https://youtu.be/ID
    // - https://www.youtube.com/embed/ID
    // - https://www.youtube-nocookie.com/embed/ID
    const match = videoId.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (match && match[1]) {
      videoId = match[1];
    }
    // "never autoplay with sound, use youtube-nocookie.com"
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&enablejsapi=1`;
  }

  if (video.type === "vimeo") {
    let videoId = video.src.trim();
    const match = videoId.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&title=0&byline=0&portrait=0`;
  }

  return video.src;
}

export default function VideoPlayer({ video, poster, onClose }: VideoPlayerProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Save previously focused element to return focus on close
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => setIsOpen(true));

    // Prevent background scrolling while modal is open, without jumping scroll position
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      // Guarantee scroll position is preserved without jumping
      window.scrollTo({ top: scrollY, behavior: "instant" });
      // Return focus to trigger button
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, []);

  // Stop playback immediately
  const stopVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    stopVideo();
    setIsOpen(false);
    setTimeout(onClose, 250);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const embedUrl = video.type !== "file" ? getEmbedUrl(video) : "";

  if (!mounted) return null;

  return createPortal(
    <div
      className={`pd-video-modal ${isOpen ? "pd-video-modal--open" : ""}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.projectChrome.videoPresentation}
    >
      <button
        className="pd-video-modal__close"
        onClick={handleClose}
        aria-label={t.projectChrome.closeVideo}
      >
        ✕
      </button>

      <div
        className="pd-video-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {(video.type === "youtube" || video.type === "vimeo") && !isClosing && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={video.type === "youtube" ? "YouTube video player" : "Vimeo video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="pd-video-modal__iframe"
          />
        )}

        {video.type === "file" && !isClosing && (
          <video
            ref={videoRef}
            src={video.src}
            poster={poster}
            controls
            autoPlay
            muted
            playsInline
            className="pd-video-modal__video"
          />
        )}
      </div>
    </div>,
    document.body
  );
}

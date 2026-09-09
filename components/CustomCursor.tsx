"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    ) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check for elements with cursor attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "";
        setCursorText(text);
        setIsHovered(true);
      } else {
        const isInteractive = target.closest("a, button, [role='button'], input, textarea, select");
        if (isInteractive) {
          setCursorText("");
          setIsHovered(true);
        } else {
          setCursorText("");
          setIsHovered(false);
        }
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp for trailing cursor ring
  useEffect(() => {
    if (isTouch) return;
    let animationFrameId: number;

    const animate = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.2,
          y: prev.y + dy * 0.2,
        };
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isTouch]);

  if (isTouch || !isVisible) return null;

  const hasCustomText = Boolean(cursorText);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99999,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* Outer Follower Ring / Badge */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%) scale(${
            isClicking ? 0.9 : 1
          })`,
          width: hasCustomText ? "auto" : isHovered ? "48px" : "32px",
          height: hasCustomText ? "auto" : isHovered ? "48px" : "32px",
          padding: hasCustomText ? "8px 16px" : 0,
          borderRadius: hasCustomText ? "24px" : "50%",
          backgroundColor: hasCustomText
            ? "#c91a1f"
            : isHovered
            ? "rgba(201, 26, 31, 0.15)"
            : "transparent",
          border: hasCustomText
            ? "none"
            : `1.5px solid ${isHovered ? "#c91a1f" : "rgba(201, 26, 31, 0.6)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), padding 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease",
          boxShadow: hasCustomText ? "0 8px 24px rgba(201, 26, 31, 0.35)" : "none",
        }}
      >
        {hasCustomText && (
          <span
            style={{
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            {cursorText}
          </span>
        )}
      </div>

      {/* Center Precise Dot */}
      {!hasCustomText && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
            width: isHovered ? "6px" : "8px",
            height: isHovered ? "6px" : "8px",
            borderRadius: "50%",
            backgroundColor: "#c91a1f",
            transition: "width 0.15s ease, height 0.15s ease, opacity 0.15s ease",
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}

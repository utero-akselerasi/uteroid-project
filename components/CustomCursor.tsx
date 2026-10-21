"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const targetPosRef = useRef({ x: -100, y: -100 });
  const trailingPosRef = useRef({ x: -100, y: -100 });
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const isClickingRef = useRef(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable on touch, coarse pointer devices, or when reduced motion is preferred
    const motionQuery = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

    if (
      typeof window !== "undefined" &&
      (motionQuery?.matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0)
    ) {
      setIsTouch(true);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsTouch(true);
      }
    };
    motionQuery?.addEventListener("change", handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

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

    const handleMouseDown = () => {
      isClickingRef.current = true;
    };
    const handleMouseUp = () => {
      isClickingRef.current = false;
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      motionQuery?.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Smooth lerp for trailing cursor ring using direct DOM manipulation.
  // Single RAF loop for the lifetime of the component — NOT restarted on
  // every mousemove (which previously caused frame drops under fast motion).
  useEffect(() => {
    if (isTouch) return;
    let animationFrameId = 0;

    const animate = () => {
      const targetPos = targetPosRef.current;
      const trailing = trailingPosRef.current;
      const dx = targetPos.x - trailing.x;
      const dy = targetPos.y - trailing.y;
      trailingPosRef.current = {
        x: trailing.x + dx * 0.2,
        y: trailing.y + dy * 0.2,
      };

      // Update DOM directly to avoid React re-renders
      if (cursorRingRef.current) {
        const scale = isClickingRef.current ? 0.9 : 1;
        cursorRingRef.current.style.transform = `translate3d(${trailingPosRef.current.x}px, ${trailingPosRef.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${targetPos.x}px, ${targetPos.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTouch]);

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
        ref={cursorRingRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
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
          ref={cursorDotRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
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

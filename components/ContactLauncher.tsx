"use client";

import { useEffect, useRef } from "react";

interface ContactLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkText?: boolean;
}

export default function ContactLauncher({
  isOpen,
  onClose,
  isDarkText = false,
}: ContactLauncherProps) {
  const launcherRef = useRef<HTMLDivElement>(null);

  // Click outside and Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        launcherRef.current &&
        !launcherRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgSurface = isDarkText
    ? "rgba(255, 255, 255, 0.82)"
    : "rgba(20, 20, 20, 0.72)";
  const textColor = isDarkText ? "#0a0a0a" : "#ffffff";
  const mutedColor = isDarkText ? "rgba(10, 10, 10, 0.5)" : "rgba(255, 255, 255, 0.55)";
  const borderStroke = isDarkText
    ? "1px solid rgba(10, 10, 10, 0.08)"
    : "1px solid rgba(255, 255, 255, 0.12)";
  const hoverBg = isDarkText
    ? "rgba(10, 10, 10, 0.05)"
    : "rgba(255, 255, 255, 0.08)";

  return (
    <>
      {/* Subtle backdrop overlay for mobile */}
      <div
        className="fixed inset-0 z-[1050] bg-black/20 backdrop-blur-xs md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Lightweight Dropdown */}
      <div
        ref={launcherRef}
        role="dialog"
        aria-modal="true"
        aria-label="Direct Contact Channels"
        className="fixed z-[1060] right-3 sm:right-6 top-16 md:top-[68px] w-[calc(100vw-1.5rem)] sm:w-[320px] max-w-[340px]"
        style={{
          animation: "contactLauncherFade 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div
          style={{
            backgroundColor: bgSurface,
            color: textColor,
            border: borderStroke,
            backdropFilter: "blur(24px) saturate(170%)",
            WebkitBackdropFilter: "blur(24px) saturate(170%)",
            borderRadius: "14px",
            boxShadow: "0 18px 45px -10px rgba(0, 0, 0, 0.22)",
            overflow: "hidden",
            padding: "10px",
          }}
        >
          {/* Header Title */}
          <div
            style={{
              padding: "6px 8px 10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: isDarkText ? "1px solid rgba(10, 10, 10, 0.06)" : "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#c91a1f",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isDarkText ? "#0a0a0a" : "#ffffff",
                }}
              >
                CONNECT WITH UTERO
              </span>
            </div>

            <span
              style={{
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: mutedColor,
              }}
            >
              MALANG (UTC+7)
            </span>
          </div>

          {/* Contact Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {/* 1. WHATSAPP */}
            <div
              style={{
                borderRadius: "8px",
                padding: "8px 10px",
                backgroundColor: isDarkText ? "rgba(10, 10, 10, 0.02)" : "rgba(255, 255, 255, 0.03)",
                border: isDarkText ? "1px solid rgba(10, 10, 10, 0.04)" : "1px solid rgba(255, 255, 255, 0.05)",
                marginBottom: "2px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="#25D366"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.871.815 2.796.815 3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm0 10.457c-.833 0-1.644-.224-2.348-.648l-.168-.101-1.745.458.466-1.701-.111-.176c-.466-.74-.712-1.602-.712-2.523 0-2.582 2.101-4.683 4.683-4.683 2.582 0 4.683 2.101 4.683 4.683 0 2.582-2.101 4.683-4.683 4.683zm2.565-3.504c-.141-.07-.833-.411-.962-.458-.129-.047-.224-.07-.318.07-.094.141-.365.458-.447.552-.082.094-.165.106-.306.035-.141-.07-.596-.22-1.135-.7-.419-.373-.701-.834-.783-.975-.082-.141-.009-.217.062-.287.063-.063.141-.165.212-.247.07-.082.094-.141.141-.235.047-.094.024-.176-.012-.247-.035-.07-.318-.765-.435-1.047-.115-.276-.232-.238-.318-.242l-.271-.005c-.094 0-.247.035-.376.176-.129.141-.494.482-.494 1.176 0 .694.506 1.365.576 1.459.07.094 1.002 1.53 2.427 2.146.339.147.604.234.811.3.341.108.651.093.896.056.273-.041.833-.341.95-.67.118-.329.118-.612.082-.67-.035-.058-.129-.094-.27-.164z"/>
                  </svg>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    WhatsApp
                  </span>
                </div>
              </div>

              {/* Wahyu */}
              <a
                href="https://wa.me/6281999900900"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: textColor,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "background-color 0.15s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverBg;
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span>081 999 900 900 — Wahyu</span>
                <span style={{ color: "#c91a1f", fontSize: "11px", fontWeight: "bold" }}>&rarr;</span>
              </a>

              {/* Utero */}
              <a
                href="https://wa.me/62817388616"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: textColor,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "background-color 0.15s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverBg;
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span>081 7388 616 — Utero</span>
                <span style={{ color: "#c91a1f", fontSize: "11px", fontWeight: "bold" }}>&rarr;</span>
              </a>
            </div>

            {/* 2. INSTAGRAM */}
            <a
              href="https://www.instagram.com/uteroindonesia/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: "8px",
                textDecoration: "none",
                color: textColor,
                transition: "background-color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E1306C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", display: "block" }}>
                    Instagram
                  </span>
                  <span style={{ fontSize: "10px", color: mutedColor }}>
                    @uteroindonesia
                  </span>
                </div>
              </div>
              <span style={{ color: "#c91a1f", fontSize: "11px", fontWeight: "bold" }}>&rarr;</span>
            </a>

            {/* 3. FACEBOOK */}
            <a
              href="https://www.facebook.com/uteroadvertisingindonesia/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: "8px",
                textDecoration: "none",
                color: textColor,
                transition: "background-color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="#1877F2"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", display: "block" }}>
                    Facebook
                  </span>
                  <span style={{ fontSize: "10px", color: mutedColor }}>
                    Utero Advertising Indonesia
                  </span>
                </div>
              </div>
              <span style={{ color: "#c91a1f", fontSize: "11px", fontWeight: "bold" }}>&rarr;</span>
            </a>

            {/* 4. YOUTUBE */}
            <a
              href="https://www.youtube.com/@uteroindonesia"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: "8px",
                textDecoration: "none",
                color: textColor,
                transition: "background-color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="#FF0000"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", display: "block" }}>
                    YouTube
                  </span>
                  <span style={{ fontSize: "10px", color: mutedColor }}>
                    @uteroindonesia
                  </span>
                </div>
              </div>
              <span style={{ color: "#c91a1f", fontSize: "11px", fontWeight: "bold" }}>&rarr;</span>
            </a>
          </div>

          {/* Footer Bar: Email */}
          <div
            style={{
              marginTop: "6px",
              paddingTop: "8px",
              borderTop: isDarkText ? "1px solid rgba(10, 10, 10, 0.06)" : "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "4px",
              paddingRight: "4px",
            }}
          >
            <a
              href="mailto:marketingutero@gmail.com"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: textColor,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                opacity: 0.85,
                transition: "opacity 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#c91a1f";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = textColor;
                e.currentTarget.style.opacity = "0.85";
              }}
            >
              <span style={{ color: "#c91a1f" }}>✉</span>
              <span>marketingutero@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes contactLauncherFade {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

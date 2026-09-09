"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ContactLauncher from "./ContactLauncher";

interface MenuNavItem {
  number: string;
  label: string;
  subtitle: string;
  href: string;
  previewImage: string;
}

const menuNavLinks: MenuNavItem[] = [
  {
    number: "01",
    label: "WORK",
    subtitle: "Selected Case Studies & Archive",
    href: "/work",
    previewImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "02",
    label: "STUDIO",
    subtitle: "Philosophy, 25+ Years & Culture",
    href: "/studio",
    previewImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "03",
    label: "SERVICES",
    subtitle: "Brand, Space, Digital & Capabilities",
    href: "/services",
    previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "04",
    label: "INSIGHTS",
    subtitle: "Publications, Media & Case Notes",
    href: "/insights",
    previewImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "05",
    label: "CONTACT",
    subtitle: "Direct Channels & Studio Base",
    href: "/contact",
    previewImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<string>(menuNavLinks[0].previewImage);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [localTime, setLocalTime] = useState<string>("");
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");

  const lastScrollY = useRef(0);

  // Live Malang Time (UTC+7 / WIB)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setLocalTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Smart scroll direction & adaptive contrast
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setScrollDirection("down");
        if (contactOpen) setContactOpen(false);
      } else {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;

      // Detect background section color under header for adaptive text theme
      const headerCenter = 35;
      const elementsUnder = document.elementsFromPoint(window.innerWidth / 2, headerCenter);
      const section = elementsUnder.find((el) => el.tagName === "SECTION" || el.id);

      if (section) {
        const id = section.id;
        if (id === "about" || id === "capabilities") {
          setNavTheme("dark");
        } else {
          setNavTheme("light");
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [contactOpen]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isDarkText = !scrolled ? navTheme === "dark" : false;
  const textColor = isDarkText ? "#0a0a0a" : "#ffffff";
  const mutedTextColor = isDarkText ? "rgba(10, 10, 10, 0.6)" : "rgba(255, 255, 255, 0.7)";
  const pillBg = scrolled
    ? "rgba(13, 13, 13, 0.85)"
    : isDarkText
    ? "rgba(245, 239, 230, 0.75)"
    : "rgba(201, 26, 31, 0.4)";
  const borderColor = scrolled
    ? "rgba(255, 255, 255, 0.12)"
    : isDarkText
    ? "rgba(10, 10, 10, 0.12)"
    : "rgba(255, 255, 255, 0.2)";

  return (
    <>
      {/* ══════════════════════════════════════════════
          SMART 2026 FLOATING / ADAPTIVE NAVIGATION
      ══════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2.5rem)",
          transform:
            scrollDirection === "down" && scrolled && !menuOpen && !contactOpen
              ? "translateY(-100%)"
              : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "auto",
          }}
        >
          {/* LEFT: Wordmark + Live Studio Status Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: pillBg,
                backdropFilter: "blur(16px)",
                border: `1px solid ${borderColor}`,
                boxShadow: scrolled ? "0 8px 32px rgba(0, 0, 0, 0.2)" : "none",
                transition: "background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: scrolled ? "#ffffff" : textColor,
                  transition: "color 0.3s ease",
                }}
              >
                UTERO.ID
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#c91a1f",
                }}
              />
            </Link>

            {/* Desktop City & Live Time Pill */}
            <div
              className="hidden lg:flex"
              style={{
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 14px",
                borderRadius: "9999px",
                backgroundColor: pillBg,
                backdropFilter: "blur(16px)",
                border: `1px solid ${borderColor}`,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: scrolled ? "rgba(255, 255, 255, 0.8)" : mutedTextColor,
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ color: "#c91a1f" }}>●</span>
              <span>MALANG, ID</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>
                {localTime || "13:00:00"} WIB
              </span>
            </div>
          </div>

          {/* RIGHT: Animated Contact Launcher Trigger + Menu Trigger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Contact Launcher Popover Button */}
            <button
              onClick={() => setContactOpen(!contactOpen)}
              aria-expanded={contactOpen}
              aria-label="Toggle contact channels"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: contactOpen
                  ? "#c91a1f"
                  : pillBg,
                backdropFilter: "blur(16px)",
                border: contactOpen
                  ? "1px solid #c91a1f"
                  : `1px solid ${borderColor}`,
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: contactOpen ? "#ffffff" : scrolled ? "#ffffff" : textColor,
                boxShadow: contactOpen ? "0 8px 24px rgba(201, 26, 31, 0.35)" : "none",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                if (!contactOpen) {
                  e.currentTarget.style.backgroundColor = isDarkText ? "rgba(10, 10, 10, 0.08)" : "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!contactOpen) {
                  e.currentTarget.style.backgroundColor = pillBg;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span>{contactOpen ? "CLOSE" : "CONTACT"}</span>
              <span
                style={{
                  color: contactOpen ? "#ffffff" : "#25D366",
                  fontSize: "10px",
                  display: "inline-block",
                  transform: contactOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              >
                {contactOpen ? "✕" : "●"}
              </span>
            </button>

            {/* Menu Trigger Button */}
            <button
              onClick={() => {
                setMenuOpen(true);
                setContactOpen(false);
              }}
              aria-label="Open studio menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: scrolled ? "#c91a1f" : isDarkText ? "#0a0a0a" : "#ffffff",
                color: scrolled ? "#ffffff" : isDarkText ? "#ffffff" : "#0a0a0a",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 800,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                MENU
              </span>

              {/* Minimal Hamburger lines */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3.5px",
                  width: "16px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "16px",
                    height: "2px",
                    backgroundColor: "currentColor",
                    borderRadius: "1px",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "10px",
                    height: "2px",
                    backgroundColor: "currentColor",
                    borderRadius: "1px",
                    alignSelf: "flex-end",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          CONTACT LAUNCHER POPOVER DROPDOWN
      ══════════════════════════════════════════════ */}
      <ContactLauncher
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        isDarkText={isDarkText}
      />

      {/* ══════════════════════════════════════════════
          IMMERSIVE 2026 EDITORIAL MENU OVERLAY
      ══════════════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          backgroundColor: "#c91a1f",
          color: "#ffffff",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Dynamic Interactive Visual Preview Backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            pointerEvents: "none",
            overflow: "hidden",
            transition: "opacity 0.5s ease",
          }}
        >
          {activePreview && (
            <Image
              src={activePreview}
              alt="Utero Studio Preview"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
                filter: "grayscale(100%) contrast(150%)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: hoveredIndex !== null ? "scale(1.05)" : "scale(1)",
              }}
            />
          )}
        </div>

        {/* Abstract Geometric Circles */}
        <div
          style={{
            position: "absolute",
            width: "clamp(500px, 60vw, 900px)",
            height: "clamp(500px, 60vw, 900px)",
            borderRadius: "50%",
            backgroundColor: "rgba(120, 10, 15, 0.45)",
            top: "-15%",
            right: "-10%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "clamp(350px, 40vw, 650px)",
            height: "clamp(350px, 40vw, 650px)",
            borderRadius: "50%",
            backgroundColor: "rgba(90, 6, 10, 0.35)",
            bottom: "-20%",
            left: "-5%",
            pointerEvents: "none",
          }}
        />

        {/* Top Bar inside Overlay */}
        <div
          style={{
            padding: "clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 4vw, 3.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              textDecoration: "none",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "14px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              UTERO.ID
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                opacity: 0.6,
              }}
            >
              / MALANG, INDONESIA
            </span>
          </Link>

          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close studio menu"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "9999px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              color: "#ffffff",
              backdropFilter: "blur(10px)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#c91a1f";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              CLOSE
            </span>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>✕</span>
          </button>
        </div>

        {/* Main Overlay Content: 2-Column Split */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(2rem, 5vw, 6rem)",
            padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3.5rem)",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
            overflowY: "auto",
          }}
        >
          {/* Left Column: Giant Interactive Navigation Links */}
          <nav aria-label="Main studio navigation">
            <div style={{ display: "flex", flexDirection: "column" }}>
              {menuNavLinks.map((link, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => {
                      setHoveredIndex(i);
                      setActivePreview(link.previewImage);
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      padding: "clamp(0.6rem, 1.4vw, 1rem) 0",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                      textDecoration: "none",
                      color: "#ffffff",
                      transition: "transform 0.25s ease, opacity 0.2s ease",
                      transform: isHovered ? "translateX(12px)" : "translateX(0)",
                      opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 2.5vw, 2rem)" }}>
                      <span
                        style={{
                          fontSize: "clamp(11px, 1.2vw, 14px)",
                          fontWeight: 700,
                          opacity: 0.6,
                          fontFamily: "monospace",
                        }}
                      >
                        {link.number}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: "clamp(2.2rem, 5.5vw, 4.75rem)",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}
                      >
                        {link.label}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.6)",
                        display: "none",
                      }}
                      className="hidden sm:inline-block"
                    >
                      {link.subtitle}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Column: Studio Contact & Live Office Information */}
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(20px)",
              padding: "clamp(1.75rem, 3.5vw, 3rem)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                STUDIO LOCATION
              </span>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                Malang, East Java, Indonesia
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "0.25rem 0 0",
                }}
              >
                Local Time: {localTime || "13:00:00"} WIB (UTC+7)
              </p>
            </div>

            {/* Direct WhatsApp Quick Chat Buttons */}
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  display: "block",
                  marginBottom: "0.75rem",
                }}
              >
                DIRECT WHATSAPP
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a
                  href="https://wa.me/6281999900900"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "10px 14px",
                    borderRadius: "2px",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  <span>081 999 900 900 (Wahyu)</span>
                  <span style={{ color: "#25D366" }}>&rarr;</span>
                </a>

                <a
                  href="https://wa.me/62817388616"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "10px 14px",
                    borderRadius: "2px",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  <span>081 7388 616 (Utero)</span>
                  <span style={{ color: "#25D366" }}>&rarr;</span>
                </a>
              </div>
            </div>

            {/* Email & Socials */}
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                EMAIL &amp; SOCIAL
              </span>
              <a
                href="mailto:marketingutero@gmail.com"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  textDecoration: "none",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                marketingutero@gmail.com
              </a>

              <div style={{ display: "flex", gap: "1rem" }}>
                <a
                  href="https://www.instagram.com/uteroindonesia/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                  }}
                >
                  Instagram &nearr;
                </a>
                <a
                  href="https://www.facebook.com/uteroadvertisingindonesia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                  }}
                >
                  Facebook &nearr;
                </a>
                <a
                  href="https://www.youtube.com/@uteroindonesia"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                  }}
                >
                  YouTube &nearr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar inside Overlay */}
        <div
          style={{
            padding: "clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 4vw, 3.5rem)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            DESIGN AS A SOLUTION.
          </span>

          <span
            style={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            &copy; 1998 — {new Date().getFullYear()} UTERO INDONESIA
          </span>
        </div>
      </div>
    </>
  );
}

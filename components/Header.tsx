"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, FormEvent } from "react";
import { usePathname } from "next/navigation";
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
    previewImage:
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "02",
    label: "STUDIO",
    subtitle: "Philosophy, 25+ Years & Culture",
    href: "/studio",
    previewImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "03",
    label: "SERVICES",
    subtitle: "Brand, Space, Digital & Capabilities",
    href: "/services",
    previewImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "04",
    label: "INSIGHTS",
    subtitle: "Publications, Media & Case Notes",
    href: "/insights",
    previewImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "05",
    label: "CONTACT",
    subtitle: "Direct Channels & Studio Base",
    href: "/contact",
    previewImage:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
  },
];

const topNavItems = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "STUDIO", href: "/studio" },
  { label: "INSIGHTS", href: "/insights" },
];

const inquiryDisciplines = [
  "Brand Identity",
  "Product & Packaging",
  "Promotions & Campaigns",
  "Space & Wayfinding",
  "Digital & Web",
  "Indoor Commercial",
  "Outdoor Large-Scale",
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<string>(
    menuNavLinks[0].previewImage
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredTopNav, setHoveredTopNav] = useState<string | null>(null);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [localTime, setLocalTime] = useState<string>("");
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");

  // Project Brief Inquiry Form States
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBrief, setFormBrief] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

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
      const elementsUnder = document.elementsFromPoint(
        window.innerWidth / 2,
        headerCenter
      );
      const section = elementsUnder.find((el) => el.tagName === "SECTION" || el.id);

      if (section) {
        const id = section.id;
        if (id === "about" || id === "capabilities" || id === "insights") {
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

  const pathname = usePathname();
  const isWorksPage = pathname?.startsWith("/work");

  const isDarkText = !scrolled ? isWorksPage || navTheme === "dark" : false;
  const textColor = isDarkText ? "#0a0a0a" : "#ffffff";
  const mutedTextColor = isDarkText
    ? "rgba(10, 10, 10, 0.7)"
    : "rgba(255, 255, 255, 0.8)";
  const pillBg = scrolled
    ? "rgba(13, 13, 13, 0.88)"
    : isWorksPage
    ? "rgba(255, 255, 255, 0.9)"
    : isDarkText
    ? "rgba(250, 248, 245, 0.8)"
    : "rgba(18, 14, 14, 0.55)";
  const borderColor = scrolled
    ? "rgba(255, 255, 255, 0.14)"
    : isDarkText
    ? "rgba(10, 10, 10, 0.12)"
    : "rgba(255, 255, 255, 0.2)";

  // Toggle Discipline Selection
  const toggleDiscipline = (disc: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  // Handle Project Inquiry Submit
  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formBrief.trim()) {
      setFormError("Please fill in all required fields (*)");
      return;
    }
    setFormError("");
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════
          UNIFIED 2026 FLOATING TOP NAVIGATION
      ══════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "clamp(0.85rem, 1.8vw, 1.4rem) clamp(1rem, 3.5vw, 3rem)",
          transform:
            scrollDirection === "down" && scrolled && !menuOpen && !contactOpen
              ? "translateY(-100%)"
              : "translateY(0)",
          transition:
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease",
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
            gap: "1rem",
            pointerEvents: "auto",
          }}
        >
          {/* LEFT: Wordmark + Live Studio Status Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: pillBg,
                backdropFilter: "blur(18px)",
                border: `1px solid ${borderColor}`,
                boxShadow: scrolled
                  ? "0 8px 32px rgba(0, 0, 0, 0.25)"
                  : "0 4px 16px rgba(0, 0, 0, 0.08)",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1.5px) scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "13px",
                  letterSpacing: "0.16em",
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
                  backgroundColor: "#e31e24",
                }}
              />
            </Link>

            {/* Desktop City & Live Time Pill */}
            <div
              className="hidden xl:flex"
              style={{
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 14px",
                borderRadius: "9999px",
                backgroundColor: pillBg,
                backdropFilter: "blur(18px)",
                border: `1px solid ${borderColor}`,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: scrolled ? "rgba(255, 255, 255, 0.8)" : mutedTextColor,
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ color: "#e31e24" }}>●</span>
              <span>MALANG, ID</span>
              <span style={{ opacity: 0.35 }}>/</span>
              <span style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>
                {localTime || "13:00:00"} WIB
              </span>
            </div>
          </div>

          {/* RIGHT: ALL NAVIGATION ITEMS PLACED TOGETHER (WORK, SERVICES, STUDIO, INSIGHTS, CONTACT, MENU) */}
          <nav
            aria-label="Top primary navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.4rem, 1vw, 0.75rem)",
            }}
          >
            {/* Desktop Links: WORK, SERVICES, STUDIO, INSIGHTS */}
            <div
              className="hidden md:flex"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(0.2rem, 0.6vw, 0.5rem)",
                padding: "4px 8px",
                borderRadius: "9999px",
                backgroundColor: pillBg,
                backdropFilter: "blur(18px)",
                border: `1px solid ${borderColor}`,
                boxShadow: scrolled
                  ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                  : "0 4px 16px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
              }}
            >
              {topNavItems.map((item) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredTopNav === item.label;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setHoveredTopNav(item.label)}
                    onMouseLeave={() => setHoveredTopNav(null)}
                    style={{
                      position: "relative",
                      padding: "6px 14px",
                      textDecoration: "none",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: isHovered
                        ? "#e31e24"
                        : isActive
                        ? "#e31e24"
                        : scrolled
                        ? "rgba(255, 255, 255, 0.85)"
                        : textColor,
                      transform: isHovered ? "translateY(-1.5px)" : "translateY(0)",
                      transition:
                        "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span>{item.label}</span>

                    {/* Subtle Intentional Animated Underline Reveal */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        left: "14px",
                        right: "14px",
                        height: "2px",
                        backgroundColor: "#e31e24",
                        borderRadius: "1px",
                        transform: isHovered || isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition:
                          "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* CONTACT Button */}
            <button
              onClick={() => setContactOpen(!contactOpen)}
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={() => setIsContactHovered(false)}
              aria-expanded={contactOpen}
              aria-label="Toggle contact channels"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: contactOpen
                  ? "#e31e24"
                  : isContactHovered
                  ? scrolled
                    ? "rgba(227, 30, 36, 0.2)"
                    : isDarkText
                    ? "rgba(10, 10, 10, 0.08)"
                    : "rgba(255, 255, 255, 0.25)"
                  : pillBg,
                backdropFilter: "blur(18px)",
                border: contactOpen
                  ? "1px solid #e31e24"
                  : isContactHovered
                  ? "1px solid #e31e24"
                  : `1px solid ${borderColor}`,
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: contactOpen
                  ? "#ffffff"
                  : isContactHovered
                  ? "#e31e24"
                  : scrolled
                  ? "#ffffff"
                  : textColor,
                boxShadow: contactOpen
                  ? "0 8px 24px rgba(227, 30, 36, 0.35)"
                  : isContactHovered
                  ? "0 6px 20px rgba(0, 0, 0, 0.15)"
                  : "none",
                transform: isContactHovered
                  ? "translateY(-1.5px) scale(1.02)"
                  : "translateY(0) scale(1)",
                transition:
                  "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease, box-shadow 0.25s ease",
              }}
            >
              <span>{contactOpen ? "CLOSE" : "CONTACT"}</span>
              <span
                style={{
                  color: contactOpen ? "#ffffff" : "#25D366",
                  fontSize: "9px",
                  display: "inline-block",
                  transform: contactOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {contactOpen ? "✕" : "●"}
              </span>
            </button>

            {/* MENU Button */}
            <button
              onClick={() => {
                setMenuOpen(true);
                setContactOpen(false);
              }}
              onMouseEnter={() => setIsMenuHovered(true)}
              onMouseLeave={() => setIsMenuHovered(false)}
              aria-label="Open studio menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: isMenuHovered
                  ? "#e31e24"
                  : scrolled
                  ? "#e31e24"
                  : isDarkText
                  ? "#0a0a0a"
                  : "#ffffff",
                color: isMenuHovered
                  ? "#ffffff"
                  : scrolled
                  ? "#ffffff"
                  : isDarkText
                  ? "#ffffff"
                  : "#0a0a0a",
                border: "none",
                cursor: "pointer",
                boxShadow: isMenuHovered
                  ? "0 8px 24px rgba(227, 30, 36, 0.4)"
                  : "0 6px 20px rgba(0, 0, 0, 0.15)",
                transform: isMenuHovered
                  ? "translateY(-1.5px) scale(1.03)"
                  : "translateY(0) scale(1)",
                transition:
                  "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
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

              {/* Minimal Hamburger lines that animate on hover */}
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
                    width: isMenuHovered ? "16px" : "16px",
                    height: "2px",
                    backgroundColor: "currentColor",
                    borderRadius: "1px",
                    transition: "width 0.25s ease",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: isMenuHovered ? "16px" : "10px",
                    height: "2px",
                    backgroundColor: "currentColor",
                    borderRadius: "1px",
                    alignSelf: "flex-end",
                    transition: "width 0.25s ease",
                  }}
                />
              </div>
            </button>
          </nav>
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
          IMMERSIVE EDITORIAL MENU OVERLAY
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
          transition:
            "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s",
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
            opacity: 0.12,
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
                filter: "grayscale(100%) contrast(140%)",
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
            backgroundColor: "rgba(120, 10, 15, 0.4)",
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
            padding: "clamp(0.6rem, 1.5vw, 1rem) clamp(1.25rem, 4vw, 3.5rem)",
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
              transition:
                "transform 0.2s ease, background-color 0.2s ease, color 0.2s ease",
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
            gap: "clamp(1.2rem, 2.5vw, 3rem)",
            padding: "clamp(0.8rem, 2vw, 1.5rem) clamp(1.25rem, 4vw, 3.5rem)",
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
                      padding: "clamp(0.35rem, 0.8vw, 0.6rem) 0",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                      textDecoration: "none",
                      color: "#ffffff",
                      transition: "transform 0.25s ease, opacity 0.2s ease",
                      transform: isHovered ? "translateX(12px)" : "translateX(0)",
                      opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "clamp(0.6rem, 1.5vw, 1.2rem)",
                      }}
                    >
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
                          fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
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
                        fontSize: "clamp(0.72rem, 0.95vw, 0.82rem)",
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

          {/* Right Column: BESPOKE PROJECT BRIEF INQUIRY FORM */}
          <div
            style={{
              backgroundColor: "rgba(10, 10, 10, 0.45)",
              backdropFilter: "blur(24px)",
              padding: "clamp(0.8rem, 1.5vw, 1.2rem)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "4px",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            {/* Header / Title */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.4rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  PROJECT BRIEF INQUIRY
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                TELL US ABOUT YOUR VISION
              </h3>
            </div>

            {formSubmitted ? (
              /* Success Confirmation State */
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    color: "#c91a1f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      margin: "0 0 0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    BRIEF RECEIVED
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: 1.5,
                      margin: 0,
                      maxWidth: "380px",
                    }}
                  >
                    Thank you, <strong>{formName}</strong>. Our creative team will
                    review your project requirements and get in touch within 24
                    hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormName("");
                    setFormCompany("");
                    setFormEmail("");
                    setFormPhone("");
                    setFormBrief("");
                    setSelectedDisciplines([]);
                  }}
                  style={{
                    marginTop: "0.5rem",
                    padding: "8px 18px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "2px",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  SUBMIT ANOTHER BRIEF
                </button>
              </div>
            ) : (
              /* The Inquiry Form */
              <form onSubmit={handleInquirySubmit}>
                {/* Section: Interested Disciplines */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255, 255, 255, 0.75)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    INTERESTED DISCIPLINES
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                    }}
                  >
                    {inquiryDisciplines.map((disc) => {
                      const isSelected = selectedDisciplines.includes(disc);
                      return (
                        <button
                          key={disc}
                          type="button"
                          onClick={() => toggleDiscipline(disc)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "9999px",
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            cursor: "pointer",
                            backgroundColor: isSelected
                              ? "#ffffff"
                              : "rgba(255, 255, 255, 0.08)",
                            color: isSelected ? "#0d0d0d" : "#ffffff",
                            border: isSelected
                              ? "1px solid #ffffff"
                              : "1px solid rgba(255, 255, 255, 0.18)",
                            transition:
                              "transform 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                            transform: isSelected ? "scale(1.02)" : "scale(1)",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor =
                                "rgba(255, 255, 255, 0.18)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor =
                                "rgba(255, 255, 255, 0.08)";
                            }
                          }}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {disc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Inputs: Name & Company */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <label
                      htmlFor="menu-inquiry-name"
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      YOUR NAME *
                    </label>
                    <input
                      id="menu-inquiry-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderRadius: "2px",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.16)";
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="menu-inquiry-company"
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      COMPANY / BRAND
                    </label>
                    <input
                      id="menu-inquiry-company"
                      type="text"
                      placeholder="e.g. Studio Vertex"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderRadius: "2px",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.16)";
                      }}
                    />
                  </div>
                </div>

                {/* Grid Inputs: Email & WhatsApp */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <label
                      htmlFor="menu-inquiry-email"
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="menu-inquiry-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderRadius: "2px",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.16)";
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="menu-inquiry-phone"
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      WHATSAPP / PHONE
                    </label>
                    <input
                      id="menu-inquiry-phone"
                      type="tel"
                      placeholder="+62 81..."
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderRadius: "2px",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.16)";
                      }}
                    />
                  </div>
                </div>

                {/* Brief & Scope Overview Textarea */}
                <div style={{ marginBottom: "1.2rem" }}>
                  <label
                    htmlFor="menu-inquiry-brief"
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    PROJECT BRIEF &amp; SCOPE OVERVIEW *
                  </label>
                  <textarea
                    id="menu-inquiry-brief"
                    required
                    rows={3}
                    placeholder="Briefly describe your objectives, target audience, timeline, or key challenges..."
                    value={formBrief}
                    onChange={(e) => setFormBrief(e.target.value)}
                    style={{
                      width: "100%",
                        padding: "6px 10px",
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderRadius: "2px",
                        color: "#ffffff",
                        fontSize: "0.72rem",
                      outline: "none",
                      resize: "vertical",
                      minHeight: "70px",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.16)";
                    }}
                  />
                </div>

                {formError && (
                  <p
                    style={{
                      color: "#ffcdd2",
                      fontSize: "0.75rem",
                      margin: "0 0 0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {formError}
                  </p>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "8px 16px",
                    backgroundColor: "#ffffff",
                    color: "#c91a1f",
                    border: "none",
                    borderRadius: "2px",
                    cursor: formSubmitting ? "wait" : "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                    transition:
                      "transform 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1.5px)";
                    e.currentTarget.style.backgroundColor = "#0d0d0d";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.color = "#c91a1f";
                  }}
                >
                  <span>
                    {formSubmitting
                      ? "TRANSMITTING BRIEF..."
                      : "SUBMIT PROJECT BRIEF"}
                  </span>
                  <span>&rarr;</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar inside Overlay */}
        <div
          style={{
            padding: "clamp(0.5rem, 1.2vw, 0.85rem) clamp(1.25rem, 4vw, 3.5rem)",
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

"use client";

import Link from "next/link";

const mainNavLinks = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "STUDIO", href: "/studio" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "CONTACT", href: "/contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/uteroindonesia/?hl=en",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/uteroadvertisingindonesia/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@uteroindonesia",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#070707",
        color: "#ffffff",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "clamp(3.5rem, 7vw, 6rem) 0 clamp(2rem, 4vw, 3rem)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        {/* ─── MAIN FOOTER GRID ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 4.5rem)",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          {/* Column 1: Brand & Positioning */}
          <div style={{ maxWidth: "340px" }}>
            <Link
              href="/"
              data-cursor="HOME"
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "1.4rem",
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "0.5rem",
              }}
            >
              UTERO.ID
            </Link>

            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c91a1f",
                margin: "0 0 1.25rem",
              }}
            >
              DESIGN AS A SOLUTION.
            </p>

            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.65)",
                margin: 0,
              }}
            >
              A premier Indonesian brand consultant and creative design agency. Transforming vision into reality with strategic craft since 1998.
            </p>
          </div>

          {/* Column 2: Quick Studio Navigation */}
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.4)",
                display: "block",
                marginBottom: "1.25rem",
              }}
            >
              NAVIGATION
            </span>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {mainNavLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    data-cursor="OPEN &rarr;"
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      textDecoration: "none",
                      transition: "color 0.2s ease, transform 0.2s ease",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#c91a1f";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct WhatsApp Connect */}
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.4)",
                display: "block",
                marginBottom: "1.25rem",
              }}
            >
              WHATSAPP INQUIRIES
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <a
                href="https://wa.me/6281999900900"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="CHAT"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "10px 14px",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  transition: "background-color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(201, 26, 31, 0.2)";
                  e.currentTarget.style.borderColor = "#c91a1f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <span>081 999 900 900 — Wahyu</span>
                <span style={{ color: "#25D366" }}>&rarr;</span>
              </a>

              <a
                href="https://wa.me/62817388616"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="CHAT"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "10px 14px",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  transition: "background-color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(201, 26, 31, 0.2)";
                  e.currentTarget.style.borderColor = "#c91a1f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <span>081 7388 616 — Utero</span>
                <span style={{ color: "#25D366" }}>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Column 4: Email, Social & Studio Base */}
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.4)",
                display: "block",
                marginBottom: "1.25rem",
              }}
            >
              EMAIL &amp; SOCIAL
            </span>

            <a
              href="mailto:marketingutero@gmail.com"
              data-cursor="EMAIL"
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
                paddingBottom: "2px",
                display: "inline-block",
                marginBottom: "1.5rem",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c91a1f";
                e.currentTarget.style.color = "#c91a1f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              marketingutero@gmail.com
            </a>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="OPEN &nearr;"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.75)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#c91a1f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
                  }}
                >
                  <span>{social.label}</span>
                  <span style={{ fontSize: "11px" }}>&nearr;</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM COPYRIGHT BAR ─── */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "clamp(1.5rem, 3vw, 2rem)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)" }}>
            &copy; 1998 — {currentYear} UTERO.ID. All rights reserved.
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            MALANG, INDONESIA — CREATIVE DESIGN STUDIO
          </div>
        </div>
      </div>
    </footer>
  );
}

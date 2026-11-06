"use client";

import { useState } from "react";
import Link from "next/link";
import { submitProjectInquiry } from "@/lib/submitProjectInquiry";
import { useTranslatedInquiryLabels } from "@/lib/useTranslatedServices";
import { useTranslations } from "@/lib/useTranslations";
import { contactChannels, studioLocation } from "@/lib/contactData";

export default function ContactContent() {
  const t = useTranslations();
  const serviceOptions = useTranslatedInquiryLabels();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBrief, setFormBrief] = useState("");

  const toggleService = (serv: string) => {
    setSelectedServices((prev) =>
      prev.includes(serv) ? prev.filter((s) => s !== serv) : [...prev, serv]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formBrief.trim()) {
      setError(t.contact.errorRequired);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitProjectInquiry({
        name: formName,
        email: formEmail,
        company: formCompany,
        phone: formPhone,
        disciplines: selectedServices,
        brief: formBrief,
        source: "contact-page",
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Project inquiry error:", err);
      setError(t.contact.errorTryAgain);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        .contact-channel-row:hover {
          border-color: #c91a1f !important;
          background-color: rgba(201, 26, 31, 0.02) !important;
        }
        .contact-channel-row:hover .contact-arrow {
          color: #c91a1f !important;
          transform: translateX(4px);
        }
        .contact-submit:hover {
          background-color: #0a0a0a !important;
        }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(6rem, 10vw, 9rem)",
          paddingBottom: "clamp(4rem, 8vw, 8rem)",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          color: "#0a0a0a",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          }}
        >
          {/* ── Header ───────────────────────────────────────────── */}
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
              marginBottom: "clamp(3.5rem, 6vw, 6rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#c91a1f",
                  borderRadius: "50%",
                  animation: "pulse-red 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                {t.contact.sectionLabel}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "1.5rem",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
                    fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 0.92,
                    margin: 0,
                  }}
                >
                  {t.contact.heading}
                </h1>
                <p
                  style={{
                    marginTop: "1.25rem",
                    fontSize: "clamp(0.95rem, 1.3vw, 1.25rem)",
                    color: "#555555",
                    letterSpacing: "0.01em",
                    lineHeight: 1.6,
                    maxWidth: "680px",
                  }}
                >
                  {t.contact.intro}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "rgba(201, 26, 31, 0.15)",
                    lineHeight: 1,
                  }}
                >
                  {studioLocation.city}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10, 10, 10, 0.35)",
                  }}
                >
                  {t.contact.timezone}
                </span>
              </div>
            </div>
          </div>

          {/* ── Contact Channels & Form Grid ────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "clamp(2rem, 5vw, 5rem)",
              marginBottom: "clamp(4rem, 7vw, 7rem)",
            }}
          >
            {/* Left Column: Contact Channels */}
            <div style={{ gridColumn: "span 12" }} className="lg:!col-span-5">
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                    marginBottom: "0.35rem",
                  }}
                >
                  {t.contact.channelsLabel}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {contactChannels.map((channel, idx) => (
                  <Link
                    key={channel.id}
                    href={channel.href}
                    target={channel.type === "email" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    data-cursor={channel.type === "email" ? "EMAIL" : "OPEN"}
                    className="contact-channel-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "clamp(1.1rem, 2vw, 1.6rem) 0",
                      borderBottom: "1px solid rgba(10, 10, 10, 0.1)",
                      backgroundColor: "transparent",
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "padding-left 0.25s ease, border-color 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "1.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "rgba(10, 10, 10, 0.4)",
                          fontFamily: "monospace",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(10, 10, 10, 0.5)",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {channel.label}
                        </span>
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color: "#0a0a0a",
                          }}
                        >
                          {channel.value}
                        </span>
                      </div>
                    </div>

                    <span
                      className="contact-arrow"
                      style={{
                        fontSize: "1.25rem",
                        color: "rgba(10, 10, 10, 0.3)",
                        transition: "transform 0.2s ease, color 0.2s ease",
                      }}
                    >
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>

              {/* Location */}
              <div
                style={{
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  marginTop: "1.5rem",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10, 10, 10, 0.4)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {t.contact.locationLabel}
                </span>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "#333333",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {studioLocation.address}
                </p>
                <a
                  href={studioLocation.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                    textDecoration: "none",
                  }}
                >
                  {t.contact.openMaps}
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Editorial Inquiry Form */}
            <div style={{ gridColumn: "span 12" }} className="lg:!col-span-7">
              <div
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  padding: "clamp(1rem, 2vw, 1.5rem)",
                  backgroundColor: "#ffffff",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t.contact.projectBrief}
                </span>

                <h2
                  style={{
                    fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
                    fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 1.2,
                    margin: "0 0 1rem",
                  }}
                >
                  {t.contact.tellUsVision}
                </h2>

                {submitted ? (
                  <div
                    style={{
                      padding: "2.5rem",
                      backgroundColor: "rgba(201, 26, 31, 0.04)",
                      border: "1px solid rgba(201, 26, 31, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        color: "#c91a1f",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {t.contact.inquiryReceived}
                    </span>
                    <p style={{ fontSize: "0.95rem", color: "#555555", margin: "0 0 1.5rem" }}>
                      {t.contact.thankYou}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormName("");
                        setFormCompany("");
                        setFormEmail("");
                        setFormPhone("");
                        setFormBrief("");
                        setSelectedServices([]);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid #c91a1f",
                        color: "#c91a1f",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      {t.contact.submitAnother}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Services Multi-Select Pills */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.65rem",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#555555",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {t.contact.interestedDisciplines}
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {serviceOptions.map((opt) => {
                          const isSelected = selectedServices.includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => toggleService(opt)}
                              style={{
                                padding: "0.35rem 0.7rem",
                                border: isSelected ? "1px solid #c91a1f" : "1px solid rgba(0, 0, 0, 0.12)",
                                backgroundColor: isSelected ? "#c91a1f" : "transparent",
                                color: isSelected ? "#ffffff" : "#0a0a0a",
                                fontSize: "0.65rem",
                                fontWeight: 500,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Brand */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                      <div>
                        <label
                          htmlFor="clientName"
                          style={{
                            display: "block",
                            fontSize: "0.6rem",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(10, 10, 10, 0.5)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {t.contact.name}
                        </label>
                        <input
                          id="clientName"
                          required
                          type="text"
                          placeholder="e.g. Budi Santoso"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            outline: "none",
                            fontSize: "16px",
                            color: "#0a0a0a",
                            backgroundColor: "#fafafa",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="brandName"
                          style={{
                            display: "block",
                            fontSize: "0.6rem",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(10, 10, 10, 0.5)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {t.contact.company}
                        </label>
                        <input
                          id="brandName"
                          type="text"
                          placeholder="e.g. Amarta Wisesa"
                          value={formCompany}
                          onChange={(e) => setFormCompany(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            outline: "none",
                            fontSize: "16px",
                            color: "#0a0a0a",
                            backgroundColor: "#fafafa",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                      <div>
                        <label
                          htmlFor="clientEmail"
                          style={{
                            display: "block",
                            fontSize: "0.6rem",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(10, 10, 10, 0.5)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {t.contact.email}
                        </label>
                        <input
                          id="clientEmail"
                          required
                          type="email"
                          placeholder="name@company.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            outline: "none",
                            fontSize: "16px",
                            color: "#0a0a0a",
                            backgroundColor: "#fafafa",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="clientPhone"
                          style={{
                            display: "block",
                            fontSize: "0.6rem",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(10, 10, 10, 0.5)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {t.contact.phone}
                        </label>
                        <input
                          id="clientPhone"
                          type="tel"
                          placeholder="+62 81..."
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            outline: "none",
                            fontSize: "16px",
                            color: "#0a0a0a",
                            backgroundColor: "#fafafa",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    </div>

                    {/* Message / Brief */}
                    <div>
                      <label
                        htmlFor="projectBrief"
                        style={{
                          display: "block",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "rgba(10, 10, 10, 0.5)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {t.contact.brief}
                      </label>
                        <textarea
                          id="projectBrief"
                          required
                          rows={3}
                          placeholder="Describe your current brand challenge, key timeline, and deliverables required..."
                          value={formBrief}
                          onChange={(e) => setFormBrief(e.target.value)}
                          style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid rgba(0, 0, 0, 0.12)",
                          outline: "none",
                          fontSize: "16px",
                          color: "#0a0a0a",
                          backgroundColor: "#fafafa",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <p style={{ fontSize: "0.75rem", color: "#c91a1f", margin: 0 }}>
                        {error}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="contact-submit"
                      data-cursor="SUBMIT"
                      disabled={submitting}
                      style={{
                        padding: "0.6rem 1.5rem",
                        backgroundColor: submitting ? "#999" : "#c91a1f",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: submitting ? "not-allowed" : "pointer",
                        alignSelf: "flex-start",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      {submitting ? "Sending..." : t.contact.submit}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Closing Statement Band ───────────────────────────── */}
          <div
            style={{
              backgroundColor: "#c91a1f",
              color: "#ffffff",
              padding: "clamp(2rem, 4vw, 3rem)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
                  fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {t.contact.closing}
              </p>
            </div>

            <Link
              href="/work"
              data-cursor="VIEW WORKS"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 2rem",
                backgroundColor: "#ffffff",
                color: "#c91a1f",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0a0a0a";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#c91a1f";
              }}
            >
              {t.contact.exploreWork}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

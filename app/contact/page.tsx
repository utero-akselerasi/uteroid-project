"use client";

import { useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";

const SERVICE_OPTIONS = [
  "Brand Identity",
  "Product & Packaging",
  "Promotion & Campaigns",
  "Space & Wayfinding",
  "Digital & Web",
  "Indoor Commercial",
  "Outdoor Large-Scale",
];

export default function ContactPage() {
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
      setError("Please fill in all required fields (*)");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await emailjs.send(
        "service_2tybtxo",
        "template_s7p9ieh",
        {
          name: formName,
          email: formEmail,
          company: formCompany,
          phone: formPhone,
          disciplines: selectedServices.join(", ") || "Not specified",
          brief: formBrief,
        },
        { publicKey: "4nKYv5KDnicRpdYv4" }
      );
      setSubmitted(true);
    } catch (err: unknown) {
      console.error("EmailJS error:", err);
      setError("Something went wrong. Please try again.");
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
        .contact-channel:hover {
          border-color: #c91a1f !important;
          background-color: rgba(201, 26, 31, 0.02) !important;
        }
        .contact-channel:hover .contact-arrow {
          color: #c91a1f !important;
          transform: translateX(4px);
        }
        .contact-submit:hover {
          background-color: #0a0a0a !important;
        }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(2rem, 4vw, 3rem)",
          paddingBottom: "clamp(2rem, 4vw, 3rem)",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          color: "#0a0a0a",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 clamp(1rem, 2vw, 2rem)",
          }}
        >
          {/* ── Header ───────────────────────────────────────────── */}
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              paddingBottom: "clamp(1rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#c91a1f",
                  borderRadius: "50%",
                  animation: "pulse-red 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#c91a1f",
                }}
              >
                05 / START A CONVERSATION
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
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  Contact
                </h1>
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)",
                    color: "#555555",
                    letterSpacing: "0.01em",
                    lineHeight: 1.5,
                    maxWidth: "540px",
                  }}
                >
                  Have a brand, product, digital platform, or architectural space that needs purpose? We collaborate with bold leaders across Indonesia.
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
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "rgba(0, 0, 0, 0.06)",
                    lineHeight: 1,
                  }}
                >
                  Malang
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
                  UTC+7 · WIB
                </span>
              </div>
            </div>
          </div>

          {/* ── 2-Column Contact Grid ────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            {/* Left Column: Direct Channels & Studio Location */}
            <div style={{ gridColumn: "span 12" }} className="lg:!col-span-5">
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#c91a1f",
                    marginBottom: "0.5rem",
                  }}
                >
                  Direct WhatsApp Channels
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <a
                    href="https://wa.me/6281999900900"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="CHAT"
                    className="contact-channel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.6rem",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#555555",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Client Relations
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "#0a0a0a",
                        }}
                      >
                        081 999 900 900 (Wahyu)
                      </span>
                    </div>
                    <span
                      className="contact-arrow"
                      style={{
                        fontSize: "1.1rem",
                        color: "#25D366",
                        fontWeight: 800,
                        transition: "all 0.2s ease",
                      }}
                    >
                      →
                    </span>
                  </a>

                  <a
                    href="https://wa.me/62817388616"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="CHAT"
                    className="contact-channel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.6rem",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#555555",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Studio Management
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "#0a0a0a",
                        }}
                      >
                        081 7388 616 (Utero)
                      </span>
                    </div>
                    <span
                      className="contact-arrow"
                      style={{
                        fontSize: "1.1rem",
                        color: "#25D366",
                        fontWeight: 800,
                        transition: "all 0.2s ease",
                      }}
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>

              {/* Studio Address & Email */}
              <div
                style={{
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
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
                    Email Communication
                  </span>
                  <a
                    href="mailto:marketingutero@gmail.com"
                    data-cursor="EMAIL"
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "#0a0a0a",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#c91a1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#0a0a0a";
                    }}
                  >
                    marketingutero@gmail.com
                  </a>
                </div>

                <div>
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
                    Malang Headquarters
                  </span>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "#333333",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    Jl. Bantaran 1 No. 25, Purwantoro, Blimbing, Malang, Jawa Timur 65141, Indonesia
                  </p>
                  <a
                    href="https://maps.google.com/?q=Utero+Indonesia+Malang"
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
                    Open in Google Maps →
                  </a>
                </div>

                <div>
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
                    Studio Operating Hours
                  </span>
                  <p style={{ fontSize: "0.875rem", color: "#555555", margin: 0 }}>
                    Monday – Friday: 08:30 – 17:00 WIB<br />
                    Saturday: 08:30 – 14:00 WIB
                  </p>
                </div>
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
                  Project Brief Inquiry
                </span>

                <h2
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    lineHeight: 1.2,
                    margin: "0 0 1rem",
                  }}
                >
                  Tell Us About Your Vision
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
                      Inquiry Received
                    </span>
                    <p style={{ fontSize: "0.95rem", color: "#555555", margin: "0 0 1.5rem" }}>
                      Thank you for contacting Utero Indonesia. Our client strategy director will review your brief and connect within 1 business day.
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
                      Submit Another Inquiry
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
                        Interested Disciplines
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {SERVICE_OPTIONS.map((opt) => {
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
                          Your Name *
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
                            fontSize: "0.8rem",
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
                          Company / Brand
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
                            fontSize: "0.8rem",
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
                          Email Address *
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
                            fontSize: "0.8rem",
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
                          WhatsApp / Phone
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
                            fontSize: "0.8rem",
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
                        Project Brief &amp; Scope Overview *
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
                          fontSize: "0.8rem",
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
                      {submitting ? "Sending..." : "Send Project Inquiry →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

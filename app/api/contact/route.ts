import { Resend } from "resend";

const RECIPIENTS = ["marketingutero@gmail.com", "uterobranding@gmail.com"];

interface InquiryPayload {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  disciplines?: unknown;
  brief?: unknown;
  source?: unknown;
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character
  );
}

function row(label: string, value: string): string {
  return '<tr><td style="padding:8px 12px;font-weight:700;vertical-align:top">' +
    label +
    '</td><td style="padding:8px 12px">' +
    (escapeHtml(value) || "-") +
    "</td></tr>";
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 15000) {
    return Response.json({ error: "Request too large" }, { status: 413 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Resend configuration is missing");
    return Response.json({ error: "Email service is unavailable" }, { status: 503 });
  }

  let payload: InquiryPayload;
  try {
    const raw = await request.text();
    if (raw.length > 15000) {
      return Response.json({ error: "Request too large" }, { status: 413 });
    }
    payload = JSON.parse(raw) as InquiryPayload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Invalid payload");
    }
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = cleanText(payload.name, 120);
  const email = cleanText(payload.email, 254).toLowerCase();
  const company = cleanText(payload.company, 160);
  const phone = cleanText(payload.phone, 50);
  const brief = cleanText(payload.brief, 5000);
  const source = payload.source === "header-launcher" ? "Header launcher" : "Contact page";
  const disciplines = Array.isArray(payload.disciplines)
    ? payload.disciplines
        .slice(0, 20)
        .map((discipline) => cleanText(discipline, 100))
        .filter(Boolean)
    : [];

  if (!name || !email || !brief || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return Response.json({ error: "Required fields are invalid" }, { status: 400 });
  }

  const html =
    '<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">' +
    '<h1 style="font-size:22px">New Project Brief Inquiry</h1>' +
    '<table style="border-collapse:collapse;width:100%;max-width:720px">' +
    row("Name", name) +
    row("Email", email) +
    row("Company", company) +
    row("Phone", phone) +
    row("Disciplines", disciplines.join(", ") || "Not specified") +
    row("Source", source) +
    "</table>" +
    '<h2 style="font-size:17px;margin-top:24px">Project brief</h2>' +
    '<p style="white-space:pre-wrap">' +
    escapeHtml(brief) +
    "</p></div>";

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: RECIPIENTS,
      replyTo: email,
      subject: "Project inquiry from " + name + (company ? " - " + company : ""),
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Unable to send email" }, { status: 502 });
    }
  } catch (error) {
    console.error("Resend request failed:", error);
    return Response.json({ error: "Unable to send email" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

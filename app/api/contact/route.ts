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

function detailRow(label: string, value: string, href = ""): string {
  const safeValue = escapeHtml(value) || "—";
  const content = href
    ? '<a href="' + escapeHtml(href) + '" style="color:#111111;text-decoration:underline;text-decoration-color:#e31e24;text-underline-offset:3px">' + safeValue + "</a>"
    : safeValue;

  return '<tr>' +
    '<td style="width:34%;padding:14px 16px;border-bottom:1px solid #ebe8e2;color:#77736d;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;vertical-align:top">' +
    label +
    '</td><td style="padding:14px 16px;border-bottom:1px solid #ebe8e2;color:#111111;font-size:15px;font-weight:600;line-height:1.5;vertical-align:top">' +
    content +
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

  const replySubject = encodeURIComponent("Re: Project inquiry from " + name);
  const html =
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">New project inquiry from ' + escapeHtml(name) + ".</div>" +
    '<div style="margin:0;padding:0;background:#f2f0eb;font-family:Arial,Helvetica,sans-serif;color:#111111;line-height:1.5">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;background:#f2f0eb"><tr><td align="center" style="padding:32px 14px">' +
    '<table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #dedad2">' +
    '<tr><td style="padding:24px 28px;background:#e31e24;color:#ffffff">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse"><tr>' +
    '<td style="font-size:20px;font-weight:900;letter-spacing:-.04em">UTERO.ID <span style="color:#111111">•</span></td>' +
    '<td align="right" style="font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Project Inquiry</td>' +
    "</tr></table></td></tr>" +
    '<tr><td style="padding:34px 28px 18px">' +
    '<div style="margin:0 0 10px;color:#e31e24;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">New business request</div>' +
    '<h1 style="margin:0;color:#111111;font-size:30px;font-weight:800;letter-spacing:-.04em;line-height:1.15">New Project Brief</h1>' +
    '<p style="margin:12px 0 0;color:#68645e;font-size:15px;line-height:1.6">A new inquiry was submitted by <strong style="color:#111111">' + escapeHtml(name) + "</strong>" +
    (company ? ' from <strong style="color:#111111">' + escapeHtml(company) + "</strong>" : "") +
    ".</p></td></tr>" +
    '<tr><td style="padding:8px 28px 0">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid #dedad2">' +
    detailRow("Name", name) +
    detailRow("Email", email, "mailto:" + email) +
    detailRow("Company", company) +
    detailRow("Phone", phone, phone ? "tel:" + phone.replace(/[^+\d]/g, "") : "") +
    detailRow("Disciplines", disciplines.join(" • ") || "Not specified") +
    detailRow("Source", source) +
    "</table></td></tr>" +
    '<tr><td style="padding:30px 28px 10px">' +
    '<div style="margin:0 0 10px;color:#77736d;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Project brief</div>' +
    '<div style="padding:20px;background:#f7f5f1;border-left:4px solid #e31e24;color:#252321;font-size:15px;line-height:1.75;overflow-wrap:break-word">' +
    escapeHtml(brief).replace(/\r\n|\r|\n/g, "<br>") +
    "</div></td></tr>" +
    '<tr><td style="padding:24px 28px 34px">' +
    '<a href="mailto:' + escapeHtml(email) + "?subject=" + replySubject + '" style="display:inline-block;padding:13px 20px;background:#111111;color:#ffffff;font-size:12px;font-weight:800;letter-spacing:.08em;text-decoration:none;text-transform:uppercase">Reply to inquiry</a>' +
    '<p style="margin:16px 0 0;color:#8a857e;font-size:11px;line-height:1.6">Sent from the Utero.id website. Replying to this email will contact ' + escapeHtml(name) + ".</p>" +
    "</td></tr></table>" +
    '<div style="padding:18px 10px;color:#9a958e;font-size:10px;letter-spacing:.08em;text-align:center;text-transform:uppercase">UTERO.ID — Design as a Solution</div>' +
    "</td></tr></table></div>";

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: RECIPIENTS,
      replyTo: email,
      subject: "Project inquiry from " + name + (company ? " - " + company : ""),
      html,
      text: [
        "New Project Brief",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "-"}`,
        `Phone: ${phone || "-"}`,
        `Disciplines: ${disciplines.join(", ") || "Not specified"}`,
        `Source: ${source}`,
        "",
        "Project brief:",
        brief,
      ].join("\n"),
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

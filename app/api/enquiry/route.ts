import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

// ── Config ───────────────────────────────────────────────────────────
const STUDIO_EMAIL = process.env.NOTIFY_EMAIL || "8347goswamisonu@gmail.com";
const STUDIO_PHONE = process.env.STUDIO_WHATSAPP || "919974057620";

// ── Types ─────────────────────────────────────────────────────────────
interface EnquiryData {
  name: string;
  mobile: string;
  email?: string | null;
  service?: string | null;
  message?: string | null;
}

// ── Build WhatsApp deep-link ──────────────────────────────────────────
function buildWhatsAppUrl(d: EnquiryData): string {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const lines = [
    "🔔 *New Enquiry — Jaimin Modi Photography*",
    "",
    `👤 *Name:*    ${d.name}`,
    `📱 *Mobile:*  ${d.mobile}`,
    d.email   ? `✉️ *Email:*   ${d.email}`   : null,
    d.service ? `📸 *Service:* ${d.service}` : null,
    d.message ? `💬 *Message:* ${d.message}` : null,
    "",
    `🕐 _${now} IST_`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${STUDIO_PHONE}?text=${encodeURIComponent(lines)}`;
}

// ── Send email notification ───────────────────────────────────────────
async function sendEmailNotification(d: EnquiryData): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[enquiry] Gmail env vars not set — skipping email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const whatsappUrl = buildWhatsAppUrl(d);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#E8906D,#c96a3f);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              📸 Jaimin Modi Photography
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:1px;text-transform:uppercase;">
              New Website Enquiry
            </p>
          </td>
        </tr>

        <!-- Alert badge -->
        <tr>
          <td style="padding:24px 32px 0;text-align:center;">
            <span style="display:inline-block;background:#fff5f0;color:#E8906D;border:1px solid rgba(232,144,109,0.3);border-radius:999px;padding:6px 18px;font-size:13px;font-weight:600;">
              🔔 &nbsp;You have a new enquiry
            </span>
          </td>
        </tr>

        <!-- Details card -->
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #efefef;border-radius:10px;overflow:hidden;">
              ${row("👤", "Name",    d.name)}
              ${row("📱", "Mobile",  d.mobile)}
              ${d.email   ? row("✉️", "Email",   d.email)   : ""}
              ${d.service ? row("📸", "Service", d.service) : ""}
              ${d.message ? rowMsg("💬", "Message", d.message) : ""}
            </table>
          </td>
        </tr>

        <!-- CTA buttons -->
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="48%" style="padding-right:6px;">
                  <a href="tel:+${d.mobile.replace(/\D/g,"")}"
                     style="display:block;text-align:center;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;padding:12px 0;font-size:14px;font-weight:700;">
                    📞 &nbsp;Call Back
                  </a>
                </td>
                <td width="48%" style="padding-left:6px;">
                  <a href="${whatsappUrl}"
                     style="display:block;text-align:center;background:#128C7E;color:#fff;text-decoration:none;border-radius:8px;padding:12px 0;font-size:14px;font-weight:700;">
                    💬 &nbsp;Reply on WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;border-top:1px solid #efefef;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#aaa;">
              Received on ${now} &nbsp;·&nbsp; Jaimin Modi Photography, Kadi, Gujarat
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from:    `"Jaimin Modi Photography Website" <${process.env.GMAIL_USER}>`,
    to:      STUDIO_EMAIL,
    subject: `📸 New Enquiry from ${d.name}${d.service ? ` — ${d.service}` : ""} | Jaimin Modi Photography`,
    html,
  });
}

// ── Email row helpers ─────────────────────────────────────────────────
function row(icon: string, label: string, value: string): string {
  return `
  <tr style="border-bottom:1px solid #efefef;">
    <td style="padding:12px 16px;font-size:12px;color:#888;white-space:nowrap;width:110px;">
      ${icon}&nbsp; ${label}
    </td>
    <td style="padding:12px 16px;font-size:14px;color:#222;font-weight:600;">
      ${value}
    </td>
  </tr>`;
}

function rowMsg(icon: string, label: string, value: string): string {
  return `
  <tr>
    <td style="padding:12px 16px;font-size:12px;color:#888;white-space:nowrap;vertical-align:top;width:110px;">
      ${icon}&nbsp; ${label}
    </td>
    <td style="padding:12px 16px;font-size:14px;color:#444;line-height:1.6;">
      ${value.replace(/\n/g, "<br/>")}
    </td>
  </tr>`;
}

// ── POST handler ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, mobile, email, service, message } = body as EnquiryData;

  if (!name || !mobile) {
    return NextResponse.json({ error: "Name and mobile are required." }, { status: 400 });
  }

  const data: EnquiryData = { name, mobile, email, service, message };

  // 1. Save to Supabase
  const { error: dbError } = await supabase.from("enquiries").insert({
    name,
    mobile,
    email:   email   || null,
    service: service || null,
    message: message || null,
  });

  if (dbError) {
    console.error("[enquiry] Supabase insert error:", dbError.message);
    // Don't fail the whole request if DB save fails — still send email + WA
  }

  // 2. Send email (fire-and-forget — don't let email failure block response)
  sendEmailNotification(data).catch((err) => {
    console.error("[enquiry] Email send failed:", err.message);
  });

  // 3. Return WhatsApp URL so client can open it
  return NextResponse.json({
    success:      true,
    whatsappUrl:  buildWhatsAppUrl(data),
  });
}

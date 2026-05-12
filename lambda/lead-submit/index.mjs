import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({ region: process.env.AWS_REGION || "ap-south-1" });

const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
const SES_SENDER   = process.env.SES_SENDER   || "paibotsadvertising@gmail.com";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "paibotsadvertising@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin":  ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

const respond = (status, body) => ({
  statusCode: status,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  if (method === "OPTIONS") return respond(204, {});

  let payload = {};
  try { payload = JSON.parse(event.body || "{}"); }
  catch { return respond(400, { ok: false, error: "Invalid JSON body" }); }

  const name    = String(payload.name    || "").trim();
  const phone   = String(payload.phone   || "").trim();
  const email   = String(payload.email   || "").trim();
  const service = String(payload.service || "").trim();
  const message = String(payload.message || "").trim();
  const pageUrl = String(payload.pageUrl || "").trim();

  if (!name)  return respond(400, { ok: false, error: "Name is required" });
  if (!phone) return respond(400, { ok: false, error: "Phone is required" });
  if (phone.replace(/[^0-9]/g, "").length < 7)
    return respond(400, { ok: false, error: "Phone looks invalid" });

  const ts = new Date().toISOString();
  const subject = "New PaiBots enquiry from " + name;
  const textBody = [
    "Name:    " + name,
    "Phone:   " + phone,
    "Email:   " + (email || "(not provided)"),
    "Service: " + (service || "(not specified)"),
    "Page:    " + (pageUrl || "(unknown)"),
    "",
    "Message:",
    message || "(no message)",
    "",
    "--",
    "Submitted: " + ts,
  ].join("\n");

  const row = (k, v) =>
    '<tr><td style="padding:4px 12px 4px 0"><b>' + k + '</b></td><td>' + escapeHtml(v) + '</td></tr>';

  const htmlBody =
    '<h2 style="margin:0 0 12px;font-family:system-ui">New PaiBots enquiry</h2>' +
    '<table style="border-collapse:collapse;font-family:system-ui;font-size:14px">' +
      row("Name", name) +
      row("Phone", phone) +
      row("Email", email || "(not provided)") +
      row("Service", service || "(not specified)") +
      row("Page", pageUrl || "(unknown)") +
    '</table>' +
    '<p style="font-family:system-ui;font-size:14px;white-space:pre-wrap;margin-top:16px">' +
      escapeHtml(message || "(no message)") +
    '</p>' +
    '<hr style="margin-top:24px;border:none;border-top:1px solid #ddd"/>' +
    '<p style="font-family:system-ui;font-size:12px;color:#888">Submitted ' + ts + '</p>';

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: SES_SENDER,
      Destination: { ToAddresses: [NOTIFY_EMAIL] },
      ReplyToAddresses: email ? [email] : undefined,
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: textBody, Charset: "UTF-8" },
            Html: { Data: htmlBody, Charset: "UTF-8" },
          },
        },
      },
    }));
  } catch (err) {
    console.error("SES send failed", err);
    return respond(502, { ok: false, error: "Email delivery failed" });
  }

  return respond(200, { ok: true });
};

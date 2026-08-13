// Razorpay webhook: records purchases in DynamoDB and sends "Service Booked"
// emails via SES. Wire this URL + WEBHOOK_SECRET in Razorpay Settings → Webhooks
// (event: payment.captured).
import crypto from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({ region: process.env.AWS_REGION || "ap-south-1" });

const TABLE          = process.env.TABLE || "paibots-purchases";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const SES_SENDER     = process.env.SES_SENDER || "paibotsadvertising@gmail.com";
const NOTIFY_EMAIL   = process.env.NOTIFY_EMAIL || "paibotsadvertising@gmail.com";
// Optional JSON map { "<payment_page_id>": "Service Name" } to resolve the
// product when notes/description don't carry it.
const PAGE_MAP = (() => { try { return JSON.parse(process.env.PAGE_MAP || "{}"); } catch { return {}; } })();

const respond = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

const inr = (paise) => "₹" + (paise / 100).toLocaleString("en-IN");

const istDate = (epochSec) =>
  new Date(epochSec * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";

export const handler = async (event) => {
  if (!WEBHOOK_SECRET) { console.error("WEBHOOK_SECRET not set"); return respond(500, { ok: false }); }

  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : (event.body || "");
  const signature = event.headers?.["x-razorpay-signature"] || event.headers?.["X-Razorpay-Signature"] || "";

  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  const sigBuf = Buffer.from(signature, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    console.warn("Bad webhook signature");
    return respond(400, { ok: false, error: "Invalid signature" });
  }

  let body = {};
  try { body = JSON.parse(rawBody); } catch { return respond(400, { ok: false, error: "Invalid JSON" }); }

  if (body.event !== "payment.captured") {
    return respond(200, { ok: true, skipped: body.event });
  }

  const p = body.payload?.payment?.entity || {};
  const notes = p.notes && !Array.isArray(p.notes) ? p.notes : {};

  const serviceName =
    notes.service || notes.Service || notes.product || notes.Product ||
    PAGE_MAP[notes.payment_page_id || ""] || p.description || "Service";
  const customerName =
    notes.name || notes.Name || notes["Your Name"] || notes.customer_name || "";
  const email   = p.email   || notes.email || "";
  const contact = p.contact || notes.phone || notes.contact || "";
  const when    = p.created_at ? istDate(p.created_at) : new Date().toISOString();

  // Record first (idempotent on payment id — retried webhooks won't duplicate,
  // and won't re-send emails).
  try {
    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id: p.id,
        serviceName,
        customerName,
        email,
        contact,
        amountPaise: p.amount,
        amount: (p.amount || 0) / 100,
        currency: p.currency || "INR",
        status: p.status || "captured",
        orderId: p.order_id || "",
        method: p.method || "",
        createdAt: new Date((p.created_at || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
      },
      ConditionExpression: "attribute_not_exists(id)",
    }));
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return respond(200, { ok: true, duplicate: true });
    }
    console.error("DynamoDB put failed", err);
    return respond(500, { ok: false, error: "Store failed" });
  }

  const subject = "Service Booked : " + serviceName + " - Paibots Advertising";
  const row = (k, v) =>
    '<tr><td style="padding:4px 12px 4px 0"><b>' + k + '</b></td><td>' + escapeHtml(v) + '</td></tr>';
  const detailsTable =
    '<table style="border-collapse:collapse;font-family:system-ui;font-size:14px">' +
      row("Service", serviceName) +
      row("Amount", inr(p.amount || 0) + " (incl. GST)") +
      row("Customer", customerName || "(not provided)") +
      row("Email", email || "(not provided)") +
      row("Phone", contact || "(not provided)") +
      row("Payment ID", p.id || "?") +
      row("Date", when) +
    "</table>";
  const textDetails = [
    "Service:    " + serviceName,
    "Amount:     " + inr(p.amount || 0) + " (incl. GST)",
    "Customer:   " + (customerName || "(not provided)"),
    "Email:      " + (email || "(not provided)"),
    "Phone:      " + (contact || "(not provided)"),
    "Payment ID: " + (p.id || "?"),
    "Date:       " + when,
  ].join("\n");

  const send = (to, html, text) => ses.send(new SendEmailCommand({
    FromEmailAddress: SES_SENDER,
    Destination: { ToAddresses: [to] },
    Content: { Simple: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: text, Charset: "UTF-8" },
        Html: { Data: html, Charset: "UTF-8" },
      },
    } },
  }));

  // Owner notification.
  try {
    await send(
      NOTIFY_EMAIL,
      '<h2 style="margin:0 0 12px;font-family:system-ui">New service booked</h2>' + detailsTable,
      "New service booked\n\n" + textDetails,
    );
  } catch (err) {
    console.error("Owner email failed", err);
  }

  // Customer confirmation (works once SES has production access).
  if (email && email !== NOTIFY_EMAIL) {
    try {
      await send(
        email,
        '<h2 style="margin:0 0 12px;font-family:system-ui">Thank you for your purchase!</h2>' +
        '<p style="font-family:system-ui;font-size:14px">Hi ' + escapeHtml(customerName || "there") +
        ", your booking with Paibots Advertising is confirmed. Here is what you purchased:</p>" +
        detailsTable +
        '<p style="font-family:system-ui;font-size:14px;margin-top:16px">We will reach out within 1 business day to get started. ' +
        'Questions? Just reply to this email.</p>' +
        '<p style="font-family:system-ui;font-size:12px;color:#888;margin-top:24px">Paibots Advertising · paibotsadvertising.com</p>',
        "Thank you for your purchase!\n\nHi " + (customerName || "there") +
        ", your booking with Paibots Advertising is confirmed.\n\n" + textDetails +
        "\n\nWe will reach out within 1 business day to get started.",
      );
    } catch (err) {
      console.error("Customer email failed (SES sandbox?)", err);
    }
  }

  return respond(200, { ok: true });
};

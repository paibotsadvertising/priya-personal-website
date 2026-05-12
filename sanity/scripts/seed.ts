/**
 * One-time migration: pushes the static content from src/lib/site.ts (and the
 * inline arrays in Hero/Process/PainSection/Testimonials/Results) into the
 * configured Sanity dataset.
 *
 * Idempotent — every document uses a deterministic _id so re-running the
 * script updates instead of duplicating.
 *
 * Usage:
 *   1. Generate an Editor token at:
 *      https://www.sanity.io/manage/project/nixmhrlo/api → Tokens → Add API token
 *   2. Add it to sanity/.env.local as SANITY_WRITE_TOKEN=...
 *   3. From repo root: npm run studio:seed
 */
import { config as loadEnv } from "dotenv";
import { createClient } from "@sanity/client";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { SITE, NAV_LINKS, SERVICES } from "../../src/lib/site.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(here, "..", ".env.local") });
loadEnv({ path: path.join(here, "..", ".env") });

const projectId = process.env.SANITY_PROJECT_ID || "nixmhrlo";
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    "✗ SANITY_WRITE_TOKEN is not set.\n" +
      "  Create a token at https://www.sanity.io/manage/project/" + projectId + "/api\n" +
      "  Then put it in sanity/.env.local as SANITY_WRITE_TOKEN=...",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// Slugify a string for use in deterministic _id values.
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Inline copies of the arrays defined directly inside Astro components.
// Keep these in sync with the component fallbacks until those components are
// the source of truth in Sanity.
const TESTIMONIALS = [
  { quote: "PaiBots untangled six months of ad spend in two weeks. We're now ROAS-positive and actually understand why.", name: "Aanya Mehra",  role: "Founder, Bloom Skincare",       fromCss: "#60A5FA", toCss: "#A855F7" },
  { quote: "The team treats our money like their own. They've turned down upsells when something simpler would work. Rare.", name: "Rohan Kapoor",  role: "Director, Northbound Travels", fromCss: "#EC4899", toCss: "#F43F5E" },
  { quote: "Our showroom footfall doubled in the first quarter. The Google Business work alone paid for the entire engagement.", name: "Vikram Singh", role: "Owner, V S Motors Moradabad",  fromCss: "#10B981", toCss: "#06B6D4" },
];

const RESULTS = [
  { tag: "D2C Skincare",  metric: "+312%",       metricLabel: "revenue in 6 months",     body: "Rebuilt the funnel from cold ad to checkout. Doubled AOV with bundle pages and email flows.", fromCss: "#60A5FA", toCss: "#A855F7", count: { to: 312, prefix: "+", suffix: "%" } },
  { tag: "Local Service", metric: "₹14L → ₹68L", metricLabel: "monthly bookings",        body: "Local SEO + Google Ads combo dominated 8 service-area searches. Now booked 5 weeks out.",     fromCss: "#EC4899", toCss: "#F43F5E", count: null as any },
  { tag: "B2B SaaS",      metric: "62",          metricLabel: "qualified demos / month", body: "LinkedIn ads + comparison-page SEO. Cost per demo dropped 4× vs. their old agency.",         fromCss: "#10B981", toCss: "#06B6D4", count: { to: 62, prefix: "", suffix: "" } },
];

const PROCESS_STEPS = [
  { n: "01", title: "Discover",   body: "We dig into your numbers, ideal customer, and what's worked (or not) so far. No assumptions.",           fromCss: "#60A5FA", toCss: "#A855F7" },
  { n: "02", title: "Strategise", body: "A 90-day plan with channels, budgets, and KPIs you'll actually use. You sign off before we spend a rupee.", fromCss: "#EC4899", toCss: "#F43F5E" },
  { n: "03", title: "Execute",    body: "Creative, copy, ads, pages, posts, emails — built and shipped weekly by people who care about your brand.", fromCss: "#F59E0B", toCss: "#F97316" },
  { n: "04", title: "Optimise",   body: "We watch the data daily, kill what's not working, double down on what is. Monthly reviews, no surprises.", fromCss: "#10B981", toCss: "#06B6D4" },
];

const QUICK_WINS = [
  { icon: "⚡", title: "LinkedIn Profile Tune-up",  body: "Headline, summary, and SEO keyword pass that turns your profile into a lead magnet." },
  { icon: "🔎", title: "SEO Content Audit",         body: "Full content inventory, keyword gaps, and a prioritised quick-wins checklist." },
  { icon: "🎬", title: "Instagram Reel Strategy",   body: "10 ready-to-shoot reel concepts with trending audio and viral-tested hooks." },
  { icon: "📧", title: "Email Campaign Setup",      body: "High-converting templates, subject-line variations, and automation for your next launch." },
];

async function run() {
  const tx = client.transaction();

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: SITE.name,
    shortName: SITE.shortName,
    tagline: SITE.tagline,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    phone: SITE.phone,
    phoneRaw: SITE.phoneRaw,
    whatsapp: SITE.whatsapp,
    address: { ...SITE.address },
    social: { ...SITE.social },
  });

  NAV_LINKS.forEach((l, i) => {
    tx.createOrReplace({
      _id: "navLink-" + slug(l.label),
      _type: "navLink",
      label: l.label,
      href: l.href,
      order: i,
    });
  });

  SERVICES.forEach((s, i) => {
    tx.createOrReplace({
      _id: "service-" + s.slug,
      _type: "service",
      title: s.title,
      shortTitle: s.shortTitle,
      slug: { _type: "slug", current: s.slug },
      blurb: s.blurb,
      icon: s.icon,
      fromCss: s.fromCss,
      toCss: s.toCss,
      order: i,
      features: [...s.features],
      intro: [...s.intro],
      process: s.process.map((p) => ({ _key: slug(p.step), step: p.step, desc: p.desc })),
      idealFor: [...s.idealFor],
      outcomes: [...s.outcomes],
      faq: s.faq.map((f) => ({ _key: slug(f.q).slice(0, 40), q: f.q, a: f.a })),
    });
  });

  TESTIMONIALS.forEach((t, i) => {
    tx.createOrReplace({ _id: "testimonial-" + slug(t.name), _type: "testimonial", ...t, order: i });
  });

  RESULTS.forEach((r, i) => {
    tx.createOrReplace({ _id: "resultMetric-" + slug(r.tag), _type: "resultMetric", ...r, order: i });
  });

  PROCESS_STEPS.forEach((p, i) => {
    tx.createOrReplace({ _id: "processStep-" + p.n, _type: "processStep", ...p, order: i });
  });

  QUICK_WINS.forEach((w, i) => {
    tx.createOrReplace({ _id: "quickWin-" + slug(w.title), _type: "quickWin", ...w, order: i });
  });

  const result = await tx.commit();
  const counts: Record<string, number> = {};
  for (const r of result.results) counts[r.id.split("-")[0]] = (counts[r.id.split("-")[0]] || 0) + 1;
  console.log("✓ Seed complete. Documents written:");
  for (const [k, v] of Object.entries(counts)) console.log("  • " + k + ": " + v);
  console.log("\nOpen the Studio with:  npm run studio:dev");
}

run().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});

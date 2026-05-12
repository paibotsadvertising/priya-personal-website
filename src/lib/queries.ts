// GROQ queries + thin fetchers wrapping safeFetch().
// Every fetcher returns the same shape the components already consume,
// and falls back to the constants in src/lib/site.ts when Sanity is
// unconfigured, empty, or unreachable.
import { safeFetch } from "./sanity";
import { SITE, SERVICES, NAV_LINKS, type Service } from "./site";

export type SiteSettings = typeof SITE;
export type NavLink = { label: string; href: string };

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  fromCss: string;
  toCss: string;
};

export type ResultMetric = {
  tag: string;
  metric: string;
  metricLabel: string;
  body: string;
  fromCss: string;
  toCss: string;
  count: { to: number; prefix: string; suffix: string } | null;
};

export type ProcessStep = {
  n: string;
  title: string;
  body: string;
  fromCss: string;
  toCss: string;
};

export type QuickWin = { icon: string; title: string; body: string };

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  name, shortName, tagline, description, url, email, phone, phoneRaw, whatsapp,
  address, social
}`;

const NAV_LINKS_QUERY = `*[_type == "navLink"] | order(order asc, label asc){ label, href }`;

const SERVICES_QUERY = `*[_type == "service"] | order(order asc, title asc){
  "slug": slug.current, title, shortTitle, blurb, features, fromCss, toCss, icon,
  intro, process, idealFor, outcomes, faq
}`;

const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  "slug": slug.current, title, shortTitle, blurb, features, fromCss, toCss, icon,
  intro, process, idealFor, outcomes, faq
}`;

const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(order asc, name asc){
  quote, name, role, fromCss, toCss
}`;

const RESULTS_QUERY = `*[_type == "resultMetric"] | order(order asc){
  tag, metric, metricLabel, body, fromCss, toCss, count
}`;

const PROCESS_QUERY = `*[_type == "processStep"] | order(order asc){
  n, title, body, fromCss, toCss
}`;

const QUICK_WINS_QUERY = `*[_type == "quickWin"] | order(order asc){ icon, title, body }`;

// Use Sanity result if it returned a non-empty value, otherwise fall back.
function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await safeFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null);
  return pick(data, SITE);
}

export async function getNavLinks(): Promise<readonly NavLink[]> {
  const data = await safeFetch<NavLink[]>(NAV_LINKS_QUERY, {}, []);
  return pick(data, NAV_LINKS as readonly NavLink[]);
}

export async function getServices(): Promise<Service[]> {
  const data = await safeFetch<Service[]>(SERVICES_QUERY, {}, []);
  return pick(data, SERVICES);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const data = await safeFetch<Service | null>(SERVICE_BY_SLUG_QUERY, { slug }, null);
  return data ?? SERVICES.find((s) => s.slug === slug);
}

const TESTIMONIALS_FALLBACK: Testimonial[] = [
  { quote: "PaiBots untangled six months of ad spend in two weeks. We're now ROAS-positive and actually understand why.", name: "Aanya Mehra",  role: "Founder, Bloom Skincare",       fromCss: "#60A5FA", toCss: "#A855F7" },
  { quote: "The team treats our money like their own. They've turned down upsells when something simpler would work. Rare.", name: "Rohan Kapoor",  role: "Director, Northbound Travels", fromCss: "#EC4899", toCss: "#F43F5E" },
  { quote: "Our showroom footfall doubled in the first quarter. The Google Business work alone paid for the entire engagement.", name: "Vikram Singh", role: "Owner, V S Motors Moradabad",  fromCss: "#10B981", toCss: "#06B6D4" },
];

const RESULTS_FALLBACK: ResultMetric[] = [
  { tag: "D2C Skincare",  metric: "+312%",       metricLabel: "revenue in 6 months",     body: "Rebuilt the funnel from cold ad to checkout. Doubled AOV with bundle pages and email flows.", fromCss: "#60A5FA", toCss: "#A855F7", count: { to: 312, prefix: "+", suffix: "%" } },
  { tag: "Local Service", metric: "₹14L → ₹68L", metricLabel: "monthly bookings",        body: "Local SEO + Google Ads combo dominated 8 service-area searches. Now booked 5 weeks out.",     fromCss: "#EC4899", toCss: "#F43F5E", count: null },
  { tag: "B2B SaaS",      metric: "62",          metricLabel: "qualified demos / month", body: "LinkedIn ads + comparison-page SEO. Cost per demo dropped 4× vs. their old agency.",         fromCss: "#10B981", toCss: "#06B6D4", count: { to: 62, prefix: "", suffix: "" } },
];

const PROCESS_FALLBACK: ProcessStep[] = [
  { n: "01", title: "Discover",   body: "We dig into your numbers, ideal customer, and what's worked (or not) so far. No assumptions.",           fromCss: "#60A5FA", toCss: "#A855F7" },
  { n: "02", title: "Strategise", body: "A 90-day plan with channels, budgets, and KPIs you'll actually use. You sign off before we spend a rupee.", fromCss: "#EC4899", toCss: "#F43F5E" },
  { n: "03", title: "Execute",    body: "Creative, copy, ads, pages, posts, emails — built and shipped weekly by people who care about your brand.", fromCss: "#F59E0B", toCss: "#F97316" },
  { n: "04", title: "Optimise",   body: "We watch the data daily, kill what's not working, double down on what is. Monthly reviews, no surprises.", fromCss: "#10B981", toCss: "#06B6D4" },
];

const QUICK_WINS_FALLBACK: QuickWin[] = [
  { icon: "⚡", title: "LinkedIn Profile Tune-up",  body: "Headline, summary, and SEO keyword pass that turns your profile into a lead magnet." },
  { icon: "🔎", title: "SEO Content Audit",         body: "Full content inventory, keyword gaps, and a prioritised quick-wins checklist." },
  { icon: "🎬", title: "Instagram Reel Strategy",   body: "10 ready-to-shoot reel concepts with trending audio and viral-tested hooks." },
  { icon: "📧", title: "Email Campaign Setup",      body: "High-converting templates, subject-line variations, and automation for your next launch." },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await safeFetch<Testimonial[]>(TESTIMONIALS_QUERY, {}, []);
  return pick(data, TESTIMONIALS_FALLBACK);
}

export async function getResults(): Promise<ResultMetric[]> {
  const data = await safeFetch<ResultMetric[]>(RESULTS_QUERY, {}, []);
  return pick(data, RESULTS_FALLBACK);
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  const data = await safeFetch<ProcessStep[]>(PROCESS_QUERY, {}, []);
  return pick(data, PROCESS_FALLBACK);
}

export async function getQuickWins(): Promise<QuickWin[]> {
  const data = await safeFetch<QuickWin[]>(QUICK_WINS_QUERY, {}, []);
  return pick(data, QUICK_WINS_FALLBACK);
}

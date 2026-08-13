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

export type Product = {
  id: string;
  title: string;
  blurb: string;
  features: string[];
  price: number;
  icon: string;
  fromCss: string;
  toCss: string;
  paymentUrl: string;
};

export type HeroCredItem = {
  label: string;
  staticValue?: string;
  count?: { to: number; decimals?: number; prefix?: string; suffix?: string } | null;
};

export type HeroStatCard = {
  label: string;
  staticValue?: string;
  fromCss: string;
  toCss: string;
  count?: { to: number; decimals?: number; suffix?: string } | null;
};

export type HeroSection = {
  badgeText: string;
  headlineLine1: string;
  rotatingWords: string[];
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  credStrip: HeroCredItem[];
  statCards: HeroStatCard[];
};

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

const PRODUCTS_QUERY = `*[_type == "product"] | order(order asc, title asc){
  "id": coalesce(_id, title), title, blurb, features, price, icon, fromCss, toCss, paymentUrl
}`;

const HERO_QUERY = `*[_type == "heroSection"][0]{
  badgeText, headlineLine1, rotatingWords, subheadline,
  primaryCtaLabel, primaryCtaHref, secondaryCtaLabel, secondaryCtaHref,
  credStrip, statCards
}`;

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

const PRODUCTS_FALLBACK: Product[] = [
  {
    id: "mini-seo-audit",
    title: "Mini SEO Audit",
    blurb: "One-time site audit with prioritized fixes, delivered within 5 business days.",
    features: ["20-point technical scan", "Top 10 keyword opportunities", "Prioritized action list"],
    price: 2000, icon: "🔍", fromCss: "#2563EB", toCss: "#9333EA",
    paymentUrl: "https://pages.razorpay.com/paibotsadvertising",
  },
  {
    id: "social-starter-pack",
    title: "Social Media Starter Pack",
    blurb: "10 on-brand designed posts for one platform — ready to publish.",
    features: ["10 custom-designed creatives", "Captions + hashtags included", "1 round of revisions"],
    price: 5000, icon: "📱", fromCss: "#EC4899", toCss: "#F43F5E",
    paymentUrl: "https://pages.razorpay.com/paibotsadvertising",
  },
  {
    id: "google-ads-setup",
    title: "Google Ads Setup",
    blurb: "One campaign configured end-to-end with conversion tracking.",
    features: ["Account + campaign build", "Keyword + ad copy research", "Conversion tracking wired"],
    price: 5000, icon: "🎯", fromCss: "#F59E0B", toCss: "#F97316",
    paymentUrl: "https://pages.razorpay.com/paibotsadvertising",
  },
];

export async function getProducts(): Promise<Product[]> {
  const data = await safeFetch<Product[]>(PRODUCTS_QUERY, {}, []);
  return pick(data, PRODUCTS_FALLBACK);
}

const HERO_FALLBACK: HeroSection = {
  badgeText: "Premium Digital Marketing Solutions",
  headlineLine1: "Elevate Your",
  rotatingWords: ["Digital Presence", "Brand Story", "Ad Spend ROI", "Lead Pipeline", "Local Reach", "Conversion Rate"],
  subheadline: "Transform your brand with cutting-edge digital marketing strategies. From quick wins to comprehensive campaigns, we deliver results that matter.",
  primaryCtaLabel: "Get Started",
  primaryCtaHref: "#contact",
  secondaryCtaLabel: "View Our Work",
  secondaryCtaHref: "#results",
  credStrip: [
    { label: "ad spend managed", count: { to: 4.2, decimals: 1, prefix: "₹", suffix: " Cr+" } },
    { label: "brands grown",     count: { to: 180, decimals: 0, suffix: "+" } },
    { label: "avg ROAS",         count: { to: 3.2, decimals: 1, suffix: "×" } },
    { label: "monitoring",       staticValue: "24/7" },
  ],
  statCards: [
    { label: "Avg. ROAS in 90 days",    fromCss: "#60A5FA", toCss: "#A855F7", count: { to: 3.2, decimals: 1, suffix: "×" } },
    { label: "Qualified leads / mo",    fromCss: "#EC4899", toCss: "#F43F5E", count: { to: 412, decimals: 0, suffix: "" } },
    { label: "On 28 priority keywords", fromCss: "#F59E0B", toCss: "#F97316", staticValue: "#1" },
    { label: "Client retention",        fromCss: "#10B981", toCss: "#06B6D4", count: { to: 98, decimals: 0, suffix: "%" } },
  ],
};

export async function getHeroSection(): Promise<HeroSection> {
  const data = await safeFetch<HeroSection | null>(HERO_QUERY, {}, null);
  return pick(data, HERO_FALLBACK);
}

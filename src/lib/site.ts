// Site-wide configuration & content constants.
// Used as fallback when Sanity content isn't yet configured.

export const SITE = {
  name: "PaiBots Advertising",
  shortName: "PaiBots",
  tagline: "Marketing that moves the needle for ambitious Indian brands.",
  description:
    "PaiBots Advertising helps small businesses and startups build a powerful digital presence — strategy, paid media, SEO, and design that delivers measurable growth.",
  url: "https://paibotsadvertising.com",
  email: "paibotsadvertising@gmail.com",
  phone: "+91-8318406327",
  phoneRaw: "+918318406327",
  whatsapp: "https://wa.me/918318406327",
  address: {
    line1: "Bank Colony, Near Ompal Welding",
    line2: "Khushalpur, Moradabad, 244001",
    city: "Moradabad",
    state: "Uttar Pradesh",
    country: "India",
  },
  social: {
    instagram: "https://instagram.com/paibotsadvertising",
    facebook: "https://facebook.com/paibotsadvertising",
    linkedin: "https://linkedin.com/company/paibotsadvertising",
    youtube: "https://youtube.com/@paibotsadvertising",
    googleBusiness: "https://g.page/paibotsadvertising",
  },
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  blurb: string;
  features: string[];
  /** Tailwind gradient stops (used as inline linear-gradient via fromCss/toCss for the icon tile). */
  fromCss: string;
  toCss: string;
  icon: string;
  intro: string[];
  process: { step: string; desc: string }[];
  idealFor: string[];
  outcomes: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "website-design-development",
    title: "Website Design & Development",
    shortTitle: "Web Design & Dev",
    blurb: "Fast, mobile-first websites built to convert. Modern stack, SEO-ready out of the box.",
    features: ["Custom design", "Mobile optimised", "Sub-2s load time", "CMS or static"],
    fromCss: "#2563EB", toCss: "#9333EA",  // blue-600 → purple-600
    icon: "🎨",
    intro: [
      "Your website is your hardest-working salesperson — it pitches 24/7, never calls in sick, and gives every visitor a first impression in under three seconds. We design and build sites that look great, load fast, and turn casual browsers into paying customers.",
      "Every site we ship is custom-coded for speed, mobile-first, SEO-ready, and easy to update. No bloated themes, no clunky page builders — just clean, modern code that ranks and converts.",
    ],
    process: [
      { step: "Discovery", desc: "30-minute call to understand your audience, offer, and competitors. We agree on goals and KPIs before any design work starts." },
      { step: "Wireframe & copy", desc: "Low-fidelity layout and conversion copy first — so the structure works before the visuals get fancy." },
      { step: "Design", desc: "Pixel-perfect mockups in Figma. Two rounds of revisions included." },
      { step: "Build", desc: "Hand-coded in Astro, Next.js or Webflow (your call). Lighthouse 95+ on mobile, sub-2-second loads." },
      { step: "Launch & support", desc: "Go-live, analytics wiring, and 30 days of post-launch tweaks at no extra cost." },
    ],
    idealFor: [
      "Service businesses with an outdated or DIY website that no longer matches the brand",
      "Startups launching a new product and need a credible digital home",
      "Local businesses losing leads to competitors with better-looking sites",
      "E-commerce brands that need a clean, fast Shopify or WooCommerce front-end",
    ],
    outcomes: [
      "A site that loads in under 2 seconds on 4G mobile",
      "Clear lead capture with form submissions landing in your inbox",
      "Google Search Console + Analytics 4 wired up from day one",
      "Editable content blocks so you can update text and images without a developer",
    ],
    faq: [
      { q: "How long does a typical project take?", a: "4–6 weeks for a 5–7 page marketing site, 8–12 weeks for an e-commerce or multi-template build." },
      { q: "Will I be able to update the site myself?", a: "Yes — we set up a CMS (Sanity, Contentful, or WordPress depending on your stack) so non-technical team members can edit text, swap images, and publish blog posts." },
      { q: "What about hosting?", a: "We deploy to AWS, Vercel or Netlify (your choice). Hosting cost is typically ₹1,000–3,000 per month depending on traffic." },
    ],
  },
  {
    slug: "lead-generation-campaigns",
    title: "Lead Generation Campaigns",
    shortTitle: "Lead Gen",
    blurb: "End-to-end funnels — from cold reach to qualified booking. Predictable, trackable pipeline.",
    features: ["Landing pages", "Multi-channel ads", "CRM wiring", "Lead scoring"],
    fromCss: "#EC4899", toCss: "#F43F5E",  // pink-500 → rose-500
    icon: "🎯",
    intro: [
      "Most ad agencies hand you a lead count and call it a day. We hand you a pipeline — qualified, scored, and dropped straight into your CRM with the context your sales team needs to close.",
      "We run end-to-end funnels: landing page, ad creative, multi-channel paid distribution, lead scoring, and CRM hand-off. Every campaign is tracked from first impression to closed deal so you know your true cost per customer, not just cost per click.",
    ],
    process: [
      { step: "ICP & offer audit", desc: "We define your ideal customer profile and pressure-test your offer before spending a single rupee on ads." },
      { step: "Landing page", desc: "Conversion-optimised landing page built in 5–7 days with A/B-ready variants." },
      { step: "Multi-channel launch", desc: "Google Search, Meta, LinkedIn (where it makes sense). Daily budget management, no set-and-forget." },
      { step: "Lead scoring + CRM wiring", desc: "Leads auto-tagged hot, warm or cold and pushed to HubSpot, Zoho, Pipedrive, or a Google Sheet — whichever you use." },
      { step: "Weekly reporting", desc: "Real numbers: spend, leads, MQL, SQL, deals. No vanity metrics." },
    ],
    idealFor: [
      "B2B services and SaaS with a clear ICP and ₹20k+ deal sizes",
      "High-ticket coaches, consultants, and education brands",
      "Real estate, financial services, healthcare, legal practices",
      "Local businesses where each lead is worth ₹5,000+",
    ],
    outcomes: [
      "Predictable monthly lead flow within 30–60 days",
      "Cost per qualified lead 30–50% below industry benchmark by month 3",
      "Sales team gets pre-qualified context (intent, budget, timeline) on every lead",
      "Clear attribution: you know which channel × ad × keyword drove each closed deal",
    ],
    faq: [
      { q: "What is the minimum monthly ad spend?", a: "We recommend at least ₹50,000 per month in ad budget plus our management fee. Below that, statistical optimisation is too slow to be useful." },
      { q: "Do you guarantee a number of leads?", a: "We commit to a CPL range based on your industry benchmarks during the onboarding audit. We will walk away from projects we cannot move the needle on — it is better than wasting your money." },
      { q: "Who owns the ad accounts and creative?", a: "You do. Always. We work inside your accounts and hand over all assets if we ever part ways." },
    ],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    shortTitle: "Social Media",
    blurb: "Content, community, and conversion across Instagram, Facebook, LinkedIn, and YouTube.",
    features: ["Content calendar", "Reels & shorts", "Community mgmt", "Monthly insights"],
    fromCss: "#F97316", toCss: "#EC4899",  // orange-500 → pink-500
    icon: "📱",
    intro: [
      "Showing up on social is not optional anymore — but posting random content five days a week burns out your team and rarely moves revenue. We build a social presence that compounds: consistent content, real community, and a clear path from follower to customer.",
      "We handle the calendar, creative, captions, scheduling, community replies, and monthly reporting. You stay in your zone of genius and your brand stays top-of-feed.",
    ],
    process: [
      { step: "Brand voice audit", desc: "We document tone, themes, do and do-not lists so every post sounds like you, not a freelancer guessing." },
      { step: "Content pillars", desc: "3–5 themes that map to your business goals (education, social proof, behind-the-scenes, product, founder POV)." },
      { step: "Monthly calendar", desc: "Reels, carousels, stories, and shorts planned a month ahead. Approval in one click via Notion or Google Drive." },
      { step: "Production + publishing", desc: "We shoot or repurpose, edit, schedule, and publish across Instagram, Facebook, LinkedIn, and YouTube Shorts." },
      { step: "Community + reporting", desc: "Reply to comments and DMs within 4 business hours. Monthly report with reach, engagement, follower quality, and lead attribution." },
    ],
    idealFor: [
      "D2C brands building a loyal audience around their product",
      "Personal brands and founders who want to grow inbound without sales calls",
      "Service businesses where trust and personality drive the buying decision",
      "Local businesses (restaurants, salons, fitness, retail) where Instagram is discovery",
    ],
    outcomes: [
      "Consistent 4–7 posts per week across primary platforms with zero stress on your end",
      "30–100% follower growth quarter-over-quarter (depends on starting base and niche)",
      "Engagement rate 2–3× your category benchmark",
      "Inbound DMs and “I found you on Instagram” bookings month after month",
    ],
    faq: [
      { q: "Do I need to be on every platform?", a: "No. We pick 1–3 channels where your audience actually spends time. Trying to be everywhere is the fastest way to be nowhere." },
      { q: "Will you create the videos and graphics?", a: "Yes. Our team handles design (Canva and Figma) and reels editing (CapCut and Premiere). For founder-led content we either coach you on the shoot or send a videographer." },
      { q: "What if I want to be involved in approvals?", a: "Default workflow: we publish a month at a time, you review in batch and approve. If you want post-by-post sign-off, we can do that too — it just slows the pipeline." },
    ],
  },
  {
    slug: "website-seo",
    title: "Website SEO",
    shortTitle: "SEO",
    blurb: "Rank where it matters. Technical, on-page, and content SEO built for the long game.",
    features: ["Tech audit", "Keyword strategy", "On-page optimisation", "Backlink outreach"],
    fromCss: "#10B981", toCss: "#06B6D4",  // emerald-500 → cyan-500
    icon: "🔍",
    intro: [
      "SEO is the only marketing channel that pays you back compounding interest — build it right and it keeps sending qualified traffic for years after you stop investing. We ship technical fixes, on-page optimisation, and a sustainable content engine that ranks for the keywords your customers actually search.",
      "No black-hat tricks, no PBNs, no AI-spam farms. Google rewards genuine quality, and our entire process is built around that.",
    ],
    process: [
      { step: "Technical audit", desc: "Crawl, index, Core Web Vitals, schema, sitemap, robots, redirect chains. We fix what is silently bleeding rankings." },
      { step: "Keyword strategy", desc: "200+ keyword research mapped to buyer intent (informational → commercial → transactional). Prioritised by traffic potential and competition." },
      { step: "On-page optimisation", desc: "Title, meta, H1, internal linking, content gaps, schema markup. Every important page gets a tune-up." },
      { step: "Content production", desc: "4–8 SEO-led articles per month, written by humans with industry expertise. Each one targets a specific keyword cluster." },
      { step: "Backlinks + monitoring", desc: "White-hat outreach for high-authority backlinks. Monthly ranking, traffic, and conversion reports in plain English." },
    ],
    idealFor: [
      "Businesses with a 12+ month time horizon (SEO compounds; it is not a quick win)",
      "B2B SaaS, professional services, and education brands",
      "E-commerce with category and product pages that need to rank",
      "Anyone tired of paying the ad-tax and wanting an organic moat",
    ],
    outcomes: [
      "100% growth in organic traffic within 6–12 months (typical)",
      "First-page rankings for 30+ commercial-intent keywords by month 9",
      "Domain Rating up 10–20 points within a year via earned backlinks",
      "Lower customer acquisition cost as organic share of leads grows",
    ],
    faq: [
      { q: "How long until I see results?", a: "First wins (technical fixes, low-competition keywords) in 8–12 weeks. Meaningful organic traffic by month 4–6. Compounding growth from month 9 onwards." },
      { q: "Do you guarantee #1 rankings?", a: "No legitimate SEO can. Anyone who guarantees rankings is either lying or about to get you penalised. We commit to traffic and lead growth, not specific positions." },
      { q: "What is the difference between SEO and Local SEO?", a: "SEO targets people searching nationally or globally for your service. Local SEO targets near-me or city-specific searches and Google Maps. Most businesses need both — ask us about the bundle." },
    ],
  },
  {
    slug: "holistic-digital-marketing",
    title: "Holistic Digital Marketing",
    shortTitle: "Holistic Digital",
    blurb: "One partner, every channel. Strategy that ties paid, organic, content, and CRM together.",
    features: ["Quarterly strategy", "Multi-channel ops", "Cross-channel tracking", "Monthly reviews"],
    fromCss: "#6366F1", toCss: "#A855F7",  // indigo-500 → purple-500
    icon: "🧭",
    intro: [
      "Most brands juggle five vendors: one for SEO, one for ads, one for socials, one for the website, and one for emails — and the strategy gets lost in translation. Holistic digital marketing means one team owning the whole stack, with a shared scoreboard and a shared brain.",
      "We become your fractional growth team: quarterly strategy, monthly execution across every channel, and weekly tactical reviews. You get the cost of one good freelancer, with the output of an in-house team.",
    ],
    process: [
      { step: "Quarterly strategy sprint", desc: "We map the next 90 days: which channels get budget, which campaigns ship, what the success metrics are." },
      { step: "Channel-specific execution", desc: "SEO, paid, social, content, email — run by specialists inside our team, coordinated by your account lead." },
      { step: "Cross-channel attribution", desc: "GA4, server-side tracking, UTM hygiene. You see which combination of channels actually drives revenue." },
      { step: "Weekly stand-ups", desc: "30 minutes every week to review numbers, unblock decisions, and ship faster." },
      { step: "Monthly business review", desc: "Strategic call with founders or CMO. We adjust the plan based on what worked, what did not, and what the market is doing." },
    ],
    idealFor: [
      "Founders who do not want to manage 4 vendors",
      "Mid-sized businesses (₹1–20 Cr revenue) that need a fractional CMO",
      "Brands launching into a new market or product category",
      "Companies with budget for a full-time marketer but not the patience to hire one",
    ],
    outcomes: [
      "One quarterly plan, one monthly report, one accountable team",
      "Marketing spend allocated to the highest-leverage channels (we kill what does not work, fast)",
      "Faster decisions because there is no “other vendor” to wait on",
      "Revenue growth tied to specific marketing motions, not vague brand activities",
    ],
    faq: [
      { q: "Is this just a retainer with extra steps?", a: "Yes and no. It is a retainer in the commercial sense, but the operating model is different — we replace 3–5 vendors with one team and one strategy, and you stop being the coordination glue." },
      { q: "What does it cost?", a: "Engagements typically start at ₹1.5L per month and scale with channel mix and ad spend management. We share a custom proposal after the discovery call." },
      { q: "Will you work with our existing vendors?", a: "If you have a vendor doing great work, we keep them. We coordinate. We do not insist on owning every channel just to inflate scope." },
    ],
  },
  {
    slug: "ecommerce-marketing",
    title: "E-Commerce Marketing",
    shortTitle: "E-Commerce",
    blurb: "Drive ROAS on Shopify, WooCommerce, Amazon, Flipkart. Catalogue, ads, and CRO together.",
    features: ["Catalogue ads", "Shopping campaigns", "Email/SMS flows", "CRO experiments"],
    fromCss: "#F59E0B", toCss: "#F97316",  // amber-500 → orange-500
    icon: "🛍️",
    intro: [
      "E-commerce is brutal: thin margins, ruthless competitors, and ad costs that climb every quarter. Winning means treating your store as a system — catalogue, ads, retention, and CRO working together — not as four separate spreadsheets.",
      "We run growth for D2C and marketplace brands across Shopify, WooCommerce, Amazon, and Flipkart. From product feed health to retention email flows, every lever gets pulled with one goal: profitable repeat customers.",
    ],
    process: [
      { step: "Account audit", desc: "Catalogue health, pixel hygiene, attribution, current ad accounts, retention flows. We find the leaks before adding new traffic." },
      { step: "Catalogue + feed setup", desc: "Optimise Shopify product titles, descriptions, images, and feeds for Google Shopping, Meta catalogue ads, and marketplace listings." },
      { step: "Acquisition campaigns", desc: "Meta Advantage+ Shopping, Google Performance Max, retargeting, influencer seeding. Daily optimisation against blended ROAS, not channel ROAS." },
      { step: "Retention engine", desc: "Klaviyo or Mailchimp flows: welcome, abandoned cart, post-purchase, win-back. Email + SMS combined to push 30–40% of revenue from existing customers." },
      { step: "CRO experiments", desc: "Monthly A/B tests on PDPs, cart, and checkout. Small wins compound into massive gains." },
    ],
    idealFor: [
      "D2C brands doing ₹50L–5 Cr per year wanting to scale to the next bracket",
      "New e-commerce brands launching their first product line",
      "Sellers spread thin across Amazon, Flipkart, Shopify wanting one growth team",
      "Catalogue-heavy stores (apparel, beauty, home, accessories) with 50+ SKUs",
    ],
    outcomes: [
      "Blended ROAS of 3–5x on a sustainable spend level",
      "30–40% of monthly revenue from email and SMS by month 6",
      "Conversion rate uplift of 20–40% via CRO experiments",
      "Clear unit economics: CAC, AOV, LTV, contribution margin tracked weekly",
    ],
    faq: [
      { q: "Do you work with new brands or only established ones?", a: "Both. New brands: we focus on getting unit economics right before scaling spend. Established brands: we focus on profitable scale and retention." },
      { q: "Can you handle Amazon and Flipkart?", a: "Yes. Listing optimisation, Sponsored Ads (PPC), inventory planning, A+ content, and brand store builds. Marketplaces have their own quirks and we have a dedicated marketplace specialist." },
      { q: "What about Shopify development?", a: "We do not rebuild your store, but we will fix critical CRO issues (faster PDPs, better cart, custom checkout). For full Shopify rebuilds, we partner with our Website team." },
    ],
  },
  {
    slug: "performance-marketing",
    title: "Performance Marketing",
    shortTitle: "Performance",
    blurb: "Google, Meta, LinkedIn ads with daily optimisation. Real numbers, not vanity metrics.",
    features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Daily optimisation"],
    fromCss: "#06B6D4", toCss: "#2563EB",  // cyan-500 → blue-600
    icon: "📈",
    intro: [
      "Performance marketing is where strategy meets the daily grind. The brands that win on Google and Meta are not the ones with the prettiest creative — they are the ones whose teams optimise every day, not every quarter.",
      "We run paid media as if every rupee is yours (because it is). Daily optimisation, weekly experimentation, monthly strategic pivots. No autopilot, no set-and-forget campaigns, no agency-style “we will look at it next month”.",
    ],
    process: [
      { step: "Account audit", desc: "Conversion tracking, attribution, account structure, creative library, audience segments. We find the holes before scaling spend." },
      { step: "Tracking + measurement", desc: "GA4, server-side tracking, conversion API, offline conversion uploads. You cannot optimise what you cannot measure." },
      { step: "Campaign launch", desc: "Tightly themed ad groups, hand-built audience layers, 5–7 creative variants per campaign at launch." },
      { step: "Daily optimisation", desc: "Bids, budgets, search term mining, negative keywords, creative refresh, audience tweaks. Five days a week, every week." },
      { step: "Weekly creative cycle", desc: "Two new ad creatives shipped per campaign per week. We test angles, hooks, and formats relentlessly because creative is the new targeting." },
    ],
    idealFor: [
      "Businesses with a clear conversion event (lead, purchase, signup) and tracking already half-set-up",
      "B2B SaaS running Google Search and LinkedIn",
      "D2C brands running Meta Advantage+ and Google Performance Max",
      "Education and finance brands with high-intent search demand",
    ],
    outcomes: [
      "CPA reduction of 20–40% within 60–90 days",
      "ROAS uplift of 30–60% via better creative + audience layering",
      "Predictable, scalable spend you can forecast against quarterly revenue targets",
      "Weekly performance reports with insights and next steps, not just charts",
    ],
    faq: [
      { q: "Will you manage just one channel (e.g. only Google)?", a: "Yes. Single-channel engagements start at ₹50k per month management fee. Most businesses get better results from a 2-channel mix." },
      { q: "What ad budget do I need to start?", a: "We work with monthly ad spends from ₹50k to ₹50L. Below ₹50k the optimisation cycle is too slow to be useful; above ₹50L we add a senior strategist to the account." },
      { q: "How do you bill?", a: "Two options: flat monthly fee (best for budgets under ₹5L) or 10–15% of ad spend (best for larger accounts). No hidden percentages, no kickbacks from platforms." },
    ],
  },
  {
    slug: "local-seo",
    title: "Local SEO",
    shortTitle: "Local SEO",
    blurb: "Own your city's search. Google Business Profile, citations, reviews, local pages.",
    features: ["GBP optimisation", "Local citations", "Review automation", "Map pack tracking"],
    fromCss: "#14B8A6", toCss: "#10B981",  // teal-500 → emerald-500
    icon: "📍",
    intro: [
      "If your customers find you by typing “near me” into Google, you do not need national SEO — you need to dominate the local 3-pack. Local SEO is the highest-ROI channel most local businesses ignore until it is too late.",
      "We optimise your Google Business Profile, build relevant citations, automate review collection, and ship hyper-local landing pages. The result: you outrank competitors on Maps and capture the 70% of local searches that never click past the top 3 results.",
    ],
    process: [
      { step: "GBP audit + optimisation", desc: "Google Business Profile categories, services, hours, photos, Q&A, posts. Every field optimised, weekly photo + post cadence set up." },
      { step: "Local citations", desc: "100+ NAP-consistent listings on Justdial, Sulekha, IndiaMART, BBB, Yelp, and the directories that actually move rankings." },
      { step: "Review automation", desc: "SMS and email flows that ask happy customers for Google reviews at the right moment. Reputation management to address negative reviews professionally." },
      { step: "Local landing pages", desc: "City-specific or area-specific pages on your site, each targeting one keyword cluster (e.g. dentist + Andheri-East)." },
      { step: "Local link building + tracking", desc: "Partnerships with local blogs, sponsorships, chamber memberships. Map-pack ranking tracker so you see week-over-week movement." },
    ],
    idealFor: [
      "Multi-location service businesses (clinics, salons, gyms, restaurants, retail)",
      "Single-location brick-and-mortar wanting to dominate one city or area",
      "Trade and home services (plumbers, electricians, AC repair, packers)",
      "Professional services (lawyers, CAs, doctors, real estate agents) with a local catchment",
    ],
    outcomes: [
      "Top-3 ranking on Google Maps for primary commercial keywords within 90–180 days",
      "2–4x increase in calls and direction-requests from your GBP",
      "50–80 new Google reviews in the first 6 months via review automation",
      "Steady inbound leads from “near me” searches without paying for ads",
    ],
    faq: [
      { q: "How is Local SEO different from regular SEO?", a: "Regular SEO targets organic search results. Local SEO targets the Map pack (3-pack), Google Business Profile rankings, and “near me” intent. The signals Google uses are different (proximity, prominence, relevance, reviews)." },
      { q: "Do I need a separate website for each location?", a: "No. One website with well-built location pages is plenty for businesses with up to 10 locations. Beyond that we discuss multi-site or store-locator architecture." },
      { q: "Can you help if my business is brand new with no reviews?", a: "Yes — we kickstart the review flywheel by setting up the request automation from day one. New profiles take 60–90 days to start ranking; we use that time to build the foundation right." },
    ],
  },
];

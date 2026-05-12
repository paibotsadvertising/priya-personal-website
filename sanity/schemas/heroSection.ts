import { defineType, defineField } from "sanity";

export default defineType({
  name: "heroSection",
  title: "Hero Section (Homepage)",
  type: "document",
  fields: [
    defineField({ name: "badgeText", type: "string", initialValue: "Premium Digital Marketing Solutions" }),
    defineField({ name: "headlineLine1", type: "string", description: "Top line of the hero, e.g. \"Elevate Your\"" }),
    defineField({
      name: "rotatingWords",
      type: "array",
      of: [{ type: "string" }],
      description: "Words that animate in/out under the headline. First entry is shown initially.",
      validation: (r) => r.min(1),
    }),
    defineField({ name: "subheadline", type: "text", rows: 3 }),
    defineField({ name: "primaryCtaLabel", type: "string", initialValue: "Get Started" }),
    defineField({ name: "primaryCtaHref", type: "string", initialValue: "#contact" }),
    defineField({ name: "secondaryCtaLabel", type: "string", initialValue: "View Our Work" }),
    defineField({ name: "secondaryCtaHref", type: "string", initialValue: "#results" }),
    defineField({
      name: "credStrip",
      title: "Credibility strip items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", description: "e.g. \"ad spend managed\"" },
            { name: "staticValue", type: "string", description: "Plain text value, used if 'count' is empty (e.g. \"24/7\")" },
            {
              name: "count",
              type: "object",
              description: "Optional animated count-up. Leave blank to show staticValue.",
              fields: [
                { name: "to", type: "number" },
                { name: "decimals", type: "number", initialValue: 0 },
                { name: "prefix", type: "string" },
                { name: "suffix", type: "string" },
              ],
            },
          ],
          preview: { select: { title: "label", subtitle: "staticValue" } },
        },
      ],
    }),
    defineField({
      name: "statCards",
      title: "Stat cards (4-up grid)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", description: "Caption under the value" },
            { name: "staticValue", type: "string", description: "Plain text value, used if 'count' is empty (e.g. \"#1\")" },
            { name: "fromCss", type: "string" },
            { name: "toCss", type: "string" },
            {
              name: "count",
              type: "object",
              fields: [
                { name: "to", type: "number" },
                { name: "decimals", type: "number", initialValue: 0 },
                { name: "suffix", type: "string" },
              ],
            },
          ],
          preview: { select: { title: "label", subtitle: "staticValue" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "headlineLine1", subtitle: "badgeText" } },
});

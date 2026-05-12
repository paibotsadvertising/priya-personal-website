import { defineType, defineField } from "sanity";

export default defineType({
  name: "resultMetric",
  title: "Result / Case Win",
  type: "document",
  fields: [
    defineField({ name: "tag", type: "string", description: "e.g. D2C Skincare", validation: (r) => r.required() }),
    defineField({ name: "metric", type: "string", description: "Headline number, e.g. +312% or ₹14L → ₹68L" }),
    defineField({ name: "metricLabel", type: "string", description: "e.g. revenue in 6 months" }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({ name: "fromCss", type: "string" }),
    defineField({ name: "toCss", type: "string" }),
    defineField({
      name: "count",
      type: "object",
      description: "Optional count-up animation. Leave blank to display the metric string as-is.",
      fields: [
        { name: "to", type: "number" },
        { name: "prefix", type: "string" },
        { name: "suffix", type: "string" },
      ],
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "tag", subtitle: "metric" } },
});

import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "shortTitle", type: "string" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "blurb", type: "text", rows: 2 }),
    defineField({ name: "icon", type: "string", description: "Emoji shown in the service tile" }),
    defineField({ name: "fromCss", type: "string", description: "Gradient start (hex), e.g. #2563EB" }),
    defineField({ name: "toCss", type: "string", description: "Gradient end (hex), e.g. #9333EA" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "process",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "step", type: "string", validation: (r) => r.required() },
            { name: "desc", type: "text", rows: 3 },
          ],
          preview: { select: { title: "step", subtitle: "desc" } },
        },
      ],
    }),
    defineField({ name: "idealFor", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "outcomes", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "faq",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "q", title: "Question", type: "string" },
            { name: "a", title: "Answer", type: "text", rows: 3 },
          ],
          preview: { select: { title: "q", subtitle: "a" } },
        },
      ],
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "blurb" } },
});

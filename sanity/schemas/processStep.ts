import { defineType, defineField } from "sanity";

export default defineType({
  name: "processStep",
  title: "Process Step (Homepage)",
  type: "document",
  fields: [
    defineField({ name: "n", title: "Number label", type: "string", description: "e.g. 01, 02" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({ name: "fromCss", type: "string" }),
    defineField({ name: "toCss", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "n" } },
});

import { defineType, defineField } from "sanity";

export default defineType({
  name: "quickWin",
  title: "Quick Win (Fast-Track Service)",
  type: "document",
  fields: [
    defineField({ name: "icon", type: "string", description: "Emoji" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});

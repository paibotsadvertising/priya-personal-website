import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "shortName", type: "string" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string", description: "Display phone, e.g. +91-8318406327" }),
    defineField({ name: "phoneRaw", type: "string", description: "Used for tel: links, e.g. +918318406327" }),
    defineField({ name: "whatsapp", type: "url" }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        { name: "line1", type: "string" },
        { name: "line2", type: "string" },
        { name: "city", type: "string" },
        { name: "state", type: "string" },
        { name: "country", type: "string" },
      ],
    }),
    defineField({
      name: "social",
      type: "object",
      fields: [
        { name: "instagram", type: "url" },
        { name: "facebook", type: "url" },
        { name: "linkedin", type: "url" },
        { name: "youtube", type: "url" },
        { name: "googleBusiness", type: "url" },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline" },
  },
});

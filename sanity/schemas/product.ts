import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product (Buy-Now Package)",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "blurb", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "features",
      title: "Bullet features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "price",
      title: "Price (INR)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({ name: "icon", type: "string", description: "Emoji" }),
    defineField({ name: "fromCss", title: "Gradient from (hex)", type: "string", initialValue: "#2563EB" }),
    defineField({ name: "toCss", title: "Gradient to (hex)", type: "string", initialValue: "#9333EA" }),
    defineField({
      name: "paymentUrl",
      title: "Razorpay payment URL",
      type: "url",
      description: "Hosted Razorpay Payment Page URL for this product. Buy button links here.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "price", media: "icon" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? "₹" + subtitle.toLocaleString("en-IN") : "—" };
    },
  },
});

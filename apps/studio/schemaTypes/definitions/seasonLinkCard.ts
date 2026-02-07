// seasonLinkCard.ts
import { defineField, defineType } from "sanity";

export const seasonLinkCard = defineType({
  name: "seasonLinkCard",
  title: "Sammanfattningsvideos",
  type: "object",
  fields: [
    defineField({ name: "badge", title: "Badge", type: "string", validation: (R) => R.required() }),
    defineField({ name: "title", title: "Titel", type: "string", validation: (R) => R.required() }),
    defineField({ name: "description", title: "Beskrivning", type: "text" }),
    defineField({
      name: "href",
      title: "Länk",
      type: "url",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "variant",
      title: "Färgvariant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Accent", value: "accent" },
        ],
      },
      initialValue: "primary",
    }),
  ],
});
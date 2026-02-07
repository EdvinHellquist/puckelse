import { defineArrayMember, defineField, defineType } from "sanity";

export const recapItem = defineType({
  name: "recapItem",
  title: "Recap Item",
  type: "object",
  fields: [
    defineField({ name: "category", type: "string", title: "Kategori", description: 'Ex: "WorldCup", "EuropaCup", "SM", "Galleri"', validation: (R) => R.required() }),
    defineField({ name: "title", type: "string", title: "Titel", validation: (R) => R.required() }),
    defineField({ name: "description", type: "text", title: "Beskrivning", rows: 2 }),
    defineField({
      name: "url",
      type: "url",
      title: "Video-/inläggslänk",
      description: "YouTube / Instagram / annan social media",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt-text" })],
    }),
  ],
});

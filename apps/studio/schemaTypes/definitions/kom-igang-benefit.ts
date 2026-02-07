import { defineField, defineType } from "sanity"

export const komIgangBenefit = defineType({
  name: "komIgangBenefit",
  title: "Benefit",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      options: {
        list: [
          { title: "Zap", value: "Zap" },
          { title: "Users", value: "Users" },
          { title: "Trophy", value: "Trophy" },
          { title: "MapPin", value: "MapPin" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
})

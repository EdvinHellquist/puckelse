import { DocumentIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from "sanity"

export const komIgangPage = defineType({
  name: "komIgangPage",
  title: "Kom igång",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Rubrik",
      type: "string",
      initialValue: "Kom igång med Puckel!",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Underrubrik",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(20).max(220),
    }),

    defineField({
      name: "about",
      title: "Vad är puckelpist?",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Bild",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "cardTitle",
          title: "Kort-rubrik",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "cardBody",
          title: "Kort-text",
          type: "text",
          rows: 6,
          validation: (Rule) => Rule.required().min(60),
        }),
      ],
    }),

    defineField({
      name: "benefitsTitle",
      title: "Rubrik för benefits",
      type: "string",
      initialValue: "Varför Puckel?",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "benefits",
      title: "Benefits-kort",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: "komIgangBenefit",
        }),
      ],
    }),
  ],
})

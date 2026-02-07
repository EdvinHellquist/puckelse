import { defineArrayMember, defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const sponsorerPage = defineType({
  name: "sponsorerPage",
  title: "Sponsorer-sida",
  type: "document",
  icon: FileText,
  fields: [
    defineField({
      name: "title",
      title: "Rubrik",
      type: "string",
      initialValue: "Bli Sponsor",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Underrubrik",
      type: "text",
      rows: 3,
      initialValue:
        "Stöd svensk puckelåkning och få exponering i en av de mest spektakulära vintersporterna. Med parra som ny OS-sport 2026 är detta en perfekt tidpunkt att hoppa på!",
    }),

    defineField({
      name: "heroImage",
      title: "Hero-bild",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-text",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "benefitsTitle",
      title: "Rubrik: Benefits-sektion",
      type: "string",
      initialValue: "Varför Sponsra Puckel?",
    }),

    defineField({
      name: "benefits",
      title: "Benefits-kort",
      type: "array",
      of: [
        defineArrayMember({
          name: "benefit",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Ikon (Lucide namn)",
              type: "string",
              description: 'Ex: "Trophy", "Users", "TrendingUp", "Star"',
            }),
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Beskrivning",
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
    }),

    defineField({
      name: "packagesTitle",
      title: "Rubrik: Sponsorpaket",
      type: "string",
      initialValue: "Våra Sponsorpaket",
    }),

    defineField({
      name: "packages",
      title: "Sponsorpaket",
      type: "array",
      of: [
        defineArrayMember({
          name: "package",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Namn",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "price",
              title: "Prisrad",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "featured",
              title: "Populärast?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "features",
              title: "Punkter",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "price", featured: "featured" },
            prepare: ({ title, subtitle, featured }) => ({
              title: `${featured ? "⭐ " : ""}${title ?? "Paket"}`,
              subtitle,
            }),
          },
        }),
      ],
    }),
  ],
});

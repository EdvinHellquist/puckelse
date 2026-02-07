import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export const news = defineType({
  name: "news",
  title: "Nyheter",
  type: "document",
  icon: Newspaper,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Ingress",
      type: "text",
      rows: 3,
      description: "Kort text som visas på startsidan",
      validation: (Rule) => Rule.required().min(30).max(220),
    }),
    defineField({
      name: "publishedAt",
      title: "Publicerad",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Bild",
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
      name: "link",
      title: "Länk (valfri)",
      type: "url",
      description: "Om nyheten ska länka vidare någonstans",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString("sv-SE") : "";
      return {
        title,
        subtitle: date ? `Publicerad: ${date}` : "Ingen publiceringsdatum",
        media,
      };
    },
  },
});

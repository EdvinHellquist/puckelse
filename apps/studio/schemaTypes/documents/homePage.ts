import { defineField, defineType } from "sanity";
import { HomeIcon } from "lucide-react";

export const homePage = defineType({
  name: "homePage",
  title: "Startsida",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      initialValue: "Startsida",
      readOnly: true,
    }),
    defineField({
      name: "heroTitle",
      title: "Hero-rubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero-underrubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroLead",
      title: "Hero-text (liten)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(30).max(220),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroLogo",
      title: "Hero-logga (valfri)",
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
  ],
});

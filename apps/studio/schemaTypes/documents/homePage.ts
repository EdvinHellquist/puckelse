import { defineField, defineType } from "sanity";
import { HomeIcon } from "lucide-react";

export const homePage = defineType({
  name: "homePage",
  title: "Startsida",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sponsors", title: "Huvudsponsorer" },
    { name: "news", title: "Nyheter" },
    { name: "clubs", title: "Klubbar" },
    { name: "contact", title: "Kontakt" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      initialValue: "Startsida",
      readOnly: true,
      group: "hero",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero-överrubrik",
      type: "string",
      description: 'Den lilla texten ovanför rubriken, ex: "Ski Team Sweden Moguls"',
      validation: (Rule) => Rule.required(),
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero-rubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "hero",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero-underrubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "hero",
    }),
    defineField({
      name: "heroLead",
      title: "Hero-text (liten)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(30).max(220),
      group: "hero",
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
      group: "hero",
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
      group: "hero",
    }),
    defineField({
      name: "mainSponsors",
      title: "Huvudsponsorer",
      type: "array",
      group: "sponsors",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Namn", validation: (R) => R.required() },
            { name: "url", type: "url", title: "Länk" },
            {
              name: "logo",
              type: "image",
              title: "Logotyp",
              options: { hotspot: true },
              validation: (R) => R.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "newsSection",
      title: "Nyheter – rubrik",
      type: "sectionIntro",
      group: "news",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "clubsSection",
      title: "Klubbar – rubrik",
      type: "sectionIntro",
      group: "clubs",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "contactSection",
      title: "Kontakt – rubrik",
      type: "sectionIntro",
      group: "contact",
      validation: (R) => R.required(),
    }),
  ],
});

import { defineField, defineType } from "sanity";

// Rubrikblocket överst i en sektion på startsidan: liten överrubrik, rubrik och ingress.
export const sectionIntro = defineType({
  name: "sectionIntro",
  title: "Sektionsrubrik",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Överrubrik",
      type: "string",
      description: "Den lilla texten ovanför rubriken",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "title",
      title: "Rubrik",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "intro",
      title: "Ingress",
      type: "text",
      rows: 3,
    }),
  ],
});

// Enkel länk med text, används för t.ex. Skidförbundet och footerns externa länkar.
export const labeledLink = defineType({
  name: "labeledLink",
  title: "Länk",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Text", type: "string", validation: (R) => R.required() }),
    defineField({ name: "url", title: "URL", type: "url", validation: (R) => R.required() }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});

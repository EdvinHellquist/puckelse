import { defineField, defineType } from "sanity";
import { Trophy } from "lucide-react";

// Texterna till Framgångar-sektionen (resultat per säsong och Hall of Fame).
export const freestyleSpiritPage = defineType({
  name: "freestyleSpiritPage",
  title: "Freestyle Spirit (sida)",
  type: "document",
  icon: Trophy,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Överrubrik",
      description: "Den lilla texten ovanför rubriken i Framgångar",
      initialValue: "Freestyle Spirit",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "heading",
      type: "string",
      title: "Rubrik",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 2,
      title: "Ingress",
    }),
    defineField({
      name: "hallOfFameTitle",
      type: "string",
      title: "Hall of Fame – rubrik",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "hallOfFameIntro",
      type: "text",
      rows: 2,
      title: "Hall of Fame – ingress",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Underrubrik (visas inte just nu)",
      initialValue: "Hall of Fame - Våra stoltheter genom åren",
    }),
    defineField({
      name: "heroImage",
      title: "Bild (visas inte just nu)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt-text" })],
    }),
  ],
});

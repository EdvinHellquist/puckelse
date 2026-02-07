import { defineField, defineType } from "sanity";
import { Trophy } from "lucide-react";

export const freestyleSpiritPage = defineType({
  name: "freestyleSpiritPage",
  title: "Freestyle Spirit (sida)",
  type: "document",
  icon: Trophy,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Rubrik",
      initialValue: "Freestyle Spirit",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Underrubrik",
      initialValue: "Hall of Fame - Våra stoltheter genom åren",
    }),
    defineField({
      name: "heroImage",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt-text" })],
    }),
  ],
});

import { defineField, defineType } from "sanity";
import { User } from "lucide-react";

export const legendSkier = defineType({
  name: "legendSkier",
  title: "Legendarisk åkare",
  type: "document",
  icon: User,
  fields: [
    defineField({ name: "name", type: "string", title: "Namn", validation: (R) => R.required() }),
    defineField({
      name: "photo",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt-text" })],
    }),
    defineField({ name: "bio", type: "text", title: "Kort bio", rows: 4 }),
    defineField({ name: "era", type: "string", title: "Era", description: 'Ex: "2000-talet", "2020-talet"' }),

    // Stats (du kan lägga till fler senare)
    defineField({ name: "osMedals", type: "number", title: "OS-medaljer", initialValue: 0 }),
    defineField({ name: "vmMedals", type: "number", title: "VM-medaljer", initialValue: 0 }),
    defineField({ name: "wcWins", type: "number", title: "Världscup-segrar", initialValue: 0 }),
    defineField({ name: "jvmMedals", type: "number", title: "Junior-VM-medaljer", initialValue: 0 }),
    defineField({ name: "ecWins", type: "number", title: "Europacup-segrar", initialValue: 0 }),
    defineField({ name: "smMedals", type: "number", title: "SM-medaljer", initialValue: 0 }),
  ],
});

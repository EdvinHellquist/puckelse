import { defineArrayMember, defineField, defineType } from "sanity";
import { CalendarDays } from "lucide-react";

export const season = defineType({
  name: "season",
  title: "Säsong",
  type: "document",
  icon: CalendarDays,
  fields: [
    defineField({
      name: "label",
      title: "Säsong label",
      type: "string",
      description: 'Ex: "2024/2025"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "yearStart",
      title: "Startår",
      type: "number",
      description: "Ex: 2024 (används för sortering)",
      validation: (R) => R.required(),
    }),

    defineField({
      name: "worldCupResults",
      title: "World Cup resultat",
      type: "array",
      of: [defineArrayMember({ type: "seasonResult" })],
    }),
    defineField({
      name: "europaCupResults",
      title: "Europa Cup resultat",
      type: "array",
      of: [defineArrayMember({ type: "seasonResult" })],
    }),
    defineField({
      name: "svenskaCupenResults",
      title: "Svenska Cupen resultat",
      type: "array",
      of: [defineArrayMember({ type: "seasonResult" })],
    }),
    defineField({
      name: "ymgResults",
      title: "YMG resultat",
      type: "array",
      of: [defineArrayMember({ type: "seasonResult" })],
    }),

    // Om du vill räkna OS/VM dynamiskt också:
    defineField({
      name: "osResults",
      title: "OS resultat",
      type: "array",
      of: [defineArrayMember({ type: "seasonResult" })],
    }),
    defineField({
      name: "vmResults",
      title: "VM resultat",
      type: "array",
      of: [defineArrayMember({ type: "seasonResult" })],
    }),
  ],
  orderings: [
    {
      title: "Senaste först",
      name: "yearDesc",
      by: [{ field: "yearStart", direction: "desc" }],
    },
  ],
});

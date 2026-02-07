import { defineField, defineType } from "sanity";

export const seasonResult = defineType({
  name: "seasonResult",
  title: "Season Result",
  type: "object",
  fields: [
    defineField({ name: "competition", type: "string", title: "Tävling", validation: (R) => R.required() }),
    defineField({ name: "date", type: "string", title: "Datum", description: "Ex: 30 nov 2024", validation: (R) => R.required() }),
    defineField({ name: "discipline", type: "string", title: "Gren", description: 'Ex: "MO" / "DM"', validation: (R) => R.required() }),
    defineField({ name: "skier", type: "string", title: "Åkare", validation: (R) => R.required() }),
    defineField({ name: "place", type: "number", title: "Placering", validation: (R) => R.required().min(1) }),

    // För Hall of Fame-beräkning (valfritt men bra):
    defineField({
      name: "level",
      title: "Nivå",
      type: "string",
      options: {
        list: [
          { title: "World Cup", value: "WC" },
          { title: "Europa Cup", value: "EC" },
          { title: "Svenska Cupen", value: "SC" },
          { title: "YMG", value: "YMG" },
          { title: "VM", value: "VM" },
          { title: "OS", value: "OS" },
          { title: "Övrigt", value: "OTHER" },
        ],
      },
      initialValue: "WC",
      validation: (R) => R.required(),
    }),
  ],
});

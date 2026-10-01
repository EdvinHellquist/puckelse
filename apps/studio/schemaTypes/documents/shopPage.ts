import { defineArrayMember, defineField, defineType } from "sanity";
import { ShoppingBag } from "lucide-react";

export const shopPage = defineType({
  name: "shopPage",
  title: "Shop",
  type: "document",
  icon: ShoppingBag,
  fields: [
    defineField({
      name: "header",
      title: "Rubrik",
      type: "sectionIntro",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "shopUrl",
      title: "Länk till webshopen",
      type: "url",
      description: "Används av shopknappen i hero och knappen längst ner i shop-sektionen",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "products",
      title: "Produkter",
      type: "array",
      of: [
        defineArrayMember({
          name: "product",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Namn", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "price",
              title: "Pris",
              type: "string",
              description: 'Ex: "499 kr"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "url",
              title: "Länk till produkten",
              type: "url",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "image",
              title: "Bild",
              type: "image",
              validation: (R) => R.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "price", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Rutan längst ner",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Överrubrik", type: "string", validation: (R) => R.required() }),
        defineField({ name: "title", title: "Rubrik", type: "string", validation: (R) => R.required() }),
        defineField({ name: "text", title: "Text", type: "string" }),
      ],
      validation: (R) => R.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Shop" }) },
});

// apps/studio/schemaTypes/common.ts
import { defineField, type ImageRule, type ImageValue, type ValidationBuilder } from "sanity";

// Minimal, template-fri helpers.
// Behåll gärna dessa – de är bra när du senare kopplar in innehåll igen.

export const richTextField = defineField({
  name: "richText",
  type: "richText",
  title: "Rich text",
  description: "Text with formatting (bold, links, lists, etc).",
});

export const imageWithAltField = ({
  name = "image",
  title = "Image",
  description = "Add an image and an alt text. Use hotspot to control crop focus.",
  validation,
}: {
  name?: string;
  title?: string;
  description?: string;
  validation?: ValidationBuilder<ImageRule, ImageValue>;
} = {}) =>
  defineField({
    name,
    type: "image",
    title,
    description,
    validation,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt text",
        description: "Describe the image for screen readers and SEO.",
      }),
    ],
  });

export const documentSlugField = ({
  name = "slug",
  title = "URL",
  description = "Automatically generated from title, but can be edited.",
}: {
  name?: string;
  title?: string;
  description?: string;
} = {}) =>
  defineField({
    name,
    type: "slug",
    title,
    description,
    options: {
      source: "title",
      maxLength: 96,
    },
    validation: (Rule) => Rule.required().error("A URL slug is required"),
  });
// apps/studio/schemaTypes/documents/page.ts
import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { documentSlugField, imageWithAltField } from "@/schemaTypes/common";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  description: "A basic page with title, slug, description and content.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required().error("A page title is required"),
    }),

    defineField({
      name: "description",
      type: "text",
      title: "SEO description",
      description: "Short summary for search engines (recommended 140–160 chars).",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("Try to keep this under 160 characters."),
    }),

    documentSlugField(),

    imageWithAltField({
      name: "image",
      title: "Main image",
      description: "Optional image used for sharing/SEO previews.",
    }),

    defineField({
      name: "content",
      type: "richText",
      title: "Content",
      description: "Optional page content (simple rich text).",
    }),
  ],

  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      media: "image",
    },
    prepare: ({ title, slug, media }) => ({
      title: title || "Untitled page",
      subtitle: slug ? `/${slug}` : "No slug",
      media,
    }),
  },
});

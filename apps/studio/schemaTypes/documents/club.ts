import { defineField, defineType } from "sanity";
import { MapPin } from "lucide-react";

// Ungefärlig ruta runt Sverige — fångar omkastade lat/lng och felklistrade koordinater.
const SWEDEN_BOUNDS = { minLat: 55, maxLat: 69.1, minLng: 10.9, maxLng: 24.2 };

export const club = defineType({
  name: "club",
  title: "Klubb",
  type: "document",
  icon: MapPin,
  fields: [
    defineField({
      name: "name",
      title: "Namn",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "city",
      title: "Ort",
      type: "string",
      description: 'Visas under namnet, ex: "Åre"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "location",
      title: "Position på kartan",
      type: "geopoint",
      description:
        "Högerklicka på platsen i Google Maps och klicka på koordinaterna för att kopiera dem. Första siffran är latitud (ca 55–69), andra är longitud (ca 11–24).",
      validation: (R) =>
        R.required().custom((point) => {
          if (!point?.lat || !point?.lng) return true;
          const { minLat, maxLat, minLng, maxLng } = SWEDEN_BOUNDS;
          const inside =
            point.lat >= minLat && point.lat <= maxLat && point.lng >= minLng && point.lng <= maxLng;
          return inside || "Punkten hamnar utanför Sverige — har latitud och longitud blivit omkastade?";
        }),
    }),
    defineField({
      name: "logo",
      title: "Logga",
      type: "image",
      fields: [defineField({ name: "alt", type: "string", title: "Alt-text" })],
    }),
    defineField({
      name: "website",
      title: "Webbplats",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "contactName",
      title: "Kontaktperson",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "E-post",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
  ],
  orderings: [
    {
      title: "Namn A–Ö",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "city", media: "logo" },
  },
});

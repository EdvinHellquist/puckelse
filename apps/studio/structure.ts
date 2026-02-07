// apps/studio/structure.ts
import { DollarSign, File, HandMetal, HomeIcon, ListStart, Newspaper, Settings2 } from "lucide-react";
import type { StructureBuilder, StructureResolverContext } from "sanity/structure";

export const structure = (S: StructureBuilder, _context: StructureResolverContext) =>
  S.list()
    .title("Content")
    .items([
      // Singleton: Startsida
      S.listItem()
        .title("Startsida")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
        ),
      S.listItem()
        .title("Kom igång")
        .icon(ListStart)
        .child(
          S.document()
            .schemaType("komIgangPage")
            .documentId("komIgangPage")
        ),

      S.listItem()
        .title("Sponsorer")
        .icon(DollarSign)
        .child(
          S.document()
            .schemaType("sponsorerPage")
            .documentId("sponsorerPage")),

      S.listItem()
        .title("Freestyle Spirit")
        .icon(HandMetal)
        .child(
          S.document()
            .schemaType("freestyleSpiritPage")
            .documentId("freestyleSpiritPage")),

      S.divider(),      
      // Nyheter (lista)
      S.documentTypeListItem("news").title("Nyheter").icon(Newspaper),

      S.divider(),

      S.documentTypeListItem("season").title("Säsonger"),
      
      S.divider(),

      S.documentTypeListItem("legendSkier").title("Legendariska åkare"),
      
      S.divider(),

      // Global settings
      S.documentTypeListItem("settings").title("Settings").icon(Settings2),
    ]);


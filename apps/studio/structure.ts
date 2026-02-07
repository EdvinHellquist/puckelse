// apps/studio/structure.ts
import { File, Settings2 } from "lucide-react";
import type { StructureBuilder, StructureResolverContext } from "sanity/structure";

export const structure = (S: StructureBuilder, _context: StructureResolverContext) =>
  S.list()
    .title("Content")
    .items([
      // Pages
      S.documentTypeListItem("page").title("Pages").icon(File),

      S.divider(),

      // Global settings (om du har kvar settings document)
      S.documentTypeListItem("settings").title("Settings").icon(Settings2),
    ]);

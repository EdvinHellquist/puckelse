// apps/studio/schemaTypes/index.ts
import { documents } from "@/schemaTypes/documents/index";

// Keep only the core object types you want in the Studio right now:
import { richText } from "@/schemaTypes/definitions/rich-text";

export const schemaTypes = [
  ...documents,
  richText,
];

export default schemaTypes;

// apps/studio/schemaTypes/index.ts
import { documents, singletons } from "@/schemaTypes/documents/index";

// Keep only the core object types you want in the Studio right now:
import { richText } from "@/schemaTypes/definitions/rich-text";
import { komIgangBenefit } from "./definitions/kom-igang-benefit";
import { seasonResult } from "./definitions/seasonResult";
import { recapItem } from "./definitions/recapItem";

export const schemaTypes = [
  ...documents,
  ...singletons,
  komIgangBenefit,
  richText,
  seasonResult,
  recapItem,
];

export default schemaTypes;

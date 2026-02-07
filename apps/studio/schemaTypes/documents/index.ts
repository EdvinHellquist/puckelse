import { page } from "@/schemaTypes/documents/page";
import { settings } from "@/schemaTypes/documents/settings";

export const singletons = [settings,];

export const documents = [page, ...singletons];

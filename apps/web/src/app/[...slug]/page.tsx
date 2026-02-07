import { Logger } from "@workspace/logger";
import { client } from "@workspace/sanity/client";
import { querySlugPagePaths } from "@workspace/sanity/query";
import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { getSEOMetadata } from "@/lib/seo";

const logger = new Logger("PageSlug");

async function fetchSlugPagePaths() {
  try {
    const slugs = await client.fetch(querySlugPagePaths);

    // If no slugs found, return empty array to prevent build errors
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    const paths: { slug: string[] }[] = [];
    for (const slug of slugs) {
      if (!slug) {
        continue;
      }
      const parts = slug.split("/").filter(Boolean);
      paths.push({ slug: parts });
    }
    return paths;
  } catch (error) {
    logger.error("Error fetching slug paths", error);
    // Return empty array to allow build to continue
    return [];
  }
}


export async function generateStaticParams() {
  const paths = await fetchSlugPagePaths();
  return paths;
}

// Allow dynamic params for paths not generated at build time
export const dynamicParams = true

import { Logger } from "@workspace/logger";
import { client } from "@workspace/sanity/client";
import { querySlugPagePaths, queryPageBySlug } from "@workspace/sanity/query";
import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { getSEOMetadata } from "@/lib/seo";

const logger = new Logger("PageSlug");

async function fetchSlugPagePaths() {
  try {
    const slugs = await client.fetch(querySlugPagePaths);
    if (!Array.isArray(slugs) || slugs.length === 0) return [];

    return slugs
      .filter(Boolean)
      .map((slug: string) => ({ slug: slug.split("/").filter(Boolean) }));
  } catch (error) {
    logger.error("Error fetching slug paths", error);
    return [];
  }
}

export async function generateStaticParams() {
  return await fetchSlugPagePaths();
}

export const dynamicParams = true;

type PageProps = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: PageProps) {
  const slug = (params.slug ?? []).join("/");
  return getSEOMetadata({ slug });
}

export default async function SlugPage({ params }: PageProps) {
  const slug = (params.slug ?? []).join("/");

  if (!slug) return notFound();

  const page = await client.fetch(queryPageBySlug, { slug });

  if (!page?._id) return notFound();

  return (
    <PageBuilder
      id={page._id}
      type={page._type}
      pageBuilder={page.pageBuilder ?? []}
    />
  );
}

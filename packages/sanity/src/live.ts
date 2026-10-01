import { env } from "@workspace/env/server";
import { defineLive } from "next-sanity/live";

import { client } from "./client";

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: env.SANITY_API_READ_TOKEN,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: env.SANITY_API_READ_TOKEN,
  // Live-händelser revaliderar bara när någon besökare har sidan öppen. Utan
  // tidsgräns cachas sidan annars för evigt i produktion, så ändringar som
  // publiceras när ingen är inne syns först vid nästa deploy.
  fetchOptions: { revalidate: 60 },
});

import { sanityFetch } from "@workspace/sanity/live";
import {
  queryGlobalSeoSettings,
} from "@workspace/sanity/query";

export const getNavigationData = async () => {
  const [settingsData] = await Promise.all([
    sanityFetch({ query: queryGlobalSeoSettings }),
  ]);

  return { settingsData: settingsData.data };
};

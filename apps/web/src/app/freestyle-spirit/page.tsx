import { sanityFetch } from "@workspace/sanity/live";
import {
  queryFreestyleSpiritPage,
  querySeasons,
  queryLegendSkiers,
} from "@workspace/sanity/query";
import { FreestyleSpiritClient } from "./ui";


export default async function Page() {
  const [{ data: page }, { data: seasons }, { data: legends }] = await Promise.all([
    sanityFetch({ 
      query: queryFreestyleSpiritPage,
      tags: ["freestyleSpiritPage"]
    }),
    sanityFetch({ 
      query: querySeasons,
      tags: ["seasons"]
    }),
    sanityFetch({ 
      query: queryLegendSkiers,
      tags: ["legendSkiers"]
    }),
  ]);

  return (
    <FreestyleSpiritClient
      page={page}
      seasons={seasons ?? []}
      legends={legends ?? []}
    />
  );
}


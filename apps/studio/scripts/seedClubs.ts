// Laddar apps/studio/.env, så att SANITY_TOKEN kan ligga i en fil i stället
// för att sättas om i skalet vid varje körning.
import "dotenv/config";

import { createClient } from "@sanity/client";

// Källa: https://www.skidor.com/idrotter/puckel/mer-om-puckel/klubbar (uppdaterad 2025-02-21).
// Webbplats, kontaktperson och e-post kommer från listan. Facebook kommer från
// klubbens egen sida. Koordinaterna är geokodade via OpenStreetMap: träningsbacken
// där klubben anger en, annars orten.
//
// createIfNotExists med fasta _id: en omkörning skriver aldrig över ändringar
// som gjorts i Studio. Ta bort dokumentet först om det ska seedas om.

const DRY_RUN = process.env.DRY_RUN === "1";

const client = createClient({
  projectId: "16altlh8",
  dataset: "production",
  apiVersion: "2025-08-29",
  token: process.env.SANITY_TOKEN, // måste ha write access
  useCdn: false,
});

type ClubSeed = {
  _id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  website?: string;
  facebook?: string;
  contactName?: string;
  email?: string;
};

const clubs: ClubSeed[] = [
  {
    _id: "club-gefle-freestyle",
    name: "Gefle Freestyle",
    city: "Gävle",
    lat: 60.675,
    lng: 17.1467,
    contactName: "Jonna Sahlberg",
    email: "sahlberg.jonna@gmail.com",
  },
  {
    _id: "club-lulea-freestyle",
    name: "Luleå Freestyle",
    city: "Måttsund, Luleå",
    // Måttsundsbacken
    lat: 65.5574,
    lng: 21.9242,
    website: "https://mattsund.se/foreningsliv/lulea-freestyle/",
    facebook: "https://www.facebook.com/groups/287496707969926/",
    contactName: "Magnus Öjelind",
    email: "luleafreestyle@hotmail.com",
  },
  {
    _id: "club-uhsk-freeskiing",
    name: "UHSK Freeskiing",
    city: "Umeå",
    // Bräntberget
    lat: 63.8395,
    lng: 20.3065,
    website: "https://uhsk.nu/freeskiing",
    facebook: "https://www.facebook.com/groups/132350673488864/",
    contactName: "Kalle Hellqvist",
    // Listan visar "hellqvist" men mailto-länken säger "hellquist" — vi följer
    // den synliga texten, som också matchar namnet.
    email: "carl-gustaf.hellqvist@vannas.se",
  },
  {
    _id: "club-are-slk",
    name: "Åre SLK",
    city: "Åre",
    // Åre skidområde
    lat: 63.4114,
    lng: 13.079,
    website: "http://www.are-slk.se/",
    contactName: "Elisabeth Walz Linde",
    email: "info@are-slk.se",
  },
  {
    _id: "club-landskrona-ski-club",
    name: "Landskrona Ski Club",
    city: "Landskrona",
    lat: 55.8698,
    lng: 12.8297,
    contactName: "Ulf Stenkula",
    email: "stenkula@ektv.nu",
  },
  {
    _id: "club-varmdo-freestyle-mt",
    name: "Värmdö Freestyle MT",
    city: "Värmdö",
    // Gustavsberg, kommunens centralort
    lat: 59.3256,
    lng: 18.3885,
    contactName: "John Brander",
    email: "varmdo.freestyle@gmail.com",
  },
  {
    _id: "club-hogby-alpina-freestyle",
    // Listan skriver "Högbyn Alpina Freestyle", klubben själv "Högby Alpina Freestyle".
    name: "Högby Alpina Freestyle",
    city: "Fagersta",
    // Högbyn
    lat: 59.9632,
    lng: 15.7112,
    website: "https://www.laget.se/HogbyAlpinaSLK",
    facebook: "https://www.facebook.com/groups/544199409472763/",
    contactName: "Mattias Pålsson",
    email: "mattias.palssonpro@gmail.com",
  },
];

async function run() {
  const existing = new Set<string>(
    await client.fetch(`*[_type == "club"]._id`),
  );

  let created = 0;
  for (const { lat, lng, ...club } of clubs) {
    if (existing.has(club._id)) {
      console.log(`  finns redan: ${club.name}`);
      continue;
    }
    console.log(`  + ${club.name} (${club.city}) ${lat}, ${lng}`);
    created++;
    if (DRY_RUN) continue;
    await client.createIfNotExists({
      _type: "club",
      ...club,
      location: { _type: "geopoint", lat, lng },
    });
  }

  console.log(`\n${DRY_RUN ? "[dry-run] " : ""}Skapade ${created} klubb(ar).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

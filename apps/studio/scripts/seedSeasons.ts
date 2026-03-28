import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "16altlh8",
  dataset: "production",
  apiVersion: "2025-08-29",
  token: process.env.SANITY_TOKEN, // måste ha write access
  useCdn: false,
});

type Season = {
  _id: string;
  yearStart: number;
};

async function run() {
  // 1. Hämta befintliga
  const existing: Season[] = await client.fetch(`
    *[_type == "season"]{ _id, yearStart }
  `);

  const existingYears = new Set(existing.map((s) => s.yearStart));

  // 2. Generera alla år
  const allYears: number[] = [];
  for (let year = 1984; year <= 2025; year++) {
    allYears.push(year);
  }

  // 3. Filtrera bort de som redan finns
  const missingYears = allYears.filter((y) => !existingYears.has(y));

  console.log("Saknade år:", missingYears);

  // 4. Skapa dokument
  const docs = missingYears.map((year) => ({
    _type: "season",
    _id: `season-${year}`, // valfri men bra för idempotency
    label: `${year}/${year + 1}`,
    yearStart: year,
  }));

  // 5. Bulk create
  if (docs.length > 0) {
    const tx = client.transaction();

    docs.forEach((doc) => {
      tx.createOrReplace(doc);
    });

    await tx.commit();
    console.log("Skapade:", docs.length);
  } else {
    console.log("Inget att skapa 🎉");
  }
}

run().catch(console.error);
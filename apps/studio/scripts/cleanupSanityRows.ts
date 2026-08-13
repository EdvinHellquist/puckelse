import { createClient } from "@sanity/client";

import { normalizeCompetition, normalizeSkier } from "./aliases.js";
import {
  dateSvToRawDate,
  rowKey,
  type SeasonBuckets,
  type SeasonResult,
} from "./seasonHelpers.js";

const DRY_RUN = process.env.DRY_RUN === "1";

const client = createClient({
  projectId: "16altlh8",
  dataset: "production",
  apiVersion: "2025-08-29",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const BUCKET_FIELDS: (keyof SeasonBuckets)[] = [
  "worldCupResults",
  "europaCupResults",
  "svenskaCupenResults",
  "ymgResults",
  "osResults",
  "vmResults",
  "smResults",
];

type SanitySeason = {
  _id: string;
  label: string;
} & Partial<SeasonBuckets>;

function normalizeRow(row: SeasonResult): SeasonResult {
  const skier = normalizeSkier(row.skier);
  const competition = normalizeCompetition(row.competition);
  const rawDate = dateSvToRawDate(row.date ?? "");
  const key = rawDate
    ? rowKey({ rawDate, competition, skier, discipline: row.discipline, place: row.place })
    : rowKey({ rawDate: "00000000", competition, skier, discipline: row.discipline, place: row.place });
  return { ...row, skier, competition, _key: key };
}

function dedupBucket(rows: SeasonResult[]): { merged: SeasonResult[]; removed: number } {
  const seen = new Map<string, SeasonResult>();
  let removed = 0;
  for (const raw of rows) {
    const normalized = normalizeRow(raw);
    if (seen.has(normalized._key)) {
      removed++;
      continue;
    }
    seen.set(normalized._key, normalized);
  }
  const merged = [...seen.values()].sort((a, b) => {
    const ra = dateSvToRawDate(a.date ?? "");
    const rb = dateSvToRawDate(b.date ?? "");
    return ra.localeCompare(rb);
  });
  return { merged, removed };
}

function bucketsEqual(a: SeasonResult[], b: SeasonResult[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (
      x._key !== y._key ||
      x.skier !== y.skier ||
      x.competition !== y.competition ||
      x.date !== y.date ||
      x.discipline !== y.discipline ||
      x.place !== y.place ||
      x.level !== y.level
    ) {
      return false;
    }
  }
  return true;
}

async function main() {
  const seasons = await client.fetch<SanitySeason[]>(
    `*[_type == "season"] | order(yearStart asc){
      _id, label,
      worldCupResults, europaCupResults, svenskaCupenResults, ymgResults,
      osResults, vmResults, smResults
    }`,
  );

  console.log(`Loaded ${seasons.length} season doc(s)`);

  let touchedSeasons = 0;
  let totalRemoved = 0;
  let totalRewritten = 0;

  for (const season of seasons) {
    const patchPayload: Partial<SeasonBuckets> = {};
    const changes: string[] = [];

    for (const field of BUCKET_FIELDS) {
      const current = season[field] ?? [];
      if (current.length === 0) continue;
      const { merged, removed } = dedupBucket(current);
      if (!bucketsEqual(current, merged)) {
        patchPayload[field] = merged;
        const rewrites = merged.length - (current.length - removed);
        const rewriteCount = merged.filter((m, i) => {
          const src = current[i];
          return !src || src.skier !== m.skier || src.competition !== m.competition;
        }).length;
        changes.push(`${field}: ${current.length} → ${merged.length} (${removed} dupes, ${rewriteCount} rewrites)`);
        totalRemoved += removed;
        totalRewritten += rewriteCount;
      }
    }

    if (changes.length === 0) continue;
    touchedSeasons++;
    console.log(`  ${season.label}:`);
    for (const c of changes) console.log(`    ${c}`);

    if (DRY_RUN) continue;

    await client.patch(season._id).set(patchPayload).commit();
  }

  console.log();
  console.log(
    `${DRY_RUN ? "[dry-run] " : ""}Touched ${touchedSeasons} season(s); removed ${totalRemoved} duplicate row(s); rewrote ${totalRewritten} skier/comp name(s).`,
  );
  if (DRY_RUN) console.log("Re-run without DRY_RUN=1 to commit.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

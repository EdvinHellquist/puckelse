// Laddar apps/studio/.env, så att SANITY_TOKEN kan ligga i en fil i stället
// för att sättas om i skalet vid varje körning.
import "dotenv/config";

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  dedupeRows,
  emptyBuckets,
  formatDateSv,
  getSeasonLabel,
  getSeasonStartYear,
  levelToField,
  rowKey,
  toSeasonResult,
  type RawRow,
  type SeasonBuckets,
  type SeasonResult,
} from "./seasonHelpers.js";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const INPUT_PATH = join(scriptsDir, "fis-results.json");
const DRY_RUN = process.env.DRY_RUN === "1";

const client = createClient({
  projectId: "16altlh8",
  dataset: "production",
  apiVersion: "2025-08-29",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

type SanitySeason = {
  _id: string;
  label: string;
  yearStart: number;
} & Partial<SeasonBuckets>;

function buildSeasonMap(rows: RawRow[]) {
  const map = new Map<string, { yearStart: number; label: string; buckets: SeasonBuckets }>();
  const clean = dedupeRows(rows);

  for (const row of clean) {
    const yearStart = getSeasonStartYear(row.rawDate);
    const label = getSeasonLabel(yearStart);
    const field = levelToField(row.level);
    if (!field) continue;

    if (!map.has(label)) {
      map.set(label, { yearStart, label, buckets: emptyBuckets() });
    }
    map.get(label)!.buckets[field].push(toSeasonResult(row));
  }

  for (const [, season] of map) {
    for (const key of Object.keys(season.buckets) as (keyof SeasonBuckets)[]) {
      season.buckets[key].sort((a, b) => a._key.slice(0, 8).localeCompare(b._key.slice(0, 8)));
    }
  }

  return map;
}

function mergeBucket(existing: SeasonResult[] | undefined, incoming: SeasonResult[]) {
  const kept = existing ?? [];
  const keys = new Set(kept.map((r) => r._key));
  const added: SeasonResult[] = [];

  for (const row of incoming) {
    if (keys.has(row._key)) continue;
    keys.add(row._key);
    added.push(row);
  }

  const merged = [...kept, ...added];
  merged.sort((a, b) => a._key.slice(0, 8).localeCompare(b._key.slice(0, 8)));
  return { merged, added };
}

async function loadInput(): Promise<RawRow[]> {
  const raw = await readFile(INPUT_PATH, "utf8");
  return JSON.parse(raw) as RawRow[];
}

async function main() {
  const rows = await loadInput();
  console.log(`Loaded ${rows.length} row(s) from ${INPUT_PATH}`);

  const seasonMap = buildSeasonMap(rows);
  console.log(`Grouped into ${seasonMap.size} season(s)`);

  const bucketFields: (keyof SeasonBuckets)[] = [
    "worldCupResults",
    "europaCupResults",
    "svenskaCupenResults",
    "ymgResults",
    "vmResults",
    "osResults",
    "smResults",
  ];

  let totalAdded = 0;

  for (const [, season] of seasonMap) {
    const existing = await client.fetch<SanitySeason | null>(
      `*[_type == "season" && label == $label][0]{
        _id, label, yearStart,
        worldCupResults, europaCupResults, vmResults, osResults, smResults
      }`,
      { label: season.label },
    );

    const setPayload: Partial<SeasonBuckets> = {};
    const seasonReport: Array<{ field: string; added: number; sample: string[] }> = [];

    for (const field of bucketFields) {
      const incoming = season.buckets[field];
      if (incoming.length === 0) continue;

      const { merged, added } = mergeBucket(existing?.[field], incoming);
      if (added.length === 0) continue;

      setPayload[field] = merged;
      seasonReport.push({
        field,
        added: added.length,
        sample: added.slice(0, 3).map((r) => `${r.date} ${r.skier} (${r.discipline} p${r.place})`),
      });
      totalAdded += added.length;
    }

    if (seasonReport.length === 0) {
      console.log(`  ${season.label}: no new rows`);
      continue;
    }

    console.log(`  ${season.label}:`);
    for (const r of seasonReport) {
      console.log(`    + ${r.added} into ${r.field}: ${r.sample.join(" | ")}${r.added > 3 ? " ..." : ""}`);
    }

    if (DRY_RUN) continue;

    if (existing?._id) {
      await client
        .patch(existing._id)
        .set({ ...setPayload, yearStart: season.yearStart })
        .commit();
    } else {
      await client.create({
        _type: "season",
        label: season.label,
        yearStart: season.yearStart,
        ...setPayload,
      });
    }
  }

  console.log(`\n${DRY_RUN ? "[dry-run] " : ""}Total rows added: ${totalAdded}`);

  if (DRY_RUN) {
    console.log("Re-run without DRY_RUN=1 (and with SANITY_TOKEN set) to write.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

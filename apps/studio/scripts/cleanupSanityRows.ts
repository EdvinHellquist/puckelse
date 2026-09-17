import { createClient } from "@sanity/client";

import { normalizeCompetition, normalizeSkier } from "./aliases.js";
import {
  dateSvToRawDate,
  formatDateSv,
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

const MONTHS = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

type DateStatus = "ok" | "repaired" | "range" | "invalid";

type DateFix = {
  date: string;
  rawDate: string;
  status: DateStatus;
  /** Bara för intervall: spannet, så rätt dag kan väljas utifrån syskonrader. */
  span?: { startRaw: string; endRaw: string };
};

function editDistance(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(
        prev[j]! + 1,
        prev[j - 1]! + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diag = tmp;
    }
  }
  return prev[b.length]!;
}

/**
 * Lagar datum som `dateSvToRawDate` inte kan tolka, så att raden både går att
 * sortera och kan dedupas mot sin korrekta tvilling:
 *  - felstavad månad ("21 dev 2024" → "21 dec 2024"), max ett teckens skillnad
 *  - intervall ("25-26 jan 2025" → "25 jan 2025"), rapporteras för granskning
 *  - "undefined"/tomt lämnas orört och rapporteras som invalid
 */
function repairDate(input: string | undefined): DateFix {
  const date = (input ?? "").trim();
  const asIs = dateSvToRawDate(date);
  if (asIs) return { date, rawDate: asIs, status: "ok" };

  // Intervall: behåll spannet så att dedupBucket kan välja rätt dag utifrån
  // syskonrader. Första dagen är bara ett fallback.
  const range = /^(\d{1,2})\s*[-–]\s*(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})$/i.exec(date);
  if (range) {
    const month = range[3]!.toLowerCase();
    const startRaw = dateSvToRawDate(`${range[1]} ${month} ${range[4]}`);
    const endRaw = dateSvToRawDate(`${range[2]} ${month} ${range[4]}`);
    if (startRaw && endRaw) {
      return {
        date: formatDateSv(startRaw),
        rawDate: startRaw,
        status: "range",
        span: { startRaw, endRaw },
      };
    }
  }

  // Felstavad månad: närmaste månadsnamn på högst ett teckens avstånd.
  const parts = /^(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})$/i.exec(date);
  if (parts) {
    const typo = parts[2]!.toLowerCase();
    const hit = MONTHS.filter((m) => editDistance(typo, m) <= 1);
    if (hit.length === 1) {
      const candidate = `${parts[1]} ${hit[0]} ${parts[3]}`;
      const raw = dateSvToRawDate(candidate);
      if (raw) return { date: candidate, rawDate: raw, status: "repaired" };
    }
  }

  return { date, rawDate: "", status: "invalid" };
}

type Analyzed = {
  row: SeasonResult;
  rawDate: string;
  status: DateStatus;
  span?: { startRaw: string; endRaw: string };
  /** Identitet utan datum — används bara för att fånga odaterade dubbletter. */
  softKey: string;
};

function analyzeRow(row: SeasonResult): Analyzed {
  const skier = normalizeSkier(row.skier);
  const competition = normalizeCompetition(row.competition);
  const { date, rawDate, status, span } = repairDate(row.date);
  const key = rowKey({
    rawDate: rawDate || "00000000",
    competition,
    skier,
    discipline: row.discipline,
    place: row.place,
  });
  return {
    row: { ...row, skier, competition, date, _key: key },
    rawDate,
    status,
    span,
    softKey: [competition, row.discipline, skier, row.place, row.level].join("|"),
  };
}

type BucketNote = { kind: DateStatus | "undated-dupe"; before: string; row: SeasonResult };

function dedupBucket(rows: SeasonResult[]): {
  merged: SeasonResult[];
  removed: number;
  notes: BucketNote[];
} {
  const analyzed = rows.map((r) => ({ ...analyzeRow(r), before: r.date ?? "" }));

  // Ett intervall som "25-26 jan 2025" säger inte vilken av dagarna raden
  // gäller. Men om andra rader för samma tävling och gren har ett säkert datum
  // inom spannet är det den dagen grenen kördes — använd den i stället för att
  // gissa på första dagen. (I Duved-Åre 2025 låg MO på 25 jan och DM på 26.)
  const eventKey = (a: (typeof analyzed)[number]) =>
    `${a.row.competition}|${a.row.discipline}`;
  const knownDates = new Map<string, Set<string>>();
  for (const a of analyzed) {
    if (a.status !== "ok") continue;
    const set = knownDates.get(eventKey(a)) ?? new Set<string>();
    set.add(a.rawDate);
    knownDates.set(eventKey(a), set);
  }

  for (const a of analyzed) {
    if (a.status !== "range" || !a.span) continue;
    const within = [...(knownDates.get(eventKey(a)) ?? [])].filter(
      (d) => d >= a.span!.startRaw && d <= a.span!.endRaw,
    );
    if (within.length !== 1) continue;
    const rawDate = within[0]!;
    a.rawDate = rawDate;
    a.row = {
      ...a.row,
      date: formatDateSv(rawDate),
      _key: rowKey({
        rawDate,
        competition: a.row.competition,
        skier: a.row.skier,
        discipline: a.row.discipline,
        place: a.row.place,
      }),
    };
  }

  const notes: BucketNote[] = [];
  for (const a of analyzed) {
    if (a.status !== "ok") notes.push({ kind: a.status, before: a.before, row: a.row });
  }

  // Steg 1: en rad vars datum inte går att tolka är överflödig om en rad med
  // samma tävling/gren/åkare/placering har ett användbart datum.
  const datedSoftKeys = new Set(analyzed.filter((a) => a.rawDate).map((a) => a.softKey));
  const kept = analyzed.filter((a) => {
    if (a.rawDate || !datedSoftKeys.has(a.softKey)) return true;
    notes.push({ kind: "undated-dupe", before: a.before, row: a.row });
    return false;
  });

  // Steg 2: exakt dedupe på nyckeln, som nu bygger på det lagade datumet — så
  // "21 dev 2024" kollapsar mot "21 dec 2024". Två rader med olika giltiga
  // datum har olika nyckel och slås aldrig ihop; tävlingshelger med två event
  // på varandra följande dagar är äkta resultat.
  const seen = new Map<string, SeasonResult>();
  let removed = analyzed.length - kept.length;
  for (const a of kept) {
    if (seen.has(a.row._key)) {
      removed++;
      continue;
    }
    seen.set(a.row._key, a.row);
  }

  const merged = [...seen.values()].sort((a, b) =>
    dateSvToRawDate(a.date ?? "").localeCompare(dateSvToRawDate(b.date ?? "")),
  );
  return { merged, removed, notes };
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
  const report: ({ season: string; field: keyof SeasonBuckets } & BucketNote)[] = [];

  for (const season of seasons) {
    const patchPayload: Partial<SeasonBuckets> = {};
    const changes: string[] = [];

    for (const field of BUCKET_FIELDS) {
      const current = season[field] ?? [];
      if (current.length === 0) continue;
      const { merged, removed, notes } = dedupBucket(current);
      for (const n of notes) report.push({ season: season.label, field, ...n });
      if (!bucketsEqual(current, merged)) {
        patchPayload[field] = merged;
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

  const byKind = (kind: BucketNote["kind"]) => report.filter((r) => r.kind === kind);
  const describe = (r: (typeof report)[number]) =>
    `${r.season} ${r.field} — ${r.row.competition} ${r.row.discipline} p${r.row.place} ${r.row.skier}`;

  const sections: [BucketNote["kind"], string][] = [
    ["repaired", "Lagad månadsstavning"],
    ["range", "Datumintervall — dag vald, kontrollera"],
    ["undated-dupe", "Borttagen: otolkbart datum, dublett av en daterad rad"],
    ["invalid", "GÅR EJ ATT LAGA — rätta för hand i Studio"],
  ];

  for (const [kind, title] of sections) {
    const rows = byKind(kind);
    if (rows.length === 0) continue;
    console.log();
    console.log(`${title} (${rows.length}):`);
    for (const r of rows) {
      const shown = r.before === r.row.date ? `"${r.before}"` : `"${r.before}" → "${r.row.date}"`;
      console.log(`  ${shown.padEnd(30)} ${describe(r)}`);
    }
  }

  console.log();
  console.log(
    `${DRY_RUN ? "[dry-run] " : ""}Touched ${touchedSeasons} season(s); removed ${totalRemoved} duplicate row(s); rewrote ${totalRewritten} skier/comp name(s).`,
  );
  const unfixable = byKind("invalid").length;
  if (unfixable > 0) console.log(`${unfixable} row(s) still need a manual date fix.`);
  if (DRY_RUN) console.log("Re-run without DRY_RUN=1 to commit.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

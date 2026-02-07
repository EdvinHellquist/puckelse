// apps/studio/scripts/tsv-season-to-ndjson.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const CATEGORY_TO_FIELD = {
  WC: "worldCupResults",
  EC: "europaCupResults",
  SC: "svenskaCupenResults",
  YMG: "ymgResults",
  OS: "osResults",
  VM: "vmResults",
};

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12);
}

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function parseTsv(tsvText) {
  const lines = stripBom(tsvText)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const header = lines[0].split("\t").map((h) => h.trim());
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const required = ["category", "competition", "date", "discipline", "skier", "place"];
  for (const key of required) {
    if (!(key in idx)) {
      throw new Error(`TSV saknar kolumn: "${key}". Hittade: ${header.join(", ")}`);
    }
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const category = (cols[idx.category] ?? "").trim();
    const competition = (cols[idx.competition] ?? "").trim();
    const date = (cols[idx.date] ?? "").trim();
    const discipline = (cols[idx.discipline] ?? "").trim();
    const skier = (cols[idx.skier] ?? "").trim();
    const placeRaw = (cols[idx.place] ?? "").trim();
    const place = Number(placeRaw);

    if (!category || !competition || !date || !discipline || !skier || !Number.isFinite(place)) {
      // skippar trasiga rader
      continue;
    }

    rows.push({ category, competition, date, discipline, skier, place });
  }

  return rows;
}

function buildSeasonDoc({ seasonId, label, yearStart, rows }) {
  const doc = {
    _type: "season",
    _id: seasonId,
    label,
    yearStart,
    worldCupResults: [],
    europaCupResults: [],
    svenskaCupenResults: [],
    ymgResults: [],
    osResults: [],
    vmResults: [],
    recapItems: [],
  };

  for (const r of rows) {
    const field = CATEGORY_TO_FIELD[r.category];
    if (!field) continue;

    const item = {
      _type: "seasonResult",
      _key: sha1(`${r.category}|${r.competition}|${r.date}|${r.discipline}|${r.skier}|${r.place}`),
      competition: r.competition,
      date: r.date,
      discipline: r.discipline,
      skier: r.skier,
      place: r.place,
      level: r.category, // matchar din schema options (WC/EC/SC/YMG/VM/OS)
    };

    doc[field].push(item);
  }

  return doc;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node scripts/tsv-season-to-ndjson.mjs <path-to-tsv> [out.ndjson]");
    process.exit(1);
  }

  const outPathArg = process.argv[3];
  const absInput = path.resolve(process.cwd(), inputPath);
  const tsv = fs.readFileSync(absInput, "utf8");

  const rows = parseTsv(tsv);

  // ⚠️ Du sa att du redan filtrerat Top 10 i sheetet.
  // Om du vill dubbelsäkra i scriptet också, avkommentera raden nedan:
  // const filtered = rows.filter((r) => r.place <= 10);
  const filtered = rows;

  const doc = buildSeasonDoc({
    seasonId: "season-2024-2025",
    label: "2024/2025",
    yearStart: 2024,
    rows: filtered,
  });

  const outPath = outPathArg
    ? path.resolve(process.cwd(), outPathArg)
    : path.resolve(process.cwd(), "scripts/season-2024-2025.ndjson");

  // Skriv exakt 1 rad (ett dokument) = korrekt för `sanity dataset import`
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(doc) + "\n", "utf8");

  console.log(`✅ Wrote: ${outPath}`);
  console.log(
    `Counts: WC=${doc.worldCupResults.length}, EC=${doc.europaCupResults.length}, SC=${doc.svenskaCupenResults.length}, YMG=${doc.ymgResults.length}, OS=${doc.osResults.length}, VM=${doc.vmResults.length}`
  );
}

main();

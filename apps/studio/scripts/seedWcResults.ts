import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "16altlh8",
  dataset: "production",
  apiVersion: "2025-08-29",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

type Level = "WC" | "EC" | "SC" | "YMG" | "VM" | "OS" | "SM" | "OTHER";
type Discipline = "MO" | "DM";

type RawRow = {
  rawDate: string;      // YYYYMMDD
  competition: string;  // ex "Stoneham, CAN"
  place: number;
  skier: string;
  level: Level;
  discipline: Discipline;
};

type SeasonResult = {
  _key: string;
  competition: string;
  date: string;
  discipline: string;
  skier: string;
  place: number;
  level: Level;
};

type SeasonBuckets = {
  worldCupResults: SeasonResult[];
  europaCupResults: SeasonResult[];
  svenskaCupenResults: SeasonResult[];
  ymgResults: SeasonResult[];
  osResults: SeasonResult[];
  vmResults: SeasonResult[];
  smResults: SeasonResult[];
};

const rawData: RawRow[] = [
  { rawDate: "19840113", competition: "Stoneham, CAN", place: 3, skier: "Lasse Fahlen", level: "WC", discipline: "MO" },
  { rawDate: "19840205", competition: "Courechevel, FRA", place: 3, skier: "Gunnar Moberg", level: "WC", discipline: "MO" },
  { rawDate: "19840227", competition: "Gostling, AUT", place: 2, skier: "Lasse Fahlen", level: "WC", discipline: "MO" },
  { rawDate: "19840321", competition: "Sälen, SWE", place: 3, skier: "Lasse Fahlen", level: "WC", discipline: "MO" },
  { rawDate: "19881217", competition: "La Plagne", place: 3, skier: "Thomas Kristiansson", level: "WC", discipline: "MO" },
  { rawDate: "19890128", competition: "Breckenridge, USA", place: 2, skier: "Leif Persson", level: "WC", discipline: "MO" },
  { rawDate: "19890212", competition: "La Clusaz, FRA", place: 3, skier: "Leif Persson", level: "WC", discipline: "MO" },
  { rawDate: "19910321", competition: "Hundfjället, SWE", place: 2, skier: "Leif Persson", level: "WC", discipline: "MO" },
  { rawDate: "19940121", competition: "Lake Placid, USA", place: 3, skier: "Jörgen Paajarvi", level: "WC", discipline: "MO" },
  { rawDate: "19960306", competition: "Hundfjället, SWE", place: 2, skier: "Jesper Rönnbeck", level: "WC", discipline: "MO" },
  { rawDate: "19961206", competition: "Tignes, FRA", place: 1, skier: "Jesper Rönnbeck", level: "WC", discipline: "MO" },
  { rawDate: "19961216", competition: "La Plagne, FRA", place: 2, skier: "Jesper Rönnbeck", level: "WC", discipline: "MO" },
  { rawDate: "19970107", competition: "Mont Treblant, CAN", place: 1, skier: "Jesper Rönnbeck", level: "WC", discipline: "MO" },
  { rawDate: "19980309", competition: "Hundfjället, SWE", place: 2, skier: "Jesper Rönnbeck", level: "WC", discipline: "MO" },
  { rawDate: "20091211", competition: "Suomu, FIN", place: 1, skier: "Jesper Björnlund", level: "WC", discipline: "MO" },
  { rawDate: "20091212", competition: "Suomu, FIN", place: 1, skier: "Jesper Björnlund", level: "WC", discipline: "MO" },
  { rawDate: "20100221", competition: "Lake Placid, USA", place: 3, skier: "Jesper Björnlund", level: "WC", discipline: "MO" },
  { rawDate: "20100312", competition: "Åre, SWE", place: 1, skier: "Jesper Björnlund", level: "WC", discipline: "MO" },
  { rawDate: "20160204", competition: "Deer Valley, USA", place: 3, skier: "Ludvig Fjällström", level: "WC", discipline: "MO" },
  { rawDate: "20170121", competition: "Val St-Come, CAN", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20181207", competition: "Ruka, FIN", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20190112", competition: "Calgary, CAN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20190118", competition: "Lake Placid, USA", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20190302", competition: "Shymbulak, KAZ", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20191207", competition: "Ruka, FIN", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20200201", competition: "Calgary, CAN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20200206", competition: "Deer Valley, USA", place: 3, skier: "Felix Olofsson", level: "WC", discipline: "MO" },
  { rawDate: "20201205", competition: "Ruka, FIN", place: 3, skier: "Ludvig Fjällström", level: "WC", discipline: "MO" },
  { rawDate: "20211211", competition: "Idre, SWE", place: 2, skier: "Albin Holmgren", level: "WC", discipline: "MO" },
  { rawDate: "20220107", competition: "Tremblant, CAN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20220108", competition: "Tremblant, CAN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20220114", competition: "Deer Valley, USA", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20221210", competition: "Idre, SWE", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20230127", competition: "Val St-Come, CAN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20231202", competition: "Ruka, FIN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20231208", competition: "Idre, SWE", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "MO" },
  { rawDate: "20231222", competition: "Bakurani, GEO", place: 2, skier: "Filip Gravenfors", level: "WC", discipline: "MO" },
  { rawDate: "20240119", competition: "Val St-Come, CAN", place: 1, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20240119", competition: "Val St-Come, CAN", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "MO" },
  { rawDate: "20240201", competition: "Deer Valley, USA", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "MO" },
  { rawDate: "20241130", competition: "Ruka, FIN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20241206", competition: "Idre, SWE", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20250221", competition: "Beidahu, CHN", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "MO" },
  { rawDate: "20251207", competition: "Ruka, FIN", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "MO" },
  { rawDate: "20260116", competition: "Waterville, USA", place: 2, skier: "Filip Gravenfors", level: "WC", discipline: "MO" },

  { rawDate: "19951211", competition: "Tignes, FRA", place: 3, skier: "Anders Jonell", level: "WC", discipline: "DM" },
  { rawDate: "19960307", competition: "Hundfjället, SWE", place: 1, skier: "Jesper Rönnbeck", level: "WC", discipline: "DM" },
  { rawDate: "19960307", competition: "Hundfjället, SWE", place: 3, skier: "Kurre Landsburgh", level: "WC", discipline: "DM" },
  { rawDate: "19961215", competition: "La Plagne, FRA", place: 3, skier: "Jesper Rönnbeck", level: "WC", discipline: "DM" },
  { rawDate: "19970221", competition: "Kirschberg, AUT", place: 3, skier: "Jesper Rönnbeck", level: "WC", discipline: "DM" },
  { rawDate: "19970228", competition: "Meringen-Hasliberg (AUT)", place: 2, skier: "Jonas Jonell", level: "WC", discipline: "DM" },
  { rawDate: "19971206", competition: "Tignes, FRA", place: 2, skier: "Jesper Rönnbeck", level: "WC", discipline: "DM" },
  { rawDate: "19980228", competition: "Chatel, FRA", place: 2, skier: "Kurre Landsburgh", level: "WC", discipline: "DM" },
  { rawDate: "19980310", competition: "Hundfjället, SWE", place: 1, skier: "Jesper Rönnbeck", level: "WC", discipline: "DM" },
  { rawDate: "19980315", competition: "Altenmarktz-Zauchensee, AUT", place: 2, skier: "Jesper Rönnbeck", level: "WC", discipline: "DM" },
  { rawDate: "20201216", competition: "Thaiwoo, CHH", place: 2, skier: "Oskar Elofsson", level: "WC", discipline: "DM" },
  { rawDate: "20200208", competition: "Deer Valley, USA", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20201213", competition: "Idre, SWE", place: 1, skier: "Ludvig Fjällström", level: "WC", discipline: "DM" },
  { rawDate: "20211212", competition: "Idre, SWE", place: 3, skier: "Ludvig Fjällström", level: "WC", discipline: "DM" },
  { rawDate: "20211218", competition: "Alpe D´Huez, FRA", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20220312", competition: "Chiesa In Valmalenco, ITA", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20221211", competition: "Idre, SWE", place: 2, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20221217", competition: "Alpe D´Huez, FRA", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20230128", competition: "Val St-Come, CAN", place: 1, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20230128", competition: "Val St-Come, CAN", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20230204", competition: "Deer Valley, USA", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20230318", competition: "Almaty, KAZ", place: 2, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20231209", competition: "Idre, SWE", place: 2, skier: "Rasmus Stegfeldt", level: "WC", discipline: "DM" },
  { rawDate: "20231216", competition: "Alpe D´Huez, FRA", place: 1, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20231216", competition: "Alpe D´Huez, FRA", place: 2, skier: "Rasmus Stegfeldt", level: "WC", discipline: "DM" },
  { rawDate: "20240120", competition: "Val St-Come, CAN", place: 2, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20240127", competition: "Waterville, USA", place: 3, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20241221", competition: "Bakurani, GEO", place: 1, skier: "Walter Wallberg", level: "WC", discipline: "DM" },
  { rawDate: "20241221", competition: "Bakurani, GEO", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20250125", competition: "Waterville, USA", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20250312", competition: "Livigno, ITA", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20260110", competition: "Val St-Come, CAN", place: 3, skier: "Filip Gravenfors", level: "WC", discipline: "DM" },
  { rawDate: "20260301", competition: "Nato-Toyama, JPN", place: 2, skier: "Rasmus Stegfeldt", level: "WC", discipline: "DM" },
];

const monthNames = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseYYYYMMDD(value: string) {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));

  if (!year || !month || !day) {
    throw new Error(`Ogiltigt datum: ${value}`);
  }

  return { year, month, day };
}

function formatDateSv(value: string) {
  const { year, month, day } = parseYYYYMMDD(value);
  return `${pad2(day)} ${monthNames[month - 1]} ${year}`;
  // Om du verkligen vill ha 2-siffrigt år:
  // return `${pad2(day)} ${monthNames[month - 1]} ${String(year).slice(-2)}`;
}

function getSeasonStartYear(value: string) {
  const { year, month } = parseYYYYMMDD(value);
  return month >= 8 ? year : year - 1;
}

function getSeasonLabel(startYear: number) {
  return `${startYear}/${startYear + 1}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dedupeRows(rows: RawRow[]) {
  const seen = new Set<string>();
  const result: RawRow[] = [];

  for (const row of rows) {
    const key = [
      row.rawDate,
      row.competition.trim(),
      row.place,
      row.skier.trim(),
      row.level,
      row.discipline,
    ].join("|");

    if (seen.has(key)) continue;
    seen.add(key);
    result.push(row);
  }

  return result;
}

function emptyBuckets(): SeasonBuckets {
  return {
    worldCupResults: [],
    europaCupResults: [],
    svenskaCupenResults: [],
    ymgResults: [],
    osResults: [],
    vmResults: [],
    smResults: [],
  };
}

function levelToField(level: Level): keyof SeasonBuckets | null {
  switch (level) {
    case "WC":
      return "worldCupResults";
    case "EC":
      return "europaCupResults";
    case "SC":
      return "svenskaCupenResults";
    case "YMG":
      return "ymgResults";
    case "OS":
      return "osResults";
    case "VM":
      return "vmResults";
    case "SM":
      return "smResults";
    default:
      return null;
  }
}

function toSeasonResult(row: RawRow): SeasonResult {
  return {
    _key: slugify(`${row.rawDate}-${row.competition}-${row.skier}-${row.discipline}-${row.place}`),
    competition: row.competition.trim(),
    date: formatDateSv(row.rawDate),
    discipline: row.discipline,
    skier: row.skier.trim(),
    place: row.place,
    level: row.level,
  };
}

function buildSeasonMap(rows: RawRow[]) {
  const map = new Map<string, { yearStart: number; label: string; buckets: SeasonBuckets }>();

  const cleanRows = dedupeRows(rows);

  for (const row of cleanRows) {
    const yearStart = getSeasonStartYear(row.rawDate);
    const label = getSeasonLabel(yearStart);
    const field = levelToField(row.level);

    if (!field) continue;

    if (!map.has(label)) {
      map.set(label, {
        yearStart,
        label,
        buckets: emptyBuckets(),
      });
    }

    map.get(label)!.buckets[field].push(toSeasonResult(row));
  }

  for (const [, season] of map) {
    for (const key of Object.keys(season.buckets) as (keyof SeasonBuckets)[]) {
      season.buckets[key].sort((a, b) => {
        // sortera stigande på datum
        const aRaw = a._key.slice(0, 8);
        const bRaw = b._key.slice(0, 8);
        return aRaw.localeCompare(bRaw);
      });
    }
  }

  return map;
}

async function clearAllResultsExceptProtected(protectedLabel = "2024/2025") {
  const seasons = await client.fetch<Array<{ _id: string; label: string }>>(
    `*[_type == "season" && label != $protectedLabel]{ _id, label }`,
    { protectedLabel }
  );

  for (const season of seasons) {
    console.log(`Clearing ${season.label}`);
    await client
      .patch(season._id)
      .set({
        worldCupResults: [],
        europaCupResults: [],
        svenskaCupenResults: [],
        ymgResults: [],
        osResults: [],
        vmResults: [],
        smResults: [],
      })
      .commit();
  }
}

async function upsertSeasonResults() {
  const seasonMap = buildSeasonMap(rawData);

  for (const [, season] of seasonMap) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "season" && label == $label][0]{ _id }`,
      { label: season.label }
    );

    if (!existing?._id) {
      const created = await client.create({
        _type: "season",
        label: season.label,
        yearStart: season.yearStart,
        ...season.buckets,
      });

      console.log(`Created season ${season.label} (${created._id})`);
      continue;
    }

    await client
      .patch(existing._id)
      .set({
        label: season.label,
        yearStart: season.yearStart,
        ...season.buckets,
      })
      .commit();

    console.log(`Updated season ${season.label}`);
  }
}

async function main() {
  console.log("1. Clearing old results...");
  await clearAllResultsExceptProtected("2024/2025");

  console.log("2. Upserting reseeded results...");
  await upsertSeasonResults();

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
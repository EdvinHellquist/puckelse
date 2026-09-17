export type Level = "WC" | "EC" | "SC" | "YMG" | "VM" | "OS" | "SM" | "OTHER";
export type Discipline = "MO" | "DM";

export type RawRow = {
  rawDate: string;
  competition: string;
  place: number;
  skier: string;
  level: Level;
  discipline: Discipline;
};

export type SeasonResult = {
  _key: string;
  competition: string;
  date: string;
  discipline: string;
  skier: string;
  place: number;
  level: Level;
};

export type SeasonBuckets = {
  worldCupResults: SeasonResult[];
  europaCupResults: SeasonResult[];
  svenskaCupenResults: SeasonResult[];
  ymgResults: SeasonResult[];
  osResults: SeasonResult[];
  vmResults: SeasonResult[];
  smResults: SeasonResult[];
};

const monthNames = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function parseYYYYMMDD(value: string) {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));

  if (!year || !month || !day) {
    throw new Error(`Ogiltigt datum: ${value}`);
  }

  return { year, month, day };
}

export function formatDateSv(value: string) {
  const { year, month, day } = parseYYYYMMDD(value);
  return `${pad2(day)} ${monthNames[month - 1]} ${year}`;
}

const svMonthIndex: Record<string, number> = Object.fromEntries(
  monthNames.map((m, i) => [m, i + 1]),
);

export function dateSvToRawDate(dateSv: string): string {
  const m = /^(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})$/i.exec(dateSv?.trim() ?? "");
  if (!m) return "";
  const day = m[1].padStart(2, "0");
  const monthNum = svMonthIndex[m[2].toLowerCase()];
  if (!monthNum) return "";
  return `${m[3]}${pad2(monthNum)}${day}`;
}

export function getSeasonStartYear(value: string) {
  const { year, month } = parseYYYYMMDD(value);
  return month >= 8 ? year : year - 1;
}

export function getSeasonLabel(startYear: number) {
  return `${startYear}/${startYear + 1}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// `discipline` vidgas till string: nyckeln interpolerar bara in värdet, och
// rader som läses tillbaka från Sanity är typade som string, inte Discipline.
export function rowKey(
  row: Pick<RawRow, "rawDate" | "competition" | "skier" | "place"> & { discipline: string },
) {
  return slugify(`${row.rawDate}-${row.competition}-${row.skier}-${row.discipline}-${row.place}`);
}

export function dedupeRows(rows: RawRow[]) {
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

export function emptyBuckets(): SeasonBuckets {
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

export function levelToField(level: Level): keyof SeasonBuckets | null {
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

export function toSeasonResult(row: RawRow): SeasonResult {
  return {
    _key: rowKey(row),
    competition: row.competition.trim(),
    date: formatDateSv(row.rawDate),
    discipline: row.discipline,
    skier: row.skier.trim(),
    place: row.place,
    level: row.level,
  };
}

import { load, type CheerioAPI } from "cheerio";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Discipline, Level, RawRow } from "./seasonHelpers.js";
import { normalizeCompetition, normalizeSkier } from "./aliases.js";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(scriptsDir, ".fis-cache");
const OUTPUT_PATH = join(scriptsDir, "fis-results.json");

const FIS_ORIGIN = "https://www.fis-ski.com";
const USER_AGENT = "puckelse-seed/1.0 (contact: edvin@iteract.se)";
const REQUEST_DELAY_MS = 250;
const NATION = "SWE";
const PODIUM_MAX_PLACE = 3;

type FisCategory = "WC" | "EC" | "WSC" | "OWG" | "NC" | "FIS";
const FIS_TO_LEVEL: Record<FisCategory, Level> = {
  WC: "WC",
  EC: "EC",
  WSC: "VM",
  OWG: "OS",
  NC: "SM",
  // Base-tier "FIS" races hosted in Sweden are the domestic Svenska Cupen circuit.
  FIS: "SC",
};

// NC and FIS are filtered to SWE-hosted events only (Swedish Nationals / Svenska Cupen).
const NATION_HOSTED_CATEGORIES: Partial<Record<FisCategory, string>> = {
  NC: "SWE",
  FIS: "SWE",
};

const CATEGORIES: FisCategory[] = ["WC", "EC", "WSC", "OWG", "NC", "FIS"];
const DISCIPLINES: Discipline[] = ["MO", "DM"];
const GENDERS = ["M", "W"] as const;

function parseSeasonRange(): { from: number; to: number } {
  const from = Number(process.env.SEASON_FROM ?? "1980");
  const to = Number(process.env.SEASON_TO ?? new Date().getFullYear() + 1);
  return { from, to };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cachePath(url: string) {
  const hash = createHash("sha1").update(url).digest("hex");
  return join(CACHE_DIR, `${hash}.html`);
}

async function fileExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function fetchCached(url: string): Promise<string> {
  const path = cachePath(url);
  if (await fileExists(path)) {
    return readFile(path, "utf8");
  }

  await mkdir(CACHE_DIR, { recursive: true });

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      await writeFile(path, html, "utf8");
      await delay(REQUEST_DELAY_MS);
      return html;
    } catch (err) {
      if (attempt === 3) throw err;
      const backoff = 1000 * 2 ** (attempt - 1);
      console.warn(`  fetch failed (attempt ${attempt}) for ${url}: ${(err as Error).message} — retrying in ${backoff}ms`);
      await delay(backoff);
    }
  }
  throw new Error("unreachable");
}

function calendarUrl(category: FisCategory, discipline: Discipline, gender: string, season: number) {
  const params = new URLSearchParams({
    categorycode: category,
    disciplinecode: discipline,
    gendercode: gender,
    seasoncode: String(season),
  });
  return `${FIS_ORIGIN}/DB/freestyle-freeski/moguls-aerials/calendar-results.html?${params.toString()}`;
}

function eventDetailsUrl(eventId: number, season: number) {
  return `${FIS_ORIGIN}/DB/general/event-details.html?sectorcode=FS&eventid=${eventId}&seasoncode=${season}`;
}

function raceUrl(raceId: number) {
  return `${FIS_ORIGIN}/DB/general/results.html?sectorcode=FS&raceid=${raceId}`;
}

function extractEvents($: CheerioAPI): Array<{ eventId: number; nation: string | null }> {
  const events = new Map<number, string | null>();
  $("a[href*='event-details.html']").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href") ?? "";
    const match = href.match(/eventid=(\d+)/);
    if (!match) return;
    const id = Number(match[1]);
    const row = $el.closest(".container.g-row, .g-row");
    const flagClass = row.find(".flag").first().attr("class") ?? "";
    const flagMatch = flagClass.match(/flag-([A-Z]{3})/);
    const nation = flagMatch ? flagMatch[1] : null;
    if (!events.has(id) || (nation && !events.get(id))) {
      events.set(id, nation);
    }
  });
  return [...events.entries()].map(([eventId, nation]) => ({ eventId, nation }));
}

type EventRace = {
  raceId: number;
  discipline: Discipline;
  gender: "M" | "W";
};

function extractRacesFromEvent($: CheerioAPI): EventRace[] {
  const races: EventRace[] = [];
  const seenIds = new Set<number>();

  $("#eventdetailscontent .table-row").each((_, rowEl) => {
    const $row = $(rowEl);
    let raceId: number | null = null;
    $row.find("a[href*='raceid=']").each((__, a) => {
      const href = $(a).attr("href") ?? "";
      const m = href.match(/raceid=(\d+)/);
      if (m && raceId === null) raceId = Number(m[1]);
    });
    if (raceId === null || seenIds.has(raceId)) return;

    const rowText = $row.text().replace(/\s+/g, " ");

    let discipline: Discipline | null = null;
    if (/\bDual Moguls\b/i.test(rowText)) discipline = "DM";
    else if (/\bMoguls\b/i.test(rowText)) discipline = "MO";
    if (!discipline) return;

    let gender: "M" | "W" | null = null;
    const genderCell = $row.find(".gender__item").first().text().trim();
    if (genderCell === "M" || genderCell === "W") {
      gender = genderCell;
    } else if (/\bWomen('s)?\b/i.test(rowText)) {
      gender = "W";
    } else if (/\bMen('s)?\b/i.test(rowText)) {
      gender = "M";
    }
    if (!gender) return;

    seenIds.add(raceId);
    races.push({ raceId, discipline, gender });
  });

  return races;
}

type RaceMeta = {
  isoDate: string;
  competition: string;
  eventCategory: FisCategory | null;
};

type Finisher = {
  place: number;
  surname: string;
  givenName: string;
  nation: string;
};

function extractRacePage($: CheerioAPI): { meta: RaceMeta; finishers: Finisher[] } | null {
  const isoDate = $("[data-date]").first().attr("data-date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;

  const titleRaw = $("title").text();
  const titleMatch = /Results\s*-\s*([^0-9]+?)\s+\d{4}\/\d{4}\s*$/.exec(titleRaw);
  const competition = titleMatch ? titleMatch[1].trim() : "";
  if (!competition) return null;

  const catText = $(".heading, .info-value").text();
  let eventCategory: FisCategory | null = null;
  if (/World Cup/i.test(catText)) eventCategory = "WC";
  else if (/Europa Cup/i.test(catText)) eventCategory = "EC";
  else if (/World Ski Championship|World Championship/i.test(catText)) eventCategory = "WSC";
  else if (/Olympic/i.test(catText)) eventCategory = "OWG";

  const finishers: Finisher[] = [];
  $("#events-info-results a.table-row").each((_, el) => {
    const $el = $(el);
    const cells = $el.find("div.g-row > div.g-row > div");
    if (cells.length === 0) return;

    const placeText = $el.find(".bold.justify-right").first().text().trim();
    const place = Number.parseInt(placeText, 10);
    if (!Number.isFinite(place) || place < 1) return;

    const nameText = $el.find(".justify-left.bold").first().text().trim();
    const nation = $el.find(".country__name-short").first().text().trim();
    if (!nameText || !nation) return;

    const tokens = nameText.split(/\s+/);
    const surnameTokens: string[] = [];
    const givenTokens: string[] = [];
    for (const token of tokens) {
      if (/^[A-ZÅÄÖ'\-]+$/.test(token)) surnameTokens.push(token);
      else givenTokens.push(token);
    }
    if (surnameTokens.length === 0 || givenTokens.length === 0) return;

    finishers.push({
      place,
      surname: surnameTokens.join(" "),
      givenName: givenTokens.join(" "),
      nation,
    });
  });

  return { meta: { isoDate, competition, eventCategory }, finishers };
}

function titleCase(input: string) {
  return input
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeSkierName(surname: string, givenName: string) {
  return `${titleCase(givenName)} ${titleCase(surname)}`;
}

function isoDateToRawDate(iso: string) {
  return iso.replace(/-/g, "");
}

function competitionWithCountry(competition: string) {
  return competition.replace(/\s*\(([A-Z]{3})\)\s*$/, ", $1");
}

async function main() {
  const { from, to } = parseSeasonRange();
  const rows: RawRow[] = [];
  const seenRaces = new Set<number>();

  console.log(`Fetching FIS results — seasons ${from}..${to}, nation ${NATION}, top ${PODIUM_MAX_PLACE}`);
  console.log(`Cache: ${CACHE_DIR}`);

  for (const category of CATEGORIES) {
    for (const discipline of DISCIPLINES) {
      for (const gender of GENDERS) {
        for (let season = from; season <= to; season++) {
          const calUrl = calendarUrl(category, discipline, gender, season);
          let calHtml: string;
          try {
            calHtml = await fetchCached(calUrl);
          } catch (err) {
            console.warn(`  calendar ${category}/${discipline}/${gender}/${season} failed: ${(err as Error).message}`);
            continue;
          }
          const $cal = load(calHtml);
          const allEvents = extractEvents($cal);
          const requiredNation = NATION_HOSTED_CATEGORIES[category];
          const events = requiredNation
            ? allEvents.filter((e) => e.nation === requiredNation)
            : allEvents;
          if (events.length === 0) continue;

          console.log(`${category} ${discipline} ${gender} ${season}: ${events.length} event(s)${requiredNation ? ` (filtered to ${requiredNation})` : ""}`);

          for (const { eventId } of events) {
            const evtUrl = eventDetailsUrl(eventId, season);
            let evtHtml: string;
            try {
              evtHtml = await fetchCached(evtUrl);
            } catch (err) {
              console.warn(`    event ${eventId} failed: ${(err as Error).message}`);
              continue;
            }
            const $evt = load(evtHtml);
            const allRaces = extractRacesFromEvent($evt);
            const races = allRaces.filter(
              (r) => r.discipline === discipline && r.gender === gender,
            );
            console.log(`  event ${eventId}: ${allRaces.length} race(s) total, ${races.length} matching ${discipline}/${gender}`);

            for (const race of races) {
              if (seenRaces.has(race.raceId)) continue;
              seenRaces.add(race.raceId);

              const rUrl = raceUrl(race.raceId);
              let raceHtml: string;
              try {
                raceHtml = await fetchCached(rUrl);
              } catch (err) {
                console.warn(`      race ${race.raceId} failed: ${(err as Error).message}`);
                continue;
              }

              const $race = load(raceHtml);
              const parsed = extractRacePage($race);
              if (!parsed) continue;

              const level: Level = parsed.meta.eventCategory
                ? FIS_TO_LEVEL[parsed.meta.eventCategory]
                : FIS_TO_LEVEL[category];

              const swePodium = parsed.finishers
                .filter((f) => f.nation === NATION && f.place <= PODIUM_MAX_PLACE)
                .map((f) => ({
                  rawDate: isoDateToRawDate(parsed.meta.isoDate),
                  competition: normalizeCompetition(competitionWithCountry(parsed.meta.competition)),
                  place: f.place,
                  skier: normalizeSkier(normalizeSkierName(f.surname, f.givenName)),
                  level,
                  discipline,
                }) satisfies RawRow);

              if (swePodium.length > 0) {
                for (const row of swePodium) {
                  console.log(`      hit: ${row.rawDate} ${row.level} ${row.discipline} p${row.place} ${row.skier} @ ${row.competition}`);
                }
                rows.push(...swePodium);
              }
            }
          }
        }
      }
    }
  }

  rows.sort((a, b) => a.rawDate.localeCompare(b.rawDate) || a.discipline.localeCompare(b.discipline) || a.place - b.place);

  await writeFile(OUTPUT_PATH, JSON.stringify(rows, null, 2), "utf8");
  console.log(`\nWrote ${rows.length} SWE podium row(s) to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export const SKIER_ALIASES: Record<string, string> = {
  "Jesper Bjoernlund": "Jesper Björnlund",
  "Jesper Roennback": "Jesper Rönnbeck",
  "Jorgen Paajarvi": "Jörgen Pääjärvi",
  "Jörgen Paajarvi": "Jörgen Pääjärvi",
  "Kurre Lansburgh": "Kurre Landsburgh",
  "Ludvig Fjallstrom": "Ludvig Fjällström",
  "Roger Haallander": "Roger Hållander",
  "Jakob Hansson M": "Jakob Hansson Mathisen",
  "Hakan Hansson": "Håkan Hansson",
  "Stefan Engstroem": "Stefan Engström",
  "Henrik Koehler": "Henrik Köhler",
  "Fredric Ericksson": "Fredrik Eriksson",
  "Clara Mansson": "Clara Månsson",
  "Ebba Mansson": "Ebba Månsson",
  "Erika Bystroem": "Erika Byström",
  "Fredrik Saterberg": "Fredrik Säterberg",
  "Linus Oejelind": "Linus Öjelind",
  "Karl Waerme": "Karl Wärme",
  "Lise Benberg": "Lise Beneberg",
};

export const COMPETITION_ALIASES: Record<string, string> = {
  "Alpe D´Huez, FRA": "Alpe d'Huez, FRA",
  "Altenmarktz-Zauchensee, AUT": "Altenmarkt-Zauchensee, AUT",
  "Are, SWE": "Åre, SWE",
  "Bakurani, GEO": "Bakuriani, GEO",
  "Chiesa In Valmalenco, ITA": "Chiesa in Valmalenco, ITA",
  "Courechevel, FRA": "Courchevel, FRA",
  "Duved (SWE)": "Duved, SWE",
  "Hundfjaellet, SWE": "Hundfjället, SWE",
  "Idre Fjall, SWE": "Idre Fjäll, SWE",
  "Idre, SWE": "Idre Fjäll, SWE",
  "Jyvaskyla, FIN": "Jyväskylä, FIN",
  "Kirschberg, AUT": "Kirchberg, AUT",
  "La Plagne": "La Plagne, FRA",
  "Lake Placid, NY, USA": "Lake Placid, USA",
  "Meringen-Hasliberg (AUT)": "Meiringen-Hasliberg, SUI",
  "Mont Treblant, CAN": "Mont Tremblant, CAN",
  "Nato-Toyama, JPN": "Nanto-Toyama, JPN",
  "Saelen, SWE": "Sälen, SWE",
  "Thaiwoo, CHH": "Thaiwoo, CHN",
  "Val St. Come, CAN": "Val St-Come, CAN",
  "Waterville Valley Resort, USA": "Waterville Valley, USA",
  "Waterville, USA": "Waterville Valley, USA",
  "Duved/Are, SWE": "Duved-Åre, SWE",
  "Duved Are, SWE": "Duved-Åre, SWE",
  "Duved-Are, SWE": "Duved-Åre, SWE",
  "Are-Duved, SWE": "Duved-Åre, SWE",
  "Duved, SWE": "Duved-Åre, SWE",
  "Bygsiljum, SWE": "Bygdsiljum, SWE",
  "Funaesdalen, SWE": "Funäsdalen, SWE",
  "Umea, SWE": "Umeå, SWE",
  "Agnas, SWE": "Agnäs, SWE",
  "Megeve, FRA": "Mègève, FRA",
};

export function normalizeSkier(name: string) {
  const trimmed = name.trim();
  return SKIER_ALIASES[trimmed] ?? trimmed;
}

export function normalizeCompetition(name: string) {
  const trimmed = name.trim();
  return COMPETITION_ALIASES[trimmed] ?? trimmed;
}

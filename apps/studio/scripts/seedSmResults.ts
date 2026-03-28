import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "16altlh8",
  dataset: "production",
  apiVersion: "2025-08-29",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const smData: Record<number, [string, string]> = {
  1984: ["Claes Wersen", "Lise Beneberg"],
  1985: ["Henrik Oskarsson", "Pia Steneberg"],
  1986: ["Håkan Hansson", "Pia Steneberg"],
  1987: ["Claes Wersen", "Lise Beneberg"],
  1988: ["Jörgen Pääjärvi", "Lise Beneberg"],
  1989: ["Mikael Persson", "Lise Beneberg"],
  1990: ["Björn Åberg", "Lise Beneberg"],
  1991: ["Leif Persson", "Lise Beneberg"],
  1992: ["Fredrik Thulin", "Lise Beneberg"],
  1993: ["Jörgen Pääjärvi", "Helena Waller"],
  1994: ["Björn Åberg", "Helena Waller"],
  1995: ["Roger Hållander", "Sara Kjellin"],
  1996: ["Jesper Rönnbäck", "Marja Elfman"],
  1997: ["Anders Jonell", "Jenny Eidolf"],
  1998: ["Patrik Sundberg", "Marja Elfman"],
  1999: ["Fredrik Fortkord", "Marja Elfman"],
  2000: ["Patrik Sundberg", "Marja Elfman"],
  2001: ["Per Hedberg", "Sara Kjellin"],
  2002: ["Fredrik Fortkord", "Åsa Östberg"],
  2003: ["Per Hedberg", "Anna Olsson"],
  2004: ["Emanuel Hedvall", "Sara Kjellin"],
  2005: ["Fredrik Fortkord", "Sara Kjellin"],
  2006: ["Per Spett", "Rebecka Eriksson (junior)"],
  2007: ["Jesper Björnlund", "Martina Schriver"],
  2008: ["Jesper Björnlund", "Veronica Carlqvist"],
  2009: ["Jesper Björnlund", "Julia Nilsson"],
  2010: ["Per Spett", "Martina Schriver"],
  2011: ["Jesper Björnlund", "Veronica Carlqvist"],
  2012: ["Per Spett", "Julia Nilsson"],
  2013: ["Adam Gumesson", "Julia Nilsson"],
  2014: ["Jens Lauritz", "Julia Nilsson"],
  2015: ["Ludvig Fjällström", "Frida Lundblad"],
  2016: ["Ludvig Fjällström", "Clara Månsson"],
  2017: ["Loke Nilsson", "Thea Wallberg"],
  2018: ["Walter Wallberg", "Frida Lundblad"],
  2019: ["Walter Wallberg", "Thea Wallberg"],
  2020: ["Covid", "Covid"],
  2021: ["Ludvig Fjällström", "Moa Gustavsson"],
  2022: ["Ludvig Fjällström", "Moa Gustavsson"],
  2023: ["Emil Holmgren", "Nicolina Stenkula"],
  2024: ["Albin Holmgren", "Moa Gustavsson"],
  2025: ["Rasmus Stegfeldt", "Moa Gustavsson"],
};

function createResult(skier: string) {
  return {
    _type: "seasonResult",
    competition: "Svenska Mästerskapen",
    discipline: "MO",
    skier,
    place: 1,
    level: "SM",
  };
}

async function run() {
  const seasons = await client.fetch(`
    *[_type == "season"]{ _id, yearStart }
  `);

  const tx = client.transaction();

  seasons.forEach((season: any) => {
    const data = smData[season.yearStart];
    if (!data) return;

    const [men, women] = data;

    const results = [
      createResult(men),
      createResult(women),
    ];

    tx.patch(season._id, {
      set: { smResults: results }, // overwrite (rent & snyggt)
    });
  });

  await tx.commit();
  console.log("SM-resultat seedade 🎉");
}

run().catch(console.error);
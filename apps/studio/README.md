# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## FIS-resultat till Sanity

`scripts/fetchFisResults.ts` skrapar fis-ski.com efter svenska pallplatser (topp 3, MO + DM, WC/EC/VM/OS) och skriver `scripts/fis-results.json`. `scripts/seedFisResults.ts` läser den filen och mergar in i motsvarande `season`-dokument via `_key`; ingenting skrivs över.

```powershell
# 1. Hämta ner resultat (default: 1980..nästa år). Cachas i scripts/.fis-cache/, återkörning är gratis.
pnpm --filter studio fis:fetch

# Alternativt bara innevarande säsong:
$env:SEASON_FROM = "2026"; $env:SEASON_TO = "2027"
pnpm --filter studio fis:fetch
Remove-Item Env:\SEASON_FROM, Env:\SEASON_TO

# 2. Torrkörning mot Sanity (kräver SANITY_TOKEN med läsrättigheter).
$env:SANITY_TOKEN = "..."
pnpm --filter studio fis:seed:dry

# 3. Skriv på riktigt (kräver skrivrättigheter i tokenet).
pnpm --filter studio fis:seed

Remove-Item Env:\SANITY_TOKEN
```

Bash-varianten är samma sak med `SEASON_FROM=2026 SEASON_TO=2027 pnpm --filter studio fis:fetch` osv.

### SANITY_TOKEN

Skripten läser `apps/studio/.env` (inte roten — `pnpm --filter studio` kör med
`apps/studio` som working directory, och det är där `dotenv` letar). Filen är
gitignorerad via `*.env`.

```
SANITY_TOKEN=sk...
```

Alternativt som sessionsvariabel enligt exemplen ovan, om du hellre slipper ha
tokenet på disk. Torrkörningar klarar sig med ett läsrättighetstoken; för att
skriva krävs **Editor**, annars svarar Sanity `403 Insufficient permissions;
permission "update" required` först när första patchen går iväg — läsningen
lyckas alltid, eftersom datasetet är publikt.

## Städa upp rader i Sanity

`scripts/cleanupSanityRows.ts` normaliserar åkar- och tävlingsnamn via
`aliases.ts`, lagar trasiga datum och tar bort dubbletter.

```powershell
pnpm --filter studio sanity:cleanup:dry   # visar vad som skulle ändras
pnpm --filter studio sanity:cleanup       # skriver
```

Den lagar felstavade månader ("21 dev 2024") och väljer dag för datumintervall
("25-26 jan 2025") utifrån syskonrader för samma tävling och gren. Två rader med
olika giltiga datum slås aldrig ihop — en tävlingshelg med två event på
varandra följande dagar är äkta resultat, inte en dubblett. Rader vars datum
inte går att laga lämnas orörda och listas under "GÅR EJ ATT LAGA".

Skriptet patchar en säsong i taget, så det är inte atomärt över säsonger: om en
körning avbryts halvvägs är tidigare säsonger redan skrivna.

FIS spellar utan diakriter (`Rönnbeck` → `Roennback`, `Idre` → `Idre Fjäll`, `Bakurani` → `Bakuriani`). Skiljer sig FIS-strängen från befintlig rad hamnar båda i Sanity — städa i Studio efter.

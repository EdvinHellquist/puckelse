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

FIS spellar utan diakriter (`Rönnbeck` → `Roennback`, `Idre` → `Idre Fjäll`, `Bakurani` → `Bakuriani`). Skiljer sig FIS-strängen från befintlig rad hamnar båda i Sanity — städa i Studio efter.

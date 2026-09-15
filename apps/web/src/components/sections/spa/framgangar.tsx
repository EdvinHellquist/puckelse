"use client"

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

type SeasonResult = {
  competition: string
  date: string
  discipline: string
  skier: string
  place: number
  level: "WC" | "EC" | "SC" | "YMG" | "VM" | "OS" | "SM" | "OTHER"
}

type Season = {
  _id: string
  label: string
  yearStart: number
  worldCupResults?: SeasonResult[]
  europaCupResults?: SeasonResult[]
  svenskaCupenResults?: SeasonResult[]
  ymgResults?: SeasonResult[]
  osResults?: SeasonResult[]
  vmResults?: SeasonResult[]
  smResults?: SeasonResult[]
}

type TaggedResult = SeasonResult & { season: string }

type Medalist = {
  skier: string
  gold: number
  silver: number
  bronze: number
  total: number
  results: TaggedResult[]
}

const isMedal = (r: SeasonResult) => r.place >= 1 && r.place <= 3

// FIS-datan listar kvalomgångar som egna resultat. Vid OS och VM körs bara en
// tävling per gren och mästerskap, så två resultat på samma åkare betyder att
// kvalet följt med — behåll den bästa placeringen och släng resten.
function dropQualifyingRounds(results: SeasonResult[]) {
  const best = new Map<string, SeasonResult>()

  for (const r of results) {
    const key = `${r.competition}|${r.discipline}|${r.skier}`
    const prev = best.get(key)
    if (!prev || r.place < prev.place) best.set(key, r)
  }

  return [...best.values()]
}

function withSeason(results: SeasonResult[], season: string): TaggedResult[] {
  return results.map((r) => ({ ...r, season }))
}

function groupBySkier(results: TaggedResult[]): Medalist[] {
  const map = new Map<string, Medalist>()

  for (const r of results) {
    let entry = map.get(r.skier)
    if (!entry) {
      entry = {
        skier: r.skier,
        gold: 0,
        silver: 0,
        bronze: 0,
        total: 0,
        results: [],
      }
      map.set(r.skier, entry)
    }

    if (r.place === 1) entry.gold++
    else if (r.place === 2) entry.silver++
    else if (r.place === 3) entry.bronze++

    entry.total++
    entry.results.push(r)
  }

  for (const entry of map.values()) {
    entry.results.sort(
      (a, b) => b.season.localeCompare(a.season) || a.place - b.place
    )
  }

  return [...map.values()].sort(
    (a, b) =>
      b.gold - a.gold ||
      b.silver - a.silver ||
      b.bronze - a.bronze ||
      a.skier.localeCompare(b.skier, "sv")
  )
}

function medalStyle(place: number) {
  if (place === 1) {
    return { label: "Guld", className: "bg-amber-400 text-amber-950" }
  }
  if (place === 2) {
    return { label: "Silver", className: "bg-zinc-300 text-zinc-800" }
  }
  return { label: "Brons", className: "bg-amber-700 text-amber-50" }
}

export function FramgangarSection({ seasons }: { seasons: Season[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [seasonIndex, setSeasonIndex] = useState(0)

  const anchor = useRef<{ el: HTMLElement; top: number } | null>(null)

  const season = seasons.length
    ? seasons[Math.min(Math.max(seasonIndex, 0), seasons.length - 1)]
    : undefined

  const toggle = (key: string, el: HTMLElement | null) => {
    if (el) anchor.current = { el, top: el.getBoundingClientRect().top }
    setOpenKey((curr) => (curr === key ? null : key))
  }

  // Håll det klickade kortet visuellt stilla när listor fälls ut/in — annars
  // hoppar sidan när en lång lista ovanför kollapsar.
  useLayoutEffect(() => {
    const a = anchor.current
    if (!a) return
    anchor.current = null

    const delta = a.el.getBoundingClientRect().top - a.top
    if (Math.abs(delta) < 1) return

    const doc = document.documentElement
    const prev = doc.style.scrollBehavior
    doc.style.scrollBehavior = "auto"
    window.scrollTo(window.scrollX, window.scrollY + delta)
    doc.style.scrollBehavior = prev
  }, [openKey])

  const osResults = useMemo(
    () => dropQualifyingRounds(season?.osResults ?? []),
    [season]
  )
  const vmResults = useMemo(
    () => dropQualifyingRounds(season?.vmResults ?? []),
    [season]
  )

  const hall = useMemo(() => {
    const os: TaggedResult[] = []
    const vm: TaggedResult[] = []
    const wc: TaggedResult[] = []

    for (const s of seasons) {
      const all: SeasonResult[] = [
        ...(s.osResults ?? []),
        ...(s.vmResults ?? []),
        ...(s.smResults ?? []),
        ...(s.worldCupResults ?? []),
        ...(s.europaCupResults ?? []),
        ...(s.svenskaCupenResults ?? []),
        ...(s.ymgResults ?? []),
      ]

      os.push(
        ...withSeason(
          dropQualifyingRounds(all.filter((r) => r.level === "OS")).filter(isMedal),
          s.label
        )
      )
      vm.push(
        ...withSeason(
          dropQualifyingRounds(all.filter((r) => r.level === "VM")).filter(isMedal),
          s.label
        )
      )
      wc.push(
        ...withSeason(
          all.filter((r) => r.level === "WC" && r.place === 1),
          s.label
        )
      )
    }

    return {
      os: { total: os.length, medalists: groupBySkier(os) },
      vm: { total: vm.length, medalists: groupBySkier(vm) },
      wc: { total: wc.length, medalists: groupBySkier(wc) },
    }
  }, [seasons])

  return (
    <section
      id="framgangar"
      className="relative scroll-mt-24 overflow-hidden bg-muted/60 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-dot opacity-50" />
      <div className="orb orb-orange -right-32 top-40 h-96 w-96 opacity-30" />
      <div className="orb orb-blue -left-32 bottom-20 h-[420px] w-[420px] opacity-25" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="accent-bar" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Freestyle Spirit
            </p>
            <span className="accent-bar" />
          </div>
          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-gradient-brand">Framgångar genom åren</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Resultat från OS, VM, Världscupen och nationella tävlingar.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          {seasons.length ? (
            <>
              <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Säsong
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSeasonIndex((i) => Math.min(seasons.length - 1, i + 1))
                    }
                    disabled={seasonIndex >= seasons.length - 1}
                    aria-label="Äldre säsong"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Badge className="min-w-24 justify-center px-4 py-1.5 text-sm">
                    {season?.label ?? "—"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSeasonIndex((i) => Math.max(0, i - 1))}
                    disabled={seasonIndex <= 0}
                    aria-label="Nyare säsong"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {osResults.length ? (
                  <ResultRow
                    title="OS"
                    tag="OS"
                    accent="border-l-primary"
                    open={openKey === "os"}
                    onToggle={(el) => toggle("os", el)}
                    results={osResults}
                  />
                ) : null}
                {vmResults.length ? (
                  <ResultRow
                    title="VM"
                    tag="VM"
                    accent="border-l-primary"
                    open={openKey === "vm"}
                    onToggle={(el) => toggle("vm", el)}
                    results={vmResults}
                  />
                ) : null}
                <ResultRow
                  title="Svenska Mästerskapen"
                  tag="SM"
                  accent="border-l-primary"
                  open={openKey === "sm"}
                  onToggle={(el) => toggle("sm", el)}
                  results={season?.smResults ?? []}
                />
                <ResultRow
                  title="Världscup"
                  tag="WorldCup"
                  accent="border-l-primary"
                  open={openKey === "wc"}
                  onToggle={(el) => toggle("wc", el)}
                  results={season?.worldCupResults ?? []}
                />
                <ResultRow
                  title="Europacup"
                  tag="EuropaCup"
                  accent="border-l-accent"
                  open={openKey === "ec"}
                  onToggle={(el) => toggle("ec", el)}
                  results={season?.europaCupResults ?? []}
                />
                <ResultRow
                  title="Svenska Cupen"
                  tag="Svenska Cupen"
                  accent="border-l-blue-500"
                  open={openKey === "sc"}
                  onToggle={(el) => toggle("sc", el)}
                  results={season?.svenskaCupenResults ?? []}
                  emptyText="Resultat kommer snart..."
                />
                <ResultRow
                  title="Youth Mogul Games"
                  tag="YMG"
                  accent="border-l-green-500"
                  open={openKey === "ymg"}
                  onToggle={(el) => toggle("ymg", el)}
                  results={season?.ymgResults ?? []}
                  emptyText="Resultat kommer snart..."
                />
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              Inga säsonger inlagda än.
            </p>
          )}

          <div className="mt-20">
            <div className="mb-10 text-center">
              <h3 className="mb-3 text-3xl font-bold">Hall of Fame</h3>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Totalt antal medaljer och segrar från Sveriges bästa
                puckelåkare. Klicka för att se vilka som står bakom siffrorna.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <StatCard
                title="OS-medaljer"
                value={hall.os.total}
                medalists={hall.os.medalists}
                mode="medals"
              />
              <StatCard
                title="VM-medaljer"
                value={hall.vm.total}
                medalists={hall.vm.medalists}
                mode="medals"
              />
              <StatCard
                title="Världscup-segrar"
                value={hall.wc.total}
                medalists={hall.wc.medalists}
                mode="wins"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResultRow({
  title,
  tag,
  accent,
  open,
  onToggle,
  results,
  emptyText,
}: {
  title: string
  tag: string
  accent: string
  open: boolean
  onToggle: (el: HTMLElement | null) => void
  results: SeasonResult[]
  emptyText?: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  return (
    <div
      ref={rowRef}
      className={cn(
        "overflow-hidden rounded-xl border border-l-4 border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md",
        accent
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(rowRef.current)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 shrink-0 text-accent" />
          <div>
            <Badge variant="outline" className="mb-1">
              {tag}
            </Badge>
            <span className="block font-display text-lg font-bold">
              {title}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div id={panelId} className="border-t border-border/60">
          <div className="p-5">
            {results.length === 0 ? (
              <p className="text-muted-foreground">
                {emptyText ?? "Inga resultat inlagda än."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tävling</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Gren</TableHead>
                      <TableHead>Åkare</TableHead>
                      <TableHead className="text-right">Placering</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow
                        key={`${r.competition}-${r.date}-${r.skier}-${r.place}`}
                      >
                        <TableCell className="font-medium">
                          {r.competition}
                        </TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              r.discipline === "MO" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {r.discipline}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.skier}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-bold",
                              r.place <= 3
                                ? "text-yellow-500"
                                : r.place <= 10
                                  ? "text-blue-500"
                                  : "text-foreground"
                            )}
                          >
                            {r.place}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatCard({
  title,
  value,
  medalists,
  mode,
}: {
  title: string
  value: number
  medalists: Medalist[]
  mode: "medals" | "wins"
}) {
  const card = <StatCardFace title={title} value={value} />

  if (!medalists.length) return card

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="block h-full w-full cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`${title}: visa vilka åkare som står bakom siffran`}
        >
          {card}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>
            {value} {mode === "medals" ? "medaljer" : "segrar"} fördelat på{" "}
            {medalists.length} åkare.
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-6 space-y-3">
          {medalists.map((m) => (
            <li
              key={m.skier}
              className="rounded-xl border border-border/70 bg-card p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-lg font-bold">
                  {m.skier}
                </span>
                {mode === "medals" ? (
                  <div className="flex items-center gap-1.5">
                    {([1, 2, 3] as const).map((place) => {
                      const count =
                        place === 1 ? m.gold : place === 2 ? m.silver : m.bronze
                      if (!count) return null
                      return (
                        <span
                          key={place}
                          title={medalStyle(place).label}
                          className={cn(
                            "flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                            medalStyle(place).className
                          )}
                        >
                          {count}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <Badge variant="secondary">
                    {m.total} {m.total === 1 ? "seger" : "segrar"}
                  </Badge>
                )}
              </div>

              <ul className="space-y-1.5">
                {m.results.map((r) => (
                  <li
                    key={`${r.season}-${r.competition}-${r.discipline}-${r.date}-${r.place}`}
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
                  >
                    {mode === "medals" ? (
                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold",
                          medalStyle(r.place).className
                        )}
                      >
                        {medalStyle(r.place).label}
                      </span>
                    ) : null}
                    <span className="font-medium">{r.competition}</span>
                    <span className="text-muted-foreground">
                      {r.discipline} · {r.date} · {r.season}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

function StatCardFace({ title, value }: { title: string; value: number }) {
  return (
    <Card className="group relative h-full overflow-hidden border-border/80 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br from-primary/40 to-accent/40 opacity-30 blur-2xl transition-opacity group-hover:opacity-60" />
      <CardContent className="relative pt-8 pb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent shadow-lg ring-1 ring-white/10">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h4 className="mb-2 font-semibold">{title}</h4>
        <p className="text-gradient-brand text-5xl font-black tracking-tight">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { SanityImage } from "@/components/sanity-image"
import {
  SWEDEN_LAKES_PATH,
  SWEDEN_LAND_PATH,
  SWEDEN_VIEWBOX,
  projectSweden,
} from "@/components/sections/spa/sweden-map-data"
import type { SectionIntro } from "@/components/sections/spa/types"

export type Club = {
  _id: string
  name: string
  city?: string
  lat: number
  lng: number
  website?: string
  facebook?: string
  instagram?: string
  contactName?: string
  email?: string
  phone?: string
  logo?: any
}

const { width: W, height: H } = SWEDEN_VIEWBOX

// Kartan sveper in söderifrån, sedan faller klubbarna in norr → söder.
const SWEEP_MS = 1400
const MARKER_STAGGER_MS = 90

export function KlubbarSection({
  header,
  clubs,
}: {
  header: SectionIntro
  clubs: Club[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Avrundat: Math.atanh/atan2 kan skilja i sista decimalen mellan Node och
  // webbläsaren, och då matchar inte server-HTML:ens left/top vid hydrering.
  const markers = useMemo(
    () =>
      clubs
        .map((club) => {
          const { x, y } = projectSweden(club.lng, club.lat)
          return {
            club,
            y,
            left: `${((x / W) * 100).toFixed(2)}%`,
            top: `${((y / H) * 100).toFixed(2)}%`,
          }
        })
        .sort((a, b) => a.y - b.y),
    [clubs]
  )

  const selected = clubs.find((c) => c._id === selectedId) ?? null

  const select = (id: string) => {
    setSelectedId((curr) => (curr === id ? null : id))
    // På mobil ligger kortet under kartan — se till att det syns.
    requestAnimationFrame(() =>
      detailsRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    )
  }

  return (
    <section
      id="klubbar"
      className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="orb orb-blue -right-40 top-24 h-[420px] w-[420px] opacity-25" />
      <div className="orb orb-orange -left-32 bottom-10 h-96 w-96 opacity-20" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="accent-bar" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {header.eyebrow}
            </p>
            <span className="accent-bar" />
          </div>
          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-gradient-brand">{header.title}</span>
          </h2>
          {header.intro ? (
            <p className="text-lg text-muted-foreground">{header.intro}</p>
          ) : null}
        </div>

        <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[auto_1fr] md:gap-14">
          <div
            ref={mapRef}
            className="relative mx-auto h-[520px] md:h-[640px]"
            style={{ aspectRatio: `${W} / ${H}` }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 h-full w-full transition-[clip-path,opacity] ease-out motion-reduce:transition-none",
                revealed
                  ? "opacity-100 [clip-path:inset(0)]"
                  : "opacity-0 [clip-path:inset(100%_0_0_0)] motion-reduce:opacity-100 motion-reduce:[clip-path:inset(0)]"
              )}
              style={{ transitionDuration: `${SWEEP_MS}ms` }}
            >
              <defs>
                <pattern
                  id="sweden-dots"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2.5" cy="2.5" r="1.2" className="fill-primary/55" />
                </pattern>
              </defs>
              <path
                d={SWEDEN_LAND_PATH + SWEDEN_LAKES_PATH}
                fillRule="evenodd"
                fill="url(#sweden-dots)"
                className="stroke-primary/30"
                strokeWidth={0.6}
                strokeLinejoin="round"
              />
            </svg>

            {markers.map(({ club, left, top }, i) => {
              const isSelected = club._id === selectedId
              const showLabel = isSelected || club._id === hoverId
              return (
                <button
                  key={club._id}
                  type="button"
                  onClick={() => select(club._id)}
                  onMouseEnter={() => setHoverId(club._id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(club._id)}
                  onBlur={() => setHoverId(null)}
                  aria-label={club.city ? `${club.name}, ${club.city}` : club.name}
                  aria-pressed={isSelected}
                  className={cn(
                    "absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-2 transition-[scale,opacity] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none",
                    revealed
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100",
                    showLabel && "z-20"
                  )}
                  style={{
                    left,
                    top,
                    transitionDelay: revealed
                      ? `${SWEEP_MS * 0.6 + i * MARKER_STAGGER_MS}ms`
                      : "0ms",
                  }}
                >
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 motion-reduce:hidden"
                      style={{ animationDelay: `${(i * 370) % 2000}ms` }}
                    />
                    <span
                      className={cn(
                        "relative inline-flex rounded-full bg-accent shadow-md ring-2 ring-background transition-all",
                        isSelected ? "h-4 w-4 ring-4 ring-accent/30" : "h-3 w-3"
                      )}
                    />
                  </span>
                  {showLabel ? (
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background shadow-lg">
                      {club.name}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="space-y-6">
            <div ref={detailsRef} className="scroll-mt-28">
              {clubs.length === 0 ? null : selected ? (
                <ClubDetails club={selected} />
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-muted-foreground">
                  <MapPin className="mx-auto mb-2 h-6 w-6 text-accent" />
                  Välj en klubb på kartan eller i listan nedan.
                </div>
              )}
            </div>

            {clubs.length ? (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Alla klubbar ({clubs.length})
                </p>
                <ul className="grid max-h-[340px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {clubs.map((club) => (
                    <li key={club._id}>
                      <button
                        type="button"
                        onClick={() => select(club._id)}
                        onMouseEnter={() => setHoverId(club._id)}
                        onMouseLeave={() => setHoverId(null)}
                        aria-pressed={club._id === selectedId}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:border-accent/60",
                          club._id === selectedId
                            ? "border-accent"
                            : "border-border/70"
                        )}
                      >
                        <MapPin className="h-4 w-4 shrink-0 text-accent" />
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">
                            {club.name}
                          </span>
                          {club.city ? (
                            <span className="block truncate text-sm text-muted-foreground">
                              {club.city}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClubDetails({ club }: { club: Club }) {
  const links = [
    { href: club.website, label: "Webbplats", Icon: Globe },
    { href: club.facebook, label: "Facebook", Icon: Facebook },
    { href: club.instagram, label: "Instagram", Icon: Instagram },
  ].filter((l): l is typeof l & { href: string } => Boolean(l.href))

  const hasContact = club.contactName || club.email || club.phone

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
      <div className="mb-5 flex items-center gap-4">
        {club.logo ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
            <SanityImage image={club.logo} fill className="object-contain p-1" />
          </div>
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-accent to-primary text-white shadow-md">
            <MapPin className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-bold leading-tight">
            {club.name}
          </h3>
          {club.city ? (
            <p className="text-sm text-muted-foreground">{club.city}</p>
          ) : null}
        </div>
      </div>

      {links.length ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {links.map(({ href, label, Icon }) => (
            <Button key={label} variant="outline" size="sm" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon />
                {label}
                <ArrowUpRight className="opacity-60" />
              </a>
            </Button>
          ))}
        </div>
      ) : null}

      {hasContact ? (
        <ul className="space-y-2 text-sm">
          {club.contactName ? (
            <li className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {club.contactName}
            </li>
          ) : null}
          {club.email ? (
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${club.email}`} className="hover:text-primary hover:underline">
                {club.email}
              </a>
            </li>
          ) : null}
          {club.phone ? (
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${club.phone.replace(/[^\d+]/g, "")}`}
                className="hover:text-primary hover:underline"
              >
                {club.phone}
              </a>
            </li>
          ) : null}
        </ul>
      ) : null}

      {!links.length && !hasContact ? (
        <p className="text-sm text-muted-foreground">
          Inga kontaktuppgifter inlagda än.
        </p>
      ) : null}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Newspaper } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"

import { SanityImage } from "@/components/sanity-image"
import type { SectionIntro } from "@/components/sections/spa/types"

type NewsItem = {
  _id?: string
  title?: string
  excerpt?: string
  publishedAt?: string
  link?: string
  coverImage?: any
}

function formatDate(iso?: string) {
  return iso
    ? new Date(iso).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null
}

// Nyheterna kommer sorterade nyast först. Karusellen startar på index 0 och
// bläddrar aldrig av sig själv — den senaste nyheten står still tills någon
// bläddrar.
export function NyheterSection({
  header,
  news: items,
}: {
  header: SectionIntro
  news: NewsItem[]
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <section
      id="nyheter"
      className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="orb orb-blue right-[-15%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 opacity-25" />

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

        <div className="mx-auto max-w-6xl">
          <Carousel setApi={setApi} opts={{ align: "start" }}>
            <div className="group relative">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl bg-linear-to-br from-primary/40 via-transparent to-accent/40 opacity-50 blur-xl transition-opacity group-hover:opacity-75"
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
                <CarouselContent className="ml-0">
                  {items.map((item, i) => (
                    <CarouselItem
                      key={item._id ?? i}
                      className="pl-0"
                      aria-label={`Nyhet ${i + 1} av ${items.length}`}
                    >
                      <NewsCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
            </div>

            {items.length > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-4">
                <CarouselPrevious
                  className="static size-9 translate-y-0"
                  aria-label="Nyare nyhet"
                />
                <div className="flex items-center gap-2">
                  {items.map((item, i) => (
                    <button
                      key={item._id ?? i}
                      type="button"
                      onClick={() => api?.scrollTo(i)}
                      aria-label={`Visa nyhet ${i + 1}: ${item.title ?? ""}`}
                      aria-current={i === current}
                      className={
                        i === current
                          ? "h-2 w-6 rounded-full bg-primary transition-all"
                          : "h-2 w-2 rounded-full bg-muted-foreground/30 transition-all hover:bg-muted-foreground/60"
                      }
                    />
                  ))}
                </div>
                <CarouselNext
                  className="static size-9 translate-y-0"
                  aria-label="Äldre nyhet"
                />
              </div>
            ) : null}
          </Carousel>
        </div>
      </div>
    </section>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const date = formatDate(item.publishedAt)

  return (
    <div className={`grid h-full ${item.coverImage ? "md:grid-cols-2" : ""}`}>
      {item.coverImage ? (
        <div className="relative aspect-video md:aspect-auto md:min-h-[360px]">
          <SanityImage image={item.coverImage} fill className="object-cover" />
        </div>
      ) : null}

      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Newspaper className="h-4 w-4" />
          {date ? <span>{date}</span> : <span>Nyhet</span>}
        </div>
        <h3 className="mb-4 text-2xl font-bold leading-tight md:text-3xl">
          {item.title}
        </h3>
        <p className="mb-6 text-base leading-relaxed text-muted-foreground">
          {item.excerpt}
        </p>
        {item.link ? (
          <div>
            <Button variant="action" asChild>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Läs mer
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

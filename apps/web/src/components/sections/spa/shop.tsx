import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"

import { SanityImage } from "@/components/sanity-image"
import type { SectionIntro } from "@/components/sections/spa/types"

// Speglar sortimentet i MERi-shoppen. Produkterna redigeras i Sanity (Shop).
type Product = {
  _key: string
  name?: string
  price?: string
  url?: string
  image?: any
}

type ShopContent = {
  header?: SectionIntro | null
  shopUrl?: string | null
  products?: Product[] | null
  cta?: { eyebrow?: string; title?: string; text?: string } | null
}

export function ShopSection({ shop }: { shop: ShopContent }) {
  const products = shop.products ?? []

  return (
    <section
      id="shop"
      className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="orb orb-orange -right-24 top-10 h-[420px] w-[420px] opacity-30" />
      <div className="orb orb-blue -left-32 bottom-0 h-96 w-96 opacity-20" />

      <div className="container relative mx-auto px-4">
        {shop.header ? (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="accent-bar" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {shop.header.eyebrow}
              </p>
              <span className="accent-bar" />
            </div>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl">
              <span className="text-gradient-brand">{shop.header.title}</span>
            </h2>
            {shop.header.intro ? (
              <p className="text-lg text-muted-foreground">
                {shop.header.intro}
              </p>
            ) : null}
          </div>
        ) : null}

        {products.length ? (
          <div className="mx-auto max-w-6xl">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {products.length} produkter i sortimentet
                </p>
                <div className="flex items-center gap-2">
                  <CarouselPrevious
                    className="static size-9 translate-y-0"
                    aria-label="Föregående produkter"
                  />
                  <CarouselNext
                    className="static size-9 translate-y-0"
                    aria-label="Fler produkter"
                  />
                </div>
              </div>

              {/* py-8: ger hover-lyftet och shadow-xl plats, annars kapar
                  karusellens overflow-hidden kortens skugga. */}
              <CarouselContent className="-ml-4 py-8">
                {products.map((p) => (
                  <CarouselItem
                    key={p._key}
                    className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
                  >
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {p.image ? (
                          <SanityImage
                            image={p.image}
                            fill
                            alt={p.name}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                        />
                        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
                        <h3 className="text-sm font-semibold leading-snug">
                          {p.name}
                        </h3>
                        <span className="text-sm font-bold text-primary">
                          {p.price}
                        </span>
                      </div>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : null}

        {shop.cta && shop.shopUrl ? (
          <div className="mx-auto mt-12 max-w-6xl">
            <div className="group relative">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl bg-linear-to-r from-accent via-primary to-accent opacity-40 blur-xl transition-opacity group-hover:opacity-70"
              />
              <div className="relative flex flex-col items-center justify-between gap-6 rounded-2xl border border-border/70 bg-card p-8 shadow-sm md:flex-row md:p-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-primary text-white shadow-md">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {shop.cta.eyebrow}
                    </p>
                    <h3 className="text-2xl font-extrabold leading-tight">
                      {shop.cta.title}
                    </h3>
                    {shop.cta.text ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {shop.cta.text}
                      </p>
                    ) : null}
                  </div>
                </div>
                <Button size="lg" variant="action" asChild className="shrink-0">
                  <a href={shop.shopUrl} target="_blank" rel="noopener noreferrer">
                    Öppna shoppen
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

import { ArrowRight, Newspaper } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

import { SanityImage } from "@/components/sanity-image"

type NewsProps = {
  news: {
    title?: string
    excerpt?: string
    publishedAt?: string
    link?: string
    coverImage?: any
  } | null
}

export function NyheterSection({ news }: NewsProps) {
  const title = news?.title ?? "Parra blir OS-sport 2026!"
  const excerpt =
    news?.excerpt ??
    "Parallell puckelåkning (parra) gör debut i OS i Livigno 2026. Detta är en historisk milstolpe för svensk puckelåkning!"
  const date = news?.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

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
              Aktuellt
            </p>
            <span className="accent-bar" />
          </div>
          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-gradient-brand">Senaste nytt</span>
          </h2>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="group relative">
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-3xl bg-linear-to-br from-primary/40 via-transparent to-accent/40 opacity-50 blur-xl transition-opacity group-hover:opacity-75"
            />
            <div className="relative grid overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto md:min-h-[360px]">
                {news?.coverImage ? (
                  <SanityImage
                    image={news.coverImage}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src="/images/parallel-race.jpg"
                    alt="Parallel moguls racing"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Newspaper className="h-4 w-4" />
                  {date ? <span>{date}</span> : <span>Nyhet</span>}
                </div>
                <h3 className="mb-4 text-2xl font-bold leading-tight md:text-3xl">
                  {title}
                </h3>
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  {excerpt}
                </p>
                {news?.link ? (
                  <div>
                    <Button variant="action" asChild>
                      <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Läs mer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

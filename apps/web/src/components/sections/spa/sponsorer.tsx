import { Star, TrendingUp, Trophy, Users } from "lucide-react"

import { SanityImage } from "@/components/sanity-image"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Users,
  TrendingUp,
  Star,
}

type Benefit = { icon?: string; title?: string; description?: string }

type SponsorerProps = {
  title: string
  subtitle: string
  benefitsTitle: string
  heroImage?: any
  benefits: Benefit[]
}

export function SponsorerSection({
  title,
  subtitle,
  benefitsTitle,
  heroImage,
  benefits,
}: SponsorerProps) {
  return (
    <section
      id="sponsorer"
      className="relative scroll-mt-24 overflow-hidden bg-muted/60 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-30" />
      <div className="orb orb-orange left-[-10%] top-1/3 h-[520px] w-[520px] opacity-35" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="accent-bar" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Partnerskap
            </p>
            <span className="accent-bar" />
          </div>
          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-gradient-brand">{title}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="group relative mb-16">
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-3xl bg-linear-to-br from-accent/40 via-transparent to-primary/40 opacity-60 blur-xl transition-opacity group-hover:opacity-90"
            />
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
              <div className="relative aspect-[21/9]">
                {heroImage ? (
                  <SanityImage
                    image={heroImage}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src="/images/sponsor-world-cup.jpg"
                    alt="Sponsorskap"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {benefits.length ? (
            <div className="mx-auto max-w-4xl">
              <h3 className="mb-10 text-center text-2xl font-bold md:text-3xl">
                {benefitsTitle}
              </h3>
              <ol className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
                {benefits.map((b, idx) => {
                  const Icon = ICONS[b.icon ?? ""] ?? Trophy
                  return (
                    <li
                      key={`${b.title}-${idx}`}
                      className="relative grid grid-cols-[auto_1fr] items-start gap-5 px-6 py-6 sm:gap-8 sm:px-10 sm:py-8"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-linear-to-b from-accent to-primary opacity-70"
                      />
                      <div className="flex min-w-14 items-baseline gap-2 sm:min-w-20">
                        <span className="text-4xl font-black leading-none tabular-nums text-accent sm:text-5xl">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0 text-primary" />
                          <h4 className="text-lg font-bold sm:text-xl">
                            {b.title}
                          </h4>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {b.description}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

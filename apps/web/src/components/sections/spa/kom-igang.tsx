import { MapPin, Trophy, Users, Zap } from "lucide-react"

import { SanityImage } from "@/components/sanity-image"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Users,
  Trophy,
  MapPin,
}

type Benefit = { icon?: string; title?: string; text?: string }

type KomIgangProps = {
  title: string
  subtitle: string
  aboutTitle: string
  aboutBody: string
  aboutImage?: any
  benefitsTitle: string
  benefits: Benefit[]
}

export function KomIgangSection({
  title,
  subtitle,
  aboutTitle,
  aboutBody,
  aboutImage,
  benefitsTitle,
  benefits,
}: KomIgangProps) {
  return (
    <section
      id="kom-igang"
      className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-40" />
      <div className="orb orb-blue -left-40 top-20 h-96 w-96 opacity-30" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="accent-bar" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Kom igång
            </p>
            <span className="accent-bar" />
          </div>
          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-gradient-brand">{title}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mx-auto mb-20 max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="group relative">
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-3xl bg-linear-to-br from-primary/30 to-accent/30 opacity-70 blur-xl transition-opacity group-hover:opacity-100"
              />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
                <div className="relative aspect-4/3">
                  {aboutImage ? (
                    <SanityImage
                      image={aboutImage}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <img
                      src="/images/kom-igang-traning.jpg"
                      alt="Träning på puckelpist"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <div
                aria-hidden="true"
                className="mb-4 h-1 w-16 rounded-full bg-linear-to-r from-primary to-accent"
              />
              <h3 className="mb-4 text-3xl font-bold">{aboutTitle}</h3>
              <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {aboutBody}
              </p>
            </div>
          </div>
        </div>

        {benefits.length ? (
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-16 text-center text-2xl font-bold md:text-3xl">
              {benefitsTitle}
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b, idx) => {
                const Icon = ICONS[b.icon ?? ""] ?? Zap
                const orange = idx % 2 === 1
                return (
                  <div
                    key={`${b.title}-${idx}`}
                    className="group relative pt-10"
                  >
                    <div
                      className={`absolute left-1/2 top-0 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6 ${
                        orange
                          ? "bg-linear-to-br from-accent to-accent/70"
                          : "bg-linear-to-br from-primary to-primary/70"
                      }`}
                    >
                      <Icon className="h-9 w-9 text-white" />
                    </div>
                    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 pb-6 pt-14 text-center shadow-sm transition-all group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-xl">
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute right-3 bottom-1 text-6xl font-black leading-none ${
                          orange ? "text-accent/8" : "text-primary/8"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h4 className="mb-2 text-lg font-bold">{b.title}</h4>
                      <p className="text-sm text-muted-foreground">{b.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

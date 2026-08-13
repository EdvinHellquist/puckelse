import { ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

import { SanityImage } from "@/components/sanity-image"

type HeroProps = {
  title: string
  subtitle: string
  lead: string
  heroImage?: any
  heroLogo?: any
}

export function HeroSection({ title, subtitle, lead, heroImage, heroLogo }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0">
        {heroImage ? (
          <SanityImage
            image={heroImage}
            fill
            className="object-cover"
          />
        ) : (
          <img
            src="/images/hero-new.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-70" />
      <div className="orb orb-blue animate-float-slow left-[-8%] top-[-10%] h-[520px] w-[520px]" />
      <div
        className="orb orb-orange animate-float-slow right-[-10%] bottom-[-15%] h-[560px] w-[560px]"
        style={{ animationDelay: "-3s" }}
      />

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-16 text-center">
        <div className="mx-auto max-w-4xl">
          {heroLogo ? (
            <div className="mx-auto mb-8 w-24 md:w-32">
              <SanityImage
                image={heroLogo}
                width={256}
                height={320}
                className="mx-auto h-auto w-full drop-shadow-2xl"
              />
            </div>
          ) : null}

          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="accent-bar" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Ski Team Sweden Moguls
            </span>
            <span className="accent-bar" />
          </div>

          <h1 className="mb-6 text-gradient-brand text-6xl font-black leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
            {title}
          </h1>

          <p className="mb-4 text-xl font-medium text-foreground/95 md:text-2xl">
            {subtitle}
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg">
            {lead}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="action" asChild>
              <a href="#kom-igang">Kom igång</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#framgangar">Se våra framgångar</a>
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#sponsors"
        aria-label="Scrolla ner"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground/60 transition-colors hover:text-primary"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </a>
    </section>
  )
}

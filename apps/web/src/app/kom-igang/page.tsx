import { Card, CardContent } from "@workspace/ui/components/card"
import { sanityFetch } from "@workspace/sanity/live"
import { queryKomIgangPage } from "@workspace/sanity/query"

import { SanityImage } from "@/components/sanity-image"
import { MapPin, Trophy, Users, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Users,
  Trophy,
  MapPin,
}

export default async function KomIgangPage() {
  const { data } = await sanityFetch({ 
    query: queryKomIgangPage,
    tags: ["komIgang"]
  })

  const title = data?.title ?? "Kom igång med Puckel!"
  const subtitle =
    data?.subtitle ??
    "Puckelåkning är en av de mest spektakulära grenarna inom freestyle. Här kombineras fart, hopp och skidteknik i en perfekt mix."

  const aboutTitle = data?.about?.cardTitle ?? "Vad är Puckelpist?"
  const aboutBody =
    data?.about?.cardBody ??
    "Puckelpist är en spektakulär freestylegren där åkare i hög fart tar sig nerför en brant pist fylld av täta pucklar och två hopp..."

  const benefitsTitle = data?.benefitsTitle ?? "Varför Puckel?"

  const benefits = data.benefits

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero */}
      <section className="relative container mx-auto px-4 mb-16">
        {/* Om du vill ha Bahui-bilden som dekoration kan vi koppla den till Sanity senare */}
        <div className="max-w-3xl mx-auto text-center animate-fade-in relative z-10">
          <h1 className="mb-6 text-4xl md:text-5xl font-bold">
            <span className="inline-block pb-2 leading-[1.05] bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
        </div>
      </section>

      {/* Vad är... */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-scale-in">
              {data?.about?.image ? (
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <div className="relative aspect-4/3">
                    <SanityImage image={data.about.image} fill className="object-cover" />
                  </div>
                </div>
              ) : (
                <img
                  src="/images/kom-igang-training.jpg"
                  alt="Träning på puckelpist"
                  className="w-full h-auto rounded-xl shadow-xl"
                />
              )}
            </div>

            <Card className="overflow-hidden animate-fade-in">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">{aboutTitle}</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {aboutBody}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 mb-4">
        <h2 className="text-3xl font-bold text-center mb-12">{benefitsTitle}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((b: any, idx: number) => {
            const Icon = ICONS[b.icon] ?? Zap
            return (
              <Card
                key={`${b.title}-${idx}`}
                className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.text}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
      <div className="mx-auto max-w-6xl">
        <Card className="bg-linear-to-r from-primary to-accent text-primary-foreground">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Följ resan mot OS</h3>
              <p className="mb-6 opacity-90">
                Stötta svenska åkare och följ utvecklingen inom både singel och parallell.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <a href="https://www.skidor.com/idrotter/puckel" target="_blank" rel="noopener noreferrer">
                  Svenska Skidförbundet
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </main>
  )
}

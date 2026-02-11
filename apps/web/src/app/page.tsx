import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { sanityFetch } from "@workspace/sanity/live";
import { queryHomePage, queryLatestNews } from "@workspace/sanity/query";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { SanityImage } from "@/components/sanity-image";
import { SponsorMarquee } from "@/components/sponsor-marquee";


export default async function Page() {
  const [{ data: home }, { data: news }] = await Promise.all([
    sanityFetch({ 
      query: queryHomePage,
      tags: ["homePage"]
    }),
    sanityFetch({ 
      query: queryLatestNews,
      tags: ["news"] 
    }),
  ]);

  const heroTitle = home?.heroTitle ?? "Svensk Puckel";
  const heroSubtitle = home?.heroSubtitle ?? "Svensk puckelåkning";
  const heroLead =
    home?.heroLead ??
    "Upplev spänningen i moguls - där fart, hopp och precision möts på snön. Med parra som ny OS-sport 2026 är vi på väg mot nya höjder!";
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          {home?.heroImage ? (
            <div className="absolute inset-0">
              <SanityImage image={home.heroImage} fill className="object-cover" />
            </div>
          ) : (
            <img
              src="/images/hero-new.jpg"
              alt="Freestyle moguls skiing action"
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="mx-auto mb-6 w-32">
              {home?.heroLogo ? (
                <SanityImage image={home.heroLogo} width={256} height={320} className="mx-auto h-auto w-full" />
              ) : (
                <img
                  src="/images/logo-stsm.jpg"
                  alt="Ski Team Sweden Moguls logo"
                  className="mx-auto h-auto w-32"
                />
              )}
            </div>

            <h1 className="mb-6 text-5xl font-bold md:text-7xl bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {heroTitle}
            </h1>

            <p className="mb-4 text-xl md:text-2xl text-muted-foreground">
              {heroSubtitle}
            </p>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {heroLead}
            </p>
          </div>
        </div>
      </section>
      {home?.mainSponsors?.length ? (
        <div className="mt-16">
          <SponsorMarquee sponsors={home.mainSponsors} />
        </div>
      ) : null}
      {/* Tre Huvudområden */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Här hittar du information om:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Kom igång */}
            <Card className="group hover:shadow-xl transition-all hover:scale-105 animate-fade-in">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <img src={"/images/bahui.png"} alt="Bahui maskot" className="w-full h-full object-cover"/>
                </div>
                <h3 className="text-2xl font-bold mb-4">Vill du börja?</h3>
                <p className="text-muted-foreground mb-6">
                  Är du nyfiken på puckelåkning? Här hittar du allt du behöver veta för att börja din resa!
                </p>
                <Button variant="ghost" className="group-hover:text-primary" asChild>
                  <Link href="/kom-igang">
                    Läs mer
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Sponsorer */}
            <Card className="group hover:shadow-xl transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <img src={"/images/sponsor-world-cup.jpg"} alt="Sponsorer" className="w-full h-full object-cover"/>
                </div>
                <h3 className="text-2xl font-bold mb-4">Sponsorer</h3>
                <p className="text-muted-foreground mb-6">
                  Intresserad av att sponsra svensk puckelåkning? Upptäck våra sponsorpaket och möjligheter.
                </p>
                <Button variant="ghost" className="group-hover:text-accent" asChild>
                  <Link href="/sponsorer">
                    Läs mer
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Freestyle Spirit */}
            <Card className="group hover:shadow-xl transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <img src={"/images/hall-of-fame.jpg"} alt="Freestyle Spirit - Hall of Fame" className="w-full h-full object-cover"/>
                </div>
                <h3 className="text-2xl font-bold mb-4">Freestyle Spirit</h3>
                <p className="text-muted-foreground mb-6">
                  Hall of Fame - Återblick på gångna säsonger, framgångar och historiska ögonblick.
                </p>
                <Button variant="ghost" className="group-hover:text-primary" asChild>
                  <Link href="/freestyle-spirit">
                    Läs mer
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Webshop */}
            <Card className="group hover:shadow-xl transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <img src={"/images/logo-stsm.jpg"} alt="STSM logo" className="w-full h-full object-cover" width={"128"} height={"172"}/>
                </div>
                <h3 className="text-2xl font-bold mb-4">Webshop</h3>
                <p className="text-muted-foreground mb-6">
                  Köp officiella produkter, kläder och prylar. Visa din passion för puckel!
                </p>
                <Button variant="action" asChild>
                  <a href="https://e-line.meri.se/sv034/Ski_Team_Moguls_Start/Profilklader" target="_blank" rel="noopener noreferrer">
                    Besök shoppen
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="pt-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  {news?.title ?? "Parra blir OS-sport 2026!"}
                </h2>
                <p className="text-muted-foreground mb-3">
                  {news?.excerpt ??
                    "Parallell puckelåkning (parra) gör debut i OS i Livigno 2026. Detta är en historisk milstolpe för svensk puckelåkning!"}
                </p>

                {news?.link ? (
                  <Button asChild variant="action" className="mt-4">
                    <a href={news.link} target="_blank" rel="noopener noreferrer">
                      Läs mer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>

              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <div className="relative aspect-video">
                  {news?.coverImage ? (
                    <SanityImage image={news.coverImage} fill className="object-cover" />
                  ) : (
                    <img
                      src="/images/parallel-race.jpg"
                      alt="Parallel moguls racing"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
            
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
        </div>
      </section>
    </div>
  )
}


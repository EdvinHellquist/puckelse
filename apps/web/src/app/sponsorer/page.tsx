import { sanityFetch } from "@workspace/sanity/live";
import { querySponsorerPage } from "@workspace/sanity/query";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { SanityImage } from "@/components/sanity-image";

// Minimal icon map (lägg till fler om du vill)
import { Trophy, Users, TrendingUp, Star } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Users,
  TrendingUp,
  Star,
};

function BenefitIcon({ name }: { name?: string }) {
  const Icon = (name && ICONS[name]) || Trophy;
  return <Icon className="h-6 w-6 text-primary" />;
}

export default async function SponsorerPage() {
  const { data } = await sanityFetch({ query: querySponsorerPage });

  const title = data?.title ?? "Bli Sponsor";
  const subtitle = data?.subtitle ?? "Stöd svensk puckelåkning och få exponering i en av de mest spektakulära vintersporterna.";

  const benefitsTitle = data?.benefitsTitle ?? "Varför Sponsra Puckel?";
  const packagesTitle = data?.packagesTitle ?? "Våra Sponsorpaket";

  const benefits = data.benefits
  const packages = data.packages


  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
          </div>
        </section>

        {/* Image */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-5xl mx-auto mb-12">
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              <div className="relative h-96">
                {data?.heroImage ? (
                  <SanityImage image={data.heroImage} fill className="object-cover" />
                ) : (
                  <img
                    src="/images/sponsor-world-cup.jpg"
                    alt="Sponsorskap och partnerskap"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-12">{benefitsTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((b:any, idx: number) => (
              <Card
                key={`${b.title}-${idx}`}
                className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BenefitIcon name={b.icon} />
                  </div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{packagesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg:any, idx:number) => (
              <Card
                key={`${pkg.name}-${idx}`}
                className={`relative overflow-hidden transition-all hover:scale-105 animate-scale-in ${
                  pkg.featured ? "border-primary shadow-lg" : ""
                }`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                {pkg.featured && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                    Populärast
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <p className="text-lg font-semibold text-primary">{pkg.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(pkg.features ?? []).map((feature:any, i:number) => (
                      <li key={`${feature}-${i}`} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <Card className="bg-linear-to-r from-primary to-accent text-primary-foreground overflow-hidden">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Intresserad av att sponsra?</h2>
                <p className="text-lg mb-8 opacity-90">
                  Vi skräddarsyr gärna ett sponsorpaket som passar just er verksamhet. Hör av dig så berättar vi mer!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Mail className="w-5 h-5" />
                    Kontakta oss
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Phone className="w-5 h-5" />
                    Ring oss
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

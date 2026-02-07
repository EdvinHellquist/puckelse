import Image from "next/image"
import { Trophy, Users, TrendingUp, Star, Mail, Phone } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function Page() {
  const benefits = [
    {
      icon: Trophy,
      title: "Exponering på tävlingar",
      description: "Synlighet på nationella och internationella tävlingar samt OS",
    },
    {
      icon: Users,
      title: "Målgrupp",
      description: "Nå en aktiv och engagerad målgrupp av åkare och deras familjer",
    },
    {
      icon: TrendingUp,
      title: "Växande sport",
      description: "Parra blir ny OS-sport 2026 - en sport på stark frammarsch",
    },
    {
      icon: Star,
      title: "Varumärkesbyggande",
      description: "Associera ert varumärke med action, ungdom och prestation",
    },
  ]

  const packages = [
    {
      name: "Bronspaket",
      price: "Från 10 000 kr/år",
      features: [
        "Logotyp på hemsida",
        "Omnämnande i sociala medier",
        "Varumärkesexponering vid lokala tävlingar",
      ],
    },
    {
      name: "Silverpaket",
      price: "Från 25 000 kr/år",
      features: [
        "Allt i Bronspaket",
        "Logotyp på tävlingskläder",
        "Produktplacering vid tävlingar",
        "Prioriterad exponering på hemsida",
      ],
      featured: true,
    },
    {
      name: "Guldpaket",
      price: "Från 50 000 kr/år",
      features: [
        "Allt i Silverpaket",
        "Huvudsponsor-status",
        "Exklusiv exponering vid samtliga tävlingar",
        "Samarbete kring event och aktiviteter",
        "Tillgång till åkare för marknadsföring",
      ],
    },
  ]

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Bli Sponsor
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Stöd svensk puckelåkning och få exponering i en av de mest spektakulära vintersporterna.
            Med parra som ny OS-sport 2026 är detta en perfekt tidpunkt att hoppa på!
          </p>
        </div>
      </section>

      {/* Varför sponsra */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative w-full h-96">
            <Image
              src="/images/sponsor-world-cup.jpg"
              alt="Sponsorskap och partnerskap"
              fill
              className="object-cover rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">Varför sponsra Puckel?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sponsorpaket */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Våra sponsorpaket</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.name}
              className={`relative overflow-hidden transition-all hover:scale-105 animate-scale-in ${
                pkg.featured ? "border-primary shadow-lg" : ""
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
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
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
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

      {/* Kontakt CTA */}
      <section className="container mx-auto px-4">
        <Card className="bg-linear-to-r from-primary to-accent text-primary-foreground overflow-hidden">
          <CardContent className="p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Intresserad av att sponsra?</h2>
              <p className="text-lg mb-8 opacity-90">
                Vi skräddarsyr gärna ett sponsorpaket som passar just er verksamhet.
                Hör av dig så berättar vi mer!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* mailto-knapp */}
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <a href="mailto:info@puckel.se">
                    <Mail className="w-5 h-5" />
                    Kontakta oss
                  </a>
                </Button>

                {/* tel-knapp */}
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  asChild
                >
                  <a href="tel:+46700000000">
                    <Phone className="w-5 h-5" />
                    Ring oss
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

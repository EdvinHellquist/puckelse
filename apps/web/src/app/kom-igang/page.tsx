import Image from "next/image"
import { MapPin, Users, Trophy, Zap } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"

export default function Page() {
  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative container mx-auto px-4 mb-16">
        <div className="absolute right-0 top-0 w-64 md:w-80 lg:w-96 opacity-20 pointer-events-none">
          <Image
            src="/images/bahui.png"
            alt="Bahui maskot"
            width={800}
            height={800}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="max-w-3xl mx-auto text-center animate-fade-in relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Kom igång med Puckel!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Puckelåkning (moguls) är en av de mest spektakulära grenarna inom freestyle.
            Här kombineras fart, hopp och precision på en bucklig pist.
          </p>
        </div>
      </section>

      {/* Vad är Puckel */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-scale-in">
              <img
                src="/images/kom-igang-traning.jpg"
                alt="Träning på puckelpist"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>

            <Card className="overflow-hidden animate-fade-in">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Vad är Puckelåkning?</h2>
                <p className="text-muted-foreground mb-4">
                  Puckelåkning, eller moguls på engelska, är en freestyle-gren där åkare tar sig ner
                  för en bucklig pist med två hopp. Det tävlas både i singel och i parallell - där
                  parallell blir ny OS-sport inför OS i Livigno!
                </p>
                <p className="text-muted-foreground">
                  Sporten kräver styrka, koordination och mod. Varje åkning bedöms på teknik, fart
                  och hoppens utförande - en perfekt mix av precision och action.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fördelar */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Varför Puckel?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Action & Adrenalin</h3>
              <p className="text-sm text-muted-foreground">
                Upplev spänningen med hopp och fart i en spektakulär miljö
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Gemenskap</h3>
              <p className="text-sm text-muted-foreground">
                Bli en del av en härlig gemenskap med passionerade åkare
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Tävla på högsta nivå</h3>
              <p className="text-sm text-muted-foreground">
                Möjlighet att tävla nationellt och internationellt, till och med OS!
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Hitta klubbar nära dig</h3>
              <p className="text-sm text-muted-foreground">
                Klubbar finns över hela Sverige - börja träna idag!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4">
        <Card className="bg-linear-to-r from-primary to-accent text-primary-foreground overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Redo att börja?</h2>
            <p className="text-lg mb-8 opacity-90">
              Kontakta en klubb nära dig och ta första steget in i puckelvärlden!
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a
                href="https://www.skidor.com/idrotter/puckel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hitta din klubb
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

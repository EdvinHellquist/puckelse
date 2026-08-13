import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const SHOP_URL =
  "https://e-line.meri.se/sv034/Ski_Team_Moguls_Start/Profilklader"

const products: {
  name: string
  price: string
  image: string
}[] = [
  {
    name: "Huvtröja stort tryck",
    price: "499 kr",
    image: "https://e-line.meri.se/images/prod200/ski010.jpg",
  },
  {
    name: "T-shirt stort tryck",
    price: "199 kr",
    image: "https://e-line.meri.se/images/prod200/ski009.jpg",
  },
  {
    name: "Huvtröja litet tryck",
    price: "499 kr",
    image: "https://e-line.meri.se/images/prod200/ski005_2.jpg",
  },
  {
    name: "T-shirt litet tryck",
    price: "199 kr",
    image: "https://e-line.meri.se/images/prod200/ski004_2.jpg",
  },
]

export function ShopSection() {
  return (
    <section
      id="shop"
      className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="orb orb-orange -right-24 top-10 h-[420px] w-[420px] opacity-30" />
      <div className="orb orb-blue -left-32 bottom-0 h-96 w-96 opacity-20" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="accent-bar" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Officiell shop
            </p>
            <span className="accent-bar" />
          </div>
          <h2 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl">
            <span className="text-gradient-brand">Bär färgerna</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Kläder och prylar direkt från Ski Team Moguls. Visa ditt stöd — varje
            plagg gör skillnad.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {products.map((p, idx) => (
            <a
              key={p.name}
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 p-4">
                <h3 className="text-sm font-semibold leading-snug">
                  {p.name}
                </h3>
                <span className="whitespace-nowrap text-sm font-bold text-primary">
                  {p.price}
                </span>
              </div>
            </a>
          ))}
        </div>

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
                    Fler produkter
                  </p>
                  <h3 className="text-2xl font-extrabold leading-tight">
                    Utforska hela sortimentet
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Officiella kläder, tryck och accessoarer på MERi Textil.
                  </p>
                </div>
              </div>
              <Button size="lg" variant="action" asChild className="shrink-0">
                <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                  Öppna shoppen
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

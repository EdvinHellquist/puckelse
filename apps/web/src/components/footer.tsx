// apps/web/src/components/footer.tsx
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              PUCKEL
            </h3>
            <p className="text-sm text-muted-foreground">
              Svensk puckelåkning - där action möter precision på snön.
            </p>
          </div>

          {/* Snabblänkar */}
          <div>
            <h4 className="font-semibold mb-4">Snabblänkar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://www.skidor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  prefetch={false}
                >
                  Svenska Skidförbundet
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://e-line.meri.se/sv034/Ski_Team_Moguls_Start/Profilklader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  prefetch={false}
                >
                  Webshop
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <p className="text-sm text-muted-foreground">
              För frågor om puckelåkning, sponsring eller samarbeten - hör av dig!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Puckel.se - Alla rättigheter förbehållna</p>
        </div>
      </div>
    </footer>
  )
}

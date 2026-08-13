import { ExternalLink, Facebook, Instagram, Mail, Youtube } from "lucide-react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

const SKIDFORBUND_URL = "https://www.skidor.com/idrotter/puckel"

type KontaktProps = {
  email?: string | null
  socials?: {
    facebook?: string
    instagram?: string
    youtube?: string
  } | null
}

export function KontaktSection({ email, socials }: KontaktProps) {
  return (
    <section
      id="kontakt"
      className="relative scroll-mt-24 overflow-hidden bg-background py-14 md:py-20"
    >
      <div className="orb orb-blue -left-24 top-10 h-96 w-96 opacity-25" />
      <div className="orb orb-orange -right-24 bottom-10 h-96 w-96 opacity-25" />

      <div className="container relative mx-auto px-4">
        <div className="group relative mx-auto max-w-5xl">
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-[2rem] bg-linear-to-br from-primary via-accent to-primary opacity-70 blur-2xl transition-opacity group-hover:opacity-90"
          />
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary to-accent p-10 shadow-2xl md:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-dot opacity-20"
              style={{ backgroundSize: "18px 18px" }}
            />
            <div className="relative mx-auto max-w-3xl text-center text-primary-foreground">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest opacity-80">
                Kontakt
              </p>
              <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
                Vill du bli en del av resan?
              </h2>
              <p className="mb-10 text-lg opacity-90">
                Fråga om sponsring, samarbeten eller bara säg hej — vi svarar
                gärna.
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                {email ? (
                  <Button size="lg" variant="secondary" asChild>
                    <a href={`mailto:${email}`}>
                      <Mail className="mr-2 h-5 w-5" />
                      {email}
                    </a>
                  </Button>
                ) : null}
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <a
                    href={SKIDFORBUND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Skidförbundet
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {socials?.facebook || socials?.instagram || socials?.youtube ? (
                <div className="mt-10 flex items-center justify-center gap-3">
                  {socials.facebook ? (
                    <SocialButton
                      href={socials.facebook}
                      label="Facebook"
                      icon={<Facebook className="h-5 w-5" />}
                    />
                  ) : null}
                  {socials.instagram ? (
                    <SocialButton
                      href={socials.instagram}
                      label="Instagram"
                      icon={<Instagram className="h-5 w-5" />}
                    />
                  ) : null}
                  {socials.youtube ? (
                    <SocialButton
                      href={socials.youtube}
                      label="YouTube"
                      icon={<Youtube className="h-5 w-5" />}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function SocialButton({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-primary-foreground transition-colors hover:bg-white/20"
    >
      {icon}
    </Link>
  )
}

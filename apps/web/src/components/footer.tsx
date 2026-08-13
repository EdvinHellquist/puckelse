import { ExternalLink, Facebook, Instagram, Mail, Youtube } from "lucide-react"
import Link from "next/link"

import { sanityFetch } from "@workspace/sanity/live"
import { querySettingsData } from "@workspace/sanity/query"

const externalLinks = [
  {
    label: "Svenska Skidförbundet",
    href: "https://www.skidor.com/idrotter/puckel",
  },
  {
    label: "FIS Freestyle Skiing",
    href: "https://www.fis-ski.com/en/freestyle-skiing",
  },
  {
    label: "Sveriges Olympiska Kommitté",
    href: "https://sok.se",
  },
]

export default async function Footer() {
  const { data } = await sanityFetch({
    query: querySettingsData,
    tags: ["settings"],
  })

  const email = data?.contactEmail
  const socials = data?.socialLinks

  return (
    <footer
      style={{
        background: "hsl(210 100% 42%)",
        color: "hsl(0 0% 100%)",
      }}
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent"
      />

      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div>
            <a
              href="#hero"
              className="inline-block text-2xl font-black tracking-tight text-white"
            >
              PUCKEL
            </a>
            <p className="mt-3 text-2xl font-extrabold leading-tight text-white">
              Fart.{" "}
              <span style={{ color: "hsl(24 100% 82%)" }}>Hopp.</span>{" "}
              Precision.
            </p>
          </div>

          <div className="md:justify-self-end">
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "hsl(205 80% 94%)" }}
            >
              Externa länkar
            </h4>
            <ul className="space-y-2 text-sm">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center"
          style={{
            borderColor: "hsl(0 0% 100% / 0.28)",
            color: "hsl(205 80% 94%)",
          }}
        >
          <p>© {new Date().getFullYear()} Puckel.se</p>

          <div className="flex items-center gap-2">
            {email ? (
              <FooterIcon
                href={`mailto:${email}`}
                label={`Maila ${email}`}
                icon={<Mail className="h-4 w-4" />}
              />
            ) : null}
            {socials?.facebook ? (
              <FooterIcon
                href={socials.facebook}
                label="Facebook"
                icon={<Facebook className="h-4 w-4" />}
                external
              />
            ) : null}
            {socials?.instagram ? (
              <FooterIcon
                href={socials.instagram}
                label="Instagram"
                icon={<Instagram className="h-4 w-4" />}
                external
              />
            ) : null}
            {socials?.youtube ? (
              <FooterIcon
                href={socials.youtube}
                label="YouTube"
                icon={<Youtube className="h-4 w-4" />}
                external
              />
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterIcon({
  href,
  label,
  icon,
  external,
}: {
  href: string
  label: string
  icon: React.ReactNode
  external?: boolean
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {}
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:border-accent hover:text-accent"
      style={{
        borderWidth: "1px",
        borderColor: "hsl(0 0% 100% / 0.35)",
        color: "hsl(0 0% 100%)",
      }}
      {...props}
    >
      {icon}
    </Link>
  )
}

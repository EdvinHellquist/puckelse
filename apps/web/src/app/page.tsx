import { sanityFetch } from "@workspace/sanity/live"
import {
  queryFreestyleSpiritPage,
  queryHomePage,
  queryKomIgangPage,
  queryLatestNews,
  querySeasons,
  querySettingsData,
  querySponsorerPage,
} from "@workspace/sanity/query"

import { HeroSection } from "@/components/sections/spa/hero"
import { KomIgangSection } from "@/components/sections/spa/kom-igang"
import { FramgangarSection } from "@/components/sections/spa/framgangar"
import { NyheterSection } from "@/components/sections/spa/nyheter"
import { SponsorerSection } from "@/components/sections/spa/sponsorer"
import { ShopSection } from "@/components/sections/spa/shop"
import { KontaktSection } from "@/components/sections/spa/kontakt"
import { SponsorMarquee } from "@/components/sponsor-marquee"

export default async function Page() {
  const [
    { data: home },
    { data: news },
    { data: komIgang },
    { data: sponsorer },
    { data: freestyle },
    { data: seasons },
    { data: settings },
  ] = await Promise.all([
    sanityFetch({ query: queryHomePage, tags: ["homePage"] }),
    sanityFetch({ query: queryLatestNews, tags: ["news"] }),
    sanityFetch({ query: queryKomIgangPage, tags: ["komIgang"] }),
    sanityFetch({ query: querySponsorerPage, tags: ["sponsorerPage"] }),
    sanityFetch({
      query: queryFreestyleSpiritPage,
      tags: ["freestyleSpiritPage"],
    }),
    sanityFetch({ query: querySeasons, tags: ["seasons"] }),
    sanityFetch({ query: querySettingsData, tags: ["settings"] }),
  ])

  const heroTitle = home?.heroTitle ?? "Svensk Puckel"
  const heroSubtitle = home?.heroSubtitle ?? "Svensk puckelåkning"
  const heroLead =
    home?.heroLead ??
    "Upplev spänningen i moguls — där fart, hopp och precision möts på snön. Med parra som ny OS-sport 2026 är vi på väg mot nya höjder!"

  const komIgangTitle = komIgang?.title ?? "Kom igång med Puckel!"
  const komIgangSubtitle =
    komIgang?.subtitle ??
    "Puckelåkning är en av de mest spektakulära grenarna inom freestyle."
  const aboutTitle = komIgang?.about?.cardTitle ?? "Vad är Puckelpist?"
  const aboutBody =
    komIgang?.about?.cardBody ??
    "Puckelpist är en spektakulär freestylegren där åkare i hög fart tar sig nerför en brant pist fylld av täta pucklar och två hopp."
  const benefitsTitle = komIgang?.benefitsTitle ?? "Varför Puckel?"

  const sponsorTitle = sponsorer?.title ?? "Bli sponsor"
  const sponsorSubtitle =
    sponsorer?.subtitle ??
    "Stöd svensk puckelåkning och få exponering i en av de mest spektakulära vintersporterna."
  const sponsorBenefitsTitle =
    sponsorer?.benefitsTitle ?? "Varför sponsra puckel?"

  return (
    <>
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        lead={heroLead}
        heroImage={home?.heroImage}
        heroLogo={home?.heroLogo}
      />

      {home?.mainSponsors?.length ? (
        <section
          id="sponsors"
          className="relative scroll-mt-24 border-y border-border/60 bg-background"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
          <SponsorMarquee sponsors={home.mainSponsors} />
        </section>
      ) : null}

      <KomIgangSection
        title={komIgangTitle}
        subtitle={komIgangSubtitle}
        aboutTitle={aboutTitle}
        aboutBody={aboutBody}
        aboutImage={komIgang?.about?.image}
        benefitsTitle={benefitsTitle}
        benefits={komIgang?.benefits ?? []}
      />

      <FramgangarSection seasons={seasons ?? []} />

      <NyheterSection news={news ?? null} />

      <SponsorerSection
        title={sponsorTitle}
        subtitle={sponsorSubtitle}
        benefitsTitle={sponsorBenefitsTitle}
        heroImage={sponsorer?.heroImage}
        benefits={sponsorer?.benefits ?? []}
      />

      <ShopSection />

      <KontaktSection
        email={settings?.contactEmail}
        socials={settings?.socialLinks}
      />
    </>
  )
}

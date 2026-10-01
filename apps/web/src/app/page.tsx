import { sanityFetch } from "@workspace/sanity/live"
import {
  queryClubs,
  queryFreestyleSpiritPage,
  queryHomePage,
  queryKomIgangPage,
  queryNews,
  querySeasons,
  querySettingsData,
  queryShopPage,
  querySponsorerPage,
} from "@workspace/sanity/query"

import { HeroSection } from "@/components/sections/spa/hero"
import { KomIgangSection } from "@/components/sections/spa/kom-igang"
import { KlubbarSection } from "@/components/sections/spa/klubbar"
import { FramgangarSection } from "@/components/sections/spa/framgangar"
import { NyheterSection } from "@/components/sections/spa/nyheter"
import { SponsorerSection } from "@/components/sections/spa/sponsorer"
import { ShopSection } from "@/components/sections/spa/shop"
import { KontaktSection } from "@/components/sections/spa/kontakt"
import { SponsorMarquee } from "@/components/sponsor-marquee"

// Allt innehåll kommer från Sanity. Saknas ett dokument renderas sektionen inte
// alls, i stället för att visa platshållare.
export default async function Page() {
  const [
    { data: home },
    { data: news },
    { data: komIgang },
    { data: sponsorer },
    { data: freestyle },
    { data: seasons },
    { data: settings },
    { data: clubs },
    { data: shop },
  ] = await Promise.all([
    sanityFetch({ query: queryHomePage, tags: ["homePage"] }),
    sanityFetch({ query: queryNews, tags: ["news"] }),
    sanityFetch({ query: queryKomIgangPage, tags: ["komIgang"] }),
    sanityFetch({ query: querySponsorerPage, tags: ["sponsorerPage"] }),
    sanityFetch({
      query: queryFreestyleSpiritPage,
      tags: ["freestyleSpiritPage"],
    }),
    sanityFetch({ query: querySeasons, tags: ["seasons"] }),
    sanityFetch({ query: querySettingsData, tags: ["settings"] }),
    sanityFetch({ query: queryClubs, tags: ["clubs"] }),
    sanityFetch({ query: queryShopPage, tags: ["shopPage"] }),
  ])

  return (
    <>
      {home ? (
        <HeroSection
          eyebrow={home.heroEyebrow}
          title={home.heroTitle}
          subtitle={home.heroSubtitle}
          lead={home.heroLead}
          heroImage={home.heroImage}
          heroLogo={home.heroLogo}
          shopUrl={shop?.shopUrl}
        />
      ) : null}

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

      {komIgang ? (
        <KomIgangSection
          eyebrow={komIgang.eyebrow}
          title={komIgang.title}
          subtitle={komIgang.subtitle}
          aboutTitle={komIgang.about?.cardTitle}
          aboutBody={komIgang.about?.cardBody}
          aboutImage={komIgang.about?.image}
          benefitsTitle={komIgang.benefitsTitle}
          benefits={komIgang.benefits ?? []}
        />
      ) : null}

      {home?.clubsSection ? (
        <KlubbarSection header={home.clubsSection} clubs={clubs ?? []} />
      ) : null}

      {freestyle ? (
        <FramgangarSection content={freestyle} seasons={seasons ?? []} />
      ) : null}

      {home?.newsSection && news?.length ? (
        <NyheterSection header={home.newsSection} news={news} />
      ) : null}

      {sponsorer ? (
        <SponsorerSection
          eyebrow={sponsorer.eyebrow}
          title={sponsorer.title}
          subtitle={sponsorer.subtitle}
          benefitsTitle={sponsorer.benefitsTitle}
          heroImage={sponsorer.heroImage}
          benefits={sponsorer.benefits ?? []}
        />
      ) : null}

      {shop ? <ShopSection shop={shop} /> : null}

      {home?.contactSection ? (
        <KontaktSection
          header={home.contactSection}
          email={settings?.contactEmail}
          socials={settings?.socialLinks}
          federationLink={settings?.federationLink}
        />
      ) : null}
    </>
  )
}

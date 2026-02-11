import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "alt": coalesce(
    alt,
    asset->altText,
    caption,
    asset->originalFilename,
    "untitled"
  ),
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  }
`;
// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);


const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);


export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);


export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo {
      ${imageFields}
    },
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`);

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "logo": logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`);

export const queryHomePage = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    heroTitle,
    heroSubtitle,
    heroLead,
    heroImage{${imageFields}},
    heroLogo{${imageFields}},
    mainSponsors[]{
      name,
      url,
      logo{
        ${imageFields}
      }
    }
  }
`);

export const queryLatestNews = defineQuery(`
  *[_type == "news"] | order(publishedAt desc)[0]{
    title,
    excerpt,
    publishedAt,
    link,
    coverImage{ ${imageFields} }
  }
`);

export const queryKomIgangPage = defineQuery(`
  *[_type == "komIgangPage" && _id == "komIgangPage"][0]{
    title,
    subtitle,
    about{
      cardTitle,
      cardBody,
      image{
        ${imageFields}
      }
    },
    benefitsTitle,
    benefits[]{
      icon,
      title,
      text
    }
  }
`)

export const querySponsorerPage = defineQuery(`
  *[_type == "sponsorerPage" && _id == "sponsorerPage"][0]{
    title,
    subtitle,
    benefitsTitle,
    packagesTitle,
    heroImage { ${imageFields} },
    benefits[]{
      icon,
      title,
      description
    },
    packages[]{
      name,
      price,
      featured,
      features
    }
  }
`);

export const queryFreestyleSpiritPage = defineQuery(`
  *[_type == "freestyleSpiritPage" && _id == "freestyleSpiritPage"][0]{
    title,
    subtitle,
    heroImage { ${imageFields} }
  }
`);

export const querySeasons = defineQuery(`
  *[_type == "season"] | order(yearStart desc) {
    _id,
    label,
    yearStart,
    worldCupResults[]{ competition, date, discipline, skier, place, level },
    europaCupResults[]{ competition, date, discipline, skier, place, level },
    svenskaCupenResults[]{ competition, date, discipline, skier, place, level },
    ymgResults[]{ competition, date, discipline, skier, place, level },
    osResults[]{ competition, date, discipline, skier, place, level },
    vmResults[]{ competition, date, discipline, skier, place, level },
    seasonCards[]{ _key, badge, title, description, href, variant, thumbnail { ${imageFields} }},
    recapItems[]{
      category,
      title,
      description,
      url,
      thumbnail { ${imageFields} }
    }
  }
`);

export const queryLegendSkiers = defineQuery(`
  *[_type == "legendSkier"] | order(name asc) {
    _id,
    name,
    era,
    bio,
    osMedals,
    vmMedals,
    wcWins,
    jvmMedals,
    ecWins,
    smMedals,
    photo { ${imageFields} }
  }
`);

export const queryPageBySlug = `
  *[_type in ["page"] && slug.current == $slug][0]{
    _id,
    _type,
    pageBuilder
  }
`;



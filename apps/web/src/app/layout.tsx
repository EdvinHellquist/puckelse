import "@workspace/ui/globals.css";

import type { Metadata } from "next";
import { SanityLive, sanityFetch } from "@workspace/sanity/live";
import { querySettingsData } from "@workspace/sanity/query";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { preconnect, prefetchDNS } from "react-dom";


import { CombinedJsonLd } from "@/components/json-ld";

import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getBaseUrl } from "@/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

async function getSettings() {
  const { data } = await sanityFetch({
    query: querySettingsData,
    tags: ["settings"],
  });
  return data;
}

// Titel och beskrivning redigeras i Sanity under Settings.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings?.siteTitle ?? undefined;
  return {
    metadataBase: new URL(getBaseUrl()),
    title: siteTitle
      ? { default: siteTitle, template: `%s · ${siteTitle}` }
      : undefined,
    description: settings?.siteDescription ?? undefined,
    openGraph: {
      type: "website",
      locale: "sv_SE",
      siteName: siteTitle,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  const settings = await getSettings();
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar federationLink={settings?.federationLink} />
          {children}
          <Footer />
          <SanityLive />
          <CombinedJsonLd includeOrganization includeWebsite />
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}

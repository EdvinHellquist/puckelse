import "@workspace/ui/globals.css";

import type { Metadata } from "next";
import { SanityLive } from "@workspace/sanity/live";
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

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Puckel.se – Svensk puckelåkning",
    template: "%s · Puckel.se",
  },
  description:
    "Allt om svensk puckelåkning – landslaget, resultat, träning och sponsorer. På väg mot OS 2026 i Livigno.",
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "Puckel.se",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
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

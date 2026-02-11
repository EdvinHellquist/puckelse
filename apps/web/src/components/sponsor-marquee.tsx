"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SanityImage } from "@/components/sanity-image";

type Img = any;

type Sponsor = {
  name?: string;
  url?: string;
  logo?: Img;
};

export function SponsorMarquee({
  sponsors,
  speedPxPerSecond = 20,
}: {
  sponsors: Sponsor[];
  speedPxPerSecond?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const doubled = useMemo(() => [...sponsors, ...sponsors], [sponsors]);

  // Mät så tidigt som möjligt (minskar "flash" vid first render)
  useLayoutEffect(() => {
    if (!firstRef.current) return;
    setContentWidth(firstRef.current.scrollWidth);
  }, [sponsors]);

  // Håll måttet uppdaterat vid resize (responsivt)
  useEffect(() => {
    if (!firstRef.current) return;

    const el = firstRef.current;
    const ro = new ResizeObserver(() => {
      setContentWidth(el.scrollWidth);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [sponsors]);

  // Om det är för få sponsors, rendera inget (eller en statisk rad)
  if (!sponsors?.length) return null;

  const durationSeconds =
    contentWidth > 0 ? contentWidth / speedPxPerSecond : 20;

  return (
    <div className="relative overflow-hidden bg-background/80 backdrop-blur">
      <div className="py-6">
        <div
          ref={trackRef}
          className="sponsor-marquee-track"
          style={
            {
              "--marquee-distance": `${contentWidth}px`,
              "--marquee-duration": `${durationSeconds}s`,
            } as React.CSSProperties
          }
        >
          {/* Första “halvan” vi mäter */}
          <div ref={firstRef} className="flex gap-16 pr-16 w-max">
            {sponsors.map((sponsor, i) => (
              <SponsorLogo key={`a-${sponsor.name ?? "s"}-${i}`} sponsor={sponsor} />
            ))}
          </div>

          {/* Klon för sömlös loop */}
          <div className="flex gap-16 pr-16 w-max" aria-hidden="true">
            {doubled.map((sponsor, i) => (
              <SponsorLogo key={`b-${sponsor.name ?? "s"}-${i}`} sponsor={sponsor} />
            ))}
          </div>
        </div>
      </div>

      {/* fade i kanterna */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent" />
    </div>
  );
}

function SponsorLogo({ sponsor }: { sponsor: { name?: string; url?: string; logo?: any } }) {
  const content = sponsor.logo ? (
    <div className="relative h-16 w-35 shrink-0">
      <SanityImage image={sponsor.logo} fill className="object-contain" />
    </div>
  ) : (
    <div className="h-12 w-35 shrink-0" />
  );

  // Om url saknas: rendera utan länk
  if (!sponsor.url) {
    return (
      <div className="flex items-center shrink-0 opacity-80">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={sponsor.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center shrink-0 opacity-90 hover:opacity-100 transition"
      aria-label={sponsor.name ?? "Sponsor"}
      title={sponsor.name ?? undefined}
    >
      {content}
    </Link>
  );
}

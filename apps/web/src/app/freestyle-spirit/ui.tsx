"use client";

import { useMemo, useState } from "react";
import { Award, ChevronLeft, ChevronRight, ChevronDown, Trophy, Video } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";

import { SanityImage } from "@/components/sanity-image";

type Img = any;

type SeasonResult = {
  competition: string;
  date: string;
  discipline: string;
  skier: string;
  place: number;
  level: "WC" | "EC" | "SC" | "YMG" | "VM" | "OS" | "OTHER";
};

type Season = {
  _id: string;
  label: string;
  yearStart: number;
  worldCupResults?: SeasonResult[];
  europaCupResults?: SeasonResult[];
  svenskaCupenResults?: SeasonResult[];
  ymgResults?: SeasonResult[];
  osResults?: SeasonResult[];
  vmResults?: SeasonResult[];
  recapItems?: {
    category: string;
    title: string;
    description?: string;
    url: string;
    thumbnail?: Img;
  }[];
};

type Legend = {
  _id: string;
  name: string;
  era?: string;
  bio?: string;
  osMedals?: number;
  vmMedals?: number;
  wcWins?: number;
  photo?: Img;
};

export function FreestyleSpiritClient({
  page,
  seasons,
  legends,
}: {
  page: { title?: string; subtitle?: string; heroImage?: Img } | null;
  seasons: Season[];
  legends: Legend[];
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Säsongs “pager” (sidled)
  const [seasonIndex, setSeasonIndex] = useState(0);
  const season = seasons.length ? seasons[Math.min(Math.max(seasonIndex, 0), seasons.length - 1)] : undefined;

  const toggleSection = (key: string) =>
    setOpenSection((curr) => (curr === key ? null : key));
  const hallStats = useMemo(() => {
    const allResults: SeasonResult[] = seasons.flatMap((s) => [
      ...(s.osResults ?? []),
      ...(s.vmResults ?? []),
      ...(s.worldCupResults ?? []),
      ...(s.europaCupResults ?? []),
      ...(s.svenskaCupenResults ?? []),
      ...(s.ymgResults ?? []),
    ]);

    const isMedal = (r: SeasonResult) => r.place >= 1 && r.place <= 3;

    const osMedals = allResults.filter((r) => r.level === "OS" && isMedal(r)).length;
    const vmMedals = allResults.filter((r) => r.level === "VM" && isMedal(r)).length;
    const wcWins = allResults.filter((r) => r.level === "WC" && r.place === 1).length;

    return { osMedals, vmMedals, wcWins };
  }, [seasons]);

  const title = page?.title ?? "Freestyle Spirit";
  const subtitle = page?.subtitle ?? "Hall of Fame - Våra stoltheter genom åren";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-32 pb-12 bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-accent rounded-full mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </h1>

            <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>

            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <div className="relative aspect-video">
                  {page?.heroImage ? (
                    <SanityImage image={page.heroImage} fill className="object-cover" />
                  ) : (
                    <img src="/images/hall-of-fame.jpg" alt="Hall of Fame" className="h-full w-full object-cover" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framgångar genom åren */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Framgångar genom åren</h2>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeasonIndex((i) => Math.min(seasons.length - 1, i + 1))}
                  disabled={seasonIndex >= seasons.length - 1}
                  aria-label="Äldre säsong"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Badge variant="default">
                  {season?.label ?? "—"}
                </Badge>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeasonIndex((i) => Math.max(0, i - 1))}
                  disabled={seasonIndex <= 0}
                  aria-label="Nyare säsong"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <ResultCollapsible
                title="Världscup"
                tag="WorldCup"
                border="border-l-primary"
                open={openSection === "wc"}
                onToggle={() => toggleSection("wc")}
                results={season?.worldCupResults ?? []}
              />

              <ResultCollapsible
                title="Europacup"
                tag="EuropaCup"
                border="border-l-accent"
                open={openSection === "ec"}
                onToggle={() => toggleSection("ec")}
                results={season?.europaCupResults ?? []}
              />

              <ResultCollapsible
                title="Svenska Cupen"
                tag="Svenska Cupen"
                border="border-l-blue-500"
                open={openSection === "sc"}
                onToggle={() => toggleSection("sc")}
                results={season?.svenskaCupenResults ?? []}
                emptyText="Resultat kommer snart..."
              />

              <ResultCollapsible
                title="Youth Mogul Games"
                tag="YMG"
                border="border-l-green-500"
                open={openSection === "ymg"}
                onToggle={() => toggleSection("ymg")}
                results={season?.ymgResults ?? []}
                emptyText="Resultat kommer snart..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Återblick */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Video className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Återblick</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* WorldCup Säsongssammanfattning */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-video bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">WorldCup</Badge>
                  <h3 className="font-semibold mb-2">Säsongssammanfattning WC</h3>
                  <p className="text-sm text-muted-foreground">
                    Höjdpunkter från världscupsäsongen 2024/25
                  </p>
                </CardContent>
              </Card>

              {/* EuropaCup Säsongssammanfattning */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-video bg-linear-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-12 h-12 text-accent" />
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">EuropaCup</Badge>
                  <h3 className="font-semibold mb-2">Säsongssammanfattning EC</h3>
                  <p className="text-sm text-muted-foreground">
                    Höjdpunkter från EuropaCup-säsongen
                  </p>
                </CardContent>
              </Card>

              {/* Svenska Cupen Säsongssammanfattning */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-video bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">Svenska Cupen</Badge>
                  <h3 className="font-semibold mb-2">Säsongssammanfattning SC</h3>
                  <p className="text-sm text-muted-foreground">
                    Höjdpunkter från Svenska Cupen
                  </p>
                </CardContent>
              </Card>

              {/* YMG Säsongssammanfattning */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-video bg-linear-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-12 h-12 text-accent" />
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">YMG</Badge>
                  <h3 className="font-semibold mb-2">Säsongssammanfattning YMG</h3>
                  <p className="text-sm text-muted-foreground">
                    Våra framtidsstjärnor i aktion
                  </p>
                </CardContent>
              </Card>

              {/* SM */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-video bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">SM</Badge>
                  <h3 className="font-semibold mb-2">Svenska Mästerskapen</h3>
                  <p className="text-sm text-muted-foreground">
                    Höjdpunkter från SM 2025
                  </p>
                </CardContent>
              </Card>

              {/* Årets bästa bilder */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-video bg-linear-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-12 h-12 text-accent" />
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">Galleri</Badge>
                  <h3 className="font-semibold mb-2">Årets bästa bilder</h3>
                  <p className="text-sm text-muted-foreground">
                    De mest spektakulära bilderna från säsongen
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame (dynamiskt) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Hall of Fame</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Summering baserad på resultaten som finns inlagda i Sanity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <StatCard title="OS-medaljer" value={hallStats.osMedals} icon="trophy" />
              <StatCard title="VM-medaljer" value={hallStats.vmMedals} icon="award" />
              <StatCard title="Världscup-segrar" value={hallStats.wcWins} icon="trophy" />
            </div>

            {/* Legendariska åkare (carousel) */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4 text-center">Legender inom svensk puckel</h3>
              <LegendCarousel legends={legends} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResultCollapsible({
  title,
  tag,
  border,
  open,
  onToggle,
  results,
  emptyText,
}: {
  title: string;
  tag: string;
  border: string;
  open: boolean;
  onToggle: () => void;
  results: SeasonResult[];
  emptyText?: string;
}) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Card className={`hover:shadow-lg transition-shadow border-l-4 ${border} cursor-pointer`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="w-fit mb-2">{tag}</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  {title}
                </CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className={`mt-2 border-l-4 ${border}`}>
          <CardContent className="pt-4">
            {results.length === 0 ? (
              <p className="text-muted-foreground">{emptyText ?? "Inga resultat inlagda än."}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tävling</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Gren</TableHead>
                      <TableHead>Åkare</TableHead>
                      <TableHead className="text-right">Placering</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{r.competition}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          <Badge variant={r.discipline === "MO" ? "default" : "secondary"} className="text-xs">
                            {r.discipline}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.skier}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-bold ${
                              r.place <= 3 ? "text-yellow-500" : r.place <= 10 ? "text-blue-500" : "text-foreground"
                            }`}
                          >
                            {r.place}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: "trophy" | "award" }) {
  const Icon = icon === "award" ? Award : Trophy;
  return (
    <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
      <CardContent className="pt-8 pb-6">
        <div className="w-20 h-20 bg-linear-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-3xl font-bold text-primary mb-2">{value}</p>
      </CardContent>
    </Card>
  );
}

function LegendCarousel({ legends }: { legends: Legend[] }) {
  const [index, setIndex] = useState(0);

  const safeIndex = Math.min(Math.max(index, 0), legends.length - 1);
  const item = legends[safeIndex] ? legends[safeIndex] : {  _id: 0,
  name: "Inget",
  era: "",
  bio: "Tom",
  osMedals: 0,
  vmMedals: 0,
  wcWins: 0,
  photo: ""};

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(legends.length - 1, i + 1));

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            disabled={safeIndex === 0}
            aria-label="Föregående"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground">
            {safeIndex + 1} / {legends.length}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            disabled={safeIndex === legends.length - 1}
            aria-label="Nästa"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="relative overflow-hidden rounded-xl shadow">
            <div className="relative aspect-4/5">
              {item.photo ? (
                <SanityImage image={item.photo} fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                  Ingen bild
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold">{item.name}</h4>
            {item.era ? <p className="text-muted-foreground mt-1">{item.era}</p> : null}

            <div className="mt-4 grid grid-cols-3 gap-3">
              <MiniStat label="OS" value={item.osMedals ?? 0} />
              <MiniStat label="VM" value={item.vmMedals ?? 0} />
              <MiniStat label="WC" value={item.wcWins ?? 0} />
            </div>

            {item.bio ? (
              <p className="mt-4 text-muted-foreground leading-relaxed">{item.bio}</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold text-primary">{value}</div>
    </div>
  );
}

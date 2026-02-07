"use client"

import { useState } from "react"
import { Award, ChevronDown, Trophy, Video } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@workspace/ui/components/collapsible"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@workspace/ui/components/table"


const worldCupResults = [
  { competition: "Ruka (FIN)", date: "30 nov 2024", discipline: "MO", skier: "Walter Wallberg", place: 2 },
  { competition: "Ruka (FIN)", date: "30 nov 2024", discipline: "MO", skier: "Rasmus Stegfeldt", place: 14 },
  { competition: "Ruka (FIN)", date: "30 nov 2024", discipline: "MO", skier: "Robin Olgård", place: 15 },
  { competition: "Ruka (FIN)", date: "30 nov 2024", discipline: "MO", skier: "Filip Gravenfors", place: 16 },
  { competition: "Idre (SWE)", date: "6-7 dec 2024", discipline: "MO", skier: "Walter Wallberg", place: 3 },
  { competition: "Idre (SWE)", date: "6-7 dec 2024", discipline: "MO", skier: "Rasmus Stegfeldt", place: 6 },
  { competition: "Idre (SWE)", date: "6-7 dec 2024", discipline: "MO", skier: "Albin Holmgren", place: 9 },
  { competition: "Bakuriani (GEO)", date: "19-21 dec 2024", discipline: "MO", skier: "Walter Wallberg", place: 4 },
  { competition: "Bakuriani (GEO)", date: "19-21 dec 2024", discipline: "MO", skier: "Rasmus Stegfeldt", place: 5 },
  { competition: "Bakuriani (GEO)", date: "19-21 dec 2024", discipline: "MO", skier: "Filip Gravenfors", place: 13 },
  { competition: "Bakuriani (GEO)", date: "19-21 dec 2024", discipline: "DM", skier: "Walter Wallberg", place: 1 },
  { competition: "Bakuriani (GEO)", date: "19-21 dec 2024", discipline: "DM", skier: "Filip Gravenfors", place: 3 },
  { competition: "Bakuriani (GEO)", date: "19-21 dec 2024", discipline: "DM", skier: "Robin Olgård", place: 14 },
  { competition: "Waterville (USA)", date: "24-25 jan 2025", discipline: "MO", skier: "Rasmus Stegfeldt", place: 5 },
  { competition: "Waterville (USA)", date: "24-25 jan 2025", discipline: "MO", skier: "Filip Gravenfors", place: 7 },
  { competition: "Waterville (USA)", date: "24-25 jan 2025", discipline: "DM", skier: "Filip Gravenfors", place: 3 },
  { competition: "Val St. Come (CAN)", date: "31 jan-1 feb 2025", discipline: "MO", skier: "Emil Holmgren", place: 4 },
  { competition: "Val St. Come (CAN)", date: "31 jan-1 feb 2025", discipline: "MO", skier: "Filip Gravenfors", place: 5 },
  { competition: "Val St. Come (CAN)", date: "31 jan-1 feb 2025", discipline: "MO", skier: "Rasmus Stegfeldt", place: 7 },
  { competition: "Val St. Come (CAN)", date: "31 jan-1 feb 2025", discipline: "DM", skier: "Filip Gravenfors", place: 4 },
  { competition: "Val St. Come (CAN)", date: "31 jan-1 feb 2025", discipline: "DM", skier: "Albin Holmgren", place: 5 },
  { competition: "Deer Valley (USA)", date: "6-8 feb 2025", discipline: "MO", skier: "Filip Gravenfors", place: 5 },
  { competition: "Deer Valley (USA)", date: "6-8 feb 2025", discipline: "MO", skier: "Rasmus Stegfeldt", place: 8 },
  { competition: "Beidahu (CHN)", date: "21-24 feb 2025", discipline: "MO", skier: "Filip Gravenfors", place: 3 },
  { competition: "Beidahu (CHN)", date: "21-24 feb 2025", discipline: "MO", skier: "Rasmus Stegfeldt", place: 13 },
  { competition: "Beidahu (CHN)", date: "21-24 feb 2025", discipline: "MO", skier: "Albin Holmgren", place: 15 },
  { competition: "Beidahu (CHN)", date: "21-24 feb 2025", discipline: "DM", skier: "Filip Gravenfors", place: 5 },
  { competition: "Beidahu (CHN)", date: "21-24 feb 2025", discipline: "DM", skier: "Rasmus Stegfeldt", place: 9 },
  { competition: "Beidahu (CHN)", date: "21-24 feb 2025", discipline: "DM", skier: "Albin Holmgren", place: 11 },
  { competition: "Almaty (KAZ)", date: "28 feb-2 mar 2025", discipline: "MO", skier: "Filip Gravenfors", place: 4 },
  { competition: "Almaty (KAZ)", date: "28 feb-2 mar 2025", discipline: "MO", skier: "Rasmus Stegfeldt", place: 10 },
  { competition: "Almaty (KAZ)", date: "28 feb-2 mar 2025", discipline: "DM", skier: "Filip Gravenfors", place: 5 },
  { competition: "Almaty (KAZ)", date: "28 feb-2 mar 2025", discipline: "DM", skier: "Rasmus Stegfeldt", place: 12 },
  { competition: "Livigno (ITA)", date: "11-13 mar 2025", discipline: "MO", skier: "Filip Gravenfors", place: 5 },
  { competition: "Livigno (ITA)", date: "11-13 mar 2025", discipline: "DM", skier: "Filip Gravenfors", place: 3 },
  { competition: "Livigno (ITA)", date: "11-13 mar 2025", discipline: "DM", skier: "Rasmus Stegfeldt", place: 12 },
];

// EuropaCup results data
const europaCupResults = [
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "MO", skier: "Gordon Berg", place: 1 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "MO", skier: "Jakob Hansson M", place: 2 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "MO", skier: "Noel Gravenfors", place: 3 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "MO", skier: "Rio Tessert", place: 6 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "MO", skier: "Linus Johansson", place: 7 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "MO", skier: "Vilgot Lundholm", place: 8 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "DM", skier: "Jakob Hansson M", place: 1 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "DM", skier: "Gordon Berg", place: 2 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "DM", skier: "Noel Gravenfors", place: 4 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "DM", skier: "Vilgot Lundholm", place: 5 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "DM", skier: "Linus Johansson", place: 11 },
  { competition: "Duved (SWE)", date: "25-26 jan 2025", discipline: "DM", skier: "Rio Tessert", place: 8 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Jakob Hansson M", place: 1 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Karl Wärme", place: 2 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Linus Johansson", place: 3 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Gordon Berg", place: 4 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Noel Gravenfors", place: 7 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Vilgot Lundholm", place: 8 },
  { competition: "Jyväskylä (FIN)", date: "1-2 feb 2025", discipline: "MO", skier: "Vincent Adriansson", place: 13 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Karl Wärme", place: 1 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Noel Gravenfors", place: 2 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Jakob Hansson M", place: 4 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Gordon Berg", place: 7 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Rio Tessert", place: 8 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Linus Johansson", place: 10 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Vincent Adriansson", place: 13 },
  { competition: "Jyväskylä (FIN)", date: "2 feb 2025", discipline: "MO", skier: "Vilgot Lundholm", place: 14 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Karl Wärme", place: 1 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Jakob Hansson M", place: 2 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Gordon Berg", place: 3 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Vincent Adriansson", place: 7 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Linus Johansson", place: 8 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Noel Gravenfors", place: 14 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "MO", skier: "Vilgot Lundholm", place: 15 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "DM", skier: "Gordon Berg", place: 3 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "DM", skier: "Jakob Hansson M", place: 4 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "DM", skier: "Noel Gravenfors", place: 5 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "DM", skier: "Linus Johansson", place: 6 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "DM", skier: "Karl Wärme", place: 8 },
  { competition: "Jyväskylä (FIN)", date: "7 feb 2025", discipline: "DM", skier: "Morgan Sönner", place: 13 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Jakob Hansson M", place: 1 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Karl Wärme", place: 2 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Gordon Berg", place: 3 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Elis Moberg", place: 5 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Linus Johansson", place: 12 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Noel Gravenfors", place: 13 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "MO", skier: "Vincent Adriansson", place: 15 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "DM", skier: "Gordon Berg", place: 1 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "DM", skier: "Karl Wärme", place: 4 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "DM", skier: "Noel Gravenfors", place: 5 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "DM", skier: "Jakob Hansson M", place: 8 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "DM", skier: "Elis Moberg", place: 9 },
  { competition: "Montafon (AUT)", date: "22 feb 2025", discipline: "DM", skier: "Linus Johansson", place: 16 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "MO", skier: "Karl Wärme", place: 1 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "MO", skier: "Gordon Berg", place: 2 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "MO", skier: "Jakob Hansson M", place: 3 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "MO", skier: "Noel Gravenfors", place: 4 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "MO", skier: "Elis Moberg", place: 9 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "MO", skier: "Vilgot Lundholm", place: 13 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "DM", skier: "Gordon Berg", place: 1 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "DM", skier: "Jakob Hansson M", place: 3 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "DM", skier: "Karl Wärme", place: 7 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "DM", skier: "Noel Gravenfors", place: 7 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "DM", skier: "Elis Moberg", place: 13 },
  { competition: "Bila (CZE)", date: "6 mar 2025", discipline: "DM", skier: "Vincent Adriansson", place: 15 },
];

export function FreestyleSpiritPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-accent rounded-full mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Freestyle Spirit
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Hall of Fame - Våra stoltheter genom åren
            </p>
            <div className="mt-8 max-w-3xl mx-auto">
              <img
                src="/images/hall-of-fame.jpg" 
                alt="Hall of Fame - OS-medalj" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Årets Framgångar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Årets Framgångar</h2>
              <Badge variant="default" className="ml-auto">2024/2025</Badge>
            </div>
            
            <div className="space-y-4">
              {/* WorldCup */}
              <Collapsible open={openSection === "worldcup"} onOpenChange={() => toggleSection("worldcup")}>
                <CollapsibleTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="w-fit mb-2">WorldCup</Badge>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            Världscup-resultat 2024/25
                          </CardTitle>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "worldcup" ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 border-l-4 border-l-primary">
                    <CardContent className="pt-4">
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
                            {worldCupResults.map((result, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{result.competition}</TableCell>
                                <TableCell>{result.date}</TableCell>
                                <TableCell>
                                  <Badge variant={result.discipline === "MO" ? "default" : "secondary"} className="text-xs">
                                    {result.discipline}
                                  </Badge>
                                </TableCell>
                                <TableCell>{result.skier}</TableCell>
                                <TableCell className="text-right">
                                  <span className={`font-bold ${
                                    result.place <= 3 ? "text-yellow-500" : 
                                    result.place <= 10 ? "text-blue-500" : 
                                    "text-foreground"
                                  }`}>
                                    {result.place}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* EuropaCup */}
              <Collapsible open={openSection === "europacup"} onOpenChange={() => toggleSection("europacup")}>
                <CollapsibleTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-accent cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="w-fit mb-2">EuropaCup</Badge>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            EuropaCup-resultat
                          </CardTitle>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "europacup" ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 border-l-4 border-l-accent">
                    <CardContent className="pt-4">
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
                            {europaCupResults.map((result, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{result.competition}</TableCell>
                                <TableCell>{result.date}</TableCell>
                                <TableCell>
                                  <Badge variant={result.discipline === "MO" ? "default" : "secondary"} className="text-xs">
                                    {result.discipline}
                                  </Badge>
                                </TableCell>
                                <TableCell>{result.skier}</TableCell>
                                <TableCell className="text-right">
                                  <span className={`font-bold ${
                                    result.place <= 3 ? "text-yellow-500" : 
                                    result.place <= 10 ? "text-blue-500" : 
                                    "text-foreground"
                                  }`}>
                                    {result.place}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Svenska Cupen */}
              <Collapsible open={openSection === "svenskacupen"} onOpenChange={() => toggleSection("svenskacupen")}>
                <CollapsibleTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="w-fit mb-2">Svenska Cupen</Badge>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            Svenska Cupen
                          </CardTitle>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "svenskacupen" ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">Resultat kommer snart...</p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* YMG */}
              <Collapsible open={openSection === "ymg"} onOpenChange={() => toggleSection("ymg")}>
                <CollapsibleTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="w-fit mb-2">YMG</Badge>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            Youth Mogul Games
                          </CardTitle>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "ymg" ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">Resultat kommer snart...</p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
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

      {/* Hall of Fame */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Hall of Fame</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vi hedrar våra mest framstående åkare genom åren som satt svensk puckelåkning på kartan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">OS-medaljer</h3>
                  <p className="text-3xl font-bold text-primary mb-2">3</p>
                  <p className="text-sm text-muted-foreground">
                    Totalt antal OS-medaljer genom historien
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">VM-medaljer</h3>
                  <p className="text-3xl font-bold text-primary mb-2">12</p>
                  <p className="text-sm text-muted-foreground">
                    Starka prestationer i världsmästerskap
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-accent to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Världscup-segrar</h3>
                  <p className="text-3xl font-bold text-primary mb-2">45+</p>
                  <p className="text-sm text-muted-foreground">
                    Segrar i världscupen genom åren
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-12 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">Legendariska Åkare</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary">2000-talet</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• OS-medaljer och världscupsegrar</li>
                      <li>• Dominans i både singel och dubbel</li>
                      <li>• Etablering som puckelnation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary">2020-talet</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Ny generation talanger</li>
                      <li>• Framgångar i parra-grenar</li>
                      <li>• Continued excellence på världsscenen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

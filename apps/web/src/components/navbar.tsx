"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Menu } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

const sections = [
  { id: "kom-igang", label: "Kom igång" },
  { id: "framgangar", label: "Framgångar" },
  { id: "nyheter", label: "Nyheter" },
  { id: "sponsorer", label: "Sponsorer" },
  { id: "shop", label: "Shop" },
  { id: "kontakt", label: "Kontakt" },
]

const SKIDFORBUND_URL = "https://www.skidor.com/idrotter/puckel"

export default function Navbar() {
  const [active, setActive] = useState<string>("hero")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const ids = ["hero", ...sections.map((s) => s.id)]
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a
          href="#hero"
          className="bg-linear-to-r from-primary to-accent bg-clip-text text-2xl font-bold tracking-tight text-transparent"
        >
          PUCKEL
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {s.label}
            </a>
          ))}
          <span className="mx-2 h-5 w-px bg-border" />
          <a
            href={SKIDFORBUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Skidförbundet
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-80 flex-col gap-0 p-0"
          >
            <SheetHeader className="border-b px-6 pt-6 pb-4">
              <SheetTitle className="text-left">
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
                  PUCKEL
                </span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              {sections.map((s) => (
                <SheetClose asChild key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      active === s.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {s.label}
                  </a>
                </SheetClose>
              ))}
              <div className="my-3 h-px bg-border" />
              <SheetClose asChild>
                <a
                  href={SKIDFORBUND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  Skidförbundet
                  <ExternalLink className="h-4 w-4" />
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

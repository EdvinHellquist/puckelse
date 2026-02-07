"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ExternalLink } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const navLinks = [
  { href: "/", label: "Hem" },
  { href: "/kom-igang", label: "Kom igång" },
  { href: "/sponsorer", label: "Sponsorer" },
  { href: "/freestyle-spirit", label: "Freestyle Spirit" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              PUCKEL
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://www.skidor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Svenska Skidförbundet
              <ExternalLink className="w-3 h-3" />
            </a>

            <Button variant="action" size="sm" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Webshop
              </a>
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://www.skidor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Svenska Skidförbundet
            </a>

            <Button variant="action" size="sm" className="w-full" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Webshop
              </a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
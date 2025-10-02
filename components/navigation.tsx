"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientAuthModal } from "@/components/client/client-auth-modal"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  // { name: "Employee Portal", href: "/employee" },
  // { name: "Staff Admin", href: "/staff" },
  // { name: "Setup Data", href: "/setup" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled ? "glass-effect shadow-lg backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
              <Image src="/images/hexcode-logo.png" alt="HexCode" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
              HexCode
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-emerald-500 transition-all duration-300 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Button 
              className="animate-pulse-glow hover-lift bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="hover-lift">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden glass-effect rounded-lg mt-2 p-4 animate-fade-in-up">
            <div className="flex flex-col space-y-4">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-emerald-500 transition-colors duration-200 font-medium hover-lift"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              <Button 
                className="w-full hover-lift bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Client Auth Modal */}
      <ClientAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </nav>
  )
}

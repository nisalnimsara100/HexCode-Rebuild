"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { DebugAuth } from "@/components/debug-auth"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const searchParams = useSearchParams();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeUsername, setWelcomeUsername] = useState('');

  useEffect(() => {
    // Check for logout success message
    if (searchParams.get('logout') === 'success') {
      // Get the last logged in user name from localStorage
      const lastClientProfile = localStorage.getItem('lastClientProfile');
      if (lastClientProfile) {
        try {
          const profile = JSON.parse(lastClientProfile);
          setWelcomeUsername(profile.name || profile.email);
          setShowWelcomeMessage(true);
          
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setShowWelcomeMessage(false);
          }, 5000);
        } catch (error) {
          console.error('Error parsing last client profile:', error);
        }
      }
      
      // Clear the URL parameter
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Welcome Back Message */}
      {showWelcomeMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 text-emerald-300 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-medium">
              Welcome back, {welcomeUsername}! 👋 Thanks for visiting HexCode.
            </span>
            <button 
              onClick={() => setShowWelcomeMessage(false)}
              className="ml-2 text-emerald-300 hover:text-emerald-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <HeroSection />

      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <ServicesSection />
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <StatsSection />
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <TestimonialsSection />
      </ScrollReveal>

      <ScrollReveal delay={500}>
        <CTASection />
      </ScrollReveal>

      <Footer />
      
      {/* Debug component */}
      <DebugAuth />
    </div>
  )
}

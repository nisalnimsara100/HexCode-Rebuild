import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
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
    </div>
  )
}

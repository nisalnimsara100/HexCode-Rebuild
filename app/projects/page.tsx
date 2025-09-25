import { Navigation } from "@/components/navigation"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="border-primary text-primary mb-6">
            Our Work
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">Projects That Make a Difference</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Explore our portfolio of successful software projects. From startups to enterprise solutions, we've helped
            businesses transform their digital presence.
          </p>
        </div>
      </section>

      <ProjectsShowcase />
      <CTASection />
      <Footer />
    </div>
  )
}

import { Navigation } from "@/components/navigation"
import { ServicesSection } from "@/components/services-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export default function ServicesPage() {
  const packages = [
    {
      name: "Starter",
      price: "$5,000",
      description: "Perfect for small businesses and startups",
      features: [
        "Responsive Web Application",
        "Basic SEO Optimization",
        "Contact Form Integration",
        "3 Months Support",
        "Mobile Responsive Design",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$15,000",
      description: "Ideal for growing businesses",
      features: [
        "Custom Web Application",
        "Advanced SEO & Analytics",
        "Payment Integration",
        "User Authentication",
        "6 Months Support",
        "Performance Optimization",
        "Third-party Integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale applications",
      features: [
        "Full-scale Application",
        "Custom Architecture",
        "Advanced Security",
        "Scalable Infrastructure",
        "12 Months Support",
        "DevOps & CI/CD",
        "Team Training",
        "24/7 Monitoring",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-6">
            Our Services
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">Comprehensive Software Solutions</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            From web applications to mobile apps, we provide end-to-end software development services tailored to your
            business needs.
          </p>
        </div>
      </section>

      <ServicesSection />

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Choose the package that best fits your project requirements and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`p-8 glass-effect hover:shadow-xl transition-all duration-300 relative ${
                  pkg.popular ? "border-emerald-500 shadow-emerald-500/20" : ""
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white">
                    Most Popular
                  </Badge>
                )}

                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-emerald-500">{pkg.price}</div>
                    <p className="text-muted-foreground text-sm">{pkg.description}</p>
                  </div>

                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      pkg.popular
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "variant-outline border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  )
}

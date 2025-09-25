import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Smartphone, Cloud, Database, Shield, Zap, ArrowRight } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Development",
      description: "Modern, responsive web applications built with the latest technologies and best practices.",
      features: ["React & Next.js", "Progressive Web Apps", "E-commerce Solutions", "CMS Development"],
      color: "emerald",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: ["React Native", "iOS & Android", "App Store Optimization", "Mobile UI/UX"],
      color: "blue",
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment solutions for modern applications.",
      features: ["AWS & Azure", "DevOps & CI/CD", "Microservices", "Container Orchestration"],
      color: "purple",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Development",
      description: "Robust, secure, and scalable backend systems and APIs for your applications.",
      features: ["RESTful APIs", "GraphQL", "Database Design", "Real-time Systems"],
      color: "orange",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Testing",
      description: "Comprehensive security audits and automated testing to ensure your software is bulletproof.",
      features: ["Security Audits", "Automated Testing", "Performance Testing", "Code Reviews"],
      color: "red",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Consulting",
      description: "Strategic technology consulting to help you make informed decisions about your tech stack.",
      features: ["Architecture Review", "Technology Strategy", "Code Optimization", "Team Training"],
      color: "green",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500">
            Our Services
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-balance">Comprehensive Software Solutions</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            From concept to deployment, we provide end-to-end software development services that help businesses thrive
            in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 glass-effect hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-emerald-500/30"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-emerald-500">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-between group-hover:bg-emerald-500/10 group-hover:text-emerald-500"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

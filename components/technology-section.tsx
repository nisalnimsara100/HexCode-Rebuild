import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TechnologySection() {
  const technologies = [
    {
      title: "API Management",
      description:
        "GreenTech's API management provides full API lifecycle, market-leading full lifecycle platform for building, integrating, securing, and managing APIs and microservices across hybrid and multi-cloud environments.",
      features: ["API Manager", "API Gateway", "Store"],
      active: true,
    },
    {
      title: "Integration",
      description:
        "Enterprise-grade and cloud-native integration technology to connect applications, data, and services across on-premises, Microservices and business at every level, and build intelligent integrations and digital transformation.",
      features: ["Integrator", "Micro Integrator", "Streaming Integrator"],
      active: false,
    },
    {
      title: "Identity & Access Management",
      description:
        "Comprehensive digital experiences offering both cloud and consumer access management solutions for your enterprise. Protect customer and employee identities, secure access to applications and APIs, and enable seamless digital experiences.",
      features: ["Identity Server", "Asgardeo", "Private Cloud"],
      active: false,
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-balance mb-6">
            Foundational Technology for Your Digital Platform
          </h2>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {technologies.map((tech, index) => (
              <Button
                key={index}
                variant={tech.active ? "default" : "outline"}
                className={
                  tech.active
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-primary/10"
                }
              >
                {tech.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {technologies.map((tech, index) => (
            <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-primary">{tech.title}</h3>
                <p className="text-lg text-muted-foreground text-pretty">{tech.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tech.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card className="bg-card/80 backdrop-blur border-border p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-40 h-40 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/40 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-2">{tech.title} Platform</h4>
                      <p className="text-muted-foreground text-sm">Enterprise-grade solutions</p>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-accent rounded opacity-60 animate-pulse"></div>
                  <div
                    className="absolute bottom-6 left-6 w-4 h-4 bg-primary rounded opacity-40 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-4 w-3 h-3 bg-chart-2 rounded opacity-50 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

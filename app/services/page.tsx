"use client"
import { Navigation } from "@/components/navigation"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Globe, Smartphone, Cloud, Database, Shield, Zap } from "lucide-react"

interface Service {
  icon: JSX.Element
  title: string
  description: string
  features: string[]
  color: string
}

interface Package {
  name: string
  price: string
  description: string
  features: string[]
  popular: boolean
}

function ServicesSection({ services, loading }: { services: Service[], loading: boolean }) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-8 glass-effect hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-emerald-500/30"
              >
                <div className="space-y-6">
                  <div
                    className={`w-16 h-16 bg-${service.color}-500/10 rounded-2xl flex items-center justify-center text-${service.color}-500 group-hover:bg-${service.color}-500 group-hover:text-white transition-all duration-300`}
                  >
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
        )}
      </div>
    </section>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [loadingServices, setLoadingServices] = useState<boolean>(true)
  const [loadingPackages, setLoadingPackages] = useState<boolean>(true)

  // Fetch services from the database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true)
        const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json")
        const data = await response.json()

        let servicesData: any[] = []

        if (data) {
          if (Array.isArray(data)) {
            servicesData = data.filter(service => service !== null)
          } else if (typeof data === 'object' && data !== null) {
            servicesData = Object.values(data).filter(service => service !== null)
          } else {
            console.error("Invalid services data format from Firebase. Expected array or object, got:", typeof data)
            servicesData = []
          }
        }

        // If no valid data found, use fallback services
        if (servicesData.length === 0) {
          servicesData = [
            {
              title: "Web Development",
              description: "Custom web applications built with modern technologies for optimal performance and user experience.",
              features: [
                "Responsive Design",
                "Modern Frameworks",
                "SEO Optimization",
                "Performance Tuning"
              ]
            },
            {
              title: "Mobile Development",
              description: "Native and cross-platform mobile applications for iOS and Android devices.",
              features: [
                "iOS & Android Apps",
                "Cross-platform Solutions",
                "App Store Deployment",
                "Push Notifications"
              ]
            },
            {
              title: "Cloud Solutions",
              description: "Scalable cloud infrastructure and services to power your applications reliably.",
              features: [
                "AWS/Azure/GCP",
                "Serverless Architecture",
                "Auto Scaling",
                "Monitoring & Analytics"
              ]
            },
            {
              title: "Database Design",
              description: "Robust database solutions optimized for your specific business requirements.",
              features: [
                "SQL & NoSQL Databases",
                "Data Modeling",
                "Performance Optimization",
                "Backup & Recovery"
              ]
            },
            {
              title: "Security Services",
              description: "Comprehensive security measures to protect your applications and data.",
              features: [
                "Authentication Systems",
                "Data Encryption",
                "Security Audits",
                "Compliance Standards"
              ]
            },
            {
              title: "API Development",
              description: "RESTful and GraphQL APIs designed for seamless integration and scalability.",
              features: [
                "RESTful APIs",
                "GraphQL Services",
                "API Documentation",
                "Rate Limiting"
              ]
            }
          ]
        }

        // Map the fetched data to include icons and colors
        const servicesWithIcons = servicesData.map((service: any, index: number) => {
          const icons = [
            <Globe className="w-8 h-8" />,
            <Smartphone className="w-8 h-8" />,
            <Cloud className="w-8 h-8" />,
            <Database className="w-8 h-8" />,
            <Shield className="w-8 h-8" />,
            <Zap className="w-8 h-8" />,
          ]

          const colors = ["emerald", "blue", "purple", "orange", "red", "green"]

          return {
            ...service,
            icon: icons[index] || <Globe className="w-8 h-8" />,
            color: colors[index] || "emerald",
          }
        })

        setServices(servicesWithIcons)
      } catch (error) {
        console.error("Error fetching services:", error)
        setServices([]) // Set empty array as fallback
      } finally {
        setLoadingServices(false)
      }
    }

    fetchServices()
  }, [])

  // Fetch packages from Firebase
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true)
        const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json")
        const data = await response.json()

        if (data) {
          // Handle different data formats from Firebase
          if (Array.isArray(data)) {
            // Data is already an array
            setPackages(data.filter(pkg => pkg !== null))
          } else if (typeof data === 'object' && data !== null) {
            // Data is an object - convert to array
            const packagesArray = Object.values(data).filter(pkg => pkg !== null)
            setPackages(packagesArray as Package[])
          } else {
            // Data is neither array nor object
            console.error("Invalid data format from Firebase. Expected array or object, got:", typeof data)
            setPackages([]) // Set empty array as fallback
          }
        } else {
          // Use fallback packages data
          const fallbackPackages: Package[] = [
            {
              name: "Starter",
              price: "$2,500",
              description: "Perfect for small businesses and startups",
              features: [
                "Responsive Web Design",
                "Up to 5 Pages",
                "Contact Form",
                "Basic SEO Optimization",
                "Mobile Friendly",
                "1 Month Support"
              ],
              popular: false
            },
            {
              name: "Professional",
              price: "$5,000",
              description: "Ideal for growing businesses",
              features: [
                "Everything in Starter",
                "Up to 15 Pages",
                "CMS Integration",
                "Advanced SEO",
                "Analytics Setup",
                "Social Media Integration",
                "3 Months Support"
              ],
              popular: true
            },
            {
              name: "Enterprise",
              price: "$10,000+",
              description: "For large-scale applications",
              features: [
                "Everything in Professional",
                "Unlimited Pages",
                "Custom Functionality",
                "Database Integration",
                "User Authentication",
                "Third-party APIs",
                "6 Months Support",
                "Performance Optimization"
              ],
              popular: false
            }
          ]
          setPackages(fallbackPackages)
        }
      } catch (error) {
        console.error("Error fetching packages from Firebase:", error)
        setPackages([]) // Set empty array as fallback
      } finally {
        setLoadingPackages(false)
      }
    }

    fetchPackages()
  }, [])

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

      {/* Services Section */}
      <ServicesSection services={services} loading={loadingServices} />

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Choose the package that best fits your project requirements and budget.
            </p>
          </div>

          {loadingPackages ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
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

                  <div className="space-y-6 flex flex-col justify-between h-full">
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
                          : "border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  )
}
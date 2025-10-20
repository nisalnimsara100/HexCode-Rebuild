"use client"

import { useState, useEffect, use } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Smartphone, Cloud, Database, Shield, Zap, ArrowRight } from "lucide-react"

interface Service {
  icon: JSX.Element
  title: string
  description: string
  features: string[]
  color: string
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch services from the database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json")
        const data = await response.json()

        // Check if data exists and is an array
        if (!data || !Array.isArray(data)) {
          console.warn('No services data found or data is not an array:', data);
          setServices([]);
          return;
        }

        // Map the fetched data to include icons and colors
        const servicesWithIcons = data.map((service: any, index: number) => {
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
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

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

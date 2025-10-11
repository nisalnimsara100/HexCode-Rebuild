"use client"

import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Lead Developer",
      bio: "Full-stack developer with 8+ years experience in modern web technologies.",
      avatar: "/team-alex.jpg",
    },
    {
      name: "Sarah Chen",
      role: "CTO & System Architect",
      bio: "Expert in cloud architecture and scalable system design.",
      avatar: "/team-sarah.jpg",
    },
    {
      name: "Mike Rodriguez",
      role: "Senior Frontend Developer",
      bio: "Specialist in React, Next.js, and modern frontend frameworks.",
      avatar: "/team-mike.jpg",
    },
    {
      name: "Emily Davis",
      role: "UI/UX Designer",
      bio: "Creative designer focused on user-centered design and modern interfaces.",
      avatar: "/team-emily.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-6">
            About HexCode
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">We're Building the Future of Software</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Founded in 2019, HexCode has been at the forefront of software innovation, helping businesses transform
            their digital presence with cutting-edge solutions.
          </p>
        </div>
      </section>

      <AboutSection />

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Our diverse team of experts brings together years of experience in software development, design, and
              technology consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center glass-effect hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-emerald-500 text-sm font-medium">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <Footer />
    </div>
  )
}

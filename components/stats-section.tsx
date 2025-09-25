import { Card } from "@/components/ui/card"
import { Code, Users, Award, Zap, Globe, Shield } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      number: "50+",
      label: "Projects Completed",
      icon: <Code className="w-6 h-6" />,
      description: "Successful software projects delivered",
    },
    {
      number: "25+",
      label: "Happy Clients",
      icon: <Users className="w-6 h-6" />,
      description: "Businesses we've helped grow",
    },
    {
      number: "5+",
      label: "Years Experience",
      icon: <Award className="w-6 h-6" />,
      description: "Years of software development expertise",
    },
    {
      number: "99%",
      label: "Uptime",
      icon: <Zap className="w-6 h-6" />,
      description: "Average application uptime",
    },
    {
      number: "15+",
      label: "Technologies",
      icon: <Globe className="w-6 h-6" />,
      description: "Modern tech stack mastery",
    },
    {
      number: "100%",
      label: "Secure",
      icon: <Shield className="w-6 h-6" />,
      description: "Security-first development approach",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-balance">Proven Track Record</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Numbers that speak to our commitment to excellence and client success.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center glass-effect hover:shadow-lg transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mx-auto group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-emerald-500">{stat.number}</div>
                  <div className="text-sm font-semibold">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

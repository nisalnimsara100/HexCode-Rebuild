import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Lightbulb } from "lucide-react"

export function AboutSection() {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Mission-Driven",
      description: "We're committed to delivering software solutions that make a real impact on your business.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Client-Focused",
      description: "Your success is our success. We work closely with you throughout every project.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality First",
      description: "We maintain the highest standards in code quality, security, and performance.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "We stay ahead of technology trends to bring you cutting-edge solutions.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                About HexCode
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-balance">Crafting Digital Excellence Since 2019</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                HexCode is a forward-thinking software development company specializing in creating innovative digital
                solutions. We combine technical expertise with creative vision to build applications that drive business
                growth and user engagement.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Our Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Node.js", "Python", "TypeScript", "AWS", "Docker", "PostgreSQL"].map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 glass-effect hover:shadow-lg transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

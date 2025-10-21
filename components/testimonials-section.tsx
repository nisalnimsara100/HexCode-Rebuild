import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechStart Inc.",
      content:
        "HexCode transformed our vision into a scalable web application that exceeded our expectations. Their attention to detail and technical expertise is unmatched.",
      rating: 5,
      avatar: "/professional-woman-diverse.png",
    },
    {
      name: "Michael Chen",
      role: "Founder",
      company: "Digital Solutions Co.",
      content:
        "Working with HexCode was a game-changer for our business. They delivered a robust e-commerce platform that increased our sales by 300%.",
      rating: 5,
      avatar: "/professional-man.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "InnovateLab",
      content:
        "The team at HexCode is incredibly professional and skilled. They built our mobile app from scratch and it's been performing flawlessly for over a year.",
      rating: 5,
      avatar: "/professional-woman-smiling.png",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500">
            Client Testimonials
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-balance">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with HexCode.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 glass-effect hover:shadow-xl transition-all duration-300 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-500/20" />

              <div className="space-y-6">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>

                <p className="text-muted-foreground italic">"{testimonial.content}"</p>

                <div className="flex items-center space-x-4">
                  {/* <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
                  </div> */}
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

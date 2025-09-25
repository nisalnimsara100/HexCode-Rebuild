import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "hello@hexcode.dev",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "San Francisco, CA",
      description: "Come say hello at our office",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      details: "Within 24 hours",
      description: "We'll get back to you quickly",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-6">
            Contact Us
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">Let's Build Something Amazing Together</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Ready to start your project? Get in touch with our team for a free consultation and let's discuss how we can
            help bring your ideas to life.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center glass-effect hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mx-auto">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-emerald-500 font-medium">{info.details}</p>
                    <p className="text-muted-foreground text-sm">{info.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Send us a message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours. We're excited to learn about your
                  project!
                </p>
              </div>

              <Card className="p-8 glass-effect">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Your Company" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project">Project Type</Label>
                    <select className="w-full p-3 border border-border rounded-lg bg-background">
                      <option>Web Application</option>
                      <option>Mobile App</option>
                      <option>E-commerce</option>
                      <option>Custom Software</option>
                      <option>Consulting</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <select className="w-full p-3 border border-border rounded-lg bg-background">
                      <option>$5,000 - $15,000</option>
                      <option>$15,000 - $50,000</option>
                      <option>$50,000 - $100,000</option>
                      <option>$100,000+</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us about your project..." rows={5} />
                  </div>

                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Why choose HexCode?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Expert Team</h4>
                      <p className="text-muted-foreground text-sm">
                        Our developers have years of experience with modern technologies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Agile Process</h4>
                      <p className="text-muted-foreground text-sm">
                        We use agile methodologies to deliver projects on time and within budget.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Ongoing Support</h4>
                      <p className="text-muted-foreground text-sm">
                        We provide comprehensive support and maintenance after launch.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Transparent Communication</h4>
                      <p className="text-muted-foreground text-sm">
                        Regular updates and clear communication throughout the project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6 glass-effect bg-emerald-500/5 border-emerald-500/20">
                <h4 className="font-semibold mb-2">Free Consultation</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Not sure where to start? Book a free 30-minute consultation call with our team.
                </p>
                <Button
                  variant="outline"
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 bg-transparent"
                >
                  Schedule Call
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Mail, Phone } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="p-12 glass-effect text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 border border-emerald-500 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border border-emerald-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-emerald-600 rounded-full"></div>
          </div>

          <div className="relative space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Ready to Build Something Amazing?</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Let's discuss your project and turn your ideas into reality. Get in touch with our team for a free
              consultation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600 px-8 group">
                <Mail className="w-5 h-5 mr-2" />
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 px-8 bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Free consultation
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                No commitment required
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Quick response time
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

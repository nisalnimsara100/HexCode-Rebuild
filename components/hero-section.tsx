import { Button } from "@/components/ui/button"
import { ArrowRight, Infinity, Code, Zap, Database } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-background flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-emerald-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-emerald-400/30 rounded-full animate-bounce-subtle"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-emerald-600/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-emerald-500/20 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover-glow">
            <Zap className="w-4 h-4 text-emerald-500 mr-2 animate-pulse" />
            <span className="text-emerald-500 text-sm font-medium">Modern Software Solutions</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-balance leading-tight">
            Building the{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent animate-gradient">
              Future
            </span>{" "}
            of Software
          </h1>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
            We create innovative, scalable, and secure software solutions that transform businesses and drive digital
            innovation. From web applications to enterprise systems, we deliver excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600 px-8 group hover-lift">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 px-8 bg-transparent hover-glow"
            >
              <Code className="w-5 h-5 mr-2" />
              View Our Work
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="text-center hover-lift">
              <div className="text-2xl font-bold text-emerald-500">50+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-2xl font-bold text-emerald-500">5+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-2xl font-bold text-emerald-500">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="relative animate-slide-in-right">
          <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-3xl rotate-12 animate-pulse-glow"></div>
              <div className="relative w-60 h-60 bg-card border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm hover-lift">
                <div className="w-32 h-32 relative animate-bounce-subtle">
                  <Image src="/images/hexcode-logo.png" alt="HexCode" fill className="object-contain opacity-80" />
                </div>
              </div>

              <div className="absolute -top-8 -left-8 w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-float hover-lift">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div
                className="absolute -top-4 -right-12 w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg animate-float hover-lift"
                style={{ animationDelay: "0.5s" }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div
                className="absolute -bottom-6 -left-12 w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg animate-float hover-lift"
                style={{ animationDelay: "1s" }}
              >
                <Database className="w-7 h-7 text-white" />
              </div>
              <div
                className="absolute -bottom-8 -right-8 w-16 h-16 bg-emerald-300 rounded-xl flex items-center justify-center shadow-lg animate-float hover-lift"
                style={{ animationDelay: "1.5s" }}
              >
                <Infinity className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

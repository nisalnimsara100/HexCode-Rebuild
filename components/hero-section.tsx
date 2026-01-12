"use client";

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Code2, Rocket, Brain, Layers, Shield, Zap } from "lucide-react"
import Image from "next/image"
import { ClientAuthModal } from "@/components/client/client-auth-modal"
import { useState, useEffect, useRef, useMemo } from "react"

export function HeroSection() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Generate stable particle data using useMemo with a fixed seed
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: (i * 5.26315) % 100, // Deterministic positioning
      top: (i * 7.89473) % 100,
      delay: (i * 0.25) % 5,
      duration: 15 + (i % 15),
    }))
  }, [])

  useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
      return () => section.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const techStack = [
    { icon: Code2, label: "Full Stack", color: "from-cyan-400 to-blue-500" },
    { icon: Brain, label: "AI/ML", color: "from-purple-400 to-pink-500" },
    { icon: Layers, label: "Cloud Native", color: "from-[#68e033] to-[#5bc929]" },
    { icon: Shield, label: "Secure", color: "from-orange-400 to-red-500" },
  ]

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-background flex items-center overflow-hidden pt-16">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#68e033]/30 via-[#68e033]/20 to-transparent rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/20 via-pink-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/20 via-[#68e033]/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isMounted && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full animate-float-particle"
            style={{
              backgroundColor: '#68e033',
              opacity: 0.4,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Spotlight Effect */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          backgroundColor: 'rgba(104, 224, 51, 0.1)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm group transition-all duration-300 animate-fade-in-up"
            style={{
              background: 'linear-gradient(to right, rgba(104, 224, 51, 0.1), rgba(104, 224, 51, 0.05), rgba(104, 224, 51, 0.1))',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(104, 224, 51, 0.3)'
            }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: '#68e033' }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#68e033' }}>Next-Gen Software Solutions</span>
            <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#68e033' }}></div>
          </div> */}

          {/* Main Heading with Staggered Animation */}
          <div className="space-y-4 animate-fade-in-up animation-delay-200">
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight">
              <span className="block text-foreground">Crafting</span>
              <span className="block bg-clip-text text-transparent animate-gradient-x"
                style={{
                  backgroundImage: 'linear-gradient(to right, #68e033, #7ef03d, #68e033)',
                  backgroundSize: '200% 200%'
                }}
              >
                Digital
              </span>
              <span className="block text-foreground">Excellence</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-in-up animation-delay-400">
            We transform visionary ideas into powerful digital experiences. From cutting-edge web apps to enterprise solutions, we build software that scales with your ambition.
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-3 animate-fade-in-up animation-delay-600">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative px-4 py-2.5 bg-card/50 backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 bg-gradient-to-br ${tech.color} rounded-lg shadow-sm`}>
                    <tech.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{tech.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-800">
            <Button 
              size="lg" 
              className="relative text-white px-8 h-14 text-base font-semibold group overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{
                background: 'linear-gradient(to right, #68e033, #7ef03d)',
                boxShadow: '0 10px 15px -3px rgba(104, 224, 51, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(104, 224, 51, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(104, 224, 51, 0.25)';
              }}
              onClick={() => setShowAuthModal(true)}
            >
              <span className="relative z-10 flex items-center">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to right, #7ef03d, #68e033)'
                }}
              ></div>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 px-8 h-14 text-base font-semibold bg-transparent backdrop-blur-sm group transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: 'rgba(104, 224, 51, 0.5)',
                color: '#68e033'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(104, 224, 51, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(104, 224, 51, 0.8)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(104, 224, 51, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(104, 224, 51, 0.5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Explore Portfolio
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up animation-delay-1000">
            {[
              { value: "10+", label: "Projects Delivered" },
              { value: "2+", label: "Years Experience" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="group text-center space-y-1 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl lg:text-4xl font-black bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to bottom right, #68e033, #7ef03d)'
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground font-medium">{stat.label}</div>
                <div className="h-1 w-0 group-hover:w-full mx-auto transition-all duration-500 rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #68e033, #7ef03d)'
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative animate-fade-in-up animation-delay-400">
          <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center px-12 py-12">
            {/* 3D Glassmorphic Card */}
            <div className="relative w-full max-w-md aspect-square group perspective-1000">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 animate-pulse-glow"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(104, 224, 51, 0.3), rgba(104, 224, 51, 0.2), rgba(147, 51, 234, 0.3))'
                }}
              ></div>
              
              {/* Main Card */}
              <div className="relative w-full h-full bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform-gpu group-hover:scale-[1.02]"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(104, 224, 51, 0.2)'
                }}
              >
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(104, 224, 51, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(104, 224, 51, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>

                {/* Logo Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 lg:w-64 lg:h-64 group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                      style={{
                        background: 'linear-gradient(to bottom right, rgba(104, 224, 51, 0.2), rgba(104, 224, 51, 0.1))'
                      }}
                    ></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image 
                        src="/images/hexcode-logo.png" 
                        alt="HexCode" 
                        fill 
                        className="object-contain drop-shadow-2xl" 
                      />
                    </div>
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </div>

              {/* Floating Icons - Moved outside main card */}
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl animate-float group-hover:rotate-12 transition-transform duration-500"
                style={{
                  background: 'linear-gradient(to bottom right, #68e033, #7ef03d)',
                  boxShadow: '0 20px 25px -5px rgba(104, 224, 51, 0.5)'
                }}
              >
                <Code2 className="w-10 h-10 text-white" />
              </div>
              <div
                className="absolute -top-4 -right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50 animate-float group-hover:-rotate-12 transition-transform duration-500"
                style={{ animationDelay: "0.5s" }}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div
                className="absolute -bottom-6 -left-8 w-18 h-18 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/50 animate-float group-hover:rotate-12 transition-transform duration-500"
                style={{ animationDelay: "1s" }}
              >
                <Brain className="w-9 h-9 text-white" />
              </div>
              <div
                className="absolute -bottom-8 -right-6 w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/50 animate-float group-hover:-rotate-12 transition-transform duration-500"
                style={{ animationDelay: "1.5s" }}
              >
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Auth Modal */}
      <ClientAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite; 
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </section>
  )
}
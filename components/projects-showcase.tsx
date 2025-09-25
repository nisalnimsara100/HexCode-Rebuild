"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  ArrowRight,
  Zap,
  Star,
  Eye,
  Layers3,
  Heart,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Target,
  Rocket,
  X,
  Mail,
  Phone,
  MessageSquare,
  Award,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"

export function ProjectsShowcase() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [visibleProjects, setVisibleProjects] = useState(6)
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set())
  const [showStartProjectModal, setShowStartProjectModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const projects = [
    {
      id: 1,
      title: "EcoCommerce Platform",
      description:
        "A sustainable e-commerce platform built with Next.js and Stripe integration. Features include inventory management, order tracking, and eco-friendly shipping options.",
      images: [
        "/projects/ecommerce-platform.jpg",
        "/projects/ecommerce-platform.jpg",
        "/projects/ecommerce-platform.jpg",
      ],
      category: "E-commerce",
      technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
      features: ["Payment Processing", "Inventory Management", "Admin Dashboard", "Mobile Responsive"],
      liveUrl: "https://ecocommerce-demo.com",
      featured: true,
      stats: { views: "12.5K", stars: 89, forks: 23 },
      complexity: "Business Solution",
      duration: "3 months",
      likes: 234,
      trending: true,
      mostLiked: false,
    },
    {
      id: 2,
      title: "HealthTech Dashboard",
      description:
        "A comprehensive healthcare management system for clinics and hospitals. Includes patient records, appointment scheduling, and real-time analytics.",
      images: [
        "/projects/healthtech-dashboard.jpg",
        "/projects/healthtech-dashboard.jpg",
        "/projects/healthtech-dashboard.jpg",
      ],
      category: "Healthcare",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Chart.js"],
      features: ["Patient Management", "Real-time Updates", "Analytics", "HIPAA Compliant"],
      liveUrl: "https://healthtech-demo.com",
      featured: true,
      stats: { views: "8.7K", stars: 156, forks: 34 },
      complexity: "Enterprise Solution",
      duration: "4 months",
      likes: 456,
      trending: false,
      mostLiked: true,
    },
    {
      id: 3,
      title: "FinTech Mobile App",
      description:
        "A secure mobile banking application with biometric authentication, transaction history, and budget tracking features.",
      images: ["/projects/fintech-mobile.jpg", "/projects/fintech-mobile.jpg", "/projects/fintech-mobile.jpg"],
      category: "FinTech",
      technologies: ["React Native", "Firebase", "Plaid API", "Redux", "TypeScript"],
      features: ["Biometric Auth", "Transaction Tracking", "Budget Planning", "Push Notifications"],
      liveUrl: "https://fintech-demo.com",
      featured: false,
      stats: { views: "15.2K", stars: 203, forks: 67 },
      complexity: "Premium Solution",
      duration: "5 months",
      likes: 189,
      trending: true,
      mostLiked: false,
    },
    {
      id: 4,
      title: "EdTech Learning Platform",
      description:
        "An interactive online learning platform with video streaming, progress tracking, and collaborative features for students and educators.",
      images: ["/projects/edtech-platform.jpg", "/projects/edtech-platform.jpg", "/projects/edtech-platform.jpg"],
      category: "Education",
      technologies: ["Vue.js", "Laravel", "MySQL", "WebRTC", "AWS S3"],
      features: ["Video Streaming", "Progress Tracking", "Interactive Quizzes", "Collaboration Tools"],
      liveUrl: "https://edtech-demo.com",
      featured: false,
      stats: { views: "9.3K", stars: 127, forks: 45 },
      complexity: "Custom Solution",
      duration: "3 months",
      likes: 167,
      trending: false,
      mostLiked: false,
    },
    {
      id: 5,
      title: "Smart IoT Dashboard",
      description:
        "A real-time IoT monitoring dashboard for smart buildings, featuring sensor data visualization and automated control systems.",
      images: ["/projects/iot-dashboard.jpg", "/projects/iot-dashboard.jpg", "/projects/iot-dashboard.jpg"],
      category: "IoT",
      technologies: ["Angular", "Python", "InfluxDB", "MQTT", "Docker"],
      features: ["Real-time Monitoring", "Data Visualization", "Automated Controls", "Alert System"],
      liveUrl: "https://iot-demo.com",
      featured: false,
      stats: { views: "6.8K", stars: 94, forks: 28 },
      complexity: "Business Solution",
      duration: "4 months",
      likes: 123,
      trending: false,
      mostLiked: false,
    },
    {
      id: 6,
      title: "Social Media Analytics",
      description:
        "A comprehensive social media analytics tool that tracks engagement, sentiment analysis, and provides actionable insights for brands.",
      images: ["/projects/social-analytics.jpg", "/projects/social-analytics.jpg", "/projects/social-analytics.jpg"],
      category: "Analytics",
      technologies: ["Python", "Django", "PostgreSQL", "Celery", "D3.js"],
      features: ["Sentiment Analysis", "Engagement Tracking", "Custom Reports", "API Integration"],
      liveUrl: "https://social-analytics-demo.com",
      featured: false,
      stats: { views: "11.1K", stars: 178, forks: 52 },
      complexity: "Enterprise Solution",
      duration: "6 months",
      likes: 298,
      trending: true,
      mostLiked: false,
    },
  ]

  const categories = ["All", "E-commerce", "Healthcare", "FinTech", "Education", "IoT", "Analytics"]

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter)
  const mostLikedProject = projects.reduce((prev, current) => (prev.likes > current.likes ? prev : current))
  const trendingProjects = projects.filter((p) => p.trending)

  const handleLike = (projectId: number) => {
    const newLikedProjects = new Set(likedProjects)
    if (newLikedProjects.has(projectId)) {
      newLikedProjects.delete(projectId)
    } else {
      newLikedProjects.add(projectId)
    }
    setLikedProjects(newLikedProjects)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Custom Solution":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20"
      case "Business Solution":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20"
      case "Premium Solution":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20"
      case "Enterprise Solution":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      default:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    }
  }

  const swipeImage = (projectId: number, direction: "left" | "right") => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    const currentIndex = currentImageIndex[projectId] || 0
    let newIndex

    if (direction === "left") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : project.images.length - 1
    } else {
      newIndex = currentIndex < project.images.length - 1 ? currentIndex + 1 : 0
    }

    setCurrentImageIndex((prev) => ({ ...prev, [projectId]: newIndex }))
  }

  const StartProjectModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 relative animate-fade-in-up border border-emerald-500/20">
        <Button
          onClick={() => setShowStartProjectModal(false)}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-500 mb-2">Start Your Project</h3>
          <p className="text-muted-foreground">Let's bring your vision to life with HexCode's expertise</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => window.open("mailto:contact@hexcode.com", "_blank")}
            className="w-full bg-emerald-500 text-white border-0 hover:bg-emerald-600"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Us
          </Button>
          <Button
            onClick={() => window.open("tel:+1234567890", "_blank")}
            className="w-full bg-emerald-500 text-white border-0 hover:bg-emerald-600"
          >
            <Phone className="w-4 h-4 mr-2" />
            Schedule Call
          </Button>
          <Button
            onClick={() => window.open("https://wa.me/1234567890", "_blank")}
            className="w-full bg-emerald-500 text-white border-0 hover:bg-emerald-600"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 premium-gradient-1 rounded-lg transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 premium-gradient-2 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 premium-gradient-3 rounded-lg transform -rotate-12"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 px-6 py-3 rounded-full mb-8">
            <Layers3 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">Project Portfolio</span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-6">
            Our Creative Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our innovative projects that push the boundaries of technology and design
          </p>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 px-4 py-2 rounded-full mb-4">
              <Trophy className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">Most Popular Project</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Client Favorite</h2>
          </div>

          <Card className="overflow-hidden bg-emerald-500/5 border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-96 lg:h-[600px]">
                <div className="absolute inset-0 premium-gradient-1 opacity-20 z-10 mix-blend-multiply"></div>
                <div className="absolute top-4 right-4 z-30 space-y-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-500">{mostLikedProject.likes} likes</span>
                  </div>
                </div>
                <Image
                  src={mostLikedProject.images?.[0] || "/placeholder.svg"}
                  alt={mostLikedProject.title}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/50 text-emerald-500">
                      {mostLikedProject.category}
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/50 text-emerald-500">
                      <Trophy className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                    {mostLikedProject.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{mostLikedProject.description}</p>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => window.open(mostLikedProject.liveUrl, "_blank")}
                      className="bg-emerald-500 text-white border-0 hover:bg-emerald-600 px-8 py-4 text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                    <Button
                      onClick={() => handleLike(mostLikedProject.id)}
                      variant="outline"
                      className={`bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20 ${
                        likedProjects.has(mostLikedProject.id) ? "text-red-400" : "text-emerald-500"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${likedProjects.has(mostLikedProject.id) ? "fill-current animate-heart-beat" : ""}`}
                      />
                      {likedProjects.has(mostLikedProject.id) ? "Liked" : "Like"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trending Projects Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 px-4 py-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500">Trending Now</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Popular Projects</h2>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={scrollLeft}
                variant="outline"
                size="sm"
                className="bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={scrollRight}
                variant="outline"
                size="sm"
                className="bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-600"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {trendingProjects.map((project) => (
              <Card
                key={project.id}
                className="flex-shrink-0 w-80 overflow-hidden bg-emerald-500/5 border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <div className="relative h-80">
                  <div className="absolute top-3 left-3 z-20 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="absolute top-3 right-3 z-20 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-emerald-500">{project.likes} likes</span>
                  </div>
                  <Image
                    src={project.images?.[0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/50 text-emerald-500">
                      {project.category}
                    </Badge>
                    <Button
                      onClick={() => handleLike(project.id)}
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${likedProjects.has(project.id) ? "text-red-400" : "text-muted-foreground"}`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedProjects.has(project.id) ? "fill-current animate-heart-beat" : ""}`}
                      />
                    </Button>
                  </div>

                  <h3 className="text-lg font-bold text-foreground line-clamp-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                      className="flex-1 bg-emerald-500 text-white border-0 hover:bg-emerald-600"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 px-4 py-2 rounded-full mb-8">
            <Filter className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">Filter Projects</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveFilter(category)}
                variant={category === activeFilter ? "default" : "outline"}
                className={
                  category === activeFilter
                    ? "bg-emerald-500 text-white border-0 hover:bg-emerald-600"
                    : "bg-emerald-500/10 border-emerald-500/30 text-muted-foreground hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/20"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-12 mb-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-4">
              All Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete portfolio of innovative solutions across different industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.slice(0, visibleProjects).map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden bg-emerald-500/5 border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 group"
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 premium-gradient-1 opacity-10 z-10 mix-blend-multiply"></div>
                  <div className="absolute top-3 right-3 z-20 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-emerald-500">{project.likes} likes</span>
                  </div>
                  {project.trending && (
                    <div className="absolute top-3 left-3 z-20 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                  )}

                  {project.images && project.images.length > 1 && (
                    <>
                      <Button
                        onClick={() => swipeImage(project.id, "left")}
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 text-white hover:bg-black/40"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => swipeImage(project.id, "right")}
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 text-white hover:bg-black/40"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  <Image
                    src={project.images?.[currentImageIndex[project.id] || 0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/50 text-emerald-500">
                        {project.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getComplexityColor(project.complexity)} border text-xs`}>
                          {project.complexity}
                        </Badge>
                        <Button
                          onClick={() => handleLike(project.id)}
                          variant="ghost"
                          size="sm"
                          className={`p-1 ${likedProjects.has(project.id) ? "text-red-400" : "text-muted-foreground"}`}
                        >
                          <Heart
                            className={`w-4 h-4 ${likedProjects.has(project.id) ? "fill-current animate-heart-beat" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-emerald-500 transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{project.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-500">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-emerald-500/10">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-emerald-500" />
                          {project.stats.stars}
                        </span>
                        <span>{project.duration}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-emerald-500" />
                        {project.stats.views}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(project.liveUrl, "_blank")}
                        className="flex-1 bg-emerald-500 text-white border-0 hover:bg-emerald-600"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredProjects.length > visibleProjects && (
              <div className="text-center pt-8">
                <Button
                  onClick={() => setVisibleProjects((prev) => prev + 3)}
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-600 px-8 py-3"
                >
                  Load More Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-32 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 px-4 py-2 rounded-full mb-8">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">Our Creative Process</span>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-12">
              From Concept to Creation
            </h2>

            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 premium-gradient-1 opacity-30"></div>

              {[
                {
                  step: "01",
                  title: "Discovery",
                  description: "Understanding your vision and requirements through detailed consultation",
                  icon: Target,
                },
                {
                  step: "02",
                  title: "Design",
                  description: "Creating stunning wireframes and prototypes with modern aesthetics",
                  icon: Layers3,
                },
                {
                  step: "03",
                  title: "Development",
                  description: "Building with cutting-edge technologies and best practices",
                  icon: Zap,
                },
                {
                  step: "04",
                  title: "Launch",
                  description: "Deploying and optimizing your solution for maximum performance",
                  icon: Rocket,
                },
              ].map((phase, index) => (
                <div key={index} className="relative group">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500/10 h-80 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <phase.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {phase.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-emerald-500 transition-colors">
                      {phase.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button
                onClick={() => setShowStartProjectModal(true)}
                className="bg-emerald-500 text-white border-0 hover:bg-emerald-600 px-8 py-4 text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showStartProjectModal && <StartProjectModal />}
    </section>
  )
}

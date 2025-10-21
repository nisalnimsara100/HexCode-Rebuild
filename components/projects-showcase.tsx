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
import { useState, useRef, useEffect } from "react"
import { PriorityQueue, createPriorityQueueFromArray } from "@/lib/priorityQueue"
import { database } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { LoadingSpinner } from "@/components/loading-spinner"; // Import the loading spinner component

// Define a TypeScript interface for project data
interface Project {
  id: number; 
  title: string;
  description: string;
  category: string;
  likes: number;
  images: string[];
  trending: boolean;
  technologies: string[];
  stats: {
    stars: number;
    views: number;
  };
  duration: string;
  complexity: string;
  liveUrl: string;
}

export function ProjectsShowcase() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [visibleProjects, setVisibleProjects] = useState(6)
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set())
  const [showStartProjectModal, setShowStartProjectModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortedProjects, setSortedProjects] = useState<Project[]>([]);
  const [popularProjects, setPopularProjects] = useState<Project[]>([]);
  const [mostLikedProject, setMostLikedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Ensure the categories array is defined
  const categories = ["All", "E-commerce", "Healthcare", "FinTech", "Education", "IoT", "Analytics"];

  // Initialize priority queues and sorted data
  useEffect(() => {
    // Create priority queue for all projects based on likes
    const projectQueue = createPriorityQueueFromArray(projects, 'likes')
    const sortedByLikes = projectQueue.toArray()
    setSortedProjects(sortedByLikes)
    
    // Get most liked project (highest priority)
    const topProject = projectQueue.peek()
    setMostLikedProject(topProject || null)
    
    // Get the 2nd, 3rd, and 4th most liked projects for the "Popular Projects" section
    const popularProjectsSubset = sortedByLikes.slice(1, 4); // Skip the first project (most liked)
    setPopularProjects(popularProjectsSubset);
  }, [projects])

  useEffect(() => {
    const projectsRef = ref(database, "allProjects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setProjects(projectsArray);
      }
      setLoading(false); // Set loading to false once data is fetched
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects =
    activeFilter === "All" ? sortedProjects : sortedProjects.filter((project) => project.category === activeFilter)

  const handleLike = (projectId: number) => {
    const newLikedProjects = new Set(likedProjects)
    let updatedProjects = [...projects]
    
    if (newLikedProjects.has(projectId)) {
      newLikedProjects.delete(projectId)
      // Update project likes count (decrement)
      const projectIndex = updatedProjects.findIndex(p => p.id === projectId)
      if (projectIndex !== -1) {
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          likes: Math.max(0, updatedProjects[projectIndex].likes - 1)
        }
      }
    } else {
      newLikedProjects.add(projectId)
      // Update project likes count (increment)
      const projectIndex = updatedProjects.findIndex(p => p.id === projectId)
      if (projectIndex !== -1) {
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          likes: updatedProjects[projectIndex].likes + 1
        }
      }
    }
    
    setLikedProjects(newLikedProjects)
    setProjects(updatedProjects)
    
    // Re-sort projects using priority queue
    const projectQueue = createPriorityQueueFromArray(updatedProjects, 'likes')
    const sortedByLikes = projectQueue.toArray()
    setSortedProjects(sortedByLikes)
    
    // Update most liked project
    const topProject = projectQueue.peek()
    setMostLikedProject(topProject || null)
    
    // Update popular projects
    const trendingProjectsFiltered = updatedProjects.filter((p) => p.trending)
    const trendingQueue = createPriorityQueueFromArray(trendingProjectsFiltered, 'likes')
    setPopularProjects(trendingQueue.toArray())
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
    if (!project || !project.images) return

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
            onClick={() => window.open("mailto:hello@hexcode.com", "_blank")}
            className="w-full bg-emerald-500 text-white border-0 hover:bg-emerald-600"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Us
          </Button>
          <Button
            onClick={() => window.open("tel:+94786734140", "_blank")}
            className="w-full bg-emerald-500 text-white border-0 hover:bg-emerald-600"
          >
            <Phone className="w-4 h-4 mr-2" />
            Schedule Call
          </Button>
          <Button
            onClick={() => window.open("https://wa.me/+94786734140", "_blank")}
            className="w-full bg-emerald-500 text-white border-0 hover:bg-emerald-600"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )

  // Ensure the loading spinner is centered and visible during loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

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

        {mostLikedProject && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 px-4 py-2 rounded-full mb-4">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500">Most Popular Project</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Client Favorite</h2>
            </div>

            <Card className="overflow-hidden bg-emerald-500/5 border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 max-w-4xl mx-auto p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-square m-0">
                  <div className="absolute inset-0 premium-gradient-1 opacity-20 z-10 mix-blend-multiply"></div>
                  <div className="absolute top-4 right-4 z-30 space-y-2">
                    <div className="bg-gradient-to-r from-emerald-500/90 to-emerald-400/90 backdrop-blur-sm border border-white/20 shadow-lg px-3 py-1.5 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all duration-300">
                      <Award className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-sm font-bold text-white drop-shadow-sm">{mostLikedProject.likes} likes</span>
                    </div>
                  </div>
                  <Image
                    src={mostLikedProject.images?.[0] || "/placeholder.svg"}
                    alt={mostLikedProject.title}
                    fill
                    className="object-cover w-full h-full m-0 p-0"
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
        )}

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

          <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar">
            {popularProjects.map((project, index) => (
              <Card
                key={project.id}
                className="flex-shrink-0 w-72 overflow-hidden bg-gradient-to-br from-emerald-500/5 to-background border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group relative p-0"
                style={{
                  animationDelay: `${index * 0.15}s`
                }}
              >
                {/* Floating trend indicator */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                
                {/* Square image container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 m-0">
                  {/* Trending badge */}
                  <div className="absolute top-3 left-3 z-20 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/30 px-2.5 py-1.5 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  
                  {/* Likes counter */}
                  <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Heart className="w-3 h-3 fill-emerald-400 text-emerald-400 animate-pulse" />
                      {project.likes}
                    </span>
                  </div>

                  {/* Image navigation */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-20 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={() => swipeImage(project.id, "left")}
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => swipeImage(project.id, "right")}
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full backdrop-blur-sm"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Main image */}
                  <Image
                    src={project.images?.[currentImageIndex[project.id] || 0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover w-full h-full m-0 p-0"
                  />

                  {/* Creative Image indicators */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {project.images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [project.id]: imageIndex }))}
                          className={`relative transition-all duration-500 ease-out transform ${
                            (currentImageIndex[project.id] || 0) === imageIndex
                              ? "w-6 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full scale-110 shadow-lg shadow-emerald-400/50"
                              : "w-2 h-2 bg-white/40 backdrop-blur-sm rounded-full hover:bg-white/70 hover:scale-125 hover:shadow-md hover:shadow-white/30"
                          }`}
                          style={{ 
                            animationDelay: `${imageIndex * 100}ms`,
                            boxShadow: (currentImageIndex[project.id] || 0) === imageIndex 
                              ? '0 0 15px rgba(52, 211, 153, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                              : undefined
                          }}
                        >
                          {/* Active indicator glow effect */}
                          {(currentImageIndex[project.id] || 0) === imageIndex && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse opacity-60 blur-sm"></div>
                          )}
                          
                          {/* Progress bar for active indicator */}
                          {(currentImageIndex[project.id] || 0) === imageIndex && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-r from-white/50 to-transparent animate-shimmer"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Compact content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 text-xs px-2 py-0.5">
                      {project.category}
                    </Badge>
                    <Button
                      onClick={() => handleLike(project.id)}
                      variant="ghost"
                      size="sm"
                      className={`p-1 hover:bg-emerald-500/10 transition-all duration-200 ${
                        likedProjects.has(project.id) ? "text-red-500" : "text-muted-foreground hover:text-emerald-500"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-all duration-200 ${
                          likedProjects.has(project.id) ? "fill-current scale-110" : "group-hover:scale-110"
                        }`}
                      />
                    </Button>
                  </div>

                  <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-emerald-500 transition-colors duration-300 leading-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {project.description}
                  </p>

                  <Button
                    size="sm"
                    onClick={() => window.open(project.liveUrl, "_blank")}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 group/btn"
                  >
                    <ExternalLink className="w-3 h-3 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Explore</span>
                  </Button>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredProjects.slice(0, visibleProjects).map((project, index) => (
              <Card
                key={project.id}
                className="overflow-hidden bg-gradient-to-br from-emerald-500/5 to-background border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group relative p-0"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Floating gradient orb */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                
                {/* Square image container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 m-0">
                  {/* Subtle animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Stats overlay */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
                    <div className="bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                      <span className="text-xs font-medium text-white flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        {project.likes}
                      </span>
                    </div>
                    {project.trending && (
                      <div className="bg-emerald-500/90 backdrop-blur-md border border-emerald-400/30 px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Image navigation */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-20 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={() => swipeImage(project.id, "left")}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => swipeImage(project.id, "right")}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full backdrop-blur-sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Main image */}
                  <Image
                    src={project.images?.[currentImageIndex[project.id] || 0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover w-full h-full m-0 p-0"
                  />

                  {/* Creative Image indicators */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {project.images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [project.id]: imageIndex }))}
                          className={`relative transition-all duration-500 ease-out transform ${
                            (currentImageIndex[project.id] || 0) === imageIndex
                              ? "w-6 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full scale-110 shadow-lg shadow-emerald-400/50"
                              : "w-2 h-2 bg-white/40 backdrop-blur-sm rounded-full hover:bg-white/70 hover:scale-125 hover:shadow-md hover:shadow-white/30"
                          }`}
                          style={{ 
                            animationDelay: `${imageIndex * 100}ms`,
                            boxShadow: (currentImageIndex[project.id] || 0) === imageIndex 
                              ? '0 0 15px rgba(52, 211, 153, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                              : undefined
                          }}
                        >
                          {/* Active indicator glow effect */}
                          {(currentImageIndex[project.id] || 0) === imageIndex && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse opacity-60 blur-sm"></div>
                          )}
                          
                          {/* Progress bar for active indicator */}
                          {(currentImageIndex[project.id] || 0) === imageIndex && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-r from-white/50 to-transparent animate-shimmer"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* badges and likes display */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
                    <div className="bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                      <span className="text-xs font-medium text-white flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        {project.likes}
                      </span>
                    </div>
                    {project.trending && (
                      <div className="bg-emerald-500/90 backdrop-blur-md border border-emerald-400/30 px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content section with reduced padding */}
                <div className="p-5 space-y-3">
                  {/* Header with badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 text-xs px-2 py-0.5">
                        {project.category}
                      </Badge>
                      <Badge variant="outline" className={`${getComplexityColor(project.complexity)} text-xs px-2 py-0.5`}>
                        {project.complexity.split(' ')[0]}
                      </Badge>
                    </div>
                    
                    <Button
                      onClick={() => handleLike(project.id)}
                      variant="ghost"
                      size="sm"
                      className={`p-1.5 hover:bg-emerald-500/10 transition-all duration-200 ${
                        likedProjects.has(project.id) ? "text-red-500" : "text-muted-foreground hover:text-emerald-500"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-200 ${
                          likedProjects.has(project.id) ? "fill-current scale-110" : "group-hover:scale-110"
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Title with hover effect */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors duration-300 leading-tight">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="secondary" 
                        className="text-xs bg-muted/50 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors duration-200 px-2 py-0.5"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-emerald-500 transition-colors duration-200">
                        <Star className="w-3 h-3" />
                        {project.stats.stars}
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 text-right">{project.duration}</span>
                  </div>

                  {/* Action button with improved styling */}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 group/btn"
                    >
                      <ExternalLink className="w-3 h-3 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                      <span className="font-medium">View Project</span>
                    </Button>
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

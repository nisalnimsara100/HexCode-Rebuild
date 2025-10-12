"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Heart, 
  Coffee, 
  Zap, 
  Award,
  ArrowRight,
  Briefcase,
  DollarSign,
  Calendar,
  Star,
  Globe,
  Code,
  Palette,
  Target,
  Monitor
} from "lucide-react"
import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { EnhancedJobApplicationForm } from "@/components/careers/enhanced-job-application-form";

type Career = {
  id: number;
  title: string;
  department: string;
  level: "Intern" | "Associate" | "Senior" | "Lead" | "Manager";
  location: string;
  type: string;
  experience: string;
  salary: string;
  technologies: string[];
  description: string;
  posted: string;
  requirements?: string[];
};

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);

  useEffect(() => {
    const careersRef = ref(database, "careers");
    const unsubscribe = onValue(careersRef, (snapshot) => {
      const data = snapshot.val();
      setCareers(data ? Object.values(data) : []);
    });

    return () => unsubscribe();
  }, []);

  const handleApplyClick = (job: Career) => {
    setSelectedJob(job);
    setIsApplicationFormOpen(true);
  };

  const handleCloseApplicationForm = () => {
    setIsApplicationFormOpen(false);
    setSelectedJob(null);
  };

  const companyValues = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Innovation First",
      description: "We embrace cutting-edge technologies and encourage creative problem-solving.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "We believe in the power of diverse teams working together towards common goals.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Continuous Growth",
      description: "We invest in our people through learning opportunities and career development.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Work-Life Balance",
      description: "We prioritize well-being with flexible schedules and a supportive environment.",
    },
  ]

  const benefits = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Competitive Salary",
      description: "Market-leading compensation packages",
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      title: "Flexible Hours",
      description: "Work when you're most productive",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Remote Work",
      description: "Hybrid or fully remote options",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Learning Budget",
      description: "$2000 annual learning allowance",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Events",
      description: "Regular team building activities",
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      title: "Latest Tech",
      description: "Top-tier equipment and tools",
    },
  ]

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Engineering":
        return <Code className="w-4 h-4" />
      case "Design":
        return <Palette className="w-4 h-4" />
      case "Infrastructure":
        return <Monitor className="w-4 h-4" />
      case "Marketing":
        return <Target className="w-4 h-4" />
      case "Sales":
        return <DollarSign className="w-4 h-4" />
      case "HR":
        return <Users className="w-4 h-4" />
      case "IT":
        return <Zap className="w-4 h-4" />
      case "Leadership":
        return <Star className="w-4 h-4" />
      case "Data":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Briefcase className="w-4 h-4" />
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Design":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "Infrastructure":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Marketing":
        return "text-pink-500 bg-pink-500/10 border-pink-500/20";
      case "Sales":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "HR":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "IT":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Leadership":
        return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      case "Data":
        return "text-teal-500 bg-teal-500/10 border-teal-500/20";
      default:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Intern":
        return "text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-700";
      case "Associate":
        return "text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-700";
      case "Senior":
        return "text-purple-600 bg-purple-100 border-purple-200 dark:text-purple-400 dark:bg-purple-900/30 dark:border-purple-700";
      case "Lead":
        return "text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-700";
      case "Manager":
        return "text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-700";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-700";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-emerald-50 to-background dark:from-emerald-950/20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-6">
            Join Our Team
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">
            Build Your Career at <span className="text-emerald-500">HexCode</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
            Join a team of passionate developers, designers, and innovators creating cutting-edge solutions 
            for businesses worldwide. Grow your skills, work on exciting projects, and make an impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>25+ Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Remote First</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Fast Growing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do, from how we build products to how we treat each other.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="p-6 text-center glass-effect hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mx-auto group-hover:bg-emerald-500/20 transition-colors">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-4">
              Perks & Benefits
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why You'll Love Working Here</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe happy employees do their best work. That's why we offer comprehensive benefits and perks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 glass-effect hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-500 text-emerald-500 mb-4">
              Open Positions
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Current Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to take the next step in your career? Check out our current openings and find your perfect role.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {careers.map((position, index) => (
              <Card 
                key={position.id} 
                className="relative overflow-hidden bg-gradient-to-br from-background via-emerald-500/5 to-background border border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 group cursor-pointer"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Animated background elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-300/10 to-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Floating orbs */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-emerald-300/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>

                {/* Main content */}
                <div className="relative p-8 space-y-6">
                  {/* Header section with enhanced styling */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getDepartmentColor(position.department)} backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {getDepartmentIcon(position.department)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-emerald-400 transition-all duration-300">
                              {position.title}
                            </h3>
                            <div className="flex gap-2 mt-2">
                              <Badge className={`${getDepartmentColor(position.department)} text-xs font-medium shadow-sm`}>
                                <span>{position.department}</span>
                              </Badge>
                              <Badge className={`${getLevelColor(position.level)} text-xs font-medium shadow-sm border`}>
                                <span>{position.level}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-4 group-hover:text-muted-foreground/90 transition-colors">
                          {position.description}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced technology tags */}
                    <div className="flex flex-wrap gap-2">
                      {position.technologies.map((tech, techIndex) => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                          style={{ 
                            animationDelay: `${techIndex * 100}ms`,
                            transform: 'translateY(0px)',
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced details grid with better visual hierarchy */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Location</p>
                          <p className="font-semibold">{position.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Type</p>
                          <p className="font-semibold">{position.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Experience</p>
                          <p className="font-semibold">{position.experience}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Salary</p>
                          <p className="font-semibold text-emerald-600">{position.salary}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced footer with better spacing and visual elements */}
                  <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        <span>Posted {position.posted}</span>
                      </div>
                      {position.posted.includes('day') && (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 group/btn hover:scale-105"
                      onClick={() => handleApplyClick(position)}
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>

          {/* Enhanced "Don't see the right role?" section */}
          <Card className="relative overflow-hidden p-10 text-center glass-effect bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border border-emerald-500/30 mt-16 max-w-3xl mx-auto group">
            {/* Animated background elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-300/15 to-emerald-500/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Floating particles */}
            <div className="absolute top-8 left-1/4 w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-12 right-1/3 w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute bottom-16 left-1/3 w-1 h-1 bg-emerald-300/50 rounded-full animate-bounce" style={{ animationDelay: '1.4s' }}></div>

            <div className="relative z-10 space-y-6">
              {/* Enhanced icon with gradient background */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Don't See The Perfect Role?
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  We're always on the lookout for exceptional talent! Even if there's no current opening that matches your skills, 
                  we'd love to hear from you. Send us your resume and let's explore future possibilities together.
                </p>
              </div>

              {/* Enhanced features list */}
              <div className="grid md:grid-cols-3 gap-4 my-8">
                <div className="flex items-center gap-3 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">Talent Pool</span>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">Future Growth</span>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">Culture Fit</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 group/btn px-8 py-3"
                  onClick={() => window.open("mailto:careers@hexcode.lk?subject=General Application", "_blank")}
                >
                  <Users className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Send General Application
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 bg-transparent backdrop-blur-sm px-8 py-3"
                  onClick={() => window.open("https://linkedin.com/company/hexcode", "_blank")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Follow Us
                </Button>
              </div>
            </div>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-emerald-100 text-lg mb-8">
              Join our team of innovators and help us build the future of technology. 
              We can't wait to see what we'll accomplish together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-50"
                onClick={() => window.open("mailto:careers@hexcode.lk", "_blank")}
              >
                Get in Touch
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Job Application Form Modal */}
      <EnhancedJobApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={handleCloseApplicationForm}
        selectedJob={selectedJob}
      />
    </div>
  )
}
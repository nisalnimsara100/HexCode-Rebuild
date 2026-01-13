"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Users,
  TrendingUp,
  Heart,
  Coffee,
  Zap,
  Award,
  ArrowRight,
  DollarSign,
  Globe,
  Monitor,
  Target
} from "lucide-react"
import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { EnhancedJobApplicationForm } from "@/components/careers/enhanced-job-application-form";
import { CareerCard, type Career } from "@/components/careers/career-card";

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);

  useEffect(() => {
    const careersRef = ref(database, "careers");
    const unsubscribe = onValue(careersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const careersArray = Object.entries(data).map(([key, value]) => ({
          ...(value as any),
          id: key
        })) as Career[];
        setCareers(careersArray);
      } else {
        setCareers([]);
      }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {careers.map((position, index) => (
              <CareerCard
                key={position.id}
                career={position}
                onApply={handleApplyClick}
                index={index}
              />
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
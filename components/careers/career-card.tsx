"use client"

import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Briefcase,
  Code,
  Palette,
  Monitor,
  Target,
  Users,
  Zap,
  Star,
  TrendingUp,
  Layout,
  Sparkles
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"

export type Career = {
  id: string | number;
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

interface CareerCardProps {
  career: Career;
  onApply: (career: Career) => void;
  className?: string;
  index?: number;
}

export function CareerCard({ career, onApply, className, index = 0 }: CareerCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Engineering": return <Code className="w-5 h-5" />
      case "Design": return <Palette className="w-5 h-5" />
      case "Infrastructure": return <Monitor className="w-5 h-5" />
      case "Marketing": return <Target className="w-5 h-5" />
      case "Sales": return <DollarSign className="w-5 h-5" />
      case "HR": return <Users className="w-5 h-5" />
      case "IT": return <Zap className="w-5 h-5" />
      case "Leadership": return <Star className="w-5 h-5" />
      case "Data": return <TrendingUp className="w-5 h-5" />
      default: return <Briefcase className="w-5 h-5" />
    }
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-emerald-100/50 dark:border-emerald-900/50 bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-lg shadow-emerald-900/5 hover:shadow-emerald-500/20 transition-all duration-500",
        className
      )}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col p-6 z-10">

        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 border border-emerald-100 dark:border-emerald-800">
              {getDepartmentIcon(career.department)}
              <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl text-foreground tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                {career.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-medium px-2 py-0.5 text-xs shadow-none"
                >
                  {career.department}
                </Badge>
                <span className="text-muted-foreground/40 text-[10px]">•</span>
                <span className="text-xs text-muted-foreground font-medium">{career.level}</span>
              </div>
            </div>
          </div>

          {career.posted.includes('day') && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 animate-pulse">
              <Sparkles className="w-3 h-3" />
              New
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 md:line-clamp-none group-hover:text-foreground transition-colors duration-300">
          {career.description}
        </p>

        {/* Stats Grid - Modern Minimal */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/50 group-hover:border-emerald-500/20 transition-colors duration-300">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-0.5">Location</p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              {career.location}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-0.5">Type</p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              {career.type}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-0.5">Salary</p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              {career.salary}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-0.5">Experience</p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              {career.experience}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-emerald-100/50 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {career.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-md bg-white dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-[10px] font-medium text-muted-foreground group-hover:border-emerald-500/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
            {career.technologies.length > 3 && (
              <span className="px-2 py-1 rounded-md bg-emerald-50/50 dark:bg-emerald-900/20 text-[10px] font-medium text-muted-foreground">+{career.technologies.length - 3}</span>
            )}
          </div>

          <Button
            onClick={() => onApply(career)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 group-hover:translate-x-1"
            size="sm"
          >
            Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

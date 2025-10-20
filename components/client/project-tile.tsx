"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Target, 
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Code
} from "lucide-react";

interface ProjectTileProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    priority: string;
    budget: {
      total: number;
      spent: number;
      remaining: number;
      currency: string;
    };
    timeline: {
      startDate: string;
      expectedEndDate: string;
      estimatedHours: number;
      spentHours: number;
    };
    team: {
      projectManager: string;
      leadDeveloper: string;
      members: string[];
    };
    technologies: string[];
    type: string;
    roadmap?: {
      phases: Array<{
        id: string;
        name: string;
        status: string;
        progress?: number;
      }>;
    };
  };
  onClick: () => void;
}

export function ProjectTile({ project, onClick }: ProjectTileProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'not-started': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'planning': return <Target className="w-4 h-4" />;
      case 'not-started': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  // Calculate overall progress based on phases
  const calculateOverallProgress = () => {
    if (!project.roadmap?.phases || project.roadmap.phases.length === 0) {
      return 0;
    }

    const phases = project.roadmap.phases;
    const completedPhases = phases.filter(phase => phase.status === 'completed').length;
    const inProgressPhases = phases.filter(phase => phase.status === 'in-progress');
    
    let totalProgress = (completedPhases / phases.length) * 100;
    
    // Add partial progress from in-progress phases
    if (inProgressPhases.length > 0) {
      const inProgressContribution = inProgressPhases.reduce((acc, phase) => {
        return acc + (phase.progress || 0);
      }, 0) / phases.length;
      totalProgress += inProgressContribution;
    }

    return Math.min(Math.round(totalProgress), 100);
  };

  const overallProgress = calculateOverallProgress();
  const budgetSpentPercentage = (project.budget.spent / project.budget.total) * 100;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="bg-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group transform hover:scale-105"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <Badge className={getPriorityColor(project.priority)} variant="outline">
                {project.priority}
              </Badge>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
          </div>
        </div>

        {/* Status and Type */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className={getStatusColor(project.status)} variant="outline">
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            <Code className="w-3 h-3 mr-1" />
            {project.type}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-400">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>Budget</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">
                {formatCurrency(project.budget.total, project.budget.currency)}
              </div>
              <div className="text-xs text-gray-400">
                {budgetSpentPercentage.toFixed(0)}% spent
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Timeline</span>
            </div>
            <div className="text-right">
              <div className="text-white">
                {formatDate(project.timeline.expectedEndDate)}
              </div>
              <div className="text-xs text-gray-400">
                Due date
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span>Team</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">
                {project.team.members.length} members
              </div>
              <div className="text-xs text-gray-400">
                Total team size
              </div>
            </div>
          </div>
        </div>
        
        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/50"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/50"
              >
                +{project.technologies.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Phase Summary */}
        {project.roadmap?.phases && project.roadmap.phases.length > 0 && (
          <div className="border-t border-gray-700/50 pt-3">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Phases</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {project.roadmap.phases.filter(p => p.status === 'completed').length} of {project.roadmap.phases.length} complete
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hover indicator */}
        <div className="mt-3 text-xs text-gray-500 group-hover:text-emerald-400 transition-colors text-center opacity-0 group-hover:opacity-100">
          Click to view details
        </div>
      </div>
    </Card>
  );
}
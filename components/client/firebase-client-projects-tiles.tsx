"use client";

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Eye,
  MapPin,
  Play,
  Pause,
  Target
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'not-started';
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  dependencies: string[];
  duration: string;
  priority: string;
  category: string;
  position: { x: number; y: number };
  color: string;
  radius: number;
  progress?: number;
}

interface ClientProject {
  email: string;
  id: string;
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
  budget: number;
  nextMilestone: string;
  progress: number;
  teamMembers: TeamMember[];
  technologies: string[];
  roadmap: RoadmapPhase[];
  status?: string;
  priority?: string;
  currency?: string;
}

interface FirebaseClientProjectsTilesProps {
  userEmail: string;
  onProjectSelect?: (project: ClientProject) => void;
  showRoadmap?: boolean;
}

export function FirebaseClientProjectsTiles({ 
  userEmail, 
  onProjectSelect,
  showRoadmap = false 
}: FirebaseClientProjectsTilesProps) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to transform Firebase roadmap phases to match your desired format
  const transformRoadmapPhases = (firebasePhases: any[]): RoadmapPhase[] => {
    if (!firebasePhases || !Array.isArray(firebasePhases)) {
      return [];
    }

    return firebasePhases.map((phase, index) => ({
      id: phase.id || `phase-${index}`,
      title: phase.name || phase.title || 'Unnamed Phase',
      description: phase.description || '',
      status: mapFirebaseStatusToRoadmapStatus(phase.status),
      tasks: transformDeliverablesToTasks(phase.deliverables || [], phase.status),
      dependencies: phase.dependencies || [],
      duration: calculatePhaseDuration(phase.startDate, phase.endDate),
      priority: 'high', // Default priority
      category: mapPhaseToCategory(phase.name || phase.title || ''),
      position: { 
        x: 200 + (index * 250), 
        y: 150 + (index % 2 === 0 ? 0 : 100) 
      },
      color: getPhaseColor(phase.status),
      radius: 40,
      progress: phase.progress || (phase.status === 'completed' ? 100 : phase.status === 'in-progress' ? 50 : 0)
    }));
  };

  // Helper function to map Firebase status to roadmap status
  const mapFirebaseStatusToRoadmapStatus = (status: string): 'completed' | 'in-progress' | 'upcoming' | 'not-started' => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in-progress': return 'in-progress';
      case 'not-started': return 'not-started';
      default: return 'upcoming';
    }
  };

  // Helper function to transform deliverables to tasks
  const transformDeliverablesToTasks = (deliverables: string[], phaseStatus: string) => {
    return deliverables.map((deliverable, index) => ({
      id: `task-${index}`,
      title: deliverable,
      completed: phaseStatus === 'completed'
    }));
  };

  // Helper function to calculate phase duration
  const calculatePhaseDuration = (startDate?: string, endDate?: string): string => {
    if (!startDate || !endDate) return '2 weeks';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
  };

  // Helper function to map phase name to category
  const mapPhaseToCategory = (phaseName: string): string => {
    const name = phaseName.toLowerCase();
    if (name.includes('design') || name.includes('ui') || name.includes('ux')) return 'design';
    if (name.includes('develop') || name.includes('code') || name.includes('implement')) return 'development';
    if (name.includes('test') || name.includes('qa') || name.includes('quality')) return 'testing';
    if (name.includes('deploy') || name.includes('launch') || name.includes('release')) return 'deployment';
    return 'design'; // Default category
  };

  // Helper function to get phase color based on status
  const getPhaseColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'not-started': return '#6b7280';
      default: return '#6366f1';
    }
  };

  // Helper function to transform Firebase team members
  const transformTeamMembers = (firebaseTeam: any): TeamMember[] => {
    if (!firebaseTeam) return [];
    
    const members: TeamMember[] = [];
    
    // Add project manager
    if (firebaseTeam.projectManager) {
      members.push({
        id: 'pm',
        name: 'Project Manager',
        role: 'Project Manager'
      });
    }
    
    // Add technical lead
    if (firebaseTeam.leadDeveloper || firebaseTeam.technicalLead) {
      members.push({
        id: 'tl',
        name: 'Technical Lead',
        role: 'Technical Lead'
      });
    }
    
    // Add developers
    if (firebaseTeam.members && Array.isArray(firebaseTeam.members)) {
      firebaseTeam.members.forEach((memberId: string, index: number) => {
        members.push({
          id: memberId,
          name: `Developer ${index + 1}`,
          role: 'Developer'
        });
      });
    }
    
    return members;
  };

  // Function to calculate project progress based on phases
  const calculateProjectProgress = (roadmapPhases: any[]): number => {
    if (!roadmapPhases || roadmapPhases.length === 0) return 0;
    
    let totalProgress = 0;
    roadmapPhases.forEach(phase => {
      if (phase.status === 'completed') {
        totalProgress += 100;
      } else if (phase.status === 'in-progress') {
        totalProgress += phase.progress || 50;
      }
    });
    
    return Math.round(totalProgress / roadmapPhases.length);
  };

  // Function to get next milestone
  const getNextMilestone = (roadmapPhases: any[]): string => {
    if (!roadmapPhases || roadmapPhases.length === 0) return 'No milestones';
    
    // Find the first non-completed phase
    const nextPhase = roadmapPhases.find(phase => phase.status !== 'completed');
    if (nextPhase) {
      return nextPhase.name || nextPhase.title || 'Next Phase';
    }
    
    return 'Project Completed';
  };

  // Fetch client projects from Firebase
  const fetchClientProjects = async (email: string): Promise<ClientProject[]> => {
    try {
      console.log('Fetching client projects for email:', email);
      
      // First, find the client by email
      const clientsRef = ref(database, 'clients');
      const clientsSnapshot = await get(clientsRef);
      
      if (!clientsSnapshot.exists()) {
        throw new Error('No clients data found in database');
      }
      
      const clientsData = clientsSnapshot.val();
      const client = Object.values(clientsData as Record<string, any>)
        .find((client: any) => client.email === email);
      
      if (!client || !client.projects) {
        console.warn(`No client found with email: ${email} or no projects associated`);
        return [];
      }
      
      console.log('Found client with projects:', client.projects);
      
      // Now fetch the projects
      const projectsRef = ref(database, 'projects');
      const projectsSnapshot = await get(projectsRef);
      
      if (!projectsSnapshot.exists()) {
        throw new Error('No projects data found in database');
      }
      
      const projectsData = projectsSnapshot.val();
      console.log('Projects data:', projectsData);
      
      // Transform Firebase data to match your desired format
      const transformedProjects: ClientProject[] = client.projects.map((projectId: string) => {
        const firebaseProject = projectsData[projectId];
        
        if (!firebaseProject) {
          console.warn(`Project ${projectId} not found in database`);
          return null;
        }
        
        console.log('Transforming project:', firebaseProject);
        
        // Transform roadmap phases
        const roadmapPhases = firebaseProject.roadmap?.phases || [];
        const transformedRoadmap = transformRoadmapPhases(roadmapPhases);
        
        // Calculate progress
        const progress = calculateProjectProgress(roadmapPhases);
        
        return {
          email: email,
          id: projectId,
          name: firebaseProject.name || 'Unnamed Project',
          description: firebaseProject.description || 'No description available',
          startDate: firebaseProject.timeline?.startDate || new Date().toISOString().split('T')[0],
          dueDate: firebaseProject.timeline?.expectedEndDate || firebaseProject.timeline?.endDate || new Date().toISOString().split('T')[0],
          budget: firebaseProject.budget?.total || 0,
          nextMilestone: getNextMilestone(roadmapPhases),
          progress: progress,
          teamMembers: transformTeamMembers(firebaseProject.team),
          technologies: firebaseProject.technologies || [],
          roadmap: transformedRoadmap,
          status: firebaseProject.status || 'planning',
          priority: firebaseProject.priority || 'medium',
          currency: firebaseProject.budget?.currency || 'USD'
        };
      }).filter(Boolean); // Remove null values
      
      console.log('Transformed projects:', transformedProjects);
      return transformedProjects;
      
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw error;
    }
  };

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await fetchClientProjects(userEmail);
        setProjects(fetchedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      loadProjects();
    }
  }, [userEmail]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'on-hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No projects found</h3>
        <p className="text-gray-600 dark:text-gray-400">No projects are associated with your account yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100 mb-2">
                    {project.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-1">
                  {showRoadmap && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => console.log('Show roadmap for:', project.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onProjectSelect?.(project)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status and Priority */}
              <div className="flex gap-2">
                <Badge className={getStatusColor(project.status || 'planning')}>
                  {(project.status || 'planning').replace('-', ' ')}
                </Badge>
                <Badge className={getPriorityColor(project.priority || 'medium')}>
                  {project.priority || 'medium'}
                </Badge>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget</span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {formatCurrency(project.budget, project.currency)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                    <Users className="h-4 w-4" />
                    <span>Team</span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {project.teamMembers.length} members
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Timeline</span>
                </div>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>

              {/* Next Milestone */}
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                  <Target className="h-4 w-4" />
                  <span>Next Milestone</span>
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {project.nextMilestone}
                </p>
              </div>

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Team Members (Avatar Row) */}
              {project.teamMembers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Team Members</p>
                  <div className="flex items-center gap-1">
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        title={`${member.name} - ${member.role}`}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  onClick={() => onProjectSelect?.(project)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Project Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  FileText,
  Download,
  MapPin,
  Eye,
  Edit,
  Briefcase,
  TrendingUp
} from 'lucide-react';

// Interface matching your JSON structure exactly
interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'not-started';
  tasks: RoadmapTask[];
  dependencies: string[];
  duration: string;
  priority: string;
  category: string;
  position: { x: number; y: number };
  color: string;
  radius: number;
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
}

interface FirebaseClientProjectsAdminProps {
  onProjectSelect?: (project: ClientProject) => void;
}

export function FirebaseClientProjectsAdmin({ onProjectSelect }: FirebaseClientProjectsAdminProps) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch data directly from the clientProjects collection
  const fetchClientProjects = async (): Promise<ClientProject[]> => {
    try {
      console.log('Fetching client projects from Firebase...');
      
      // Fetch from the clientProjects collection as shown in your Firebase screenshots
      const clientProjectsRef = ref(database, 'clientProjects');
      const snapshot = await get(clientProjectsRef);
      
      if (!snapshot.exists()) {
        console.warn('No clientProjects data found in Firebase');
        return [];
      }
      
      const clientProjectsData = snapshot.val();
      console.log('Client projects data:', clientProjectsData);
      
      // Convert Firebase object to array
      const projectsArray: ClientProject[] = Object.keys(clientProjectsData).map(key => {
        const project = clientProjectsData[key];
        
        // Return the project as is since it already matches your desired format
        return {
          email: project.email || 'unknown@email.com',
          id: project.id || key,
          name: project.name || 'Unnamed Project',
          description: project.description || 'No description available',
          startDate: project.startDate || new Date().toISOString().split('T')[0],
          dueDate: project.dueDate || new Date().toISOString().split('T')[0],
          budget: project.budget || 0,
          nextMilestone: project.nextMilestone || 'No milestone',
          progress: project.progress || 0,
          teamMembers: project.teamMembers || [],
          technologies: project.technologies || [],
          roadmap: project.roadmap || []
        };
      });
      
      console.log('Processed projects:', projectsArray);
      return projectsArray;
      
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
        const fetchedProjects = await fetchClientProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Refresh function
  const refreshProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await fetchClientProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh projects');
      console.error('Error refreshing projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For status filter, we'll use progress to determine status
    let projectStatus = 'planning';
    if (project.progress === 100) projectStatus = 'completed';
    else if (project.progress > 0) projectStatus = 'in-progress';
    
    const matchesStatus = statusFilter === 'all' || projectStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status based on progress
  const getProjectStatus = (progress: number): string => {
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'planning';
  };

  // Get status color
  const getStatusColor = (progress: number) => {
    const status = getProjectStatus(progress);
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate project stats
  const projectStats = {
    total: projects.length,
    completed: projects.filter(p => p.progress === 100).length,
    inProgress: projects.filter(p => p.progress > 0 && p.progress < 100).length,
    planning: projects.filter(p => p.progress === 0).length,
    totalValue: projects.reduce((sum, p) => sum + p.budget, 0)
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
          <Button onClick={refreshProjects} size="sm" variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Client Projects Management</h2>
            <p className="text-orange-100">Monitor and control all client projects and their progress</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshProjects}
              variant="outline"
              className="border-orange-200 text-white hover:bg-orange-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projectStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{projectStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-blue-400">{projectStats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Planning</p>
                <p className="text-2xl font-bold text-yellow-400">{projectStats.planning}</p>
              </div>
              <Target className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(projectStats.totalValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects by name, description, or client email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid - Exact format from your JSON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors cursor-pointer"
            onClick={() => onProjectSelect?.(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white mb-2 flex items-center gap-2">
                    {project.name}
                    {project.progress === 100 && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                  </CardTitle>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <p className="text-orange-400 text-xs mt-1">
                    Client: {project.email}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status Badge */}
              <div className="flex gap-2">
                <Badge className={getStatusColor(project.progress)}>
                  {getProjectStatus(project.progress).replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  {project.progress}% Complete
                </Badge>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Budget</p>
                  <p className="text-white font-medium">
                    {formatCurrency(project.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Team Size</p>
                  <p className="text-white font-medium">{project.teamMembers.length}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="text-sm">
                <p className="text-gray-400">Timeline</p>
                <p className="text-white">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>

              {/* Next Milestone */}
              <div className="text-sm">
                <p className="text-gray-400">Next Milestone</p>
                <p className="text-white font-medium">{project.nextMilestone}</p>
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

              {/* Team Members */}
              {project.teamMembers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Team:</span>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={member.id}
                        className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-gray-800"
                        title={`${member.name} - ${member.role}`}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-gray-800">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Roadmap Summary */}
              {project.roadmap.length > 0 && (
                <div className="text-sm">
                  <p className="text-gray-400">Roadmap Progress</p>
                  <div className="flex gap-1 mt-1">
                    {project.roadmap.map((phase) => (
                      <div
                        key={phase.id}
                        className={`w-4 h-4 rounded-full ${
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-600'
                        }`}
                        title={`${phase.title} - ${phase.status}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
            <p className="text-gray-400 text-center mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your filters to see more results."
                : "No client projects found in the database."
              }
            </p>
            <Button onClick={refreshProjects} variant="outline" className="border-gray-600 text-gray-300">
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
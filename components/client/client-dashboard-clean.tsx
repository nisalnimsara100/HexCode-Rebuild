"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CleanGraphRoadmap from "./clean-graph-roadmap";
import { useRouter } from "next/navigation";
import { fetchClientProjectsForDashboard, FirebaseClientProject, submitClientProjectRequest } from "@/lib/client-projects-firebase";
import { 
  User, 
  Bell, 
  Search,
  Settings,
  LogOut,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  MessageCircle,
  Download,
  Eye,
  BarChart3,
  PieChart,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Heart,
  Zap,
  Target,
  Briefcase,
  Users,
  Globe,
  Smartphone,
  Phone,
  Video,
  Home,
  GitBranch
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: string;
  tasks: any[];
  dependencies: string[];
  duration: string;
  priority: string;
  category: string;
  position: { x: number; y: number };
  color: string;
  radius: number;
}

// Use the Firebase interface for projects
type Project = FirebaseClientProject;

export function ClientDashboard() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [newProjectForm, setNewProjectForm] = useState({
    name: "",
    description: "",
    timeline: "",
    budget: "",
    requirements: ""
  });
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const newProjectModalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Utility function to get status from progress
  const getProjectStatus = (progress: number) => {
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'planning';
  };

  // Calculate project progress based on actual task completion
  const calculateProjectProgress = (project: Project) => {
    if (!project.roadmap || project.roadmap.length === 0) return project.progress || 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    project.roadmap.forEach(phase => {
      if (phase.tasks && Array.isArray(phase.tasks)) {
        totalTasks += phase.tasks.length;
        completedTasks += phase.tasks.filter(task => task.completed).length;
      }
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress || 0;
  };

  // Utility function to format budget
  const formatBudget = (budget: number) => {
    return `$${(budget / 1000).toFixed(0)}K`;
  };

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get user email from localStorage
        const profile = localStorage.getItem('clientProfile');
        if (profile) {
          const parsed = JSON.parse(profile);
          const email = parsed.email;
          setUserEmail(email);
          
          // Fetch projects from Firebase using the new function
          const fetchedProjects = await fetchClientProjectsForDashboard(email);
          
          // Filter out pending approval projects (they belong in admin panel)
          const approvedProjects = fetchedProjects.filter(project => 
            project.status !== 'pending-approval'
          );
          
          // Ensure required fields are present
          const projectsWithDefaults = approvedProjects.map(project => ({
            ...project,
            status: project.status || getProjectStatus(project.progress || 0),
            roadmap: project.roadmap || [],
            teamMembers: project.teamMembers || [],
            technologies: project.technologies || [],
            startDate: project.startDate || new Date().toISOString().split('T')[0]
          }));
          
          setProjects(projectsWithDefaults);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  const handleLogout = async () => {
    try {
      // Clear client session and redirect to home with success message
      localStorage.removeItem('clientProfile');
      router.push('/?logout=success');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleSubmitProjectRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      alert('Please log in to submit a project request');
      return;
    }

    if (!newProjectForm.name || !newProjectForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmittingProject(true);
    
    try {
      // Get user profile for additional info
      const profile = localStorage.getItem('clientProfile');
      const clientName = profile ? JSON.parse(profile).name : undefined;

      await submitClientProjectRequest({
        name: newProjectForm.name,
        description: newProjectForm.description,
        timeline: newProjectForm.timeline,
        budget: newProjectForm.budget,
        requirements: newProjectForm.requirements,
        clientEmail: userEmail,
        clientName
      });

      // Show success state
      setSubmitSuccess(true);
      
      // Reset form
      setNewProjectForm({ 
        name: "", 
        description: "", 
        timeline: "", 
        budget: "", 
        requirements: "" 
      });

      // Auto-close modal after showing success message
      setTimeout(() => {
        setShowNewProjectModal(false);
        setSubmitSuccess(false);
        // Refresh projects list to show the new pending request
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error submitting project request:', error);
      alert('Failed to submit project request. Please try again.');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (newProjectModalRef.current && !newProjectModalRef.current.contains(event.target as Node)) {
        setShowNewProjectModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending-approval': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'planning': return <Target className="w-4 h-4" />;
      case 'pending-approval': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHomeClick}
                className="text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Client Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {(() => {
                  try {
                    const profile = localStorage.getItem('clientProfile');
                    if (profile) {
                      const parsed = JSON.parse(profile);
                      return parsed.name || 'User';
                    }
                    return 'User';
                  } catch (e) {
                    return 'User';
                  }
                })()}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 w-64"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-white">{projects.filter((p: Project) => p.status === 'in-progress').length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-emerald-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-white">{projects.filter((p: Project) => p.status === 'completed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-400 text-sm font-medium">In Planning</p>
                <p className="text-2xl font-bold text-white">{projects.filter((p: Project) => p.status === 'planning').length}</p>
              </div>
              <Target className="w-8 h-8 text-amber-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Total Investment</p>
                <p className="text-2xl font-bold text-white">${(projects.reduce((total, p) => total + p.budget, 0) / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {projects.map((project: Project) => (
              <Card key={project.id} className="bg-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedProject(project)}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                    </div>
                    <Badge className={getStatusColor(project.status || 'planning')}>
                      {getStatusIcon(project.status || 'planning')}
                      <span className="ml-1 capitalize">{(project.status || 'planning').replace('-', ' ')}</span>
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{calculateProjectProgress(project)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProjectProgress(project)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Project Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white font-medium">{formatBudget(project.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Due:</span>
                      <span className="text-white">{project.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next:</span>
                      <span className="text-white">{project.nextMilestone}</span>
                    </div>
                  </div>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {(project.technologies || []).slice(0, 3).map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {tech}
                      </Badge>
                    ))}
                    {(project.technologies || []).length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-500/20 text-gray-400">
                        +{(project.technologies || []).length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          
            {/* New Project Card */}
            <Card className="bg-gray-800/30 border-gray-700/50 border-dashed hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowNewProjectModal(true)}>
              <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/30 transition-colors">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">New Project</h3>
                  <p className="text-gray-400 text-sm">Click to request a new project</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">

              
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                  <p className="text-gray-400 text-lg">{selectedProject.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(selectedProject.status || 'planning')}>
                    {getStatusIcon(selectedProject.status || 'planning')}
                    <span className="ml-1 capitalize">{(selectedProject.status || 'planning').replace('-', ' ')}</span>
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Overall Progress</span>
                  <span>{calculateProjectProgress(selectedProject)}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProjectProgress(selectedProject)}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Project Details */}
                <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start Date:</span>
                      <span className="text-white">{selectedProject.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Due Date:</span>
                      <span className="text-white">{selectedProject.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white">{formatBudget(selectedProject.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Milestone:</span>
                      <span className="text-white">{selectedProject.nextMilestone}</span>
                    </div>
                  </div>
                </Card>

                {/* Team Members */}
                {/* <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {selectedProject.teamMembers.map((member: TeamMember, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-sm text-white font-medium">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <span className="text-white">{member.name}</span>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card> */}

                {/* Technologies */}
                <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.technologies || []).map((tech, index) => (
                      <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Interactive Graph Roadmap */}
              <div className="mb-8">
                <Card className="bg-gray-800/50 border-gray-700/50 p-0 overflow-hidden">
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
                      Clean Project Roadmap
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Swipe or click nodes to explore tasks and progress
                    </p>
                  </div>
                  <CleanGraphRoadmap roadmapData={selectedProject.roadmap || []} />
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Team
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProject(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={newProjectModalRef}
            className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Request New Project</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitProjectRequest}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Mobile App Development"
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    placeholder="Describe your project goals, target audience, and key features..."
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Timeline
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 3-4 months"
                    value={newProjectForm.timeline}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, timeline: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Budget (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 50000"
                    value={newProjectForm.budget}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This helps us provide more accurate proposals. Leave blank if unsure.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Goals & Requirements
                  </label>
                  <textarea
                    placeholder="What are your main goals for this project? Any specific features or requirements?"
                    value={newProjectForm.requirements || ""}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, requirements: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {submitSuccess && (
                  <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Request Submitted Successfully!</span>
                    </div>
                    <p className="text-emerald-300 text-sm mt-1">
                      Your project request has been sent for admin review. You'll see it in your dashboard with "Pending Approval" status.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewProjectModal(false);
                      setSubmitSuccess(false);
                    }}
                    className="flex-1"
                    disabled={isSubmittingProject}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    disabled={!newProjectForm.name || !newProjectForm.description || isSubmittingProject || submitSuccess}
                  >
                    {isSubmittingProject ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : submitSuccess ? (
                      'Submitted ✓'
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
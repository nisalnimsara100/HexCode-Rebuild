"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectTile } from "./project-tile";
import { ProjectDetailsModal } from "./project-details-modal";
import { useClientProjects } from "@/hooks/use-client-projects";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Search,
  Settings,
  LogOut,
  DollarSign,
  CheckCircle,
  Target,
  Briefcase,
  Home,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Plus
} from "lucide-react";

interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  type: string;
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
    actualEndDate?: string;
    estimatedHours: number;
    spentHours: number;
  };
  team: {
    projectManager: string;
    leadDeveloper: string;
    members: string[];
  };
  technologies: string[];
  repository?: {
    url: string;
    branch: string;
    lastCommit: string;
  };
  roadmap?: {
    phases: Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      startDate: string;
      endDate: string;
      progress?: number;
      deliverables: string[];
      milestones: Array<{
        id: string;
        name: string;
        description: string;
        dueDate: string;
        status: string;
        completedDate?: string;
        progress?: number;
      }>;
    }>;
    dependencies: Array<{
      from: string;
      to: string;
      type: string;
      description?: string;
    }>;
    criticalPath?: string[];
    risks?: Array<{
      id: string;
      description: string;
      impact: string;
      probability: string;
      mitigation: string;
      owner: string;
    }>;
  };
  communications?: Array<{
    id: string;
    type: string;
    subject: string;
    date: string;
    participants?: string[];
    summary: string;
    actionItems?: Array<{
      item: string;
      assignee: string;
      dueDate: string;
      status: string;
    }>;
    from?: string;
    to?: string[];
    duration?: string;
    attachments?: string[];
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    version: string;
    uploadDate: string;
    uploadedBy: string;
  }>;
  metrics?: {
    codeQuality: {
      coverage: number;
      complexity: string;
      bugs: number;
      vulnerabilities: number;
    };
    performance: {
      responseTime: string;
      throughput: string;
      uptime: string;
    };
  };
}

export function ClientDashboard() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProjectForm, setNewProjectForm] = useState({
    name: "",
    description: "",
    timeline: "",
    budget: "",
    requirements: ""
  });
  const newProjectModalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get user email from localStorage
  const getUserEmail = () => {
    try {
      const profile = localStorage.getItem('clientProfile');
      if (profile) {
        const parsed = JSON.parse(profile);
        return parsed.email;
      }
    } catch (e) {
      console.error('Error parsing client profile:', e);
    }
    return null;
  };

  const [userEmail] = useState(getUserEmail());
  
  // Use the Firebase hook for real-time data
  const { projects, loading, error, clientData, notifications, refreshProjects } = useClientProjects(userEmail);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.technologies.some(tech => 
      tech.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate project statistics
  const projectStats = {
    active: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0),
    totalSpent: projects.reduce((sum, p) => sum + (p.budget?.spent || 0), 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('clientProfile');
      router.push('/?logout=success');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleHomeClick = () => {
    router.push('/');
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
                <p className="text-sm text-gray-400">
                  Welcome back, {clientData?.name || 'User'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 w-64"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((n: any) => !n.read).length}
                  </span>
                )}
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
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-gray-400">Loading your projects...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <Card className="bg-red-500/10 border-red-500/20 p-6 max-w-md">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-400 font-medium">Error Loading Projects</h3>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button
                onClick={refreshProjects}
                variant="outline"
                className="mt-4 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Card>
          </div>
        )}

        {/* Content when loaded */}
        {!loading && !error && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">Active Projects</p>
                    <p className="text-2xl font-bold text-white">{projectStats.active}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-emerald-400" />
                </div>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-white">{projectStats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </Card>
              
              <Card className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 text-sm font-medium">In Planning</p>
                    <p className="text-2xl font-bold text-white">{projectStats.planning}</p>
                  </div>
                  <Target className="w-8 h-8 text-amber-400" />
                </div>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Total Budget</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(projectStats.totalBudget)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
              </Card>
            </div>

            {/* Projects Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Projects</h2>
                  <p className="text-gray-400 text-sm">
                    {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
                    {searchQuery && ` • Filtering by "${searchQuery}"`}
                  </p>
                </div>
                <Button
                  onClick={() => setShowNewProjectModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 && projects.length > 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg font-medium mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your search query</p>
              </div>
            ) : filteredProjects.length === 0 && projects.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg font-medium mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-4">Get started by requesting your first project</p>
                <Button
                  onClick={() => setShowNewProjectModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredProjects.map((project) => (
                  <ProjectTile
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
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

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted:', newProjectForm);
                setShowNewProjectModal(false);
                setNewProjectForm({ name: "", description: "", timeline: "", budget: "", requirements: "" });
              }}>
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

                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProjectModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={!newProjectForm.name || !newProjectForm.description}
                  >
                    Submit Request
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
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ref, get, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  Target,
  Edit,
  Trash2,
  Eye,
  FileText,
  Download,
  RefreshCw,
  Save,
  X,
  DollarSign,
  MapPin,
  Circle
} from 'lucide-react';

// Client Project interface (Firebase clientProjects structure)
interface ClientProject {
  id: string;
  email: string;
  name: string;
  description: string;
  budget: number;
  dueDate: string;
  nextMilestone: string;
  progress: number;
  startDate?: string;
  status?: string;
  technologies?: string[];
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  roadmap?: Array<{
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    category: string;
    color: string;
    estimatedHours?: number;
    priority?: 'low' | 'medium' | 'high';
    tasks?: Array<{
      id: string;
      title: string;
      description: string;
      completed: boolean;
      priority: 'low' | 'medium' | 'high';
      estimatedTime: string;
    }>;
  }>;
}

interface ClientProjectsManagementProps {
  onProjectSelect?: (project: ClientProject) => void;
}

export function ClientProjectsManagement({ onProjectSelect }: ClientProjectsManagementProps) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showEditPhaseModal, setShowEditPhaseModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [isUpdatingPhase, setIsUpdatingPhase] = useState(false);
  const [isDeletingPhase, setIsDeletingPhase] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ClientProject>>({});
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [editingPhaseIndex, setEditingPhaseIndex] = useState<number>(-1);

  // Form state for new phase
  const [newPhaseForm, setNewPhaseForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'upcoming' as 'completed' | 'in-progress' | 'upcoming',
    category: 'development',
    tasks: [''] as string[]
  });

  // Form state for editing phase
  const [editPhaseForm, setEditPhaseForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'upcoming' as 'completed' | 'in-progress' | 'upcoming',
    category: 'development',
    tasks: [] as Array<{ id: string; title: string; description?: string; completed: boolean }>
  });

  // Form state for new/edit project
  const [projectForm, setProjectForm] = useState<Partial<ClientProject>>({
    name: '',
    description: '',
    email: '',
    budget: 0,
    dueDate: '',
    nextMilestone: '',
    progress: 0,
    technologies: [],
    roadmap: []
  });

  // Fetch all client projects from Firebase
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientProjectsRef = ref(database, 'clientProjects');
      const snapshot = await get(clientProjectsRef);
      
      if (snapshot.exists()) {
        const clientProjects = snapshot.val();
        
        if (Array.isArray(clientProjects)) {
          // Filter out any null/undefined entries and add status
          const validProjects = clientProjects
            .filter(project => project && project.id)
            .map(project => ({
              ...project,
              status: project.status || getStatusFromProgress(project.progress || 0)
            }));
          setProjects(validProjects);
        } else {
          console.log('clientProjects is not an array:', typeof clientProjects);
          setProjects([]);
        }
      } else {
        console.log('No clientProjects found in database');
        setProjects([]);
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time data refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProjects();
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get status from progress
  const getStatusFromProgress = (progress: number): string => {
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'planning';
  };

  // Create new project
  const handleCreateProject = async () => {
    try {
      if (projectForm.name && projectForm.email) {
        const clientProjectsRef = ref(database, 'clientProjects');
        const snapshot = await get(clientProjectsRef);
        
        let currentProjects: ClientProject[] = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          currentProjects = Array.isArray(data) ? data : [];
        }
        
        const newProject: ClientProject = {
          ...projectForm as Omit<ClientProject, 'id'>,
          id: `project-${Date.now()}`,
          technologies: projectForm.technologies || [],
          roadmap: projectForm.roadmap || [],
          status: (projectForm.progress || 0) === 100 ? 'completed' : 
                  (projectForm.progress || 0) > 0 ? 'in-progress' : 'planning'
        };
        
        currentProjects.push(newProject);
        await set(clientProjectsRef, currentProjects);
        
        setShowCreateModal(false);
        resetProjectForm();
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Edit project
  const handleEditProject = (project: ClientProject) => {
    setEditingProject(project);
    setProjectForm(project);
    setShowEditModal(true);
  };

  // Update project
  const handleUpdateProject = async () => {
    try {
      if (editingProject.id && projectForm.name && projectForm.email) {
        const clientProjectsRef = ref(database, 'clientProjects');
        const snapshot = await get(clientProjectsRef);
        
        if (snapshot.exists()) {
          const projects = snapshot.val();
          if (Array.isArray(projects)) {
            const projectIndex = projects.findIndex((p: ClientProject) => p.id === editingProject.id);
            if (projectIndex !== -1) {
              const updatedProject = {
                ...projects[projectIndex],
                ...projectForm,
                status: (projectForm.progress || 0) === 100 ? 'completed' : 
                        (projectForm.progress || 0) > 0 ? 'in-progress' : 'planning'
              };
              projects[projectIndex] = updatedProject;
              await set(clientProjectsRef, projects);
            }
          }
        }
        
        setShowEditModal(false);
        setEditingProject({});
        resetProjectForm();
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const clientProjectsRef = ref(database, 'clientProjects');
        const snapshot = await get(clientProjectsRef);
        
        if (snapshot.exists()) {
          const projects = snapshot.val();
          if (Array.isArray(projects)) {
            const filteredProjects = projects.filter((p: ClientProject) => p.id !== projectId);
            await set(clientProjectsRef, filteredProjects);
          }
        }
        
        await fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  // Reset form
  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      description: '',
      email: '',
      budget: 0,
      dueDate: '',
      nextMilestone: '',
      progress: 0,
      technologies: [],
      roadmap: []
    });
  };

  // Handle technologies input
  const handleTechnologiesChange = (value: string) => {
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setProjectForm(prev => ({ ...prev, technologies }));
  };

  // Handle view project details
  const handleViewProject = (project: ClientProject) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  // Handle view roadmap
  const handleViewRoadmap = (project: ClientProject) => {
    setSelectedProject(project);
    setShowRoadmapModal(true);
  };

  const handleEditPhase = (phase: any, index: number) => {
    setEditingPhase(phase);
    setEditingPhaseIndex(index);
    setEditPhaseForm({
      title: phase.title || '',
      description: phase.description || '',
      priority: phase.priority || 'medium',
      status: phase.status || 'upcoming',
      category: phase.category || 'development',
      tasks: phase.tasks || []
    });
    setShowEditPhaseModal(true);
  };

  // Firebase CRUD operations for roadmap
  const addPhaseToProject = async (projectId: string, newPhase: any) => {
    try {
      const clientProjectsRef = ref(database, 'clientProjects');
      const snapshot = await get(clientProjectsRef);
      
      if (snapshot.exists()) {
        const clientProjects = snapshot.val();
        let projectsArray: ClientProject[] = [];
        
        if (Array.isArray(clientProjects)) {
          projectsArray = clientProjects;
        } else {
          setError('Invalid project data structure.');
          return false;
        }
        
        // Find the project by ID
        const projectIndex = projectsArray.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
          setError('Project not found.');
          return false;
        }
        
        const currentRoadmap = projectsArray[projectIndex].roadmap || [];
        
        const phaseToAdd = {
          id: `phase_${Date.now()}`,
          title: newPhase.title,
          description: newPhase.description,
          status: newPhase.status,
          category: newPhase.category,
          color: getPhaseColor(newPhase.category),
          estimatedHours: 40,
          priority: newPhase.priority,
          tasks: newPhase.tasks.filter((task: string) => task.trim() !== '').map((task: string, index: number) => ({
            id: `task_${Date.now()}_${index}`,
            title: task.trim(),
            description: '',
            completed: false,
            priority: newPhase.priority,
            estimatedTime: '4 hours'
          }))
        };

        // Update the roadmap for this project
        projectsArray[projectIndex].roadmap = [...currentRoadmap, phaseToAdd];
        
        // Save back to Firebase
        await set(clientProjectsRef, projectsArray);
        
        // Refresh the projects list
        await fetchProjects();
        
        return true;
      } else {
        setError('No projects found in database.');
        return false;
      }
    } catch (error) {
      console.error('Error adding phase:', error);
      setError('Failed to add phase. Please try again.');
      return false;
    }
  };

  const updatePhaseInProject = async (projectId: string, phaseIndex: number, updatedPhase: any) => {
    try {
      const clientProjectsRef = ref(database, 'clientProjects');
      const snapshot = await get(clientProjectsRef);
      
      if (snapshot.exists()) {
        const clientProjects = snapshot.val();
        let projectsArray: ClientProject[] = [];
        
        if (Array.isArray(clientProjects)) {
          projectsArray = clientProjects;
        } else {
          setError('Invalid project data structure.');
          return false;
        }
        
        // Find the project by ID
        const projectIndex = projectsArray.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
          setError('Project not found.');
          return false;
        }
        
        const currentRoadmap = projectsArray[projectIndex].roadmap || [];
        
        if (phaseIndex >= 0 && phaseIndex < currentRoadmap.length) {
          currentRoadmap[phaseIndex] = {
            ...currentRoadmap[phaseIndex],
            title: updatedPhase.title,
            description: updatedPhase.description,
            status: updatedPhase.status,
            category: updatedPhase.category,
            color: getPhaseColor(updatedPhase.category),
            priority: updatedPhase.priority,
            tasks: updatedPhase.tasks
          };

          // Update the roadmap for this project
          projectsArray[projectIndex].roadmap = currentRoadmap;
          
          // Save back to Firebase
          await set(clientProjectsRef, projectsArray);
          
          // Refresh the projects list
          await fetchProjects();
          
          return true;
        } else {
          setError('Invalid phase index.');
          return false;
        }
      } else {
        setError('No projects found in database.');
        return false;
      }
    } catch (error) {
      console.error('Error updating phase:', error);
      setError('Failed to update phase. Please try again.');
      return false;
    }
  };

  const deletePhaseFromProject = async (projectId: string, phaseIndex: number) => {
    try {
      const clientProjectsRef = ref(database, 'clientProjects');
      const snapshot = await get(clientProjectsRef);
      
      if (snapshot.exists()) {
        const clientProjects = snapshot.val();
        let projectsArray: ClientProject[] = [];
        
        if (Array.isArray(clientProjects)) {
          projectsArray = clientProjects;
        } else {
          setError('Invalid project data structure.');
          return false;
        }
        
        // Find the project by ID
        const projectIndex = projectsArray.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
          setError('Project not found.');
          return false;
        }
        
        const currentRoadmap = projectsArray[projectIndex].roadmap || [];
        
        if (phaseIndex >= 0 && phaseIndex < currentRoadmap.length) {
          const updatedRoadmap = currentRoadmap.filter((_: any, index: number) => index !== phaseIndex);
          
          // Update the roadmap for this project
          projectsArray[projectIndex].roadmap = updatedRoadmap;
          
          // Save back to Firebase
          await set(clientProjectsRef, projectsArray);
          
          // Refresh the projects list
          await fetchProjects();
          
          return true;
        } else {
          setError('Invalid phase index.');
          return false;
        }
      } else {
        setError('No projects found in database.');
        return false;
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
      setError('Failed to delete phase. Please try again.');
      return false;
    }
  };

  // Helper function to get phase color based on category
  const getPhaseColor = (category: string) => {
    const colors: { [key: string]: string } = {
      design: '#EC4899',
      development: '#10B981',
      testing: '#F59E0B',
      deployment: '#8B5CF6',
      planning: '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  // Form handlers
  const handleAddPhase = async () => {
    if (!selectedProject || !newPhaseForm.title.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsAddingPhase(true);
    setError(null);
    
    console.log('Adding phase to project:', selectedProject.id, newPhaseForm);

    try {
      const success = await addPhaseToProject(selectedProject.id, newPhaseForm);
      if (success) {
        console.log('Phase added successfully');
        setShowAddNodeModal(false);
        setNewPhaseForm({
          title: '',
          description: '',
          priority: 'medium',
          status: 'upcoming',
          category: 'development',
          tasks: ['']
        });
        // Update selectedProject with new data
        const updatedProject = projects.find(p => p.id === selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
          console.log('Updated selected project:', updatedProject);
        }
      }
    } catch (error) {
      console.error('Error in handleAddPhase:', error);
      setError('Failed to add phase. Please try again.');
    } finally {
      setIsAddingPhase(false);
    }
  };

  const handleUpdatePhase = async () => {
    if (!selectedProject || !editPhaseForm.title.trim() || editingPhaseIndex === -1) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsUpdatingPhase(true);
    setError(null);
    
    console.log('Updating phase:', editingPhaseIndex, editPhaseForm);

    try {
      const success = await updatePhaseInProject(selectedProject.id, editingPhaseIndex, editPhaseForm);
      if (success) {
        console.log('Phase updated successfully');
        setShowEditPhaseModal(false);
        setEditingPhase(null);
        setEditingPhaseIndex(-1);
        // Update selectedProject with new data
        const updatedProject = projects.find(p => p.id === selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
          console.log('Updated selected project:', updatedProject);
        }
      }
    } catch (error) {
      console.error('Error in handleUpdatePhase:', error);
      setError('Failed to update phase. Please try again.');
    } finally {
      setIsUpdatingPhase(false);
    }
  };

  const handleDeletePhase = async () => {
    if (!selectedProject || editingPhaseIndex === -1) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this phase? This action cannot be undone.')) {
      setIsDeletingPhase(true);
      setError(null);
      
      console.log('Deleting phase:', editingPhaseIndex);

      try {
        const success = await deletePhaseFromProject(selectedProject.id, editingPhaseIndex);
        if (success) {
          console.log('Phase deleted successfully');
          setShowEditPhaseModal(false);
          setEditingPhase(null);
          setEditingPhaseIndex(-1);
          // Update selectedProject with new data
          const updatedProject = projects.find(p => p.id === selectedProject.id);
          if (updatedProject) {
            setSelectedProject(updatedProject);
            console.log('Updated selected project:', updatedProject);
          }
        }
      } catch (error) {
        console.error('Error in handleDeletePhase:', error);
        setError('Failed to delete phase. Please try again.');
      } finally {
        setIsDeletingPhase(false);
      }
    }
  };

  const addTaskToNewPhase = () => {
    setNewPhaseForm(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const updateNewPhaseTask = (index: number, value: string) => {
    setNewPhaseForm(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  const removeNewPhaseTask = (index: number) => {
    setNewPhaseForm(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const addTaskToEditPhase = () => {
    setEditPhaseForm(prev => ({
      ...prev,
      tasks: [...prev.tasks, {
        id: `task_${Date.now()}`,
        title: '',
        completed: false
      }]
    }));
  };

  const updateEditPhaseTask = (index: number, field: 'title' | 'completed', value: string | boolean) => {
    setEditPhaseForm(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeEditPhaseTask = (index: number) => {
    setEditPhaseForm(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate project stats
  const projectStats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    planning: projects.filter(p => p.status === 'planning').length,
    totalValue: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    averageProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading client projects from Firebase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Failed to load projects from Firebase</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="ml-4"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Projects Management</h2>
          <p className="text-gray-400">Manage client dashboard project data directly in Firebase</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-gray-400">Firebase Realtime Database Control</span>
            {isRefreshing && (
              <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Projects Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projectStats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
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
                <p className="text-2xl font-bold text-green-400">{formatCurrency(projectStats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
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

      {/* Projects Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Client Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Project</th>
                  <th className="text-left py-3 px-4 text-gray-400">Client</th>
                  <th className="text-left py-3 px-4 text-gray-400">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-400">Budget</th>
                  <th className="text-left py-3 px-4 text-gray-400">Due Date</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{project.name}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{project.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{project.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-white text-xs">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{formatCurrency(project.budget || 0)}</td>
                    <td className="py-3 px-4 text-gray-300">{project.dueDate}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(project.status || 'planning')}>
                        {project.status || 'planning'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProject(project)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewProject(project)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredProjects.length === 0 && !loading && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
            <p className="text-gray-400 text-center mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your filters to see more results."
                : "No client projects are currently available. Create your first project to get started."
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Project Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Client:</span>
                      <span className="text-white ml-2">{selectedProject.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedProject.status === 'completed' ? 'bg-green-900 text-green-300' :
                        selectedProject.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {selectedProject.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Due Date:</span>
                      <span className="text-white ml-2">{selectedProject.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white ml-2">${selectedProject.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Progress Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {selectedProject.roadmap?.filter(item => item.status === 'completed').length || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {selectedProject.roadmap?.filter(item => item.status === 'in-progress').length || 0}
                    </div>
                    <div className="text-gray-400 text-sm">In Progress</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {selectedProject.roadmap?.filter(item => item.status === 'upcoming').length || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Upcoming</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleViewRoadmap(selectedProject);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Roadmap
                </Button>
                <Button
                  onClick={() => handleEditProject(selectedProject)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Modal */}
      {showRoadmapModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProject.name} - Interactive Roadmap</h2>
                  <p className="text-gray-400 mt-1">Visual timeline with node-based project phases</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setShowAddNodeModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Phase
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRoadmapModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedProject.roadmap?.filter(item => item.status === 'completed').length || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Completed</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedProject.roadmap?.filter(item => item.status === 'in-progress').length || 0}
                  </div>
                  <div className="text-gray-400 text-sm">In Progress</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedProject.roadmap?.filter(item => item.status === 'upcoming').length || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Upcoming</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(((selectedProject.roadmap?.filter(phase => phase.status === 'completed').length || 0) / (selectedProject.roadmap?.length || 1)) * 100)}%
                  </div>
                  <div className="text-gray-400 text-sm">Overall Progress</div>
                </div>
              </div>

              {/* Visual Roadmap with Nodes */}
              <div className="relative">
                {/* Background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Central timeline spine */}
                <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1">
                  <div className="w-1 h-full bg-gray-700/40 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-1 rounded-full overflow-hidden" 
                       style={{ height: `${Math.round(((selectedProject.roadmap?.filter(phase => phase.status === 'completed').length || 0) / (selectedProject.roadmap?.length || 1)) * 100)}%` }}>
                    <div className="w-full h-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600"></div>
                  </div>
                </div>

                {/* Roadmap Nodes */}
                <div className="relative space-y-8 py-8">
                  {selectedProject.roadmap?.map((phase, index) => {
                    const isLeft = index % 2 === 0;
                    const progress = phase.tasks ? Math.round((phase.tasks.filter(t => t.completed).length / phase.tasks.length) * 100) : 0;
                    
                    return (
                      <div key={index} className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'} items-center group`}>
                        {/* Phase connector */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                          <div className={`relative w-10 h-10 rounded-full border-4 border-white transition-all duration-300 flex items-center justify-center ${
                            phase.status === 'completed' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' :
                            phase.status === 'in-progress' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
                            'bg-gray-600 shadow-lg shadow-gray-600/30'
                          }`}>
                            {phase.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : phase.status === 'in-progress' ? (
                              <Clock className="w-5 h-5 text-white" />
                            ) : (
                              <Circle className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                            phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {phase.status === 'completed' ? 'Done' :
                             phase.status === 'in-progress' ? 'Active' : 'Pending'}
                          </div>
                        </div>

                        {/* Phase content card */}
                        <div className={`${isLeft ? 'mr-auto pr-8' : 'ml-auto pl-8'} w-full max-w-md`}>
                          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:bg-gray-800 hover:border-gray-600/50 hover:shadow-xl">
                            {/* Phase header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{phase.description}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  phase.priority === 'high' ? 'bg-red-900 text-red-300' :
                                  phase.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                  'bg-green-900 text-green-300'
                                }`}>
                                  {phase.priority?.toUpperCase() || 'MEDIUM'}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditPhase(phase, index)}
                                  className="text-gray-400 hover:text-white p-1"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            {phase.tasks && phase.tasks.length > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      phase.status === 'completed' ? 'bg-emerald-500' :
                                      phase.status === 'in-progress' ? 'bg-yellow-500' :
                                      'bg-gray-500'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Tasks preview */}
                            {phase.tasks && phase.tasks.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Tasks ({phase.tasks.filter(t => t.completed).length}/{phase.tasks.length})</h4>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {phase.tasks.slice(0, 3).map((task, taskIndex) => (
                                    <div key={taskIndex} className="flex items-center space-x-2 text-xs">
                                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                        task.completed ? 'bg-emerald-500' : 'bg-gray-600'
                                      }`}>
                                        {task.completed && <CheckCircle className="w-2 h-2 text-white" />}
                                      </div>
                                      <span className={`${task.completed ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                                        {task.title}
                                      </span>
                                    </div>
                                  ))}
                                  {phase.tasks.length > 3 && (
                                    <div className="text-xs text-gray-500 ml-5">
                                      +{phase.tasks.length - 3} more tasks
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Category badge */}
                            <div className="mt-4 pt-4 border-t border-gray-700/50">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                                {phase.category || 'General'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  {selectedProject.roadmap?.length || 0} phases • {selectedProject.roadmap?.reduce((total, phase) => total + (phase.tasks?.length || 0), 0) || 0} total tasks
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowRoadmapModal(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRoadmapModal(false);
                      handleEditProject(selectedProject);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add New Phase</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddNodeModal(false);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddPhase(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phase Title *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Frontend Development"
                    value={newPhaseForm.title}
                    onChange={(e) => setNewPhaseForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what this phase involves..."
                    value={newPhaseForm.description}
                    onChange={(e) => setNewPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select 
                      value={newPhaseForm.priority}
                      onChange={(e) => setNewPhaseForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select 
                      value={newPhaseForm.status}
                      onChange={(e) => setNewPhaseForm(prev => ({ ...prev, status: e.target.value as 'completed' | 'in-progress' | 'upcoming' }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select 
                    value={newPhaseForm.category}
                    onChange={(e) => setNewPhaseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="deployment">Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tasks</label>
                  <div className="space-y-2">
                    {newPhaseForm.tasks.map((task, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder={`Task ${index + 1}`}
                          value={task}
                          onChange={(e) => updateNewPhaseTask(index, e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white flex-1"
                        />
                        {newPhaseForm.tasks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNewPhaseTask(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTaskToNewPhase}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddNodeModal(false);
                      setNewPhaseForm({
                        title: '',
                        description: '',
                        priority: 'medium',
                        status: 'upcoming',
                        category: 'development',
                        tasks: ['']
                      });
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newPhaseForm.title.trim() || isAddingPhase}
                  >
                    {isAddingPhase ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Phase
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Phase Modal */}
      {showEditPhaseModal && editingPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Phase: {editingPhase.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditPhaseModal(false);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdatePhase(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phase Title *</label>
                  <Input
                    type="text"
                    value={editPhaseForm.title}
                    onChange={(e) => setEditPhaseForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={editPhaseForm.description}
                    onChange={(e) => setEditPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select 
                      value={editPhaseForm.priority}
                      onChange={(e) => setEditPhaseForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select 
                      value={editPhaseForm.status}
                      onChange={(e) => setEditPhaseForm(prev => ({ ...prev, status: e.target.value as 'completed' | 'in-progress' | 'upcoming' }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select 
                    value={editPhaseForm.category}
                    onChange={(e) => setEditPhaseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="deployment">Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tasks</label>
                  <div className="space-y-2">
                    {editPhaseForm.tasks?.map((task, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => updateEditPhaseTask(index, 'completed', e.target.checked)}
                          className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <Input
                          type="text"
                          value={task.title}
                          onChange={(e) => updateEditPhaseTask(index, 'title', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEditPhaseTask(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTaskToEditPhase}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditPhaseModal(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeletePhase}
                    disabled={isDeletingPhase || isUpdatingPhase}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeletingPhase ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Phase
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!editPhaseForm.title.trim() || isUpdatingPhase || isDeletingPhase}
                  >
                    {isUpdatingPhase ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Project Modals */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {showCreateModal ? 'Create New Project' : 'Edit Project'}
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingProject({});
                  resetProjectForm();
                }}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <Input
                  value={projectForm.name || ''}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
                  rows={3}
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Email</label>
                <Input
                  type="email"
                  value={projectForm.email || ''}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="client@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget ($)</label>
                  <Input
                    type="number"
                    value={projectForm.budget || 0}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={projectForm.dueDate || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={projectForm.progress || 0}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Next Milestone</label>
                  <Input
                    value={projectForm.nextMilestone || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, nextMilestone: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Next milestone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
                <Input
                  value={(projectForm.technologies || []).join(', ')}
                  onChange={(e) => handleTechnologiesChange(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={showCreateModal ? handleCreateProject : handleUpdateProject} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateModal ? 'Create Project' : 'Update Project'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingProject({});
                    resetProjectForm();
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
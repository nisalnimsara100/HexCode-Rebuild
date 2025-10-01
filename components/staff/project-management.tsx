"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  assignedTeam: string[];
  client: string;
  category: string;
  tasks: number;
  completedTasks: number;
}

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    endDate: "",
    budget: 0,
    client: "",
    category: "",
    assignedTeam: [],
  });

  const categories = [
    "Web Development",
    "Mobile App",
    "E-commerce",
    "Marketing",
    "Consulting",
    "Maintenance",
  ];

  const teamMembers = [
    "John Smith",
    "Sarah Johnson", 
    "Mike Davis",
    "Emily Chen",
    "Alex Rodriguez",
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedStatus, selectedPriority]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockProjects: Project[] = [
        {
          id: "1",
          name: "E-commerce Platform v2.0",
          description: "Complete redesign of the e-commerce platform with new features",
          status: "in-progress",
          priority: "high",
          startDate: "2024-01-15",
          endDate: "2024-06-30",
          budget: 50000,
          progress: 65,
          assignedTeam: ["John Smith", "Sarah Johnson", "Mike Davis"],
          client: "ABC Corp",
          category: "Web Development",
          tasks: 45,
          completedTasks: 29,
        },
        {
          id: "2",
          name: "Mobile Banking App",
          description: "Secure mobile banking application with biometric authentication",
          status: "planning",
          priority: "critical",
          startDate: "2024-03-01",
          endDate: "2024-09-15",
          budget: 75000,
          progress: 15,
          assignedTeam: ["Emily Chen", "Alex Rodriguez"],
          client: "XYZ Bank",
          category: "Mobile App",
          tasks: 60,
          completedTasks: 9,
        },
        {
          id: "3",
          name: "Marketing Website",
          description: "Company marketing website with CMS integration",
          status: "completed",
          priority: "medium",
          startDate: "2023-11-01",
          endDate: "2024-01-31",
          budget: 15000,
          progress: 100,
          assignedTeam: ["Sarah Johnson"],
          client: "DEF Inc",
          category: "Marketing",
          tasks: 20,
          completedTasks: 20,
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((project) => project.status === selectedStatus);
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((project) => project.priority === selectedPriority);
    }

    setFilteredProjects(filtered);
  };

  const handleAddProject = async () => {
    if (!newProject.name || !newProject.client || !newProject.startDate) {
      alert("Please fill in required fields");
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name!,
      description: newProject.description || "",
      status: (newProject.status as Project["status"]) || "planning",
      priority: (newProject.priority as Project["priority"]) || "medium",
      startDate: newProject.startDate!,
      endDate: newProject.endDate || "",
      budget: newProject.budget || 0,
      progress: 0,
      assignedTeam: newProject.assignedTeam || [],
      client: newProject.client!,
      category: newProject.category || "",
      tasks: 0,
      completedTasks: 0,
    };

    // In real implementation, save to Firebase
    setProjects([...projects, project]);
    setIsAddModalOpen(false);
    resetNewProject();
  };

  const resetNewProject = () => {
    setNewProject({
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: "",
      endDate: "",
      budget: 0,
      client: "",
      category: "",
      assignedTeam: [],
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      // In real implementation, delete from Firebase
      setProjects(projects.filter((proj) => proj.id !== id));
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "on-hold":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Project Management
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Track and manage all your projects in one place.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Projects</p>
                <p className="text-2xl font-semibold text-white">{projects.length}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-white">
                  {projects.filter((p) => p.status === "in-progress").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-white">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">High Priority</p>
                <p className="text-2xl font-semibold text-white">
                  {projects.filter((p) => p.priority === "high" || p.priority === "critical").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Status and Priority */}
              <div className="flex items-center space-x-2 mb-4">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </Badge>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-white">{project.progress}%</span>
                </div>
                <Progress
                  value={project.progress}
                  className="h-2"
                />
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Duration
                  </span>
                  <span className="text-white">
                    {new Date(project.startDate).toLocaleDateString()} - {" "}
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "TBD"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Budget
                  </span>
                  <span className="text-white">${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Tasks
                  </span>
                  <span className="text-white">{project.completedTasks}/{project.tasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Client</span>
                  <span className="text-white">{project.client}</span>
                </div>
              </div>

              {/* Team */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Team ({project.assignedTeam.length})</p>
                <div className="flex -space-x-2">
                  {project.assignedTeam.slice(0, 3).map((member, index) => (
                    <div
                      key={member}
                      className="h-8 w-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-white"
                      title={member}
                    >
                      {member.split(" ").map(n => n[0]).join("")}
                    </div>
                  ))}
                  {project.assignedTeam.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-white">
                      +{project.assignedTeam.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setEditingProject(project)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-950"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Project Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-gray-700 border-gray-600"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newProject.category}
                onValueChange={(value) => setNewProject({ ...newProject, category: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newProject.priority}
                onValueChange={(value) => setNewProject({ ...newProject, priority: value as Project["priority"] })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newProject.status}
                onValueChange={(value) => setNewProject({ ...newProject, status: value as Project["status"] })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject} className="bg-emerald-600 hover:bg-emerald-700">
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
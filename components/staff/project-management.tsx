"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/auth-context";
import {
  FolderOpen,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  CheckSquare, // Added import
  Edit3,
  Eye,
} from "lucide-react";

interface Task {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  projectId: string
  priority: string
  dueDate: string
  assignedTo: string | string[]
  estimatedHours?: string | number
}



interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "researching" | "in-progress" | "review" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  endDate: string;
  budget: string | number;
  progress: number;
  team: string[]; // List of UIDs
  clientName: string;
}

interface TeamMember {
  uid: string;
  name: string;
  avatar?: string;
}

export function ProjectManagement() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, TeamMember>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ status: "", progress: 0 });

  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Firebase
  useEffect(() => {
    setLoading(true);

    // 1. Fetch Staff Details
    const usersRef = ref(database, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const map: Record<string, TeamMember> = {};
        Object.entries(usersData).forEach(([uid, data]: [string, any]) => {
          map[uid] = {
            uid,
            name: data.name || "Unknown",
            avatar: data.profilePicture
          };
        });
        setStaffMap(map);
      }
    });

    // 2. Fetch Projects
    const projectsRef = ref(database, 'staffdashboard/projects');
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectList: Project[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          title: val.title || "Untitled Project",
          description: val.description || "",
          status: val.status || "planning",
          priority: val.priority || "medium",
          startDate: val.startDate || "",
          endDate: val.endDate || "",
          budget: val.budget || 0,
          progress: Number(val.progress) || 0,
          team: val.team || [],
          clientName: val.clientName || "Internal"
        }));

        // Sort by priority logic
        const priorityOrder: { [key: string]: number } = { critical: 0, high: 1, medium: 2, low: 3 };
        projectList.sort((a, b) => {
          const pA = priorityOrder[a.priority?.toLowerCase()] ?? 4;
          const pB = priorityOrder[b.priority?.toLowerCase()] ?? 4;
          return pA - pB;
        });

        setProjects(projectList);
      } else {
        setProjects([]);
      }
      setLoading(false);
    });

    // 3. Fetch Tasks
    const tasksRef = ref(database, 'staffdashboard/tasks');
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const taskList: Task[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        }));
        setAllTasks(taskList);
      } else {
        setAllTasks([]);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeProjects();
      unsubscribeTasks();
    };
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerTerm) ||
          project.clientName.toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((project) => project.status === selectedStatus);
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((project) => project.priority === selectedPriority);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedStatus, selectedPriority]);

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      status: project.status,
      progress: project.progress
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      await update(ref(database, `staffdashboard/projects/${editingProject.id}`), {
        status: editForm.status,
        progress: Number(editForm.progress)
      });

      toast({ title: "Updated", description: "Project status updated successfully." });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to update project.", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "researching": return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "in-progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "review": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/50";
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "on-hold": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100/10 text-gray-400 border-gray-700";
      case "medium": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-gray-100/10 text-gray-400 border-gray-700";
    }
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
    <div className="space-y-8 p-6 lg:p-0">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            My Projects
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            View assigned projects and update your progress.
          </p>
        </div>
        {/* Removed 'New Project' button as requested */}
      </div>

      {/* Stats - Kept existing layout/design */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
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
        <Card className="bg-gray-900 border-gray-800">
          <div className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-white">
                  {projects.filter((p) => p.status === "in-progress" || p.status === "researching").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
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
        <Card className="bg-gray-900 border-gray-800">
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
      <Card className="bg-gray-900 border-gray-800">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-emerald-500"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="researching">Researching</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">{project.description}</p>
                </div>
                {/* Actions Menu removed, handled by buttons below */}
              </div>

              {/* Status and Priority */}
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="outline" className={`${getStatusColor(project.status)} uppercase text-[10px] tracking-wider px-2 py-0.5 border`}>
                  {project.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className={`${getPriorityColor(project.priority)} uppercase text-[10px] tracking-wider px-2 py-0.5 border`}>
                  {project.priority}
                </Badge>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 font-medium">Progress</span>
                  <span className="text-sm font-bold text-white">{project.progress}%</span>
                </div>
                <Progress
                  value={project.progress}
                  className="h-1.5 bg-gray-800"
                  indicatorClassName={project.progress === 100 ? "bg-emerald-500" : "bg-white"}
                />
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6 bg-gray-800/30 p-3 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Duration
                  </span>
                  <span className="text-gray-300 text-xs">
                    {project.startDate} - {project.endDate || 'TBD'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5" />
                    Budget
                  </span>
                  <span className="text-gray-300 font-medium">LKR {String(project.budget).replace(/[^0-9,.]/g, '')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Target className="h-3.5 w-3.5" />
                    Client
                  </span>
                  <span className="text-gray-300">{project.clientName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <CheckSquare className="h-3.5 w-3.5" />
                    Tasks
                  </span>
                  <span className="text-gray-300 font-mono">
                    {allTasks.filter(t => t.projectId === project.id && t.status === 'completed' && (Array.isArray(t.assignedTo) ? t.assignedTo.includes(userProfile?.uid || '') : t.assignedTo === userProfile?.uid)).length} / {allTasks.filter(t => t.projectId === project.id && (Array.isArray(t.assignedTo) ? t.assignedTo.includes(userProfile?.uid || '') : t.assignedTo === userProfile?.uid)).length}
                  </span>
                </div>
              </div>

              {/* Team */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">Assigned Team</p>
                <div className="flex -space-x-2">
                  {project.team && project.team.length > 0 ? (
                    project.team.slice(0, 4).map((uid) => {
                      const member = staffMap[uid];
                      return (
                        <div
                          key={uid}
                          className="h-8 w-8 rounded-full ring-2 ring-gray-900 bg-gray-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden"
                          title={member?.name || "Unknown"}
                        >
                          {member?.avatar ? <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" /> : member?.name?.charAt(0)}
                        </div>
                      )
                    })
                  ) : (
                    <span className="text-gray-500 text-xs italic">No team assigned</span>
                  )}
                  {project.team && project.team.length > 4 && (
                    <div className="h-8 w-8 rounded-full ring-2 ring-gray-900 bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-400">
                      +{project.team.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  onClick={() => setViewProject(project)}
                >
                  <Eye className="h-4 w-4 mr-2 text-gray-400" />
                  View
                </Button>
                <Button
                  size="icon"
                  className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  onClick={() => openEditModal(project)}
                >
                  <Edit3 className="h-4 w-4 text-emerald-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Status/Progress Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(val) => setEditForm(prev => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="researching">Researching</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Completion Percentage</Label>
                <span className="text-sm font-bold text-emerald-500">{editForm.progress}%</span>
              </div>
              <Input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editForm.progress}
                onChange={(e) => setEditForm(prev => ({ ...prev, progress: Number(e.target.value) }))}
                className="accent-emerald-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProject} className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewProject} onOpenChange={(open) => !open && setViewProject(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px] max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="mb-2 shrink-0">
            <DialogTitle className="text-xl flex items-center justify-between">
              {viewProject?.title}
              <Badge className={viewProject ? getStatusColor(viewProject.status) : ''}>{viewProject?.status}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-4 bg-gray-800 rounded-lg text-gray-300 text-sm leading-relaxed">
              {viewProject?.description}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <span className="text-xs text-gray-500 block mb-1">Start Date</span>
                <span>{viewProject?.startDate}</span>
              </div>
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <span className="text-xs text-gray-500 block mb-1">End Date</span>
                <span>{viewProject?.endDate || 'Dec 31, 2024'}</span>
              </div>
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <span className="text-xs text-gray-500 block mb-1">Budget</span>
                <span className="text-green-400 font-mono">LKR {String(viewProject?.budget).replace(/[^0-9,.]/g, '')}</span>
              </div>
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <span className="text-xs text-gray-500 block mb-1">Client</span>
                <span>{viewProject?.clientName}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-gray-400 uppercase tracking-wider font-bold">Assigned Team</span>
              <div className="flex gap-2 flex-wrap">
                {viewProject?.team?.map(uid => (
                  <div key={uid} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-900/50 flex items-center justify-center text-[10px] text-emerald-400 border border-emerald-900">
                      {staffMap[uid]?.name?.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-300">{staffMap[uid]?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-3 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">My Project Tasks</h4>
                <span className="text-xs text-emerald-500 font-mono">
                  {allTasks.filter(t => t.projectId === viewProject?.id && t.status === 'completed' && (Array.isArray(t.assignedTo) ? t.assignedTo.includes(userProfile?.uid || '') : t.assignedTo === userProfile?.uid)).length} / {allTasks.filter(t => t.projectId === viewProject?.id && (Array.isArray(t.assignedTo) ? t.assignedTo.includes(userProfile?.uid || '') : t.assignedTo === userProfile?.uid)).length} Completed
                </span>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {allTasks.filter(t => t.projectId === viewProject?.id && (Array.isArray(t.assignedTo) ? t.assignedTo.includes(userProfile?.uid || '') : t.assignedTo === userProfile?.uid)).length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-4 text-center border border-dashed border-gray-800 rounded">No tasks assigned to you in this project.</p>
                ) : (
                  allTasks.filter(t => t.projectId === viewProject?.id && (Array.isArray(t.assignedTo) ? t.assignedTo.includes(userProfile?.uid || '') : t.assignedTo === userProfile?.uid)).map(task => {
                    const daysLeft = task.dueDate ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
                    const isOverdue = daysLeft !== null && daysLeft < 0;

                    return (
                      <div key={task.id} className={`group flex flex-col gap-3 bg-gray-950/50 p-4 rounded-lg border ${task.status === 'completed' ? 'border-gray-800 bg-gray-900/30' : 'border-gray-800 hover:border-gray-700'} transition-all`}>
                        <div className="flex items-start gap-4">
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={task.status === 'completed'}
                              onChange={async (e) => {
                                const newStatus = e.target.checked ? 'completed' : 'pending';
                                await update(ref(database, `staffdashboard/tasks/${task.id}`), {
                                  status: newStatus
                                });
                                toast({
                                  title: newStatus === 'completed' ? "Task Completed" : "Task Reopened",
                                  description: `Marked "${task.title}" as ${newStatus}`
                                });
                              }}
                              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900 cursor-pointer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className={`text-base font-medium truncate pr-4 ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                {task.title}
                              </p>
                              <Badge variant="outline" className={`shrink-0 text-[10px] py-0 border-gray-700 capitalize ${task.status === 'completed' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {task.priority || 'Normal'}
                              </Badge>
                            </div>

                            {/* Task Meta Details */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3 text-xs text-gray-400">
                              {task.dueDate && (
                                <div className={`flex items-center gap-2 ${isOverdue && task.status !== 'completed' ? 'text-red-400' : ''}`}>
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Due: {task.dueDate}</span>
                                </div>
                              )}

                              {daysLeft !== null && task.status !== 'completed' && (
                                <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400 font-bold' : daysLeft <= 2 ? 'text-orange-400' : 'text-emerald-400'}`}>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}</span>
                                </div>
                              )}

                              {/* Placeholder for Estimate if exist on Task object */}
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Est: {task.estimatedHours || 0}h</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  {(Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]).slice(0, 3).map((uid, i) => (
                                    <div key={uid || i} className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-300 border border-gray-800">
                                      {staffMap[uid]?.name?.charAt(0) || '?'}
                                    </div>
                                  ))}
                                </div>
                                <span className="truncate max-w-[100px] text-xs">
                                  {(Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]).map(uid => staffMap[uid]?.name || 'Unassigned').join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
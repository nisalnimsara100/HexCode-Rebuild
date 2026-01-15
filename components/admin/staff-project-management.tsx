"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, push, update, remove, onValue } from "firebase/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  MoreVertical,
  Calendar,
  DollarSign,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Users,
  Briefcase,
  Target,
  Trash2,
  Edit2,
  X
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// --- Types ---
interface TeamMember {
  uid: string;
  name: string;
  role: string;
  avatar?: string;
}

interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface StaffProject {
  id: string;
  title: string;
  description: string;
  status: "planning" | "researching" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
  clientName: string;
  team: string[]; // Array of User UIDs
  tasks: Record<string, ProjectTask>; // Firebase object
}

// --- Component ---
export function StaffProjectManagement() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<StaffProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<{ id: string, name: string, members: string[] }[]>([]);
  const [hideBudget, setHideBudget] = useState(false); // New State

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<StaffProject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewProject, setViewProject] = useState<StaffProject | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<StaffProject>>({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    progress: 0,
    startDate: "",
    endDate: "",
    budget: "",
    clientName: "",
    team: [],
  });

  // Fetch Projects & Staff
  useEffect(() => {
    // 0. Fetch Settings
    const settingsRef = ref(database, 'settings/staffSystem/hideBudget');
    onValue(settingsRef, (snapshot) => {
      setHideBudget(snapshot.exists() ? snapshot.val() : false);
    });

    // 1. Fetch Staff List for assignment
    const usersRef = ref(database, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const staff: TeamMember[] = Object.entries(usersData)
          .map(([uid, data]: [string, any]) => ({
            uid,
            name: data.name || "Unknown",
            role: data.role || "staff",
            avatar: data.profilePicture || ""
          }))
          // Filter out clients, admins, and unknown users
          .filter(u => u.role !== 'client' && u.role !== 'admin' && u.name !== 'Unknown');
        setStaffList(staff);
      }
    });

    // 2. Fetch Projects
    const projectsRef = ref(database, 'staffdashboard/projects');
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
          team: val.team || []
        }));

        // Sort by priority
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

    // 3. Fetch Teams
    const teamsRef = ref(database, 'teams');
    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      if (snapshot.exists()) {
        const teamsData = snapshot.val();
        const teamsList = Object.entries(teamsData).map(([id, val]: [string, any]) => ({
          id,
          name: val.name,
          members: val.members || []
        }));
        setTeams(teamsList);
      } else {
        setTeams([]);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeProjects();
      unsubscribeTeams();
    };
  }, []);

  // --- Handlers ---

  const handleOpenModal = (project?: StaffProject) => {
    if (project) {
      setEditingProject(project);
      setFormData({ ...project });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        status: "planning",
        priority: "medium",
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        budget: "",
        clientName: "",
        team: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProject = async () => {
    try {
      if (!formData.title) return toast({ title: "Error", description: "Title is required", variant: "destructive" });

      const projectData = {
        title: formData.title,
        description: formData.description || "",
        status: formData.status,
        priority: formData.priority,
        progress: Number(formData.progress) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        clientName: formData.clientName,
        team: formData.team || [],
        updatedAt: new Date().toISOString(),
      };

      if (editingProject) {
        // Update
        await update(ref(database, `staffdashboard/projects/${editingProject.id}`), projectData);
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        // Create
        await push(ref(database, 'staffdashboard/projects'), {
          ...projectData,
          createdAt: new Date().toISOString(),
          tasks: {} // Init empty tasks
        });
        toast({ title: "Success", description: "New project created" });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    }
  };

  const handleDeleteProject = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(ref(database, `staffdashboard/projects/${deleteId}`));
      toast({ title: "Deleted", description: "Project removed successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleTeamMember = (uid: string) => {
    setFormData(prev => {
      const currentTeam = prev.team || [];
      if (currentTeam.includes(uid)) {
        return { ...prev, team: currentTeam.filter(id => id !== uid) };
      } else {
        return { ...prev, team: [...currentTeam, uid] };
      }
    });
  };

  // --- Render Helpers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'researching': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'on-hold': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <div className="text-white p-8">Loading Projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Staff Project Management</h2>
          <p className="text-gray-400 mt-1">Manage and assign projects to your development team.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-[#1a1f2e] border-gray-800 text-white flex flex-col hover:border-orange-500/30 transition-all duration-300 shadow-xl">
            <CardHeader className="pb-3 relative">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-xl leading-none">{project.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 min-h-[2.5em]">{project.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white absolute top-4 right-4" onClick={() => handleOpenModal(project)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className={`${getStatusColor(project.status)} border capitalize px-2.5 py-0.5`}>
                  {project.status}
                </Badge>
                <Badge className={`${getPriorityColor(project.priority)} capitalize px-2.5 py-0.5 border-0`}>
                  {project.priority}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-5 pb-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2 bg-gray-700" indicatorClassName="bg-orange-500" />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-xs">{project.startDate || 'TBD'} - {project.endDate || 'TBD'}</span>
                </div>
                {!hideBudget && (
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs font-bold text-green-500">LKR</span>
                    <span className="text-white font-medium">
                      {project.budget ? project.budget.replace(/[^0-9,.]/g, '') : '0'}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 col-span-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>Client: <span className="text-gray-300">{project.clientName || 'Internal'}</span></span>
                </div>
              </div>

              {/* Team Avatars */}
              {project.team && project.team.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Team ({project.team.length})</p>
                  <div className="flex -space-x-2 overflow-hidden">
                    {project.team.map(uid => {
                      const user = staffList.find(u => u.uid === uid);
                      return (
                        <div key={uid} title={user?.name} className="inline-block h-8 w-8 rounded-full ring-2 ring-[#1a1f2e] bg-gray-700 flex items-center justify-center text-xs font-bold relative">
                          {user?.avatar ? (
                            <img src={user.avatar} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <span className="text-gray-300">{user?.name?.charAt(0) || '?'}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-2 border-t border-gray-800 flex gap-2">
              <Button
                className="flex-1 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300"
                onClick={() => setViewProject(project)}
              >
                <Target className="w-4 h-4 mr-2" /> View Details
              </Button>
              <Button
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Project Title</Label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g. E-commerce Platform v2.0"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Brief overview..."
                />
              </div>

              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              {!hideBudget && (
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                    placeholder="$5,000"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: any) => setFormData({ ...formData, priority: v })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status and Progress removed as per requirement */}

              <div className="col-span-2 space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Assign Team or Members</Label>
                  <Select onValueChange={(teamId) => {
                    const team = teams.find(t => t.id === teamId);
                    if (team) {
                      setFormData(prev => ({
                        ...prev,
                        team: Array.from(new Set([...(prev.team || []), ...team.members]))
                      }));
                      toast({ title: "Team Members Added", description: `Added members from ${team.name}` });
                    }
                  }}>
                    <SelectTrigger className="w-[180px] h-8 bg-gray-800 border-gray-700 text-xs text-gray-300">
                      <SelectValue placeholder="Add Team..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {teams.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-2 bg-gray-800 rounded border border-gray-700">
                  {staffList.map(user => {
                    // Calculate workload
                    const activeProjects = projects.filter(p =>
                      p.team?.includes(user.uid) &&
                      p.status !== 'completed' &&
                      p.id !== editingProject?.id // Don't count current project if editing
                    );

                    const isBusy = activeProjects.length > 0;

                    return (
                      <div
                        key={user.uid}
                        className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors border ${formData.team?.includes(user.uid)
                          ? 'bg-orange-600/20 border-orange-500/50'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
                          }`}
                        onClick={() => toggleTeamMember(user.uid)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${formData.team?.includes(user.uid)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-500'
                            }`}>
                            {formData.team?.includes(user.uid) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{user.name}</span>
                            <span className="text-xs text-gray-400 capitalize">{user.role}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {isBusy ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="text-xs text-right cursor-pointer group">
                                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 group-hover:bg-blue-500/30 transition-colors mb-1">
                                    {activeProjects.length} Active Project{activeProjects.length !== 1 ? 's' : ''}
                                  </Badge>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent side="left" className="w-72 bg-gray-900 border-gray-700 text-white p-3 shadow-xl z-[9999]">
                                <h4 className="font-semibold text-sm mb-2 text-gray-300 border-b border-gray-700 pb-1">Current Workload</h4>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                                  {activeProjects.map(p => (
                                    <div key={p.id} className="space-y-1">
                                      <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-white line-clamp-1">{p.title}</span>
                                        <span className="text-[10px] text-gray-400 bg-gray-800 px-1 rounded">{p.progress}%</span>
                                      </div>
                                      <Progress value={p.progress} className="h-1 bg-gray-800" indicatorClassName="bg-blue-500" />
                                      {p.team && p.team.length > 1 && (
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                          <Users className="w-3 h-3" /> In a team of {p.team.length}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Badge variant="outline" className="text-xs text-green-400 border-green-500/30 bg-green-500/10">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleSaveProject} className="bg-orange-600 hover:bg-orange-700 text-white">
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the project from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">Delete Project</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Project Details Modal */}
      <Dialog open={!!viewProject} onOpenChange={(open) => !open && setViewProject(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between pr-8">
              {viewProject?.title}
              <div className="flex gap-2 text-sm font-normal">
                <Badge variant="outline" className={`${viewProject && getStatusColor(viewProject.status)} border capitalize px-2.5 py-0.5`}>
                  {viewProject?.status}
                </Badge>
                <Badge className={`${viewProject && getPriorityColor(viewProject.priority)} capitalize px-2.5 py-0.5 border-0`}>
                  {viewProject?.priority}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Main Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Description</h4>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {viewProject?.description || "No description provided."}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/30">
                <p className="text-xs text-gray-500 mb-1">Client</p>
                <p className="font-medium text-white truncate" title={viewProject?.clientName}>{viewProject?.clientName || "Internal"}</p>
              </div>
              {!hideBudget && (
                <div className="p-3 bg-gray-800/30 rounded border border-gray-700/30">
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="font-medium text-green-400">{viewProject?.budget || "N/A"}</p>
                </div>
              )}
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/30">
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-white">{viewProject?.startDate || "TBD"}</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/30">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-medium text-white">{viewProject?.endDate || "TBD"}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completion</span>
                <span className="text-white font-medium">{viewProject?.progress || 0}%</span>
              </div>
              <Progress value={viewProject?.progress} className="h-2 bg-gray-700" indicatorClassName="bg-orange-500" />
            </div>

            {/* Assigned Team */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" /> Assigned Team ({viewProject?.team?.length || 0})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {viewProject?.team && viewProject.team.map(uid => {
                  const user = staffList.find(u => u.uid === uid);
                  return (
                    <div key={uid} className="flex items-center gap-3 p-2 bg-gray-800 rounded border border-gray-700">
                      <Avatar className="h-8 w-8 border border-gray-600">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-gray-700 text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role || "Staff"}</p>
                      </div>
                    </div>
                  )
                })}
                {(!viewProject?.team || viewProject.team.length === 0) && (
                  <p className="text-gray-500 text-sm italic col-span-2">No team members assigned yet.</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

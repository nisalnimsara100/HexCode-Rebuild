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
import { useAuth } from "@/components/auth/auth-context";
import { database } from "@/lib/firebase";
import { ref, onValue, push, update, remove } from "firebase/database";
import { useToast } from "@/components/ui/use-toast";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  TrendingUp,
  Users,
  MoreVertical,
  Briefcase
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  assignedTo: string | string[]; // UID or array of UIDs
  assignedBy: string; // UID
  projectId: string; // Project ID
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  progress: number;
  tags: string[];
}

interface TeamMember {
  uid: string;
  name: string;
  role: string;
  status: "available" | "busy" | "on_leave";
  avatar?: string;
}

interface Project {
  id: string;
  title: string;
}

export function AssignmentSystem() {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    status: "pending",
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    estimatedHours: 0,
    progress: 0,
    tags: [],
  });

  // Progress Update State
  const [progressUpdateValue, setProgressUpdateValue] = useState(0);

  // Fetch Data
  useEffect(() => {
    setLoading(true);

    // 1. Fetch Users (Team Members)
    const usersRef = ref(database, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const members: TeamMember[] = Object.entries(data).map(([uid, val]: [string, any]) => ({
          uid,
          name: val.name || "Unknown",
          role: val.role || "Staff",
          status: val.status || "available", // Assuming status exists or defaulting
          avatar: val.profilePicture
        }));
        setTeamMembers(members);
      }
    });

    // 2. Fetch Projects
    const projectsRef = ref(database, 'staffdashboard/projects');
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projList: Project[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          title: val.title || "Untitled"
        }));
        setProjects(projList);
      }
    });

    // 3. Fetch Tasks
    const tasksRef = ref(database, 'staffdashboard/tasks');
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const taskList: Assignment[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        }));
        setAssignments(taskList);
      } else {
        setAssignments([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeProjects();
      unsubscribeTasks();
    };
  }, []);

  // Filter Logic
  useEffect(() => {
    if (!userProfile) return;

    let filtered = assignments;

    // Visibility Rule: Admin sees all, Staff sees only assigned to them
    if (userProfile.role !== "admin") {
      filtered = filtered.filter(a => a.assignedTo === userProfile.uid);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.description.toLowerCase().includes(lower)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((a) => a.status === selectedStatus);
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, selectedStatus, userProfile]);

  const handleAddAssignment = async () => {
    if (!newAssignment.title || !newAssignment.assignedTo || !newAssignment.dueDate) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    try {
      const tasksRef = ref(database, 'staffdashboard/tasks');
      await push(tasksRef, {
        ...newAssignment,
        assignedBy: userProfile?.uid || "system",
        createdAt: new Date().toISOString(),
      });
      toast({ title: "Success", description: "Assignment created successfully." });
      setIsAddModalOpen(false);
      resetNewAssignment();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create assignment.", variant: "destructive" });
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (userProfile?.role !== "admin") {
      toast({ title: "Access Denied", description: "Only admins can delete assignments.", variant: "destructive" });
      return;
    }

    if (confirm("Are you sure you want to delete this assignment permanently?")) {
      try {
        await remove(ref(database, `staffdashboard/tasks/${id}`));
        toast({ title: "Deleted", description: "Assignment removed successfully." });
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete assignment.", variant: "destructive" });
      }
    }
  };

  const handleReassign = async (newUid: string) => {
    if (!selectedAssignment) return;
    try {
      await update(ref(database, `staffdashboard/tasks/${selectedAssignment.id}`), {
        assignedTo: newUid
      });
      toast({ title: "Reassigned", description: `Task reassigned to ${teamMembers.find(m => m.uid === newUid)?.name}` });
      setIsReassignOpen(false);
      setSelectedAssignment(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to reassign task.", variant: "destructive" });
    }
  };

  const handleUpdateProgress = async () => {
    if (!selectedAssignment) return;
    try {
      let newStatus = selectedAssignment.status;
      if (progressUpdateValue === 100) newStatus = "completed";
      else if (progressUpdateValue > 0 && newStatus === "pending") newStatus = "in-progress";

      await update(ref(database, `staffdashboard/tasks/${selectedAssignment.id}`), {
        progress: progressUpdateValue,
        status: newStatus
      });
      toast({ title: "Updated", description: "Progress updated successfully." });
      setIsUpdateProgressOpen(false);
      setSelectedAssignment(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update progress.", variant: "destructive" });
    }
  };

  const resetNewAssignment = () => {
    setNewAssignment({
      title: "",
      description: "",
      assignedTo: "",
      projectId: "",
      status: "pending",
      priority: "medium",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      estimatedHours: 0,
      progress: 0,
      tags: [],
    });
  };

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending": return "bg-gray-100/10 text-gray-400 border-gray-700";
      case "in-progress": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  const getPriorityColor = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "critical": return "text-red-400";
      case "high": return "text-orange-400";
      case "medium": return "text-blue-400";
      case "low": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading system...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Active Assignments</h2>
          <p className="text-sm text-gray-400">Manage tasks and track team progress</p>
        </div>
        {userProfile?.role === "admin" && (
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        )}
      </div>

      {/* Team Availability Section (Restored) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Users className="w-5 h-5 mr-2 text-emerald-500" />
          Team Availability
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teamMembers.map(member => (
            <Card key={member.uid} className="bg-gray-900 border-gray-800 p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                    {member.avatar ? <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" /> : member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className={`text-xs font-medium ${member.status === 'available' ? 'text-emerald-400' :
                  member.status === 'busy' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                  {member.status === 'available' ? 'Available' : member.status === 'busy' ? 'Busy' : 'On Leave'}
                </span>

                {userProfile?.role === "admin" && (
                  <Button
                    size="sm"
                    className="bg-orange-600/90 hover:bg-orange-700 h-7 text-xs"
                    onClick={() => {
                      setNewAssignment(prev => ({ ...prev, assignedTo: member.uid }));
                      setIsAddModalOpen(true);
                    }}
                  >
                    Assign Task
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Assignments List Section */}
      <div className="space-y-4">
        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tasks..."
                className="pl-9 bg-gray-800 border-gray-700 text-white h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Task Cards */}
        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No tasks found.</div>
          ) : (
            filteredAssignments.map(task => {
              const projectTitle = projects.find(p => p.id === task.projectId)?.title || "Unknown Project";
              // Handle assignedTo being a string or an array of strings
              const assigneeName = Array.isArray(task.assignedTo)
                ? task.assignedTo.map(uid => teamMembers.find(m => m.uid === uid)?.name || "Unknown User").join(", ")
                : teamMembers.find(m => m.uid === task.assignedTo)?.name || "Unknown User";

              return (
                <Card key={task.id} className="bg-gray-900 border-gray-800 p-5 hover:border-gray-700 transition-all group">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start">

                    {/* Left: Task Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-lg font-bold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        <Badge variant="outline" className={`${getStatusColor(task.status)} border-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm`}>
                          {task.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 text-sm text-gray-400 mt-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Assigned To</span>
                          <span className="text-white font-medium">{assigneeName}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Deadline</span>
                          <span className="text-white font-medium">{task.dueDate}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                          <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Description</span>
                          <span className="truncate">{task.description}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white w-8 text-right">{task.progress}%</span>
                      </div>
                    </div>

                    {/* Right: Estimated Hours & Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs text-gray-500 font-mono mb-2">{task.estimatedHours}h estimated</span>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          size="sm"
                          className="h-8 bg-blue-600 hover:bg-blue-700 text-white border-none"
                          onClick={() => {
                            setSelectedAssignment(task);
                            setProgressUpdateValue(task.progress);
                            setIsUpdateProgressOpen(true);
                          }}
                        >
                          Update Progress
                        </Button>

                        {userProfile?.role === "admin" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                              onClick={() => {
                                setSelectedAssignment(task);
                                setIsReassignOpen(true);
                              }}
                            >
                              Reassign
                            </Button>

                            {/* Delete Button (Icon) */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                              onClick={() => handleDeleteAssignment(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-1">
                        Assigned by {task.assignedBy === userProfile?.uid ? 'Me' : 'Admin'}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* --- Modals --- */}

      {/* 1. Add Assignment Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Task title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select
                  value={typeof newAssignment.assignedTo === 'string' ? newAssignment.assignedTo : ''} // Ensure value is string for single select
                  onValueChange={(val) => setNewAssignment({ ...newAssignment, assignedTo: val })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select Staff" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {teamMembers.map(m => (
                      <SelectItem key={m.uid} value={m.uid}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={newAssignment.projectId}
                  onValueChange={(val) => setNewAssignment({ ...newAssignment, projectId: val })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Task details..."
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                className="bg-gray-800 border-gray-700 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Hours</Label>
                <Input
                  type="number"
                  value={newAssignment.estimatedHours}
                  onChange={(e) => setNewAssignment({ ...newAssignment, estimatedHours: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAssignment} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Reassign Modal */}
      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reassign Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Select New Assignee</Label>
            <Select onValueChange={handleReassign}>
              <SelectTrigger className="mt-2 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Choose staff member" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {teamMembers.map(m => (
                  <SelectItem key={m.uid} value={m.uid}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Update Progress Modal */}
      <Dialog open={isUpdateProgressOpen} onOpenChange={setIsUpdateProgressOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Update Progress: {selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Progress</span>
              <span className="text-2xl font-bold text-emerald-500">{progressUpdateValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressUpdateValue}
              onChange={(e) => setProgressUpdateValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0% (Pending)</span>
              <span>50% (In Progress)</span>
              <span>100% (Completed)</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateProgress} className="bg-emerald-600 hover:bg-emerald-700 w-full">Save Progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
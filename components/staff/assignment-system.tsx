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
  MoreVertical,
  TrendingUp,
  Users,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  project: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  dependencies: string[];
  tags: string[];
}

export function AssignmentSystem() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "",
    description: "",
    assignedTo: "",
    project: "",
    status: "pending",
    priority: "medium",
    startDate: "",
    dueDate: "",
    estimatedHours: 0,
    progress: 0,
    dependencies: [],
    tags: [],
  });

  const teamMembers = [
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Emily Chen",
    "Alex Rodriguez",
  ];

  const projects = [
    "E-commerce Platform v2.0",
    "Mobile Banking App",
    "Marketing Website",
    "API Redesign",
    "Database Optimization",
  ];

  const availableTags = [
    "Frontend",
    "Backend", 
    "Design",
    "Testing",
    "Documentation",
    "Bug Fix",
    "Feature",
    "Urgent",
  ];

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, selectedStatus, selectedPriority, selectedAssignee]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockAssignments: Assignment[] = [
        {
          id: "1",
          title: "Implement user authentication",
          description: "Create login and registration functionality with JWT tokens",
          assignedTo: "John Smith",
          assignedBy: "Sarah Johnson",
          project: "E-commerce Platform v2.0",
          status: "in-progress",
          priority: "high",
          startDate: "2024-01-15",
          dueDate: "2024-01-25",
          estimatedHours: 16,
          actualHours: 8,
          progress: 50,
          dependencies: [],
          tags: ["Backend", "Feature"],
        },
        {
          id: "2",
          title: "Design mobile app UI",
          description: "Create wireframes and mockups for the mobile banking application",
          assignedTo: "Emily Chen",
          assignedBy: "Mike Davis",
          project: "Mobile Banking App",
          status: "completed",
          priority: "medium",
          startDate: "2024-01-10",
          dueDate: "2024-01-20",
          completedDate: "2024-01-18",
          estimatedHours: 12,
          actualHours: 10,
          progress: 100,
          dependencies: [],
          tags: ["Design", "Frontend"],
        },
        {
          id: "3",
          title: "Fix payment gateway integration",
          description: "Resolve issues with payment processing and error handling",
          assignedTo: "Alex Rodriguez",
          assignedBy: "John Smith",
          project: "E-commerce Platform v2.0",
          status: "overdue",
          priority: "critical",
          startDate: "2024-01-12",
          dueDate: "2024-01-18",
          estimatedHours: 8,
          actualHours: 6,
          progress: 75,
          dependencies: ["Implement user authentication"],
          tags: ["Backend", "Bug Fix", "Urgent"],
        },
        {
          id: "4",
          title: "Write API documentation",
          description: "Document all API endpoints with examples and usage guidelines",
          assignedTo: "Sarah Johnson",
          assignedBy: "Mike Davis", 
          project: "API Redesign",
          status: "pending",
          priority: "low",
          startDate: "2024-01-20",
          dueDate: "2024-02-05",
          estimatedHours: 6,
          actualHours: 0,
          progress: 0,
          dependencies: [],
          tags: ["Documentation"],
        },
      ];
      setAssignments(mockAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((assignment) => assignment.status === selectedStatus);
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((assignment) => assignment.priority === selectedPriority);
    }

    if (selectedAssignee !== "all") {
      filtered = filtered.filter((assignment) => assignment.assignedTo === selectedAssignee);
    }

    setFilteredAssignments(filtered);
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.title || !newAssignment.assignedTo || !newAssignment.dueDate) {
      alert("Please fill in required fields");
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title!,
      description: newAssignment.description || "",
      assignedTo: newAssignment.assignedTo!,
      assignedBy: "Current User", // In real app, get from auth
      project: newAssignment.project || "",
      status: (newAssignment.status as Assignment["status"]) || "pending",
      priority: (newAssignment.priority as Assignment["priority"]) || "medium",
      startDate: newAssignment.startDate || new Date().toISOString().split("T")[0],
      dueDate: newAssignment.dueDate!,
      estimatedHours: newAssignment.estimatedHours || 0,
      actualHours: 0,
      progress: 0,
      dependencies: newAssignment.dependencies || [],
      tags: newAssignment.tags || [],
    };

    // In real implementation, save to Firebase
    setAssignments([...assignments, assignment]);
    setIsAddModalOpen(false);
    resetNewAssignment();
  };

  const resetNewAssignment = () => {
    setNewAssignment({
      title: "",
      description: "",
      assignedTo: "",
      project: "",
      status: "pending",
      priority: "medium",
      startDate: "",
      dueDate: "",
      estimatedHours: 0,
      progress: 0,
      dependencies: [],
      tags: [],
    });
  };

  const handleDeleteAssignment = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      // In real implementation, delete from Firebase
      setAssignments(assignments.filter((assignment) => assignment.id !== id));
    }
  };

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Assignment["priority"]) => {
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

  const getProgressColor = (progress: number, status: Assignment["status"]) => {
    if (status === "overdue") return "bg-red-500";
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const calculateWorkload = (assignee: string) => {
    const assigneeAssignments = assignments.filter(
      (assignment) => assignment.assignedTo === assignee && assignment.status !== "completed"
    );
    return assigneeAssignments.reduce((total, assignment) => total + assignment.estimatedHours, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading assignments...</p>
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
            Assignment System
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Delegate tasks and track work progress across your team.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Assignments</p>
                <p className="text-2xl font-semibold text-white">{assignments.length}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-white">
                  {assignments.filter((a) => a.status === "in-progress").length}
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
                  {assignments.filter((a) => a.status === "completed").length}
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
                <p className="text-sm text-gray-400">Overdue</p>
                <p className="text-2xl font-semibold text-white">
                  {assignments.filter((a) => a.status === "overdue").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Workload Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Team Workload Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {teamMembers.map((member) => {
              const workload = calculateWorkload(member);
              const activeAssignments = assignments.filter(
                (a) => a.assignedTo === member && a.status !== "completed"
              ).length;
              
              return (
                <div key={member} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white">
                      {member.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{member}</p>
                      <p className="text-xs text-gray-400">{activeAssignments} active tasks</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{workload}h</p>
                    <p className="text-xs text-gray-400">Total workload</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search assignments..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {assignment.title}
                    </h3>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(assignment.priority)}>
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 mb-4 line-clamp-2">{assignment.description}</p>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-white">{assignment.progress}%</span>
                    </div>
                    <Progress
                      value={assignment.progress}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span>{assignment.assignedTo}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Target className="h-4 w-4 mr-2" />
                      <span>{assignment.project}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{assignment.actualHours}h / {assignment.estimatedHours}h</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {assignment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {assignment.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Dependencies */}
                  {assignment.dependencies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Dependencies:</p>
                      <div className="text-sm text-gray-300">
                        {assignment.dependencies.map((dep, index) => (
                          <span key={dep}>
                            {dep}
                            {index < assignment.dependencies.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAssignment(assignment)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Assignment Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Enter assignment title"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                className="bg-gray-700 border-gray-600"
                rows={3}
                placeholder="Describe the assignment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To *</Label>
              <Select
                value={newAssignment.assignedTo}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, assignedTo: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={newAssignment.project}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, project: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newAssignment.priority}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, priority: value as Assignment["priority"] })}
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={newAssignment.status}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, status: value as Assignment["status"] })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newAssignment.startDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={newAssignment.estimatedHours}
                onChange={(e) => setNewAssignment({ ...newAssignment, estimatedHours: parseFloat(e.target.value) })}
                className="bg-gray-700 border-gray-600"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={newAssignment.progress}
                onChange={(e) => setNewAssignment({ ...newAssignment, progress: parseFloat(e.target.value) })}
                className="bg-gray-700 border-gray-600"
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAssignment} className="bg-emerald-600 hover:bg-emerald-700">
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
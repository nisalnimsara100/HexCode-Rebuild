"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  MoreVertical,
  Timer,
  Users,
  Zap,
  TrendingUp,
  Activity,
  AlertCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Eye,
  List,
  Grid3X3,
  Flag,
  Briefcase,
} from "lucide-react";

interface TicketItem {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "review" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    team: string; // Added team property
  };
  reporter: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  createdDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  timeSpent: number;
  isTimerRunning: boolean;
  timerStartTime?: string;
  comments: Comment[];
  watchers: string[];
  tags: string[];
  attachments: string[];
  adminNotes?: string;
  extraTimeReason?: string;
  extraTimeAdded?: number;
  ruralSituations?: {
    type: string;
    description: string;
    timeExtension: number;
    timestamp: string;
  }[];
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  type: "comment" | "status_change" | "assignment" | "system";
}

export function TicketSystem() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [view, setView] = useState<'list' | 'grid'>('list');

  const [newTicket, setNewTicket] = useState<Partial<TicketItem>>({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    category: "",
    assignedTo: undefined,
    dueDate: "",
    estimatedHours: 0,
    tags: [],
    adminNotes: "",
    extraTimeReason: "",
    extraTimeAdded: 0,
    ruralSituations: [],
  });

  const [newComment, setNewComment] = useState("");

  const teamMembers = [
    {
      id: "1",
      name: "John Smith",
      avatar: "/placeholder-user.jpg",
      email: "john@company.com",
      team: "Engineering"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      email: "sarah@company.com",
      team: "Product"
    },
    {
      id: "3",
      name: "Mike Davis", 
      avatar: "/placeholder-user.jpg",
      email: "mike@company.com",
      team: "Design"
    },
    {
      id: "4",
      name: "Emily Chen",
      avatar: "/placeholder-user.jpg", 
      email: "emily@company.com",
      team: "Engineering"
    },
    {
      id: "5",
      name: "Alex Rodriguez",
      avatar: "/placeholder-user.jpg",
      email: "alex@company.com",
      team: "DevOps"
    },
  ];

  const categories = [
    "Bug Fix",
    "Feature Request", 
    "Enhancement",
    "Documentation",
    "Testing",
    "DevOps",
    "UI/UX",
    "Security",
  ];

  const availableTags = [
    "Frontend",
    "Backend",
    "Mobile",
    "API",
    "Database",
    "Critical",
    "Easy Fix",
    "Needs Review",
  ];

  // Calculate Workload based on tickets
  const getMemberWorkload = (memberId: string) => {
    const memberTickets = tickets.filter(t => t.assignedTo.id === memberId);
    // Calculate workload based on estimated hours assuming 40h work week
    const totalHours = memberTickets.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const percentage = Math.min((totalHours / 40) * 100, 100); 
    return {
      hours: totalHours,
      percentage: Math.round(percentage),
      ticketCount: memberTickets.length
    };
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, selectedStatus, selectedPriority, selectedAssignee]);

  // Timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        tickets.forEach(ticket => {
          if (ticket.isTimerRunning && ticket.timerStartTime) {
            const startTime = new Date(ticket.timerStartTime).getTime();
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            newTimers[ticket.id] = ticket.timeSpent + elapsedSeconds;
          } else {
            newTimers[ticket.id] = ticket.timeSpent;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // In real implementation, use Firebase
      // const ticketsRef = collection(db, "tickets");
      // const q = query(ticketsRef, orderBy("createdDate", "desc"));
      // const unsubscribe = onSnapshot(q, (snapshot) => {
      //   const ticketsData = snapshot.docs.map(doc => ({
      //     id: doc.id,
      //     ...doc.data()
      //   })) as TicketItem[];
      //   setTickets(ticketsData);
      //   setLoading(false);
      // });
      // return unsubscribe;

      // Mock data updated to match the provided images
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockTickets: TicketItem[] = [
        {
          id: "1",
          title: "Fix responsive design issues on mobile",
          description: "Users are unable to log in with correct credentials. Error appears to be related to JWT token validation.",
          status: "open",
          priority: "high",
          category: "Bug Fix",
          assignedTo: {
            id: "1",
            name: "John Smith",
            avatar: "/placeholder-user.jpg",
            email: "john@company.com",
            team: "Engineering"
          },
          reporter: {
            id: "2",
            name: "Sarah Johnson", 
            avatar: "/placeholder-user.jpg",
            email: "sarah@company.com"
          },
          createdDate: "2025-09-01T10:30:00Z",
          dueDate: "2025-10-05T17:00:00Z", // Overdue as per image
          estimatedHours: 16,
          actualHours: 0,
          timeSpent: 14400, 
          isTimerRunning: false,
          watchers: ["3", "4"],
          tags: ["Frontend", "Critical", "Mobile"],
          attachments: [],
          comments: []
        },
        {
          id: "2",
          title: "Implement dark mode toggle",
          description: "Add a dark mode toggle switch to the user preferences panel with system theme detection.",
          status: "open",
          priority: "medium",
          category: "Feature Request",
          assignedTo: {
            id: "4",
            name: "Emily Chen",
            avatar: "/placeholder-user.jpg",
            email: "emily@company.com",
            team: "Engineering"
          },
          reporter: {
            id: "3",
            name: "Mike Davis",
            avatar: "/placeholder-user.jpg", 
            email: "mike@company.com"
          },
          createdDate: "2024-01-14T14:20:00Z",
          dueDate: "2024-01-25T22:30:00Z", // Overdue as per image logic
          estimatedHours: 6,
          actualHours: 2,
          timeSpent: 0,
          isTimerRunning: false,
          watchers: ["1", "2"],
          tags: ["Frontend", "UI/UX"],
          attachments: [],
          comments: []
        },
        {
          id: "3",
          title: "Database performance optimization",
          description: "Optimize slow-running queries in the reports module. Current response time is >3 seconds.",
          status: "open", // Image shows OVERDUE, usually mapped to open status but visually indicated
          priority: "high",
          category: "Enhancement",
          assignedTo: {
            id: "5",
            name: "Alex Rodriguez",
            avatar: "/placeholder-user.jpg",
            email: "alex@company.com",
            team: "DevOps"
          },
          reporter: {
            id: "1",
            name: "John Smith",
            avatar: "/placeholder-user.jpg",
            email: "john@company.com"
          },
          createdDate: "2024-01-10T09:15:00Z",
          dueDate: "2024-01-20T22:30:00Z", // Overdue
          estimatedHours: 12,
          actualHours: 10,
          timeSpent: 36000,
          isTimerRunning: false,
          watchers: ["2", "3"],
          tags: ["Database", "Backend", "Needs Review"],
          attachments: [],
          comments: []
        }
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === selectedStatus);
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === selectedPriority);
    }

    if (selectedAssignee !== "all") {
      filtered = filtered.filter((ticket) => ticket.assignedTo.id === selectedAssignee);
    }

    setFilteredTickets(filtered);
  };

  const handleAddTicket = async () => {
    if (!newTicket.title || !newTicket.assignedTo || !newTicket.dueDate) {
      alert("Please fill in required fields");
      return;
    }

    const member = teamMembers.find(m => m.id === newTicket.assignedTo?.id);

    const ticket: TicketItem = {
      id: Date.now().toString(),
      title: newTicket.title!,
      description: newTicket.description || "",
      status: (newTicket.status as TicketItem["status"]) || "open",
      priority: (newTicket.priority as TicketItem["priority"]) || "medium",
      category: newTicket.category || "General",
      assignedTo: {
        ...newTicket.assignedTo!,
        team: member?.team || "General"
      },
      reporter: {
        id: "current-user",
        name: "Current User",
        avatar: "/placeholder-user.jpg",
        email: "current@company.com"
      },
      createdDate: new Date().toISOString(),
      dueDate: newTicket.dueDate!,
      estimatedHours: newTicket.estimatedHours || 0,
      actualHours: 0,
      timeSpent: 0,
      isTimerRunning: false,
      watchers: [],
      tags: newTicket.tags || [],
      attachments: [],
      comments: [],
      adminNotes: newTicket.adminNotes || "",
      extraTimeReason: newTicket.extraTimeReason || "",
      extraTimeAdded: newTicket.extraTimeAdded || 0,
      ruralSituations: newTicket.ruralSituations || [],
    };

    try {
      setTickets([...tickets, ticket]);
      setIsAddModalOpen(false);
      resetNewTicket();
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
  };

  const resetNewTicket = () => {
    setNewTicket({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
      category: "",
      assignedTo: undefined,
      dueDate: "",
      estimatedHours: 0,
      tags: [],
      adminNotes: "",
      extraTimeReason: "",
      extraTimeAdded: 0,
      ruralSituations: [],
    });
  };

  const handleDeleteTicket = async (id: string) => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      try {
        setTickets(tickets.filter((ticket) => ticket.id !== id));
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };

  const toggleTimer = async (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    try {
      const updatedTicket = {
        ...ticket,
        isTimerRunning: !ticket.isTimerRunning,
        timerStartTime: !ticket.isTimerRunning ? new Date().toISOString() : undefined,
        timeSpent: ticket.isTimerRunning ? timers[ticketId] || ticket.timeSpent : ticket.timeSpent
      };

      setTickets(tickets.map(t => t.id === ticketId ? updatedTicket : t));
    } catch (error) {
      console.error("Error toggling timer:", error);
    }
  };

  const addComment = async (ticketId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "Current User",
        avatar: "/placeholder-user.jpg"
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      type: "comment"
    };

    try {
      const updatedTickets = tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, comments: [...ticket.comments, comment] }
          : ticket
      );
      
      setTickets(updatedTickets);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getStatusColor = (status: TicketItem["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "closed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: TicketItem["priority"]) => {
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

  const getStatusIcon = (status: TicketItem["status"]) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />;
      case "review":
        return <Eye className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (priority: TicketItem["priority"]) => {
    switch (priority) {
      case "low":
        return <Flag className="h-4 w-4 text-gray-500" />;
      case "medium":
        return <Flag className="h-4 w-4 text-blue-500" />;
      case "high":
        return <Flag className="h-4 w-4 text-orange-500" />;
      case "critical":
        return <Flag className="h-4 w-4 text-red-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverdueDetails = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    
    if (diffMs > 0) {
       // Future dates handled by CountdownTimer usually, but returning null here
       return null; 
    }

    // Overdue calculation
    const diffAbs = Math.abs(diffMs);
    const diffDays = Math.floor(diffAbs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffAbs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return {
      text: `${diffDays}d ${diffHours}h overdue`,
      color: "text-red-500 font-semibold",
      isOverdue: true
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:tracking-tight">
            🎫 Ticket System
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-400">
            Track and manage support tickets with <span className="text-emerald-400 font-medium">real-time countdown timers</span> and collaboration.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:shrink-0">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
          <Button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
          >
            {view === 'grid' ? (
              <>
                <List className="h-4 w-4 mr-2 sm:mr-0" />
                <span className="sm:hidden">List View</span>
              </>
            ) : (
              <>
                <Grid3X3 className="h-4 w-4 mr-2 sm:mr-0" />
                <span className="sm:hidden">Grid View</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
          <div className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-300" />
              <div className="ml-4">
                <p className="text-sm text-blue-200">Open Tickets</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "open").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-700">
          <div className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-yellow-300" />
              <div className="ml-4">
                <p className="text-sm text-yellow-200">In Progress</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "in-progress").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-teal-900 to-teal-800 border-teal-700">
          <div className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-teal-300" />
              <div className="ml-4">
                <p className="text-sm text-teal-200">In Review</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "review").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700">
          <div className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-emerald-300" />
              <div className="ml-4">
                <p className="text-sm text-emerald-200">Completed</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "closed").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Staff Workload Overview (Added based on Image 1) */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald-400" />
              Staff Workload Overview
            </h3>
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
              <Briefcase className="h-4 w-4 mr-2" />
              Manage Teams
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {teamMembers.map((member) => {
              const workload = getMemberWorkload(member.id);
              return (
                <div key={member.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.team}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Workload</span>
                      <span className={`font-medium ${workload.percentage > 90 ? 'text-red-400' : workload.percentage > 70 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {workload.percentage}%
                      </span>
                    </div>
                    <Progress value={workload.percentage} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{workload.ticketCount} Tasks</span>
                      <span>{workload.hours}h Est.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Priority" />
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
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setSelectedPriority("all");
                setSelectedAssignee("all");
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Clear</span>
              <span className="sm:hidden">Clear Filters</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => {
          const currentTime = timers[ticket.id] || ticket.timeSpent;
          const overdueDetails = getOverdueDetails(ticket.dueDate);
          
          return (
            <Card key={ticket.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          {getStatusIcon(ticket.status)}
                          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                            {ticket.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            <div className="flex items-center space-x-1">
                              {getPriorityIcon(ticket.priority)}
                              <span className="hidden sm:inline">{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                              <span className="sm:hidden">{ticket.priority.charAt(0).toUpperCase()}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm sm:text-base mb-3 line-clamp-2">{ticket.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTimer(ticket.id)}
                        className={`${
                          ticket.isTimerRunning 
                            ? "text-red-400 hover:text-red-300" 
                            : "text-emerald-400 hover:text-emerald-300"
                        } p-2`}
                      >
                        {ticket.isTimerRunning ? (
                          <PauseCircle className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsViewModalOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-gray-400 hover:text-white p-2 hidden sm:inline-flex"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-red-400 hover:text-red-300 p-2 hidden sm:inline-flex"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Time Remaining</span>
                        <div className="flex items-center justify-between">
                            <CountdownTimer 
                            dueDate={ticket.dueDate}
                            priority={ticket.priority}
                            size="md"
                            className="w-full"
                            />
                            {overdueDetails && (
                                <span className={`text-sm ${overdueDetails.color} ml-2`}>
                                    {overdueDetails.text}
                                </span>
                            )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Time Spent</span>
                        <span className="font-mono text-white font-medium">{formatTime(currentTime)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-medium">
                          {Math.round((ticket.actualHours / ticket.estimatedHours) * 100) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min((ticket.actualHours / ticket.estimatedHours) * 100, 100) || 0}
                        className="h-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center text-gray-400">
                      <User className="h-4 w-4 mr-2 shrink-0" />
                      <div className="flex items-center space-x-2 min-w-0">
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={ticket.assignedTo.avatar} />
                          <AvatarFallback className="text-xs">{ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <span className="block truncate text-white">{ticket.assignedTo.name}</span>
                            <span className="block truncate text-xs text-gray-500">{ticket.assignedTo.team}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                      <span>{ticket.comments.length} comments</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 mr-2 shrink-0" />
                      <span>{ticket.watchers.length} watchers</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Ticket Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Enter ticket title"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="bg-gray-700 border-gray-600"
                rows={3}
                placeholder="Describe the issue or request"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To *</Label>
              <Select
                value={newTicket.assignedTo?.id}
                onValueChange={(value) => {
                  const member = teamMembers.find(m => m.id === value);
                  setNewTicket({ ...newTicket, assignedTo: member });
                }}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.team})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTicket.category}
                onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTicket.priority}
                onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as TicketItem["priority"] })}
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
                value={newTicket.status}
                onValueChange={(value) => setNewTicket({ ...newTicket, status: value as TicketItem["status"] })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={newTicket.dueDate}
                onChange={(e) => setNewTicket({ ...newTicket, dueDate: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={newTicket.estimatedHours}
                onChange={(e) => setNewTicket({ ...newTicket, estimatedHours: parseFloat(e.target.value) })}
                className="bg-gray-700 border-gray-600"
                placeholder="0"
              />
            </div>
            
            {/* Admin Notes Section */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                value={newTicket.adminNotes || ''}
                onChange={(e) => setNewTicket({ ...newTicket, adminNotes: e.target.value })}
                className="bg-gray-700 border-gray-600"
                rows={2}
                placeholder="Add any special instructions or notes for the employee..."
              />
            </div>
            
            {/* Extra Time Section */}
            <div className="space-y-2">
              <Label htmlFor="extraTimeAdded">Extra Time (Hours)</Label>
              <Input
                id="extraTimeAdded"
                type="number"
                value={newTicket.extraTimeAdded || 0}
                onChange={(e) => setNewTicket({ ...newTicket, extraTimeAdded: parseFloat(e.target.value) })}
                className="bg-gray-700 border-gray-600"
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extraTimeReason">Extra Time Reason</Label>
              <Input
                id="extraTimeReason"
                value={newTicket.extraTimeReason || ''}
                onChange={(e) => setNewTicket({ ...newTicket, extraTimeReason: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Reason for extra time allocation..."
              />
            </div>
            
            {/* Rural Situations Section */}
            <div className="col-span-2 space-y-3">
              <Label className="text-sm font-medium text-gray-300">Rural Situations (Optional)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select onValueChange={(value) => {
                  const newSituation = {
                    type: value,
                    description: value === 'electricity' ? 'Power outage' : value === 'internet' ? 'Internet connectivity issues' : 'Other rural situation',
                    timeExtension: 2,
                    timestamp: new Date().toISOString()
                  };
                  setNewTicket({ 
                    ...newTicket, 
                    ruralSituations: [...(newTicket.ruralSituations || []), newSituation] 
                  });
                }}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-sm">
                    <SelectValue placeholder="Add situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">⚡ Electricity Cut</SelectItem>
                    <SelectItem value="internet">🌐 Internet Issues</SelectItem>
                    <SelectItem value="weather">🌧️ Weather Problems</SelectItem>
                    <SelectItem value="transport">🚌 Transport Issues</SelectItem>
                    <SelectItem value="other">📋 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Display added situations */}
              {newTicket.ruralSituations && newTicket.ruralSituations.length > 0 && (
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {newTicket.ruralSituations.map((situation, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700/50 p-2 rounded text-sm">
                      <span className="text-yellow-400">
                        {situation.type === 'electricity' ? '⚡' : 
                         situation.type === 'internet' ? '🌐' : 
                         situation.type === 'weather' ? '🌧️' : 
                         situation.type === 'transport' ? '🚌' : '📋'} 
                        {situation.description} (+{situation.timeExtension}h)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSituations = newTicket.ruralSituations?.filter((_, i) => i !== index) || [];
                          setNewTicket({ ...newTicket, ruralSituations: newSituations });
                        }}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTicket} className="bg-emerald-600 hover:bg-emerald-700">
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl pr-8">{selectedTicket.title}</DialogTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1).replace('-', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-300">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Assigned To</h4>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedTicket.assignedTo.avatar} />
                        <AvatarFallback>
                          {selectedTicket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{selectedTicket.assignedTo.name}</p>
                        <p className="text-sm text-gray-400">{selectedTicket.assignedTo.team} • {selectedTicket.assignedTo.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Reporter</h4>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedTicket.reporter.avatar} />
                        <AvatarFallback>
                          {selectedTicket.reporter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{selectedTicket.reporter.name}</p>
                        <p className="text-sm text-gray-400">{selectedTicket.reporter.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="text-gray-400 mb-1">Due Date</h4>
                    <p className="text-white">{new Date(selectedTicket.dueDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Time Spent</h4>
                    <p className="text-white font-mono">{formatTime(timers[selectedTicket.id] || selectedTicket.timeSpent)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Estimated</h4>
                    <p className="text-white">{selectedTicket.estimatedHours}h</p>
                  </div>
                </div>

                {/* Admin Details Section */}
                {(selectedTicket.adminNotes || selectedTicket.extraTimeAdded || (selectedTicket.ruralSituations && selectedTicket.ruralSituations.length > 0)) && (
                  <>
                    <Separator className="bg-gray-700" />
                    <div className="space-y-4 bg-gray-700/30 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-semibold text-emerald-400 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Admin & Extensions
                      </h4>
                      
                      {selectedTicket.adminNotes && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-semibold">Admin Notes</span>
                          <p className="text-sm text-gray-300 mt-1 bg-gray-800 p-2 rounded">{selectedTicket.adminNotes}</p>
                        </div>
                      )}
                      
                      {(selectedTicket.extraTimeAdded || selectedTicket.extraTimeReason) && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                           <div className="bg-blue-900/30 border border-blue-700/50 rounded px-3 py-1">
                              <span className="text-xs text-blue-300">+{selectedTicket.extraTimeAdded}h Extra Time</span>
                           </div>
                           {selectedTicket.extraTimeReason && (
                             <span className="text-sm text-gray-400 italic">"{selectedTicket.extraTimeReason}"</span>
                           )}
                        </div>
                      )}

                      {selectedTicket.ruralSituations && selectedTicket.ruralSituations.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-semibold block mb-2">Rural Situations</span>
                          <div className="space-y-2">
                            {selectedTicket.ruralSituations.map((situation, index) => (
                              <div key={index} className="flex items-center justify-between text-sm bg-yellow-900/20 border border-yellow-700/30 p-2 rounded">
                                <span className="text-yellow-200/80">
                                  {situation.type === 'electricity' ? '⚡' : 
                                   situation.type === 'internet' ? '🌐' : 
                                   situation.type === 'weather' ? '🌧️' : 
                                   situation.type === 'transport' ? '🚌' : '📋'} 
                                  {situation.description}
                                </span>
                                <span className="text-xs text-yellow-500">+{situation.timeExtension}h</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator className="bg-gray-700" />

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4">Comments & Activity</h4>
                  <div className="space-y-4 mb-4">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{comment.author.name}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                      <Button
                        onClick={() => addComment(selectedTicket.id)}
                        disabled={!newComment.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
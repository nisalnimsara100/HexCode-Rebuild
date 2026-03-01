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
  ref,
  onValue,
  update,
} from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-context";
import {
  Ticket,
  Plus,
  Minus,
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
  status: "open" | "in-progress" | "review" | "closed" | "planning" | "available" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  assignedTo: string[]; // Array of UIDs
  project?: string; // Added project field support
  dueDate: string;
  estimatedHours: string | number;
  descriptionImage?: string;
  createdAt: string;
  // Extras for UI compatibility if needed, or mapped
  reporter?: any;
  actualHours?: number;
  timeSpent?: number;
  isTimerRunning?: boolean;
  comments?: Comment[];
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
  type: "comment" | "status_change";
}

export function TicketSystem() {
  const { userProfile } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, any>>({}); // To store staff details for lookup
  const [filteredTickets, setFilteredTickets] = useState<TicketItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false); // Renamed for clarity
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'grid'>('grid'); // Default to grid to match preference
  const [inlineProgress, setInlineProgress] = useState<Record<string, number>>({});
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [imageViewerSrc, setImageViewerSrc] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [isPanningImage, setIsPanningImage] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Minimal edit form for status and time spent
  const [editStatus, setEditStatus] = useState<string>("");
  const [editTimeSpent, setEditTimeSpent] = useState<number>(0);

  const [newComment, setNewComment] = useState("");

  // Fetch Staff Data for name lookup
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        setStaffMap(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Tickets from Realtime DB
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const ticketsRef = ref(database, 'staffdashboard/tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ticketList: TicketItem[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
          assignedTo: Array.isArray(val.assignedTo) ? val.assignedTo : (val.assignedTo ? [val.assignedTo] : [])
        }));
        setTickets(ticketList);
      } else {
        setTickets([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  };

  // Filter Logic (Simple)
  useEffect(() => {
    let filtered = tickets;

    if (userProfile?.uid) {
      filtered = filtered.filter(t => t.assignedTo.includes(userProfile.uid));
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === selectedPriority);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, selectedStatus, selectedPriority, userProfile]);

  const handleEditClick = (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditTimeSpent(ticket.timeSpent || 0); // Initialize with current time or 0
    setIsEditStatusModalOpen(true);
  }

  const handleSaveStatus = async () => {
    if (!selectedTicket) return;
    try {
      await update(ref(database, `staffdashboard/tickets/${selectedTicket.id}`), {
        status: editStatus,
        timeSpent: parseFloat(editTimeSpent.toString()) || 0
      });
      setIsEditStatusModalOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }

  // Helper to get staff avatar/name
  const getAssigneeInfo = (uid: string) => {
    return staffMap[uid] || { name: 'Unknown', profilePicture: null };
  }

  const getStatusColor = (status: TicketItem["status"]) => {
    switch (status) {
      case "open":
      case "planning":
      case "available":
        return "bg-blue-900/30 text-blue-300 border-blue-700/40";
      case "in-progress":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700/40";
      case "review":
        return "bg-teal-900/30 text-teal-300 border-teal-700/40";
      case "closed":
      case "completed":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-700/40";
      default:
        return "bg-slate-900/30 text-slate-300 border-slate-700/40";
    }
  };

  const getPriorityColor = (priority: TicketItem["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-slate-900/30 text-slate-300 border-slate-700/40";
      case "medium":
        return "bg-blue-900/30 text-blue-300 border-blue-700/40";
      case "high":
        return "bg-orange-900/30 text-orange-300 border-orange-700/40";
      case "critical":
        return "bg-red-900/30 text-red-300 border-red-700/40";
      default:
        return "bg-slate-900/30 text-slate-300 border-slate-700/40";
    }
  };

  const getStatusIcon = (status: TicketItem["status"]) => {
    switch (status) {
      case "open":
      case "planning":
      case "available":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />;
      case "review":
        return <Eye className="h-4 w-4" />;
      case "closed":
      case "completed":
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

  const getProgressPercent = (ticket: TicketItem) => {
    const estimated = parseFloat(ticket.estimatedHours?.toString() || "0");
    if (!estimated || estimated <= 0) return 0;
    return Math.min(Math.round(((ticket.timeSpent || 0) / estimated) * 100), 100);
  };

  const getQuickStatusValue = (status: TicketItem["status"]) => {
    return ["closed", "completed"].includes(status) ? "done" : "in-progress";
  };

  const handleQuickStatusUpdate = async (ticket: TicketItem, value: "in-progress" | "done") => {
    try {
      const nextStatus = value === "done" ? "completed" : "in-progress";
      await update(ref(database, `staffdashboard/tickets/${ticket.id}`), {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to update ticket status", error);
    }
  };

  const commitInlineProgress = async (ticket: TicketItem) => {
    const percent = inlineProgress[ticket.id];
    if (percent === undefined) return;

    const estimated = parseFloat(ticket.estimatedHours?.toString() || "0");
    const safeEstimated = estimated > 0 ? estimated : 0;
    const timeSpent = Number(((percent / 100) * safeEstimated).toFixed(2));

    const payload: Record<string, any> = {
      timeSpent,
      updatedAt: new Date().toISOString(),
    };

    if (percent >= 100) {
      payload.status = "completed";
    } else if (["closed", "completed"].includes(ticket.status)) {
      payload.status = "in-progress";
    }

    setUpdatingTicketId(ticket.id);
    try {
      await update(ref(database, `staffdashboard/tickets/${ticket.id}`), payload);
    } catch (error) {
      console.error("Failed to update ticket progress", error);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const formatDueDateTime = (dueDate?: string) => {
    if (!dueDate) return "No due date";
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return dueDate;

    const hasTime = dueDate.includes("T");
    return parsed.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: hasTime ? "2-digit" : undefined,
      minute: hasTime ? "2-digit" : undefined,
    });
  };

  const openImageViewer = (imagePath: string) => {
    setImageViewerSrc(imagePath);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setIsPanningImage(false);
  };

  const closeImageViewer = () => {
    setImageViewerSrc(null);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setIsPanningImage(false);
  };

  const handleImagePanStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (imageZoom <= 1) return;
    setIsPanningImage(true);
    setPanStart({ x: event.clientX - imagePan.x, y: event.clientY - imagePan.y });
  };

  const handleImagePanMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningImage || imageZoom <= 1) return;
    setImagePan({
      x: event.clientX - panStart.x,
      y: event.clientY - panStart.y,
    });
  };

  const handleImagePanEnd = () => {
    setIsPanningImage(false);
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
        <Card className="bg-gray-900 border-gray-800">
          <div className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-300" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Open Tickets</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => ["open", "planning", "available"].includes(t.status) && t.assignedTo.includes(userProfile?.uid || "")).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <div className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-yellow-300" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "in-progress" && t.assignedTo.includes(userProfile?.uid || "")).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <div className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-teal-300" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">In Review</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "review" && t.assignedTo.includes(userProfile?.uid || "")).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <div className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-emerald-300" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => ["closed", "completed"].includes(t.status) && t.assignedTo.includes(userProfile?.uid || "")).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Staff Workload Overview (Hidden for Staff) */}
      {/* 
      <Card className="bg-gray-900 border-gray-800 hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-white flex items-center">
               <Users className="h-5 w-5 mr-2 text-emerald-400" />
               Staff Workload Overview
             </h3>
          </div>
        </div>
      </Card> 
      */}

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setSelectedPriority("all");
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-200 overflow-hidden flex flex-col">
            <div className="p-4 flex-1 flex flex-col relative">
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                <Select
                  value={getQuickStatusValue(ticket.status)}
                  onValueChange={(value: "in-progress" | "done") => handleQuickStatusUpdate(ticket, value)}
                >
                  <SelectTrigger className="h-8 w-[130px] bg-gray-800 border-gray-700 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority.toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center mb-2 pr-[150px]">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(ticket.status)}
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1" title={ticket.title}>
                {ticket.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                {ticket.description}
              </p>

              <div className="space-y-4 mt-auto">
                {/* Countdown & Overdue Warning */}
                <div className="pt-2">
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1 block">Time Remaining</span>
                  <CountdownTimer
                    dueDate={ticket.dueDate}
                    priority={ticket.priority}
                    size="md"
                    className="w-full"
                  />
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {formatDueDateTime(ticket.dueDate)}</span>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {(inlineProgress[ticket.id] ?? getProgressPercent(ticket))}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={inlineProgress[ticket.id] ?? getProgressPercent(ticket)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setInlineProgress((prev) => ({ ...prev, [ticket.id]: value }));
                    }}
                    onMouseUp={() => void commitInlineProgress(ticket)}
                    onTouchEnd={() => void commitInlineProgress(ticket)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      Time Spent: {(((inlineProgress[ticket.id] ?? getProgressPercent(ticket)) / 100) * (parseFloat(ticket.estimatedHours.toString()) || 0)).toFixed(1)}h
                    </span>
                    <span>{ticket.estimatedHours}h Est.</span>
                  </div>
                  {updatingTicketId === ticket.id && (
                    <p className="text-[10px] text-gray-500">Updating...</p>
                  )}
                </div>

                {/* Assignee Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    {ticket.assignedTo && ticket.assignedTo.length > 0 && (
                      (() => {
                        const firstUid = ticket.assignedTo[0];
                        const staff = getAssigneeInfo(firstUid);
                        return (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8 border border-gray-600">
                              <AvatarImage src={staff.profilePicture} />
                              <AvatarFallback>{staff.name ? staff.name.charAt(0) : '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white leading-none">{staff.name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500 mt-0.5">{staff.role || staff.team || 'Staff'}</span>
                            </div>
                          </div>
                        );
                      })()
                    )}
                    {ticket.assignedTo && ticket.assignedTo.length > 1 && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
                        +{ticket.assignedTo.length - 1} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setIsEditStatusModalOpen(false);
                      }}
                      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredTickets.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tickets found matching your criteria.
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Ticket Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Spent (Hours)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editTimeSpent}
                  onChange={(e) => setEditTimeSpent(parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 pr-12"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xs">
                    {selectedTicket && selectedTicket.estimatedHours ? Math.round((editTimeSpent / Number(selectedTicket.estimatedHours)) * 100) : 0}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Estimated: {selectedTicket?.estimatedHours}h
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditStatusModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStatus} className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* View Ticket Modal - Simplified for Staff */}
      <Dialog open={!!selectedTicket && !isEditStatusModalOpen} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[88vh] overflow-hidden">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl pr-8">{selectedTicket.title}</DialogTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pr-1 max-h-[74vh] overflow-y-auto custom-scrollbar">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-300">{selectedTicket.description}</p>
                </div>

                {selectedTicket.descriptionImage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Description Image</h4>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 hover:border-emerald-500/60 transition-colors"
                      onClick={() => openImageViewer(selectedTicket.descriptionImage as string)}
                    >
                      <img
                        src={selectedTicket.descriptionImage}
                        alt="Ticket description"
                        className="max-h-56 w-auto rounded object-contain"
                      />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Assigned To</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.assignedTo?.map((uid) => {
                        const staff = getAssigneeInfo(uid);
                        return (
                          <div key={uid} className="inline-flex items-center space-x-2 bg-gray-800 pr-3 rounded-full border border-gray-700 p-1">
                            <Avatar className="h-6 w-6">
                              {staff.profilePicture ? <AvatarImage src={staff.profilePicture} /> : null}
                              <AvatarFallback className="text-[10px]">{staff.name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-white">{staff.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Due Date</h4>
                    <p className="text-white">{new Date(selectedTicket.dueDate).toLocaleString()}</p>
                  </div>
                </div>

                <Separator className="bg-gray-700" />
                <p className="text-gray-500 italic text-sm">Comments & Activity logs are view-only in this beta version.</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!imageViewerSrc} onOpenChange={(open) => !open && closeImageViewer()}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[96vw] max-h-[92vh] p-4">
          {imageViewerSrc && (
            <div className="space-y-3">
              <div className="relative w-full h-[72vh] overflow-hidden rounded border border-gray-700 bg-gray-950/70">
                <div
                  className={`w-full h-full flex items-center justify-center ${imageZoom > 1 ? (isPanningImage ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
                  onMouseDown={handleImagePanStart}
                  onMouseMove={handleImagePanMove}
                  onMouseUp={handleImagePanEnd}
                  onMouseLeave={handleImagePanEnd}
                >
                  <img
                    src={imageViewerSrc}
                    alt="Description full view"
                    draggable={false}
                    className="max-w-full max-h-full select-none pointer-events-none transition-transform duration-150"
                    style={{
                      transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/85 p-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setImageZoom((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setImageZoom((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      setImageZoom(1);
                      setImagePan({ x: 0, y: 0 });
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
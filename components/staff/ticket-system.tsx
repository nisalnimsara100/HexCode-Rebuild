"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { database } from "@/lib/firebase";
import { ref, onValue, push, remove, update } from "firebase/database";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Edit3,
  Trash2,
  MoreVertical,
} from "lucide-react";

interface TicketItem {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "review" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  assignedTo: string;
  reporter: string;
  createdDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
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
  const [loading, setLoading] = useState(true);

  const [newTicket, setNewTicket] = useState<Partial<TicketItem>>({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    category: "",
    assignedTo: "",
    dueDate: "",
    estimatedHours: 0,
  });

  const categories = [
    "Bug Fix",
    "Feature Request",
    "Improvement",
    "Documentation",
    "Testing",
    "Support",
    "Maintenance",
  ];

  const teamMembers = [
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Emily Chen",
    "Alex Rodriguez",
  ];

  // Data Fetching
  useEffect(() => {
    const ticketsRef = ref(database, 'tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ticketList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
          comments: val.comments || []
        }));

        // Sort by Priority
        const priorityOrder: { [key: string]: number } = { critical: 0, high: 1, medium: 2, low: 3 };
        ticketList.sort((a, b) => {
          const pA = priorityOrder[a.priority] ?? 4;
          const pB = priorityOrder[b.priority] ?? 4;
          return pA - pB;
        });

        setTickets(ticketList);
      } else {
        setTickets([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter Logic
  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, selectedStatus, selectedPriority, selectedAssignee]);

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
      filtered = filtered.filter((ticket) => ticket.assignedTo === selectedAssignee);
    }

    setFilteredTickets(filtered);
  };

  const handleAddTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      alert("Please fill in required fields");
      return;
    }

    const ticketData = {
      title: newTicket.title!,
      description: newTicket.description!,
      status: (newTicket.status as TicketItem["status"]) || "open",
      priority: (newTicket.priority as TicketItem["priority"]) || "medium",
      category: newTicket.category || "Bug Fix",
      assignedTo: newTicket.assignedTo || "",
      reporter: "Current User", // Should be userProfile.name or similar
      createdDate: new Date().toISOString().split("T")[0],
      dueDate: newTicket.dueDate || "",
      estimatedHours: newTicket.estimatedHours || 0,
      actualHours: 0,
      comments: [],
    };

    try {
      await push(ref(database, 'tickets'), ticketData);
      setIsAddModalOpen(false);
      resetNewTicket();
    } catch (error) {
      console.error("Failed to add ticket", error);
    }
  };

  const resetNewTicket = () => {
    setNewTicket({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
      category: "",
      assignedTo: "",
      dueDate: "",
      estimatedHours: 0,
    });
  };

  const handleDeleteTicket = async (id: string) => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      try {
        await remove(ref(database, `tickets/${id}`));
      } catch (error) {
        console.error("Failed to delete ticket", error);
      }
    }
  };

  const getStatusColor = (status: TicketItem["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200";
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
        return <Clock className="h-4 w-4" />;
      case "review":
        return <Clock className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
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
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Ticket System
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Track and manage tasks, bugs, and feature requests.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Tickets</p>
                <p className="text-2xl font-semibold text-white">{tickets.length}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Open</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "open").length}
                </p>
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
                  {tickets.filter((t) => t.status === "in-progress").length}
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
                <p className="text-sm text-gray-400">Closed</p>
                <p className="text-2xl font-semibold text-white">
                  {tickets.filter((t) => t.status === "closed").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tickets..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-lg font-semibold text-white truncate">
                        {ticket.title}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">{ticket.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span>Assigned: {ticket.assignedTo || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Tag className="h-4 w-4 mr-2" />
                      <span>{ticket.category}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : "No due date"}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{ticket.actualHours}h / {ticket.estimatedHours}h</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {ticket.comments.length > 0 && (
                    <div className="flex items-center text-gray-400">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span className="text-sm">{ticket.comments.length}</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTicket(ticket.id)}
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

      {/* Add Ticket Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Enter ticket title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="bg-gray-700 border-gray-600"
                rows={4}
                placeholder="Describe the issue or requirement"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select
                  value={newTicket.assignedTo}
                  onValueChange={(value) => setNewTicket({ ...newTicket, assignedTo: value })}
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
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTicket.dueDate}
                  onChange={(e) => setNewTicket({ ...newTicket, dueDate: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
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
    </div>
  );
}
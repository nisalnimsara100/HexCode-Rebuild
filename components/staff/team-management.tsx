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
import {
  Users,
  Plus,
  Search,
  Filter,
  Crown,
  Mail,
  Phone,
  Calendar,
  Target,
  Activity,
  Edit3,
  Trash2,
  MoreVertical,
  UserPlus,
  MessageCircle,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  teamLead: string;
  members: TeamMember[];
  createdDate: string;
  status: "active" | "inactive";
  projects: string[];
  objectives: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  avatar?: string;
}

export function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    description: "",
    department: "",
    teamLead: "",
    status: "active",
    objectives: [],
  });

  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
  ];

  const availableEmployees = [
    { id: "1", name: "John Smith", email: "john@hexcode.com", role: "Senior Developer" },
    { id: "2", name: "Sarah Johnson", email: "sarah@hexcode.com", role: "UI/UX Designer" },
    { id: "3", name: "Mike Davis", email: "mike@hexcode.com", role: "Project Manager" },
    { id: "4", name: "Emily Chen", email: "emily@hexcode.com", role: "Frontend Developer" },
    { id: "5", name: "Alex Rodriguez", email: "alex@hexcode.com", role: "Backend Developer" },
  ];

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, searchTerm, selectedDepartment, selectedStatus]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockTeams: Team[] = [
        {
          id: "1",
          name: "Frontend Development",
          description: "Responsible for user interface and user experience development",
          department: "Engineering",
          teamLead: "Sarah Johnson",
          members: [
            {
              id: "1",
              name: "Sarah Johnson",
              email: "sarah@hexcode.com",
              role: "Team Lead",
              joinDate: "2023-01-15",
              avatar: "/placeholder-user.jpg",
            },
            {
              id: "2",
              name: "Emily Chen",
              email: "emily@hexcode.com",
              role: "Frontend Developer",
              joinDate: "2023-02-20",
              avatar: "/placeholder-user.jpg",
            },
            {
              id: "3",
              name: "John Smith",
              email: "john@hexcode.com",
              role: "Senior Developer",
              joinDate: "2023-01-10",
              avatar: "/placeholder-user.jpg",
            },
          ],
          createdDate: "2023-01-15",
          status: "active",
          projects: ["E-commerce Platform v2.0", "Mobile Banking App"],
          objectives: ["Improve UI/UX", "Implement new design system", "Optimize performance"],
        },
        {
          id: "2",
          name: "Backend Development",
          description: "Server-side development and API management",
          department: "Engineering",
          teamLead: "Alex Rodriguez",
          members: [
            {
              id: "4",
              name: "Alex Rodriguez",
              email: "alex@hexcode.com",
              role: "Team Lead",
              joinDate: "2022-11-10",
              avatar: "/placeholder-user.jpg",
            },
            {
              id: "5",
              name: "Mike Davis",
              email: "mike@hexcode.com",
              role: "Backend Developer",
              joinDate: "2023-03-01",
              avatar: "/placeholder-user.jpg",
            },
          ],
          createdDate: "2022-11-10",
          status: "active",
          projects: ["API Redesign", "Database Optimization"],
          objectives: ["Improve API performance", "Implement microservices", "Enhance security"],
        },
        {
          id: "3",
          name: "Marketing Team",
          description: "Digital marketing and brand management",
          department: "Marketing",
          teamLead: "John Smith",
          members: [
            {
              id: "6",
              name: "John Smith",
              email: "john@hexcode.com",
              role: "Marketing Manager",
              joinDate: "2023-01-01",
              avatar: "/placeholder-user.jpg",
            },
          ],
          createdDate: "2023-01-01",
          status: "inactive",
          projects: ["Brand Redesign"],
          objectives: ["Increase brand awareness", "Launch new campaigns"],
        },
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = teams;

    if (searchTerm) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((team) => team.department === selectedDepartment);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((team) => team.status === selectedStatus);
    }

    setFilteredTeams(filtered);
  };

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.department || !newTeam.teamLead) {
      alert("Please fill in required fields");
      return;
    }

    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name!,
      description: newTeam.description || "",
      department: newTeam.department!,
      teamLead: newTeam.teamLead!,
      members: [
        {
          id: Date.now().toString(),
          name: newTeam.teamLead!,
          email: availableEmployees.find(emp => emp.name === newTeam.teamLead)?.email || "",
          role: "Team Lead",
          joinDate: new Date().toISOString().split("T")[0],
        },
      ],
      createdDate: new Date().toISOString().split("T")[0],
      status: (newTeam.status as Team["status"]) || "active",
      projects: [],
      objectives: newTeam.objectives || [],
    };

    // In real implementation, save to Firebase
    setTeams([...teams, team]);
    setIsAddModalOpen(false);
    resetNewTeam();
  };

  const resetNewTeam = () => {
    setNewTeam({
      name: "",
      description: "",
      department: "",
      teamLead: "",
      status: "active",
      objectives: [],
    });
  };

  const handleDeleteTeam = async (id: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      // In real implementation, delete from Firebase
      setTeams(teams.filter((team) => team.id !== id));
    }
  };

  const getStatusColor = (status: Team["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading teams...</p>
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
            Team Management
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Organize and manage your teams effectively.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Teams</p>
                <p className="text-2xl font-semibold text-white">{teams.length}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Active Teams</p>
                <p className="text-2xl font-semibold text-white">
                  {teams.filter((t) => t.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Members</p>
                <p className="text-2xl font-semibold text-white">
                  {teams.reduce((acc, team) => acc + team.members.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Avg Team Size</p>
                <p className="text-2xl font-semibold text-white">
                  {teams.length > 0 ? Math.round(teams.reduce((acc, team) => acc + team.members.length, 0) / teams.length) : 0}
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
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                    <Badge className={getStatusColor(team.status)}>
                      {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{team.description}</p>
                  <p className="text-xs text-gray-500">{team.department} Department</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Team Lead */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-300">Team Lead</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white">
                    {team.teamLead.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{team.teamLead}</p>
                    <p className="text-xs text-gray-400">
                      {team.members.find(m => m.name === team.teamLead)?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    Members ({team.members.length})
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="h-8 w-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-white"
                      title={`${member.name} - ${member.role}`}
                    >
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  ))}
                  {team.members.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-white">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-300">Active Projects</span>
                <div className="mt-2 space-y-1">
                  {team.projects.slice(0, 2).map((project, index) => (
                    <div key={index} className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {project}
                    </div>
                  ))}
                  {team.projects.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{team.projects.length - 2} more projects
                    </div>
                  )}
                </div>
              </div>

              {/* Objectives */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-300">Team Objectives</span>
                <div className="mt-2">
                  <ul className="text-xs text-gray-400 space-y-1">
                    {team.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></div>
                        {objective}
                      </li>
                    ))}
                    {team.objectives.length > 2 && (
                      <li className="text-gray-500">+{team.objectives.length - 2} more objectives</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-lg font-semibold text-white">{team.projects.length}</p>
                  <p className="text-xs text-gray-400">Projects</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-lg font-semibold text-white">
                    {Math.floor((Date.now() - new Date(team.createdDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-xs text-gray-400">Days Active</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setSelectedTeam(team)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-black text-black hover:bg-black"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-950"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Team Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={newTeam.department}
                  onValueChange={(value) => setNewTeam({ ...newTeam, department: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                className="bg-gray-700 border-gray-600"
                rows={3}
                placeholder="Describe the team's purpose and responsibilities"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLead">Team Lead *</Label>
                <Select
                  value={newTeam.teamLead}
                  onValueChange={(value) => setNewTeam({ ...newTeam, teamLead: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name} - {employee.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTeam.status}
                  onValueChange={(value) => setNewTeam({ ...newTeam, status: value as Team["status"] })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeam} className="bg-emerald-600 hover:bg-emerald-700">
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
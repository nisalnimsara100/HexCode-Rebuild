"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectRoadmap } from "./project-roadmap";
import { 
  User, 
  Bell, 
  Search,
  Settings,
  LogOut,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  MessageCircle,
  Download,
  Eye,
  BarChart3,
  PieChart,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Heart,
  Zap,
  Target,
  Briefcase,
  Users,
  Globe,
  Smartphone,
  Phone,
  Video
} from "lucide-react";

// Sample data
const projectsData = [
  {
    id: "1",
    name: "E-Commerce Platform",
    status: "in-progress",
    progress: 65,
    startDate: "2024-01-15",
    estimatedCompletion: "2024-03-15",
    budget: 45000,
    spent: 29250,
    team: ["John Doe", "Jane Smith", "Mike Johnson"],
    description: "Full-featured e-commerce platform with payment integration",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    priority: "high",
    lastUpdate: "2 hours ago"
  },
  {
    id: "2",
    name: "Mobile App Development",
    status: "planning",
    progress: 15,
    startDate: "2024-02-01",
    estimatedCompletion: "2024-05-01",
    budget: 35000,
    spent: 5250,
    team: ["Sarah Wilson", "Tom Brown"],
    description: "Cross-platform mobile application for iOS and Android",
    technologies: ["React Native", "Firebase", "TypeScript"],
    priority: "medium",
    lastUpdate: "1 day ago"
  },
  {
    id: "3",
    name: "Company Website Redesign",
    status: "completed",
    progress: 100,
    startDate: "2023-11-01",
    estimatedCompletion: "2024-01-01",
    budget: 15000,
    spent: 14500,
    team: ["Alice Cooper", "Bob Dylan"],
    description: "Modern responsive website with CMS integration",
    technologies: ["Next.js", "Tailwind CSS", "Strapi"],
    priority: "low",
    lastUpdate: "3 weeks ago"
  }
];

const recentActivities = [
  { id: 1, type: "update", message: "Project milestone completed: Frontend Development", time: "2 hours ago", project: "E-Commerce Platform" },
  { id: 2, type: "message", message: "New message from project manager", time: "4 hours ago", project: "Mobile App Development" },
  { id: 3, type: "payment", message: "Invoice payment received: $15,000", time: "1 day ago", project: "E-Commerce Platform" },
  { id: 4, type: "document", message: "Project documentation updated", time: "2 days ago", project: "Company Website Redesign" },
  { id: 5, type: "meeting", message: "Weekly standup meeting scheduled", time: "3 days ago", project: "Mobile App Development" }
];

const notifications = [
  { id: 1, title: "Project Update Available", message: "E-Commerce Platform has reached 65% completion", type: "info", time: "1 hour ago" },
  { id: 2, title: "Payment Reminder", message: "Next milestone payment due in 3 days", type: "warning", time: "6 hours ago" },
  { id: 3, title: "Team Message", message: "New message from your development team", type: "message", time: "1 day ago" },
  { id: 4, title: "Document Ready", message: "Project requirements document is ready for review", type: "success", time: "2 days ago" }
];

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "in-progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "planning": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update": return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "message": return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case "payment": return <DollarSign className="w-4 h-4 text-green-400" />;
      case "document": return <FileText className="w-4 h-4 text-purple-400" />;
      case "meeting": return <Calendar className="w-4 h-4 text-orange-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const totalBudget = projectsData.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projectsData.reduce((sum, p) => sum + p.spent, 0);
  const activeProjects = projectsData.filter(p => p.status === "in-progress").length;
  const completedProjects = projectsData.filter(p => p.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Client Portal</h1>
                <p className="text-sm text-gray-400">Welcome back, John!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 bg-gray-800/50 border-gray-600/50 text-white w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-8 mb-8 border-b border-gray-700/50">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "projects", label: "Projects", icon: Briefcase },
            { id: "roadmap", label: "Roadmap", icon: Target },
            { id: "messages", label: "Messages", icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 px-2 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? "border-emerald-500 text-emerald-400" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">Active Projects</p>
                    <p className="text-3xl font-bold text-white mt-2">{activeProjects}</p>
                    <p className="text-xs text-emerald-300 mt-1 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +2 from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-white mt-2">{completedProjects}</p>
                    <p className="text-xs text-blue-300 mt-1 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +1 this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Total Budget</p>
                    <p className="text-3xl font-bold text-white mt-2">${(totalBudget / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-purple-300 mt-1 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +15% growth
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-400 text-sm font-medium">Avg Progress</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / projectsData.length)}%
                    </p>
                    <p className="text-xs text-orange-300 mt-1 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +12% this week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Projects Overview */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Active Projects</h3>
                    <Button variant="outline" size="sm" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {projectsData.filter(p => p.status !== "completed").map((project) => (
                      <div key={project.id} className="border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status.replace("-", " ")}
                              </Badge>
                              <Badge className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(project.estimatedCompletion).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{project.team.length} team members</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-400 mb-1">{project.progress}%</div>
                            <div className="text-xs text-gray-400">Complete</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, index) => (
                                <div 
                                  key={index}
                                  className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs text-white font-medium"
                                >
                                  {member.split(" ").map(n => n[0]).join("")}
                                </div>
                              ))}
                              {project.team.length > 3 && (
                                <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card className="bg-gray-900/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{activity.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                          <p className="text-xs text-emerald-400">{activity.project}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Notifications */}
                <Card className="bg-gray-900/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                          </div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Projects</h2>
              <div className="flex items-center space-x-4">
                <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                  <option>All Status</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Planning</option>
                </select>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projectsData.map((project) => (
                <Card key={project.id} className="bg-gray-900/50 border-gray-700/50 p-6 hover:border-emerald-500/30 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                        {project.technologies.includes("React") && <Globe className="w-5 h-5 text-white" />}
                        {project.technologies.includes("React Native") && <Smartphone className="w-5 h-5 text-white" />}
                        {!project.technologies.includes("React") && !project.technologies.includes("React Native") && <Briefcase className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{project.name}</h3>
                        <p className="text-xs text-gray-400">{project.lastUpdate}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.estimatedCompletion).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs text-white font-medium"
                          >
                            {member.split(" ").map(n => n[0]).join("")}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-emerald-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-emerald-400">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Project Roadmap</h2>
              <p className="text-gray-400">Track the development progress of your selected project</p>
            </div>
            <ProjectRoadmap projectId={selectedProject.id} />
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Messages</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                New Message
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-900/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Conversations</h3>
                  <div className="space-y-4">
                    {[
                      { name: "John Doe", role: "Project Manager", message: "Updates on the frontend development...", time: "2h ago", unread: 2 },
                      { name: "Sarah Wilson", role: "Designer", message: "I've completed the UI mockups for...", time: "4h ago", unread: 0 },
                      { name: "Mike Johnson", role: "Developer", message: "The API integration is ready for...", time: "1d ago", unread: 1 }
                    ].map((conversation, index) => (
                      <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 cursor-pointer transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-sm text-white font-medium">
                              {conversation.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{conversation.name}</p>
                              <p className="text-xs text-gray-400">{conversation.role}</p>
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs text-white">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{conversation.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{conversation.time}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Message Thread */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-700/50 p-6 h-96">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-sm text-white font-medium">
                        JD
                      </div>
                      <div>
                        <p className="font-medium text-white">John Doe</p>
                        <p className="text-sm text-gray-400">Project Manager</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-4 max-h-64 overflow-y-auto">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                        JD
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-sm text-white">Hi! I wanted to update you on the progress of the e-commerce platform. We've completed the frontend development and are now moving on to backend integration.</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 flex-row-reverse">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                        You
                      </div>
                      <div className="flex-1 text-right">
                        <div className="bg-emerald-600 rounded-lg p-3 inline-block">
                          <p className="text-sm text-white">That's great news! When do you expect the backend integration to be completed?</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-700/50">
                    <Input 
                      placeholder="Type your message..." 
                      className="flex-1 bg-gray-800 border-gray-600 text-white"
                    />
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Send
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
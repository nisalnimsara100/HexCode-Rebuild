"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientAuth, ClientProfile } from "@/lib/client-auth";
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
  Video,
  Home,
  GitBranch
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
  const router = useRouter();
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [userName, setUserName] = useState('User'); // State to track user name
  
  // Helper function to get user name from localStorage
  const getUserName = () => {
    try {
      const storedProfile = localStorage.getItem('clientProfile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        console.log('📋 getUserName - Parsed profile:', parsed);
        const name = parsed?.name || 'User';
        setUserName(name); // Update state
        return name;
      }
    } catch (e) {
      console.error('Error parsing stored profile:', e);
    }
    setUserName('User');
    return 'User';
  };
  
  // All state declarations must come first, before any conditional logic
  const [projects, setProjects] = useState(projectsData);
  const [activities, setActivities] = useState(recentActivities);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: "",
    description: "",
    budget: "",
    requirements: ""
  });
  const notificationsRef = useRef<HTMLDivElement>(null);
  const newProjectModalRef = useRef<HTMLDivElement>(null);
  
  // Check authentication and get client profile
  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Dashboard Debug - Starting auth check...');
      console.log('🔍 Dashboard Debug - LocalStorage content:', localStorage.getItem('clientProfile'));
      
      const profile = ClientAuth.getCurrentUser();
      console.log('🔍 Dashboard Debug - Retrieved profile:', profile);
      console.log('🔍 Dashboard Debug - Profile name specifically:', profile?.name);
      
      if (!profile) {
        console.log('❌ No profile found, redirecting to home');
        router.push('/');
        return;
      }
      console.log('✅ Setting profile:', profile);
      console.log('✅ Profile name being set:', profile.name);
      setClientProfile(profile);
      setLoading(false);
    };

    // Add a small delay to ensure localStorage is ready
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 50);

    // Listen for auth state changes
    const handleAuthChange = () => {
      console.log('🔄 Auth state changed, rechecking...');
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [router]);

  // Initialize userName on component mount
  useEffect(() => {
    // Immediately check localStorage for user name
    try {
      const storedProfile = localStorage.getItem('clientProfile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        console.log('🚀 Mount - Setting userName from localStorage:', parsed.name);
        setUserName(parsed.name || 'User');
      }
    } catch (e) {
      console.error('Error on mount:', e);
      setUserName('User');
    }
  }, []);

  // Debug effect to monitor clientProfile state changes
  useEffect(() => {
    console.log('🔍 ClientProfile state changed:', clientProfile);
    console.log('🔍 ClientProfile name:', clientProfile?.name);
    
    // Update userName whenever profile changes or on mount
    const updateUserName = () => {
      try {
        const storedProfile = localStorage.getItem('clientProfile');
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          console.log('📋 Updating userName from localStorage:', parsed.name);
          setUserName(parsed.name || 'User');
        }
      } catch (e) {
        console.error('Error parsing stored profile:', e);
        setUserName('User');
      }
    };
    
    updateUserName();
    
    // Force a re-render if profile exists but name is missing
    if (clientProfile && !clientProfile.name) {
      console.log('⚠️ Profile missing name, attempting to refresh from localStorage');
      const storedProfile = localStorage.getItem('clientProfile');
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed?.name && parsed.name !== clientProfile.name) {
            console.log('🔄 Updating profile with stored name:', parsed.name);
            setClientProfile(parsed);
          }
        } catch (e) {
          console.error('Error parsing stored profile:', e);
        }
      }
    }
  }, [clientProfile]);

  // Client-side data fetching
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (clientProfile) {
          // Use static data for demo - in real app this would be API calls
          setProjects(projectsData);
          setActivities(recentActivities);
          setNotificationsList(notifications);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        // Fallback to static data on error
        setProjects(projectsData);
        setActivities(recentActivities);
        setNotificationsList(notifications);
      }
    };

    if (clientProfile) {
      fetchClientData();
    }
  }, [clientProfile]);

  // Close modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (newProjectModalRef.current && !newProjectModalRef.current.contains(event.target as Node)) {
        setShowNewProjectModal(false);
      }
    }

    if (showNotifications || showNewProjectModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications, showNewProjectModal]);

  // Loading state - now comes after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading Dashboard...</p>
          <p className="text-gray-400">Fetching your project data</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      // Use ClientAuth logout
      ClientAuth.logout();
      
      // Force page reload to ensure complete state reset
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect
      window.location.href = '/';
    }
  };

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

  // Filter projects based on search and status
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = projectsData.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projectsData.reduce((sum, p) => sum + p.spent, 0);
  const activeProjects = projectsData.filter(p => p.status === "in-progress").length;
  const completedProjects = projectsData.filter(p => p.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                {clientProfile?.profilePicture ? (
                  <img 
                    src={clientProfile.profilePicture} 
                    alt={clientProfile.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="text-white font-semibold text-sm">
                    {clientProfile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Client Dashboard</h1>
                <p className="text-sm text-gray-400">
                  Welcome back, {(() => {
                    try {
                      const profile = localStorage.getItem('clientProfile');
                      if (profile) {
                        const parsed = JSON.parse(profile);
                        return parsed.name || 'User';
                      }
                      return 'User';
                    } catch (e) {
                      return 'User';
                    }
                  })()}!
                </p>
                {/* Debug info - remove after fixing */}
                <div className="text-xs text-yellow-400 mt-1 p-2 bg-yellow-900/20 rounded">
                  Debug: ClientProfile="{clientProfile?.name}" | LocalStorage="{(() => {
                    try {
                      const stored = localStorage.getItem('clientProfile');
                      return stored ? JSON.parse(stored).name : 'null';
                    } catch { return 'error'; }
                  })()}" | UserName State="{userName}"
                </div>
                {clientProfile?.company && (
                  <p className="text-xs text-gray-500">{clientProfile.company}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 bg-gray-800/50 border-gray-600/50 text-white w-48 lg:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Mobile search button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white sm:hidden"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white"
                title="Account Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Home button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white"
                onClick={() => router.push('/')}
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-400 hover:text-red-300"
                onClick={handleLogout}
                title={`Logout (${clientProfile?.email})`}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div 
            ref={notificationsRef}
            className="absolute top-full right-4 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-3">Notifications</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-emerald-400 hover:text-emerald-300"
                  onClick={() => setShowNotifications(false)}
                >
                  Mark all as read
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="sm:hidden px-4 pb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10 bg-gray-800/50 border-gray-600/50 text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-4 sm:space-x-8 mb-6 sm:mb-8 border-b border-gray-700/50 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "projects", label: "Projects", icon: Briefcase },
            { id: "messages", label: "Messages", icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 pb-3 sm:pb-4 px-2 sm:px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "border-emerald-500 text-emerald-400" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">{tab.label}</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Projects Overview */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-700/50 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Active Projects</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 w-full sm:w-auto"
                      onClick={() => setActiveTab("projects")}
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {projectsData.filter(p => p.status !== "completed").map((project) => (
                      <div key={project.id} className="border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-emerald-500/30 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <h4 className="text-base sm:text-lg font-semibold text-white">{project.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status.replace("-", " ")}
                                </Badge>
                                <Badge className={getPriorityColor(project.priority)}>
                                  {project.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                            
                            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {project.estimatedCompletion}</span>
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
                          
                          <div className="text-right sm:text-right">
                            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mb-1">{project.progress}%</div>
                            <div className="text-xs text-gray-400">Complete</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-3">
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
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                            
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-white p-1 sm:p-2"
                                onClick={() => setSelectedProject(project)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-white p-1 sm:p-2"
                                onClick={() => alert(`Opening messages for ${project.name}`)}
                              >
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">All Projects</h2>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <select 
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="planning">Planning</option>
                </select>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  New Project
                </Button>
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || statusFilter !== "all") && (
              <div className="text-sm text-gray-400 mb-4">
                Showing {filteredProjects.length} of {projectsData.length} projects
                {searchTerm && ` matching "${searchTerm}"`}
                {statusFilter !== "all" && ` with status "${statusFilter.replace("-", " ")}"`}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-gray-900/50 border-gray-700/50 p-6 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
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
                        <span>{project.estimatedCompletion}</span>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-emerald-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            // Open project details with roadmap integrated
                          }}
                          title="View project details and roadmap"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-emerald-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          title="View interactive roadmap"
                        >
                          <GitBranch className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-emerald-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Downloading report for ${project.name}`);
                          }}
                          title="Download project report"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No projects found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="mt-4"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
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

      {/* Project Details Modal with Integrated Roadmap */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              {/* Project Details and Roadmap Layout */}
              <div className="space-y-6 mb-8">
                {/* Project Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Project Progress */}
                  <div className="lg:col-span-2 space-y-6">
                  {/* Progress Overview */}
                  <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Project Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Overall Progress</span>
                        <span className="text-2xl font-bold text-emerald-400">{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                          <div className="text-xl font-bold text-white">${selectedProject.spent.toLocaleString()}</div>
                          <div className="text-sm text-gray-400">Spent</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                          <div className="text-xl font-bold text-white">${selectedProject.budget.toLocaleString()}</div>
                          <div className="text-sm text-gray-400">Total Budget</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Advanced Graph Roadmap - Full Width */}
                </div>

                {/* Project Sidebar */}
                <div className="space-y-6">
                  {/* Project Details */}
                  <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge className={getStatusColor(selectedProject.status)}>
                          {selectedProject.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Priority:</span>
                        <Badge className={getPriorityColor(selectedProject.priority)}>
                          {selectedProject.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="text-white">{selectedProject.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="text-white">{selectedProject.estimatedCompletion}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Team Members */}
                  <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
                    <div className="space-y-3">
                      {selectedProject.team.map((member, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-sm text-white font-medium">
                            {member.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-white">{member}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Technologies */}
                  <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Full-Width Advanced Graph Roadmap */}
              <div className="mb-8">
                <Card className="bg-gray-800/50 border-gray-700/50 p-0 overflow-hidden">
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
                      Project Roadmap
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Click nodes to view task details and dependencies
                    </p>
                  </div>
                  {/* Temporarily disabled for debugging */}
                  <div className="p-6 text-center text-gray-400">
                    <p>Project roadmap will be displayed here</p>
                  </div>
                  {/* <CleanGraphRoadmap /> */}
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Team
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProject(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={newProjectModalRef}
            className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Request New Project</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                // Here you would typically send data to your backend
                console.log('New Project Request:', newProjectForm);
                alert(`Project request "${newProjectForm.name}" submitted successfully! Our team will review and get back to you within 24 hours.`);
                setShowNewProjectModal(false);
                setNewProjectForm({
                  name: "",
                  description: "",
                  budget: "",
                  requirements: ""
                });
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <Input
                    placeholder="Enter project name"
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your project..."
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Budget (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 50000"
                    value={newProjectForm.budget}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This helps us provide more accurate proposals. Leave blank if unsure.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Goals & Requirements
                  </label>
                  <textarea
                    placeholder="What are your main goals for this project? Any specific features or requirements?"
                    value={newProjectForm.requirements || ""}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, requirements: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProjectModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={!newProjectForm.name || !newProjectForm.description}
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
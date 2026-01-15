"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { StaffManagement, TicketSystem, TaskAssignments, ProjectManagement, StaffReports, StaffSettings } from "./staff-components"
import { WebsiteOverview, ServicesManagement, PortfolioManagement, WebsiteStats, ContentManagement, WebsiteSettings, PricePackagesManagement } from "./website-components-fixed"
import { FirebaseClientProjectsAdmin } from "./firebase-client-projects-admin"
import { Modal } from "./modal"
import {
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  AlertCircle,
  TrendingUp,
  Activity,
  Package,
  Shield,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  MoreHorizontal,
  Ticket,
  CheckSquare,
  Globe,
  UserCheck,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Image,
  FileText,
  PieChart,
  Briefcase,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Star,
  ExternalLink
} from "lucide-react"

// Types for our data structures
interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'on-leave'
  avatar?: string
  joinDate: string
  skills: string[]
  workload: number
}

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'review' | 'closed' | 'planning' | 'available' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: string
  assigneeEmail?: string
  reporter: string
  created: string
  updated: string
  dueDate?: string
  estimatedHours?: number
  category: string
  project?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  progress: number
  startDate: string
  deadline: string
  budget: string
  teamSize: number
  lead: string
  technologies: string[]
  milestones: Array<{
    name: string
    status: 'completed' | 'in-progress' | 'pending'
    date: string
  }>
}

interface Task {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string[]
  dueDate?: string
}

interface ServiceItem {
  id: string
  title: string
  description: string
  price: string
  features: string[]
  icon: string
  category: string
  isActive: boolean
  order: number
}

interface PortfolioProject {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  url?: string
  githubUrl?: string
  isActive: boolean
  order: number
  client?: string
  completedDate: string
}

export function AdminDashboard() {
  const { userProfile, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeMainTab, setActiveMainTab] = useState<'staff' | 'website' | 'projects'>('projects')
  const [activeStaffTab, setActiveStaffTab] = useState('overview')
  const [activeWebsiteTab, setActiveWebsiteTab] = useState('overview')
  const [showModal, setShowModal] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Staff Management Data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  // Website Management Data
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: '1',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies',
      price: '$2,500',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Modern UI/UX'],
      icon: 'globe',
      category: 'Development',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications',
      price: '$5,000',
      features: ['iOS & Android', 'Cross-platform', 'Native Performance', 'App Store Ready'],
      icon: 'smartphone',
      category: 'Development',
      isActive: true,
      order: 2
    }
  ])

  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([
    {
      id: '1',
      title: 'E-commerce Dashboard',
      description: 'Modern admin dashboard for e-commerce management',
      image: '/projects/dashboard.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      category: 'Web Development',
      url: 'https://example.com',
      isActive: true,
      order: 1,
      client: 'ABC Company',
      completedDate: '2025-09-15'
    }
  ])

  // Fetch Data from Firebase
  useEffect(() => {
    // 1. Fetch Staff
    const usersRef = ref(database, 'users')
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const staffList: StaffMember[] = Object.entries(data)
          // @ts-ignore
          .filter(([_, val]: [string, any]) => val.role !== 'client') // Filter out clients if necessary
          .map(([uid, val]: [string, any]) => ({
            id: uid,
            name: val.name || "Unknown",
            email: val.email || "",
            role: (val.role || "staff").toLowerCase(),
            department: val.department || "General",
            status: val.status || "active",
            avatar: val.profilePicture,
            joinDate: val.createdAt ? new Date(val.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            skills: val.skills || [],
            workload: val.workload || 0
          }))
        setStaffMembers(staffList)
      } else {
        setStaffMembers([])
      }
    })

    // 2. Fetch Tickets
    const ticketsRef = ref(database, 'staffdashboard/tickets')
    const unsubscribeTickets = onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const ticketList: Ticket[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          title: val.title,
          description: val.description,
          status: val.status,
          priority: val.priority,
          assignee: val.assignedTo?.[0] || 'Unassigned',
          assigneeEmail: val.assignedTo?.email, // Keep consistent if available
          reporter: val.reporter || "Admin",
          created: val.createdAt || new Date().toISOString(),
          updated: val.updatedAt || new Date().toISOString(),
          dueDate: val.dueDate,
          estimatedHours: Number(val.estimatedHours),
          category: val.category || "General",
          project: val.project
        }))
        setTickets(ticketList)
      } else {
        setTickets([])
      }
    })

    // 3. Fetch Projects
    const projectsRef = ref(database, 'staffdashboard/projects')
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const projectList: Project[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          name: val.title,
          description: val.description,
          status: val.status === 'in-progress' || val.status === 'researching' ? 'active' : val.status === 'completed' ? 'completed' : 'planning', // Map status loosely
          priority: val.priority,
          progress: Number(val.progress),
          startDate: val.startDate,
          deadline: val.endDate,
          budget: val.budget,
          teamSize: val.team ? val.team.length : 0,
          lead: 'Admin', // Placeholder or derive from team
          technologies: [], // Not in current schema
          milestones: [] // Not in current schema
        }))
        setProjects(projectList)
      } else {
        setProjects([])
      }
    })

    // 4. Fetch Tasks
    const tasksRef = ref(database, 'staffdashboard/tasks')
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const taskList: Task[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          title: val.title,
          status: val.status,
          priority: val.priority,
          assignedTo: val.assignedTo || [],
          dueDate: val.dueDate
        }))
        setTasks(taskList)
      } else {
        setTasks([])
      }
    })

    return () => {
      unsubscribeUsers()
      unsubscribeTickets()
      unsubscribeProjects()
      unsubscribeTasks()
    }
  }, [])

  // Authentication check
  useEffect(() => {
    setIsLoading(false)
    if (!userProfile || userProfile.role !== 'admin') {
      router.push('/unauthorized')
    }
  }, [userProfile, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!userProfile || userProfile.role !== 'admin') {
    return null
  }

  // Main navigation tabs
  const mainTabs = [
    { id: 'projects', label: 'Client Projects', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'staff', label: 'Staff Management', icon: <Users className="w-5 h-5" /> },
    { id: 'website', label: 'Website Management', icon: <Globe className="w-5 h-5" /> }
  ]

  // Staff management tabs
  const staffTabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff Members', icon: <Users className="w-4 h-4" /> },
    { id: 'tickets', label: 'Ticket System', icon: <Ticket className="w-4 h-4" /> },
    { id: 'assignments', label: 'Task Assignments', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'projects', label: 'Project Management', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ]

  // Website management tabs
  const websiteTabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Image className="w-4 h-4" /> },
    { id: 'packages', label: 'Price Packages', icon: <Package className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistics', icon: <PieChart className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-white font-bold text-lg">HexCode Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, {userProfile?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as 'staff' | 'website' | 'projects')}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeMainTab === tab.id
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {activeMainTab === 'staff' ? (
              staffTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStaffTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeStaffTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))
            ) : (
              websiteTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWebsiteTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeWebsiteTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeMainTab === 'projects' && (
          <FirebaseClientProjectsAdmin
            onProjectSelect={(project) => {
              console.log('Selected project:', project);
              // Handle project selection - could open modal or navigate
            }}
          />
        )}

        {activeMainTab === 'staff' && (
          <div>
            {activeStaffTab === 'overview' && <StaffOverview staffMembers={staffMembers} tickets={tickets} projects={projects} tasks={tasks} onNavigate={setActiveStaffTab} />}
            {activeStaffTab === 'staff' && <StaffManagement staffMembers={staffMembers} setStaffMembers={setStaffMembers} setShowModal={setShowModal} setEditingItem={setEditingItem} />}
            {activeStaffTab === 'tickets' && <TicketSystem tickets={tickets} setTickets={setTickets} staffMembers={staffMembers} setShowModal={setShowModal} setEditingItem={setEditingItem} />}
            {activeStaffTab === 'assignments' && <TaskAssignments staffMembers={staffMembers} />}
            {activeStaffTab === 'projects' && <ProjectManagement projects={projects} setProjects={setProjects} staffMembers={staffMembers} setShowModal={setShowModal} setEditingItem={setEditingItem} />}
            {activeStaffTab === 'reports' && <StaffReports />}
            {activeStaffTab === 'settings' && <StaffSettings />}
          </div>
        )}

        {activeMainTab === 'website' && (
          <div>
            {activeWebsiteTab === 'overview' && <WebsiteOverview />}
            {activeWebsiteTab === 'services' && <ServicesManagement />}
            {activeWebsiteTab === 'portfolio' && <PortfolioManagement />}
            {activeWebsiteTab === 'packages' && <PricePackagesManagement />}
            {activeWebsiteTab === 'stats' && <WebsiteStats />}
            {activeWebsiteTab === 'content' && <ContentManagement />}
            {activeWebsiteTab === 'settings' && <WebsiteSettings />}
          </div>
        )}
      </main>

      {/* Modals */}
      {showModal && (
        <Modal
          type={showModal}
          editingItem={editingItem}
          onClose={() => {
            setShowModal(null)
            setEditingItem(null)
          }}
          onSave={(data) => {
            // Handle save logic based on modal type
            handleModalSave(showModal, data, editingItem)
            setShowModal(null)
            setEditingItem(null)
          }}
          staffMembers={staffMembers}
        />
      )}
    </div>
  )

  // Helper function to handle modal saves
  function handleModalSave(modalType: string, data: any, editingItem: any) {
    switch (modalType) {
      case 'staff':
        if (editingItem) {
          setStaffMembers(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item))
        } else {
          setStaffMembers(prev => [...prev, { ...data, id: Date.now().toString() }])
        }
        break
      case 'ticket':
        if (editingItem) {
          setTickets(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item))
        } else {
          setTickets(prev => [...prev, { ...data, id: Date.now().toString() }])
        }
        break
      case 'project':
        if (editingItem) {
          setProjects(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item))
        } else {
          setProjects(prev => [...prev, { ...data, id: Date.now().toString() }])
        }
        break
      case 'service':
        if (editingItem) {
          setServices(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item))
        } else {
          setServices(prev => [...prev, { ...data, id: Date.now().toString() }])
        }
        break
      case 'portfolio':
        if (editingItem) {
          setPortfolioProjects(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item))
        } else {
          setPortfolioProjects(prev => [...prev, { ...data, id: Date.now().toString() }])
        }
        break
    }
  }
}

// Staff Overview Component
function StaffOverview({ staffMembers, tickets, projects, tasks, onNavigate }: { staffMembers: StaffMember[], tickets: Ticket[], projects: Project[], tasks: Task[], onNavigate: (tab: string) => void }) {
  const totalStaff = staffMembers.length
  const onlineStaff = staffMembers.filter(s => s.status === 'active').length

  const activeTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'completed').length
  const pendingTickets = tickets.filter(t => !t.assignee || t.assignee === 'Unassigned').length

  const completedTasks = tasks.filter(t => t.status === 'completed').length

  const activeProjectsCount = projects.filter(p => p.status === 'active').length

  const totalTasks = tasks.length
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length +
    tickets.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'closed' && t.status !== 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-2">Staff Management Overview</h2>
        <p className="text-orange-100">Monitor and manage your team's productivity and assignments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Staff */}
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-orange-500 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="text-orange-500 font-semibold mb-1">Total Staff</h3>
              <p className="text-4xl font-bold text-white">{totalStaff}</p>
              <p className="text-gray-400 text-sm mt-1">{onlineStaff} currently active</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Active Tickets */}
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-blue-500 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="text-blue-500 font-semibold mb-1">Active Tickets</h3>
              <p className="text-4xl font-bold text-white">{activeTickets}</p>
              <p className="text-gray-400 text-sm mt-1">{pendingTickets} pending assignment</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
              <Ticket className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-green-500 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="text-green-500 font-semibold mb-1">Completed Tasks</h3>
              <p className="text-4xl font-bold text-white">{completedTasks}</p>
              <p className="text-gray-400 text-sm mt-1">This month</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-purple-500 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="text-purple-500 font-semibold mb-1">Projects</h3>
              <p className="text-4xl font-bold text-white">{activeProjectsCount}</p>
              <p className="text-gray-400 text-sm mt-1">In progress</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
              <FolderOpen className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Productivity */}
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-yellow-500 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="text-yellow-500 font-semibold mb-1">Productivity</h3>
              <p className="text-4xl font-bold text-white">{productivity}%</p>
              <p className="text-gray-400 text-sm mt-1">Team efficiency</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-red-500 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="text-red-500 font-semibold mb-1">Overdue</h3>
              <p className="text-4xl font-bold text-white">{overdueCount}</p>
              <p className="text-gray-400 text-sm mt-1">Tasks need attention</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <button onClick={() => onNavigate('tickets')} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white p-4 rounded-xl transition-all shadow-lg shadow-orange-900/20 font-medium group">
          <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Assign New Ticket</span>
        </button>
        <button onClick={() => onNavigate('staff')} className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium group">
          <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Manage Staff</span>
        </button>
        <button onClick={() => onNavigate('projects')} className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white p-4 rounded-xl transition-all shadow-lg shadow-green-900/20 font-medium group">
          <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Create Project</span>
        </button>
        <button onClick={() => onNavigate('reports')} className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 font-medium group">
          <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>View Reports</span>
        </button>
      </div>
    </div>
  )
}

// I'll continue with the remaining components in the next part...
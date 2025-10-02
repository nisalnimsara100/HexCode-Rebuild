"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { StaffManagement, TicketSystem, TaskAssignments, ProjectManagement, StaffReports, StaffSettings } from "./staff-components"
import { WebsiteOverview, ServicesManagement, PortfolioManagement, WebsiteStats, ContentManagement, WebsiteSettings, PricePackagesManagement } from "./website-components"
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
  status: 'open' | 'in-progress' | 'review' | 'closed'
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
  const { userProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeMainTab, setActiveMainTab] = useState<'staff' | 'website'>('staff')
  const [activeStaffTab, setActiveStaffTab] = useState('overview')
  const [activeWebsiteTab, setActiveWebsiteTab] = useState('overview')
  const [showModal, setShowModal] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Staff Management Data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@hexcode.com',
      role: 'Senior Developer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2024-01-15',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      workload: 85
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@hexcode.com',
      role: 'UI/UX Designer',
      department: 'Design',
      status: 'active',
      joinDate: '2024-02-20',
      skills: ['Figma', 'Adobe XD', 'React', 'CSS'],
      workload: 70
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@hexcode.com',
      role: 'Backend Developer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2024-03-10',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      workload: 90
    }
  ])

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Fix responsive design issues on mobile',
      description: 'Mobile layout breaks on devices smaller than 768px',
      status: 'open',
      priority: 'high',
      assignee: 'John Smith',
      assigneeEmail: 'john@hexcode.com',
      reporter: 'Admin',
      created: '2025-10-01',
      updated: '2025-10-01',
      dueDate: '2025-10-05',
      estimatedHours: 8,
      category: 'Frontend',
      project: 'E-commerce Platform'
    },
    {
      id: '2',
      title: 'Update API documentation',
      description: 'Update REST API docs with new endpoints',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Sarah Johnson',
      assigneeEmail: 'sarah@hexcode.com',
      reporter: 'Admin',
      created: '2025-09-30',
      updated: '2025-10-01',
      dueDate: '2025-10-03',
      estimatedHours: 4,
      category: 'Documentation',
      project: 'Internal Tools'
    }
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform Redesign',
      description: 'Complete redesign of the e-commerce platform with modern UI/UX',
      status: 'active',
      priority: 'high',
      progress: 75,
      startDate: '2025-09-15',
      deadline: '2025-10-30',
      budget: '$50,000',
      teamSize: 6,
      lead: 'John Smith',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      milestones: [
        { name: 'Design Phase', status: 'completed', date: '2025-09-30' },
        { name: 'Frontend Development', status: 'in-progress', date: '2025-10-15' },
        { name: 'Backend Integration', status: 'pending', date: '2025-10-25' },
        { name: 'Testing & Deployment', status: 'pending', date: '2025-10-30' }
      ]
    }
  ])

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
                onClick={() => router.push('/logout')}
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
                onClick={() => setActiveMainTab(tab.id as 'staff' | 'website')}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeMainTab === tab.id
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
                  className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeStaffTab === tab.id
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
                  className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeWebsiteTab === tab.id
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
        {activeMainTab === 'staff' && (
          <div>
            {activeStaffTab === 'overview' && <StaffOverview staffMembers={staffMembers} tickets={tickets} projects={projects} />}
            {activeStaffTab === 'staff' && <StaffManagement staffMembers={staffMembers} setStaffMembers={setStaffMembers} setShowModal={setShowModal} setEditingItem={setEditingItem} />}
            {activeStaffTab === 'tickets' && <TicketSystem tickets={tickets} setTickets={setTickets} staffMembers={staffMembers} setShowModal={setShowModal} setEditingItem={setEditingItem} />}
            {activeStaffTab === 'assignments' && <TaskAssignments staffMembers={staffMembers} />}
            {activeStaffTab === 'projects' && <ProjectManagement projects={projects} setProjects={setProjects} staffMembers={staffMembers} setShowModal={setShowModal} setEditingItem={setEditingItem} />}
            {activeStaffTab === 'reports' && <StaffReports staffMembers={staffMembers} tickets={tickets} projects={projects} />}
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
function StaffOverview({ staffMembers, tickets, projects }: { staffMembers: StaffMember[], tickets: Ticket[], projects: Project[] }) {
  const activeStaff = staffMembers.filter(s => s.status === 'active').length
  const openTickets = tickets.filter(t => t.status === 'open').length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const avgWorkload = Math.round(staffMembers.reduce((acc, s) => acc + s.workload, 0) / staffMembers.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-2">Staff Management Overview</h2>
        <p className="text-orange-100">Monitor and manage your team's productivity and assignments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold">Active Staff</h3>
              <p className="text-3xl font-bold text-white">{activeStaff}</p>
              <p className="text-gray-400 text-sm">of {staffMembers.length} total</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-400 font-semibold">Open Tickets</h3>
              <p className="text-3xl font-bold text-white">{openTickets}</p>
              <p className="text-gray-400 text-sm">Need attention</p>
            </div>
            <Ticket className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 font-semibold">Active Projects</h3>
              <p className="text-3xl font-bold text-white">{activeProjects}</p>
              <p className="text-gray-400 text-sm">In progress</p>
            </div>
            <FolderOpen className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 font-semibold">Avg Workload</h3>
              <p className="text-3xl font-bold text-white">{avgWorkload}%</p>
              <p className="text-gray-400 text-sm">Team capacity</p>
            </div>
            <Activity className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Recent Tickets</h3>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{ticket.title}</p>
                  <p className="text-gray-400 text-sm">{ticket.assignee || 'Unassigned'}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ticket.status === 'open' ? 'bg-orange-500' :
                  ticket.status === 'in-progress' ? 'bg-blue-500' :
                  ticket.status === 'review' ? 'bg-yellow-500' : 'bg-green-500'
                } text-white`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Team Workload</h3>
          <div className="space-y-3">
            {staffMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        member.workload >= 90 ? 'bg-red-500' :
                        member.workload >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${member.workload}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{member.workload}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// I'll continue with the remaining components in the next part...
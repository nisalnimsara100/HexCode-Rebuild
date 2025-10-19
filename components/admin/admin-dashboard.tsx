"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { WebsiteOverview, ServicesManagement, PortfolioManagement, WebsiteStats, ContentManagement, WebsiteSettings, PricePackagesManagement } from "./website-components-fixed"
import {
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  AlertCircle,
  TrendingUp,
  Activity,
  Shield,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
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
  Package,
  DollarSign
} from "lucide-react" 

// Staff Management Components
function StaffOverviewDashboard() {
  const [staffStats] = useState({
    totalStaff: 12,
    activeTickets: 24,
    completedTasks: 89,
    pendingAssignments: 7,
    onlineStaff: 8,
    projectsInProgress: 5
  })

  return (
    <div className="space-y-6">
      {/* Staff Overview Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-2">Staff Management Overview</h2>
        <p className="text-orange-100">Monitor and manage your team's productivity and assignments</p>
      </div>

      {/* Staff Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-400 font-semibold">Total Staff</h3>
              <p className="text-3xl font-bold text-white">{staffStats.totalStaff}</p>
              <p className="text-gray-400 text-sm">{staffStats.onlineStaff} currently online</p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold">Active Tickets</h3>
              <p className="text-3xl font-bold text-white">{staffStats.activeTickets}</p>
              <p className="text-gray-400 text-sm">{staffStats.pendingAssignments} pending assignment</p>
            </div>
            <AlertCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 font-semibold">Completed Tasks</h3>
              <p className="text-3xl font-bold text-white">{staffStats.completedTasks}</p>
              <p className="text-gray-400 text-sm">This month</p>
            </div>
            <Activity className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 font-semibold">Projects</h3>
              <p className="text-3xl font-bold text-white">{staffStats.projectsInProgress}</p>
              <p className="text-gray-400 text-sm">In progress</p>
            </div>
            <FolderOpen className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-400 font-semibold">Productivity</h3>
              <p className="text-3xl font-bold text-white">94%</p>
              <p className="text-gray-400 text-sm">Team efficiency</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-400 font-semibold">Overdue</h3>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-gray-400 text-sm">Tasks need attention</p>
            </div>
            <Clock className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">Assign New Ticket</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <Users className="w-6 h-6" />
          <span className="font-medium">Manage Staff</span>
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <FolderOpen className="w-6 h-6" />
          <span className="font-medium">Create Project</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <BarChart3 className="w-6 h-6" />
          <span className="font-medium">View Reports</span>
        </button>
      </div>
    </div>
  )
}

function SystemManagementPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-4">System Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold">Server Status</h3>
            <p className="text-xl font-bold text-white">Online</p>
            <p className="text-gray-400 text-sm">99.9% uptime</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold">CPU Usage</h3>
            <p className="text-xl font-bold text-white">45%</p>
            <p className="text-gray-400 text-sm">Normal load</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold">Memory</h3>
            <p className="text-xl font-bold text-white">67%</p>
            <p className="text-gray-400 text-sm">8GB used</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-purple-400 font-semibold">Storage</h3>
            <p className="text-xl font-bold text-white">234GB</p>
            <p className="text-gray-400 text-sm">Available</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            System Health Check
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
            Restart Services
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Emergency Shutdown
          </button>
        </div>
      </div>
    </div>
  )
}

function SecurityManagementPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Security Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold">Security Score</h3>
            <p className="text-2xl font-bold text-white">A+</p>
            <p className="text-gray-400 text-sm">Excellent</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold">Threats Blocked</h3>
            <p className="text-2xl font-bold text-white">47</p>
            <p className="text-gray-400 text-sm">This month</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold">Failed Logins</h3>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Security Scan
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
            Update Firewall
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

function StaffTicketManagement() {
  const [tickets] = useState([
    { 
      id: 1, 
      title: "Fix responsive design issues on mobile", 
      description: "Mobile layout breaks on devices smaller than 768px",
      assignee: "John Smith", 
      assigneeEmail: "john@hexcode.com",
      status: "open", 
      priority: "high", 
      created: "2025-10-01",
      dueDate: "2025-10-05",
      estimatedHours: 8,
      category: "Frontend",
      project: "E-commerce Platform"
    },
    { 
      id: 2, 
      title: "Update API documentation", 
      description: "Update REST API docs with new endpoints",
      assignee: "Sarah Johnson", 
      assigneeEmail: "sarah@hexcode.com",
      status: "in-progress", 
      priority: "medium", 
      created: "2025-09-30",
      dueDate: "2025-10-03",
      estimatedHours: 4,
      category: "Documentation",
      project: "Internal Tools"
    },
    { 
      id: 3, 
      title: "Database performance optimization", 
      description: "Optimize slow queries in user management module",
      assignee: "Mike Davis", 
      assigneeEmail: "mike@hexcode.com",
      status: "review", 
      priority: "high", 
      created: "2025-09-29",
      dueDate: "2025-10-02",
      estimatedHours: 12,
      category: "Backend",
      project: "User Management"
    },
    { 
      id: 4, 
      title: "Implement dark mode toggle", 
      description: "Add dark/light mode switch in user preferences",
      assignee: "Emily Chen", 
      assigneeEmail: "emily@hexcode.com",
      status: "closed", 
      priority: "low", 
      created: "2025-09-28",
      dueDate: "2025-10-01",
      estimatedHours: 6,
      category: "UI/UX",
      project: "Dashboard Redesign"
    },
  ])

  const [availableStaff] = useState([
    { name: "John Smith", email: "john@hexcode.com", department: "Frontend", workload: 75 },
    { name: "Sarah Johnson", email: "sarah@hexcode.com", department: "Documentation", workload: 60 },
    { name: "Mike Davis", email: "mike@hexcode.com", department: "Backend", workload: 90 },
    { name: "Emily Chen", email: "emily@hexcode.com", department: "UI/UX", workload: 45 },
    { name: "Alex Rodriguez", email: "alex@hexcode.com", department: "DevOps", workload: 30 },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-orange-500'
      case 'in-progress': return 'bg-blue-500'
      case 'review': return 'bg-yellow-500'
      case 'closed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-red-400 bg-red-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'low': return 'text-green-400 bg-green-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'text-red-400'
    if (workload >= 60) return 'text-yellow-400'
    return 'text-green-400'
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Staff Ticket Management</h2>
            <p className="text-gray-400">Assign and track tickets across your team</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Bulk Assign</span>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-orange-400 font-semibold">Open</h3>
            <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'open').length}</p>
            <p className="text-gray-400 text-xs">Need assignment</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold">In Progress</h3>
            <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'in-progress').length}</p>
            <p className="text-gray-400 text-xs">Active work</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold">In Review</h3>
            <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'review').length}</p>
            <p className="text-gray-400 text-xs">Pending approval</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold">Completed</h3>
            <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'closed').length}</p>
            <p className="text-gray-400 text-xs">This month</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold">Overdue</h3>
            <p className="text-2xl font-bold text-white">{tickets.filter(t => isOverdue(t.dueDate) && t.status !== 'closed').length}</p>
            <p className="text-gray-400 text-xs">Need attention</p>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white">{ticket.title}</div>
                        <div className="text-xs text-gray-400">#{ticket.id} • {ticket.project}</div>
                        <div className="text-xs text-gray-500">{ticket.category} • {ticket.estimatedHours}h estimated</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {ticket.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm text-white">{ticket.assignee}</div>
                          <div className="text-xs text-gray-400">{ticket.assigneeEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)} text-white`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{ticket.dueDate}</div>
                      {isOverdue(ticket.dueDate) && ticket.status !== 'closed' && (
                        <div className="text-xs text-red-400">Overdue</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-xs bg-blue-900/20 px-2 py-1 rounded">Edit</button>
                        <button className="text-green-400 hover:text-green-300 text-xs bg-green-900/20 px-2 py-1 rounded">Reassign</button>
                        <button className="text-yellow-400 hover:text-yellow-300 text-xs bg-yellow-900/20 px-2 py-1 rounded">Update</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Staff Workload Overview */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Staff Workload Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableStaff.map((staff, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{staff.name}</div>
                    <div className="text-xs text-gray-400">{staff.department}</div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getWorkloadColor(staff.workload)}`}>
                  {staff.workload}%
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    staff.workload >= 80 ? 'bg-red-500' : 
                    staff.workload >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${staff.workload}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">Workload</span>
                <button className="text-xs text-orange-400 hover:text-orange-300">Assign Task</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("staff-overview");
  const [activeSection, setActiveSection] = useState<"staff" | "projects" | "website">("staff");

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Modern Admin Header */}
      <header className="bg-gray-900 border-b border-orange-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-white text-xl font-bold">HexCode Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="text-white font-medium">{userProfile?.name || 'Administrator'}</p>
                <p className="text-orange-400">{userProfile?.role?.toUpperCase() || 'ADMIN'} • {userProfile?.department || 'Management'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Section Toggle */}
      <div className="bg-gray-900/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            <button
              onClick={() => {
                setActiveSection("staff");
                setActiveTab("staff-overview");
              }}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeSection === "staff"
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Staff Management
            </button>
            <button
              onClick={() => {
                setActiveSection("projects");
                setActiveTab("projects-overview");
              }}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeSection === "projects"
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Projects Management
            </button>
            <button
              onClick={() => {
                setActiveSection("website");
                setActiveTab("website-overview");
              }}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeSection === "website"
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Website Management
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {(activeSection === "staff" ? [
              { id: 'staff-overview', label: 'Staff Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'tickets', label: 'Ticket Management', icon: <AlertCircle className="w-4 h-4" /> },
              { id: 'assignments', label: 'Task Assignments', icon: <Users className="w-4 h-4" /> },
              { id: 'staff-projects', label: 'Project Management', icon: <FolderOpen className="w-4 h-4" /> },
              { id: 'team', label: 'Team Management', icon: <Users className="w-4 h-4" /> },
              { id: 'reports', label: 'Staff Reports', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'settings', label: 'Staff Settings', icon: <Settings className="w-4 h-4" /> }
            ] : activeSection === "projects" ? [
              { id: 'projects-overview', label: 'Projects Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'client-projects', label: 'Client Projects', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'project-requests', label: 'Project Requests', icon: <AlertCircle className="w-4 h-4" /> },
              { id: 'project-approvals', label: 'Approvals', icon: <CheckCircle className="w-4 h-4" /> },
              { id: 'client-dashboard-control', label: 'Client Dashboard Control', icon: <Settings className="w-4 h-4" /> },
              { id: 'project-analytics', label: 'Project Analytics', icon: <BarChart3 className="w-4 h-4" /> }
            ] : [
              { id: 'website-overview', label: 'Website Overview', icon: <Globe className="w-4 h-4" /> },
              { id: 'services', label: 'Services Management', icon: <Package className="w-4 h-4" /> },
              { id: 'packages', label: 'Price Packages', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'portfolio', label: 'Portfolio Management', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'analytics', label: 'Website Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'content', label: 'Content Management', icon: <FileText className="w-4 h-4" /> },
              { id: 'web-settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> }
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Staff Management Section */}
        {activeSection === "staff" && (
          <>
            {activeTab === "staff-overview" && <StaffOverviewDashboard />}
            {activeTab === "tickets" && <StaffTicketManagement />}
            {activeTab === "assignments" && <TaskAssignmentPanel />}
            {activeTab === "staff-projects" && <StaffProjectManagement />}
            {activeTab === "team" && <TeamManagementPanel />}
            {activeTab === "reports" && <StaffReportsPanel />}
            {activeTab === "settings" && <StaffSettingsPanel />}
          </>
        )}

        {/* Projects Management Section */}
        {activeSection === "projects" && (
          <>
            {activeTab === "projects-overview" && <ProjectsOverviewDashboard />}
            {activeTab === "client-projects" && <ClientProjectsManagement />}
            {activeTab === "project-requests" && <ProjectRequestsManagement />}
            {activeTab === "project-approvals" && <ProjectApprovalsManagement />}

            {activeTab === "client-dashboard-control" && <ClientDashboardControl />}
            {activeTab === "project-analytics" && <ProjectAnalyticsDashboard />}
          </>
        )}

        {/* Website Management Section */}
        {activeSection === "website" && (
          <>
            {activeTab === "website-overview" && <WebsiteOverview />}
            {activeTab === "services" && <ServicesManagement />}
            {activeTab === "packages" && <PricePackagesManagement />}
            {activeTab === "portfolio" && <PortfolioManagement />}
            {activeTab === "analytics" && <WebsiteStats />}
            {activeTab === "content" && <ContentManagement />}
            {activeTab === "web-settings" && <WebsiteSettings />}
          </>
        )}
      </main>
    </div>
  )
}

function TaskAssignmentPanel() {
  const [assignments] = useState([
    {
      id: 1,
      title: "Code Review - Authentication Module",
      assignedTo: "Sarah Johnson",
      assignedBy: "Admin",
      deadline: "2025-10-03",
      status: "pending",
      priority: "high",
      description: "Review new authentication code and provide feedback",
      estimatedHours: 3,
      progress: 0
    },
    {
      id: 2,
      title: "Database Migration Testing",
      assignedTo: "Mike Davis",
      assignedBy: "Admin",
      deadline: "2025-10-05",
      status: "in-progress",
      priority: "critical",
      description: "Test database migration scripts on staging environment",
      estimatedHours: 8,
      progress: 45
    },
    {
      id: 3,
      title: "UI Component Documentation",
      assignedTo: "Emily Chen",
      assignedBy: "Admin",
      deadline: "2025-10-07",
      status: "completed",
      priority: "medium",
      description: "Document all reusable UI components with examples",
      estimatedHours: 6,
      progress: 100
    }
  ])

  const [teamMembers] = useState([
    { name: "John Smith", email: "john@hexcode.com", role: "Senior Developer", availability: "Available" },
    { name: "Sarah Johnson", email: "sarah@hexcode.com", role: "Frontend Developer", availability: "Busy" },
    { name: "Mike Davis", email: "mike@hexcode.com", role: "Backend Developer", availability: "Available" },
    { name: "Emily Chen", email: "emily@hexcode.com", role: "UI/UX Designer", availability: "Available" },
    { name: "Alex Rodriguez", email: "alex@hexcode.com", role: "DevOps Engineer", availability: "On Leave" }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'in-progress': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'overdue': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'high': return <ArrowUp className="w-4 h-4 text-orange-500" />
      case 'medium': return <Minus className="w-4 h-4 text-yellow-500" />
      case 'low': return <ArrowDown className="w-4 h-4 text-green-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'text-green-400'
      case 'Busy': return 'text-yellow-400'
      case 'On Leave': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Task Assignment Dashboard</h2>
            <p className="text-gray-400">Delegate and track task assignments across your team</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Tasks</span>
            </button>
          </div>
        </div>

        {/* Assignment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold">Pending</h3>
            <p className="text-2xl font-bold text-white">{assignments.filter(a => a.status === 'pending').length}</p>
            <p className="text-gray-400 text-xs">Awaiting start</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold">In Progress</h3>
            <p className="text-2xl font-bold text-white">{assignments.filter(a => a.status === 'in-progress').length}</p>
            <p className="text-gray-400 text-xs">Active work</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold">Completed</h3>
            <p className="text-2xl font-bold text-white">{assignments.filter(a => a.status === 'completed').length}</p>
            <p className="text-gray-400 text-xs">This week</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-orange-400 font-semibold">Team Load</h3>
            <p className="text-2xl font-bold text-white">73%</p>
            <p className="text-gray-400 text-xs">Average capacity</p>
          </div>
        </div>

        {/* Active Assignments */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Assignments</h3>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getPriorityIcon(assignment.priority)}
                    <h4 className="text-white font-medium">{assignment.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)} text-white`}>
                      {assignment.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">{assignment.estimatedHours}h estimated</span>
                    <button className="text-orange-400 hover:text-orange-300">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-400">Assigned To</span>
                    <p className="text-sm text-white font-medium">{assignment.assignedTo}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Deadline</span>
                    <p className="text-sm text-white">{assignment.deadline}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Progress</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            assignment.progress >= 100 ? 'bg-green-500' : 
                            assignment.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${assignment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white">{assignment.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{assignment.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Update Progress</button>
                    <button className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded">Reassign</button>
                  </div>
                  <span className="text-xs text-gray-400">Assigned by {assignment.assignedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Availability */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Team Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{member.name}</div>
                  <div className="text-xs text-gray-400">{member.role}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${getAvailabilityColor(member.availability)}`}>
                  {member.availability}
                </span>
                <button className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded">
                  Assign Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StaffProjectManagement() {
  const [projects] = useState([
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      status: "active",
      progress: 75,
      priority: "high",
      deadline: "2025-10-30",
      budget: "$50,000",
      teamSize: 6,
      lead: "John Smith"
    }
  ])

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Staff Project Management</h2>
        <p className="text-gray-400">Oversee and coordinate all team projects</p>
      </div>
    </div>
  )
}

function TeamManagementPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Team Management Panel</h2>
        <p className="text-gray-400">Coming soon - comprehensive team management features</p>
      </div>
    </div>
  )
}

function StaffReportsPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Staff Reports Panel</h2>
        <p className="text-gray-400">Coming soon - detailed staff performance reports</p>
      </div>
    </div>
  )
}

function StaffSettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Staff Settings Panel</h2>
        <p className="text-gray-400">Coming soon - staff-related configuration settings</p>
      </div>
    </div>
  )
}

// Projects Management Components

function ProjectsOverviewDashboard() {
  const [projectStats] = useState({
    totalProjects: 28,
    activeProjects: 15,
    pendingApproval: 4,
    completedThisMonth: 12,
    totalClients: 18,
    totalRevenue: 485000,
    averageProjectValue: 17321,
    onTimeDelivery: 92
  })

  return (
    <div className="space-y-6">
      {/* Projects Overview Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-2">Projects Management Overview</h2>
        <p className="text-blue-100">Monitor and control all client projects, approvals, and roadmaps</p>
      </div>

      {/* Project Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold">Total Projects</h3>
              <p className="text-3xl font-bold text-white">{projectStats.totalProjects}</p>
              <p className="text-gray-400 text-sm">{projectStats.activeProjects} currently active</p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 font-semibold">Completed</h3>
              <p className="text-3xl font-bold text-white">{projectStats.completedThisMonth}</p>
              <p className="text-gray-400 text-sm">This month</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-400 font-semibold">Pending Approval</h3>
              <p className="text-3xl font-bold text-white">{projectStats.pendingApproval}</p>
              <p className="text-gray-400 text-sm">Needs review</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 font-semibold">Revenue</h3>
              <p className="text-3xl font-bold text-white">${(projectStats.totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-gray-400 text-sm">Total project value</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <Plus className="w-6 h-6" />
          <span className="font-medium">New Project</span>
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Review Approvals</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <Users className="w-6 h-6" />
          <span className="font-medium">Assign Team</span>
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors">
          <BarChart3 className="w-6 h-6" />
          <span className="font-medium">View Analytics</span>
        </button>
      </div>

      {/* Recent Project Activity */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Recent Project Activity</h3>
        <div className="space-y-4">
          {[
            { id: 1, type: "approval", message: "E-commerce Platform project approved", client: "TechCorp Inc.", time: "2 hours ago", status: "approved" },
            { id: 2, type: "request", message: "New mobile app project requested", client: "StartupXYZ", time: "4 hours ago", status: "pending" },
            { id: 3, type: "milestone", message: "Website redesign milestone completed", client: "DesignCo", time: "6 hours ago", status: "completed" },
            { id: 4, type: "payment", message: "Invoice payment received for API development", client: "DataTech", time: "1 day ago", status: "paid" }
          ].map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'approved' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' :
                  activity.status === 'completed' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}></div>
                <div>
                  <p className="text-white font-medium">{activity.message}</p>
                  <p className="text-gray-400 text-sm">{activity.client}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClientProjectsManagement() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "E-Commerce Platform",
      client: "TechCorp Inc.",
      clientEmail: "contact@techcorp.com",
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
      lastUpdate: "2 hours ago",
      objectives: [
        "Create responsive e-commerce website",
        "Integrate payment processing",
        "Implement user authentication",
        "Add admin dashboard",
        "Optimize for mobile devices"
      ],
      milestones: [
        { name: "UI/UX Design", completed: true, dueDate: "2024-01-30" },
        { name: "Frontend Development", completed: true, dueDate: "2024-02-15" },
        { name: "Backend API", completed: false, dueDate: "2024-02-28" },
        { name: "Payment Integration", completed: false, dueDate: "2024-03-10" },
        { name: "Testing & Launch", completed: false, dueDate: "2024-03-15" }
      ]
    },
    {
      id: "2",
      name: "Mobile App Development",
      client: "StartupXYZ",
      clientEmail: "hello@startupxyz.com",
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
      lastUpdate: "1 day ago",
      objectives: [
        "Develop cross-platform mobile app",
        "Implement real-time messaging",
        "Add social media integration",
        "Create user profiles",
        "Implement push notifications"
      ],
      milestones: [
        { name: "Project Planning", completed: true, dueDate: "2024-02-05" },
        { name: "App Design", completed: false, dueDate: "2024-02-20" },
        { name: "Core Development", completed: false, dueDate: "2024-03-20" },
        { name: "Testing Phase", completed: false, dueDate: "2024-04-15" },
        { name: "App Store Launch", completed: false, dueDate: "2024-05-01" }
      ]
    }
  ])

  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(projects[0])
  const [showProjectDetails, setShowProjectDetails] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [editingProject, setEditingProject] = useState<typeof projects[0] | null>(null)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    clientEmail: "",
    description: "",
    budget: 0,
    technologies: [],
    priority: "medium",
    objectives: [""],
    milestones: [{ name: "", dueDate: "", completed: false }]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "in-progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "planning": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "on-hold": return "bg-red-500/20 text-red-400 border-red-500/50";
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

  const handleAddProject = () => {
    const projectId = String(projects.length + 1);
    const newProjectData = {
      ...newProject,
      id: projectId,
      status: "planning",
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      spent: 0,
      team: [],
      lastUpdate: "Just created",
      objectives: newProject.objectives.filter(obj => obj.trim() !== ""),
      milestones: newProject.milestones.filter(ms => ms.name.trim() !== "")
    };
    setProjects([...projects, newProjectData]);
    setNewProject({
      name: "",
      client: "",
      clientEmail: "",
      description: "",
      budget: 0,
      technologies: [],
      priority: "medium",
      objectives: [""],
      milestones: [{ name: "", dueDate: "", completed: false }]
    });
    setShowAddProject(false);
  };

  const handleSaveEditProject = () => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      setShowAddProject(false);
      setEditingProject(null);
      if (selectedProject && selectedProject.id === editingProject.id) {
        setSelectedProject(editingProject);
      }
    }
  };

  const startEditProject = (project: typeof projects[0]) => {
    setEditingProject(project);
    setShowAddProject(true);
    setShowProjectDetails(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setProjects(projects.filter(p => p.id !== projectId));
      if (selectedProject && selectedProject.id === projectId) {
        setShowProjectDetails(false);
        setSelectedProject(null);
      }
    }
  };

  const handleStatusChange = (projectId: string, newStatus: string) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, status: newStatus, lastUpdate: "Just updated" }
        : p
    ));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, status: newStatus, lastUpdate: "Just updated" });
    }
  };

  const updateMilestone = (projectId: string, milestoneIndex: number, completed: boolean) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = [...p.milestones];
        updatedMilestones[milestoneIndex] = { ...updatedMilestones[milestoneIndex], completed };
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...p, milestones: updatedMilestones, progress, lastUpdate: "Milestone updated" };
      }
      return p;
    });
    setProjects(updatedProjects);
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Client Projects Management</h2>
            <p className="text-gray-400">Monitor and control all client projects and their progress</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => {setEditingProject(null); setShowAddProject(true)}}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Bulk Actions</span>
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-all cursor-pointer"
                 onClick={() => {setSelectedProject(project); setShowProjectDetails(true)}}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                  <p className="text-gray-400 text-sm">{project.client}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                    {project.status.replace("-", " ")}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{project.estimatedCompletion}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <div 
                        key={index}
                        className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-white font-medium"
                      >
                        {member.split(" ").map(n => n[0]).join("")}
                      </div>
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">{project.lastUpdate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                  <p className="text-gray-400">{selectedProject.client}</p>
                </div>
                <button 
                  onClick={() => setShowProjectDetails(false)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Info */}
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedProject.status)}`}>
                          {selectedProject.status.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(selectedProject.priority)}`}>
                          {selectedProject.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-white">${selectedProject.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spent:</span>
                        <span className="text-white">${selectedProject.spent.toLocaleString()}</span>
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
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Project Objectives</h3>
                    <div className="space-y-2">
                      {selectedProject.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Project Milestones</h3>
                    <div className="space-y-3">
                      {selectedProject.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              milestone.completed ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                              {milestone.completed && <span className="text-white text-xs">✓</span>}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{milestone.name}</p>
                              <p className="text-gray-400 text-xs">Due: {milestone.dueDate}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => updateMilestone(selectedProject.id, index, !milestone.completed)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            {milestone.completed ? 'Mark Incomplete' : 'Mark Complete'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Team Members</h3>
                    <div className="space-y-2">
                      {selectedProject.team.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm text-white font-medium">
                              {member.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-white text-sm">{member}</span>
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Contact
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => startEditProject(selectedProject)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Edit Project
                </button>
                <button 
                  onClick={() => {
                    const newStatus = selectedProject.status === 'active' ? 'completed' : 'active';
                    handleStatusChange(selectedProject.id, newStatus);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Update Status
                </button>
                <button 
                  onClick={() => setShowProjectDetails(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button 
                  onClick={() => setShowAddProject(false)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {e.preventDefault(); editingProject ? handleSaveEditProject() : handleAddProject();}} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                    <input 
                      type="text" 
                      required
                      value={editingProject ? editingProject.name : newProject.name}
                      onChange={(e) => editingProject 
                        ? setEditingProject({...editingProject, name: e.target.value})
                        : setNewProject({...newProject, name: e.target.value})
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                    <input 
                      type="text" 
                      required
                      value={editingProject ? editingProject.client : newProject.client}
                      onChange={(e) => editingProject 
                        ? setEditingProject({...editingProject, client: e.target.value})
                        : setNewProject({...newProject, client: e.target.value})
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select 
                      defaultValue={editingProject?.status || 'pending'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select 
                      defaultValue={editingProject?.priority || 'medium'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget ($)</label>
                    <input 
                      type="number" 
                      required
                      value={editingProject ? editingProject.budget : newProject.budget}
                      onChange={(e) => editingProject 
                        ? setEditingProject({...editingProject, budget: parseInt(e.target.value) || 0})
                        : setNewProject({...newProject, budget: parseInt(e.target.value) || 0})
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter budget amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Completion</label>
                    <input 
                      type="date" 
                      required
                      value={editingProject ? editingProject.estimatedCompletion : ''}
                      onChange={(e) => editingProject 
                        ? setEditingProject({...editingProject, estimatedCompletion: e.target.value})
                        : setNewProject({...newProject})
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={editingProject ? editingProject.description : newProject.description}
                    onChange={(e) => editingProject 
                      ? setEditingProject({...editingProject, description: e.target.value})
                      : setNewProject({...newProject, description: e.target.value})
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProjectRequestsManagement() {
  const [requests] = useState([
    {
      id: 1,
      projectName: "Enterprise CRM System",
      clientName: "GlobalTech Solutions",
      clientEmail: "ceo@globaltech.com",
      requestDate: "2024-10-18",
      estimatedBudget: 75000,
      description: "Comprehensive CRM system with analytics dashboard, customer management, and reporting features",
      requirements: "Multi-user authentication, Role-based access, Real-time analytics, Mobile responsive design, API integrations",
      priority: "high",
      status: "pending",
      urgency: "urgent",
      expectedStartDate: "2024-11-01",
      expectedDuration: "6 months"
    },
    {
      id: 2,
      projectName: "Food Delivery Mobile App",
      clientName: "QuickBite Inc.",
      clientEmail: "founder@quickbite.com", 
      requestDate: "2024-10-17",
      estimatedBudget: 45000,
      description: "Cross-platform mobile application for food ordering and delivery with real-time tracking",
      requirements: "GPS tracking, Payment integration, Push notifications, Restaurant management portal, Customer reviews system",
      priority: "medium",
      status: "under-review",
      urgency: "normal",
      expectedStartDate: "2024-12-01",
      expectedDuration: "4 months"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "under-review": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Project Requests Management</h2>
            <p className="text-gray-400">Review and manage incoming project requests from clients</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Bulk Approve
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Export Requests
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{request.projectName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(request.status)}`}>
                      {request.status.replace("-", " ")}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span>Client: {request.clientName}</span>
                    <span>•</span>
                    <span>Requested: {request.requestDate}</span>
                    <span>•</span>
                    <span>Budget: ${request.estimatedBudget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                    Approve
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
                    Review
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                    Reject
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{request.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Requirements</h4>
                  <p className="text-gray-300 text-sm">{request.requirements}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Project Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected Start:</span>
                      <span className="text-white">{request.expectedStartDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{request.expectedDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Urgency:</span>
                      <span className={`${request.urgency === 'urgent' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {request.urgency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Contact: {request.clientEmail}
                </div>
                <div className="flex space-x-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Contact Client
                  </button>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    Schedule Meeting
                  </button>
                  <button className="text-green-400 hover:text-green-300 text-sm">
                    Create Proposal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectApprovalsManagement() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Project Approvals Management</h2>
        <p className="text-gray-400">Manage project approvals, contracts, and client agreements</p>
        <div className="mt-6 p-8 bg-gray-800 rounded-lg text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-300">Project approvals system coming soon...</p>
        </div>
      </div>
    </div>
  )
}


function ClientDashboardControl() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Client Dashboard Control</h2>
        <p className="text-gray-400">Control what clients see in their dashboard - customize their experience</p>
        <div className="mt-6 p-8 bg-gray-800 rounded-lg text-center">
          <Settings className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <p className="text-gray-300">Client dashboard control panel coming soon...</p>
        </div>
      </div>
    </div>
  )
}

function ProjectAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Project Analytics Dashboard</h2>
        <p className="text-gray-400">Analytics and insights for all projects and client relationships</p>
        <div className="mt-6 p-8 bg-gray-800 rounded-lg text-center">
          <BarChart3 className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-300">Project analytics system coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { ClientProjectsManagement } from "./client-projects-management"
import { WebsiteOverview, ServicesManagement, PortfolioManagement, WebsiteStats, ContentManagement, WebsiteSettings, PricePackagesManagement } from "./website-components-fixed"
import { fetchPendingApprovalProjects, FirebaseClientProject, approveProject, rejectProject } from "@/lib/client-projects-firebase"
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
function ProjectRequestsManagement() {
  const [requests, setRequests] = useState<FirebaseClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch pending approval projects from Firebase
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const pendingProjects = await fetchPendingApprovalProjects();
        setRequests(pendingProjects);
      } catch (error) {
        console.error('Error fetching pending approval projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  // Handle project approval
  const handleApproveProject = async (projectId: string) => {
    try {
      setProcessingId(projectId);
      await approveProject(projectId);
      
      // Remove the approved project from the requests list
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== projectId)
      );
      
      // Show success message
      setSuccessMessage('Project approved successfully and moved to client projects!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error approving project:', error);
      // You can add error handling here (show error toast)
    } finally {
      setProcessingId(null);
    }
  };

  // Handle project rejection
  const handleRejectProject = async (projectId: string) => {
    try {
      setProcessingId(projectId);
      await rejectProject(projectId);
      
      // Remove the rejected project from the requests list
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== projectId)
      );
      
      // Show success message
      setSuccessMessage('Project rejected and removed from system.');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error rejecting project:', error);
      // You can add error handling here
    } finally {
      setProcessingId(null);
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-white">Project Requests Management</h2>
          <div className="mt-6 p-8 bg-gray-800 rounded-lg text-center">
            <p className="text-gray-300">Loading pending project requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
            <p className="text-green-400 font-medium">{successMessage}</p>
          </div>
        )}
        
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

        {requests.length === 0 ? (
          <div className="mt-6 p-8 bg-gray-800 rounded-lg text-center">
            <p className="text-gray-300">No pending project requests at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{request.name || 'Untitled Project'}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(request.status || 'pending-approval')}`}>
                      {(request.status || 'pending-approval').replace("-", " ")}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor('medium')}`}>
                      medium
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span>Client: {request.email || 'Not provided'}</span>
                    <span>•</span>
                    <span>Requested: {request.id ? new Date(parseInt(request.id)).toLocaleDateString() : 'Unknown'}</span>
                    <span>•</span>
                    <span>Budget: ${request.budget ? parseInt(request.budget.toString()).toLocaleString() : 'Not specified'}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleApproveProject(request.id)}
                    disabled={processingId === request.id}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {processingId === request.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
                    Review
                  </button>
                  <button 
                    onClick={() => handleRejectProject(request.id)}
                    disabled={processingId === request.id}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {processingId === request.id ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{request.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Requirements</h4>
                  <p className="text-gray-300 text-sm">{request.description || 'No requirements specified'}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Project Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected Start:</span>
                      <span className="text-white">{'To be determined'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{'To be estimated'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Urgency:</span>
                      <span className="text-yellow-400">
                        medium
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Contact: {request.email || 'Not provided'}
                </div>
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
            ))}
          </div>
        )}
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

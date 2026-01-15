// Staff Management Components

import { useState } from "react"
import { Edit, Trash2, Plus, Search, Filter, Users, Mail, Phone, AlertCircle, MoreVertical, Shield, UserMinus, UserCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { database } from "@/lib/firebase"
import { ref, update, remove } from "firebase/database"
import { useToast } from "@/components/ui/use-toast"

interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'on-leave'
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

// Staff Management Component
export function StaffManagement({
  staffMembers,
  setStaffMembers,
  setShowModal,
  setEditingItem
}: {
  staffMembers: StaffMember[]
  setStaffMembers: (members: StaffMember[]) => void
  setShowModal: (modal: string) => void
  setEditingItem: (item: any) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')

  const filteredStaff = staffMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === '' || member.department === filterDepartment)
  )

  const departments = [...new Set(staffMembers.map(s => s.department))]

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(staffMembers.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Management</h2>
          <p className="text-gray-400">Manage your team members and their information</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowModal('staff')
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-white font-semibold">{member.name}</h3>
                <p className="text-gray-400 text-sm">{member.role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{member.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{member.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'active' ? 'bg-green-500' :
                  member.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                  } text-white`}>
                  {member.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Workload:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${member.workload >= 90 ? 'bg-red-500' :
                        member.workload >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${member.workload}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{member.workload}%</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {member.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                    +{member.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingItem(member)
                  setShowModal('staff')
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-800 text-gray-400 hover:text-white">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // If currently staff, demote to employee. If anything else (active/employee), promote to staff.
                      const newRole = member.role === 'staff' ? 'employee' : 'staff';
                      update(ref(database, `users/${member.id}`), { role: newRole });
                      // Optimistic update handled, but listener will usually catch it
                    }}
                  >
                    {member.role === 'staff' ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4 text-orange-400" />
                        <span>Demote to Employee</span>
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4 text-green-400" />
                        <span>Promote to Staff</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    className="hover:bg-gray-800 cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => {
                      if (confirm("Are you sure you want to fire this employee? This will remove their access.")) {
                        update(ref(database, `users/${member.id}`), { status: 'inactive', role: 'fired' });
                        setStaffMembers(staffMembers.filter(s => s.id !== member.id)); // Remove from list or update status
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Fire Employee</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-gray-400 text-lg">No staff members found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

// Ticket System Component
export function TicketSystem({
  tickets,
  setTickets,
  staffMembers,
  setShowModal,
  setEditingItem
}: {
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
  staffMembers: StaffMember[]
  setShowModal: (modal: string) => void
  setEditingItem: (item: any) => void
}) {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  const filteredTickets = tickets.filter(ticket =>
    (filterStatus === '' || ticket.status === filterStatus) &&
    (filterPriority === '' || ticket.priority === filterPriority)
  )

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      setTickets(tickets.filter(t => t.id !== id))
    }
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(t =>
      t.id === ticketId ? { ...t, status: newStatus as any, updated: new Date().toISOString().split('T')[0] } : t
    ))
  }

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
      case 'critical': return 'text-red-400 bg-red-900/20'
      case 'high': return 'text-red-400 bg-red-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'low': return 'text-green-400 bg-green-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Ticket System</h2>
          <p className="text-gray-400">Manage and track support tickets</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowModal('ticket')
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-orange-400 font-semibold">Open</h3>
          <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'open').length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-blue-400 font-semibold">In Progress</h3>
          <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-yellow-400 font-semibold">Review</h3>
          <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'review').length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-green-400 font-semibold">Closed</h3>
          <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'closed').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{ticket.title}</div>
                      <div className="text-xs text-gray-400">#{ticket.id}</div>
                      <div className="text-xs text-gray-500">{ticket.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.assignee ? (
                      <div>
                        <div className="text-sm text-white">{ticket.assignee}</div>
                        <div className="text-xs text-gray-400">{ticket.assigneeEmail}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(ticket.status)}`}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {ticket.dueDate || 'No due date'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(ticket)
                          setShowModal('ticket')
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Task Assignments Component
export function TaskAssignments({ staffMembers }: { staffMembers: StaffMember[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Task Assignments</h2>
        <p className="text-gray-400">Delegate and track task assignments - Coming Soon</p>
      </div>
    </div>
  )
}

// Project Management Component
export function ProjectManagement({
  projects,
  setProjects,
  staffMembers,
  setShowModal,
  setEditingItem
}: {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  staffMembers: StaffMember[]
  setShowModal: (modal: string) => void
  setEditingItem: (item: any) => void
}) {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Management</h2>
          <p className="text-gray-400">Oversee and coordinate team projects</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowModal('project')
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-900 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
                <p className="text-gray-400">{project.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingItem(project)
                    setShowModal('project')
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-400">Status</span>
                <p className="text-sm text-white">{project.status}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Progress</span>
                <p className="text-sm text-white">{project.progress}%</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Team Lead</span>
                <p className="text-sm text-white">{project.lead}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Deadline</span>
                <p className="text-sm text-white">{project.deadline}</p>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full ${project.progress >= 100 ? 'bg-green-500' :
                  project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Staff Reports Component
export function StaffReports({
  staffMembers,
  tickets,
  projects
}: {
  staffMembers: StaffMember[]
  tickets: Ticket[]
  projects: Project[]
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Staff Reports</h2>
        <p className="text-gray-400">Comprehensive staff performance reports - Coming Soon</p>
      </div>
    </div>
  )
}

// Staff Settings Component
export function StaffSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Staff Settings</h2>
        <p className="text-gray-400">Staff management configuration - Coming Soon</p>
      </div>
    </div>
  )
}
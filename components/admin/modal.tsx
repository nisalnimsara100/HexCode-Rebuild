"use client"

import { useState, useEffect } from "react"
import { X, Save, Plus, Trash2 } from "lucide-react"

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

interface ModalProps {
  type: string
  editingItem: any
  onClose: () => void
  onSave: (data: any) => void
  staffMembers?: StaffMember[]
}

export function Modal({ type, editingItem, onClose, onSave, staffMembers = [] }: ModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem)
    } else {
      // Initialize with default values based on modal type
      switch (type) {
        case 'staff':
          setFormData({
            name: '',
            email: '',
            role: '',
            department: '',
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            skills: [],
            workload: 0
          })
          break
        case 'ticket':
          setFormData({
            title: '',
            description: '',
            status: 'open',
            priority: 'medium',
            assignee: '',
            assigneeEmail: '',
            reporter: 'Admin',
            created: new Date().toISOString().split('T')[0],
            updated: new Date().toISOString().split('T')[0],
            dueDate: '',
            estimatedHours: 0,
            category: '',
            project: ''
          })
          break
        case 'project':
          setFormData({
            name: '',
            description: '',
            status: 'planning',
            priority: 'medium',
            progress: 0,
            startDate: new Date().toISOString().split('T')[0],
            deadline: '',
            budget: '',
            teamSize: 1,
            lead: '',
            technologies: [],
            milestones: []
          })
          break
        case 'service':
          setFormData({
            title: '',
            description: '',
            price: '',
            features: [],
            icon: 'globe',
            category: '',
            isActive: true,
            order: 1
          })
          break
        case 'portfolio':
          setFormData({
            title: '',
            description: '',
            image: '',
            technologies: [],
            category: '',
            url: '',
            githubUrl: '',
            isActive: true,
            order: 1,
            client: '',
            completedDate: new Date().toISOString().split('T')[0]
          })
          break
      }
    }
  }, [type, editingItem])

  const validateForm = () => {
    const newErrors: any = {}

    switch (type) {
      case 'staff':
        if (!formData.name) newErrors.name = 'Name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        if (!formData.role) newErrors.role = 'Role is required'
        if (!formData.department) newErrors.department = 'Department is required'
        break
      case 'ticket':
        if (!formData.title) newErrors.title = 'Title is required'
        if (!formData.description) newErrors.description = 'Description is required'
        if (!formData.category) newErrors.category = 'Category is required'
        break
      case 'project':
        if (!formData.name) newErrors.name = 'Project name is required'
        if (!formData.description) newErrors.description = 'Description is required'
        if (!formData.deadline) newErrors.deadline = 'Deadline is required'
        if (!formData.lead) newErrors.lead = 'Project lead is required'
        break
      case 'service':
        if (!formData.title) newErrors.title = 'Service title is required'
        if (!formData.description) newErrors.description = 'Description is required'
        if (!formData.price) newErrors.price = 'Price is required'
        if (!formData.category) newErrors.category = 'Category is required'
        break
      case 'portfolio':
        if (!formData.title) newErrors.title = 'Project title is required'
        if (!formData.description) newErrors.description = 'Description is required'
        if (!formData.category) newErrors.category = 'Category is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const handleArrayFieldChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    handleInputChange(field, array)
  }

  const addMilestone = () => {
    const newMilestone = {
      name: '',
      status: 'pending' as const,
      date: ''
    }
    handleInputChange('milestones', [...(formData.milestones || []), newMilestone])
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    const milestones = [...(formData.milestones || [])]
    milestones[index] = { ...milestones[index], [field]: value }
    handleInputChange('milestones', milestones)
  }

  const removeMilestone = (index: number) => {
    const milestones = [...(formData.milestones || [])]
    milestones.splice(index, 1)
    handleInputChange('milestones', milestones)
  }

  const getModalTitle = () => {
    const action = editingItem ? 'Edit' : 'Add'
    switch (type) {
      case 'staff': return `${action} Staff Member`
      case 'ticket': return `${action} Ticket`
      case 'project': return `${action} Project`
      case 'service': return `${action} Service`
      case 'portfolio': return `${action} Portfolio Project`
      default: return `${action} Item`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === 'staff' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.role ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="e.g., Senior Developer"
                  />
                  {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department *</label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.department ? 'border-red-500' : 'border-gray-700'}`}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                  {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate || ''}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Workload (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.workload || 0}
                    onChange={(e) => handleInputChange('workload', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('skills', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="React, Node.js, TypeScript, AWS"
                />
              </div>
            </>
          )}

          {type === 'ticket' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.title ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter ticket title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                  rows={3}
                  placeholder="Describe the issue or task"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status || 'open'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.category ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="e.g., Frontend, Backend"
                  />
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Assignee</label>
                  <select
                    value={formData.assignee || ''}
                    onChange={(e) => {
                      const selectedStaff = staffMembers.find(s => s.name === e.target.value)
                      handleInputChange('assignee', e.target.value)
                      handleInputChange('assigneeEmail', selectedStaff?.email || '')
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Unassigned</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.name}>{staff.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedHours || 0}
                    onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
                  <input
                    type="text"
                    value={formData.project || ''}
                    onChange={(e) => handleInputChange('project', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Associated project"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'project' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter project name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                  rows={3}
                  placeholder="Describe the project"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status || 'planning'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress || 0}
                    onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline || ''}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.deadline ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.deadline && <p className="text-red-400 text-sm mt-1">{errors.deadline}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget</label>
                  <input
                    type="text"
                    value={formData.budget || ''}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="$50,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.teamSize || 1}
                    onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Lead *</label>
                  <select
                    value={formData.lead || ''}
                    onChange={(e) => handleInputChange('lead', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${errors.lead ? 'border-red-500' : 'border-gray-700'}`}
                  >
                    <option value="">Select Lead</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.name}>{staff.name}</option>
                    ))}
                  </select>
                  {errors.lead && <p className="text-red-400 text-sm mt-1">{errors.lead}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('technologies', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Milestones</label>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="text-orange-400 hover:text-orange-300 text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Milestone</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.milestones || []).map((milestone: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        placeholder="Milestone name"
                      />
                      <select
                        value={milestone.status}
                        onChange={(e) => updateMilestone(index, 'status', e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <input
                        type="date"
                        value={milestone.date}
                        onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'service' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter service title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                  rows={3}
                  placeholder="Describe the service"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                  <input
                    type="text"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="$2,500"
                  />
                  {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="e.g., Development"
                  />
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order || 1}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Features (comma-separated)</label>
                <textarea
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('features', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={2}
                  placeholder="Responsive Design, SEO Optimized, Fast Loading"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive || false}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">Active (visible on website)</label>
              </div>
            </>
          )}

          {type === 'portfolio' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 ${errors.title ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                  rows={3}
                  placeholder="Describe the project"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 ${errors.category ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="e.g., Web Development"
                  />
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Completed Date</label>
                  <input
                    type="date"
                    value={formData.completedDate || ''}
                    onChange={(e) => handleInputChange('completedDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project URL</label>
                  <input
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                  <input
                    type="text"
                    value={formData.client || ''}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order || 1}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('technologies', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="portfolioActive"
                  checked={formData.isActive || false}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="portfolioActive" className="text-sm text-gray-300">Active (visible on website)</label>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 ${
                type === 'staff' ? 'bg-orange-500 hover:bg-orange-600' :
                type === 'ticket' ? 'bg-orange-500 hover:bg-orange-600' :
                type === 'project' ? 'bg-orange-500 hover:bg-orange-600' :
                type === 'service' ? 'bg-blue-500 hover:bg-blue-600' :
                'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{editingItem ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
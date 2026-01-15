"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, push, update, remove, onValue } from "firebase/database"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
    Plus,
    Calendar,
    AlertTriangle,
    ArrowUp,
    Minus,
    ArrowDown,
    MoreHorizontal,
    Briefcase,
    Users,
    CheckCircle,
    Clock,
    Trash2,
    Search,
    Edit3,
    UserPlus,
    X
} from "lucide-react"

// Types
interface Task {
    id: string
    title: string
    description: string
    projectId: string
    assignedTo: string[] // Array of User UIDs
    status: 'pending' | 'in-progress' | 'completed' | 'overdue'
    priority: 'low' | 'medium' | 'high' | 'critical'
    dueDate: string
    estimatedHours: string | number
    assignedBy: string // User UID or Name
    createdAt: string
    progress: number
    // Helper fields for display
    projectName?: string
    assigneeNames?: string[]
    assigneeAvatars?: string[]
}

interface Project {
    id: string
    title: string
}

interface StaffMember {
    uid: string
    name: string
    role: string
    avatar?: string
    status?: 'available' | 'busy' | 'on_leave' // From DB
    dbStatus?: string // Raw status from DB to differentiate
}

export function StaffTaskAssignments() {
    const { toast } = useToast()

    // Data State
    const [tasks, setTasks] = useState<Task[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [staffList, setStaffList] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAssignExistingOpen, setIsAssignExistingOpen] = useState(false)

    // Selection State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [selectedStaffId, setSelectedStaffId] = useState<string>("")
    const [taskToAssignId, setTaskToAssignId] = useState<string>("")
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

    const [formData, setFormData] = useState<{
        title: string
        description: string
        projectId: string
        assignedTo: string[]
        status: 'pending' | 'in-progress' | 'completed' | 'overdue'
        priority: 'low' | 'medium' | 'high' | 'critical'
        dueDate: string
        estimatedHours: string
        progress: number
    }>({
        title: "",
        description: "",
        projectId: "",
        assignedTo: [],
        status: "pending",
        priority: "medium",
        dueDate: "",
        estimatedHours: "",
        progress: 0
    })

    // --- Fetch Data ---
    useEffect(() => {
        setLoading(true)

        // 1. Projects
        const projectsRef = ref(database, 'staffdashboard/projects')
        const unsubProjects = onValue(projectsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setProjects(Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    title: val.title || "Untitled Project"
                })))
            } else {
                setProjects([])
            }
        })

        // 2. Staff
        const usersRef = ref(database, 'users')
        const unsubUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setStaffList(Object.entries(data).map(([uid, val]: [string, any]) => ({
                    uid,
                    name: val.name || "Unknown",
                    role: val.role || "staff",
                    avatar: val.profilePicture,
                    dbStatus: val.status // Keep raw DB status
                })).filter(u => u.role !== 'client' && u.name !== 'Unknown'))
            }
        })

        // 3. Tasks
        const tasksRef = ref(database, 'staffdashboard/tasks')
        const unsubTasks = onValue(tasksRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const taskList = Object.entries(data).map(([id, val]: [string, any]) => {
                    // Normalize assignedTo to always be an array
                    let assignedTo: string[] = []
                    if (Array.isArray(val.assignedTo)) {
                        assignedTo = val.assignedTo
                    } else if (typeof val.assignedTo === 'string' && val.assignedTo) {
                        assignedTo = [val.assignedTo]
                    }

                    return {
                        id,
                        ...val,
                        assignedTo
                    }
                })
                setTasks(taskList)
            } else {
                setTasks([])
            }
            setLoading(false)
        })

        return () => {
            unsubProjects()
            unsubUsers()
            unsubTasks()
        }
    }, [])

    // --- Logic / Calculations ---

    const getStaffStatus = (member: StaffMember) => {
        // Priority 1: DB Status 'on_leave' override
        if (member.dbStatus === 'on_leave') return 'on_leave'

        // Priority 2: Workload Calculation
        // Count ACTIVE tasks (pending/in-progress) assigned to this user
        const activeTaskCount = tasks.filter(t =>
            (t.status === 'pending' || t.status === 'in-progress' || t.status === 'overdue') &&
            t.assignedTo.includes(member.uid)
        ).length

        if (activeTaskCount >= 10) return 'busy'
        return 'available'
    }

    const getEnrichedTasks = () => {
        return tasks.map(task => {
            const project = projects.find(p => p.id === task.projectId)
            const assignees = task.assignedTo.map(uid => staffList.find(s => s.uid === uid)).filter(Boolean) as StaffMember[]

            return {
                ...task,
                projectName: project?.title || "Unknown Project",
                assigneeNames: assignees.map(a => a.name),
                assigneeAvatars: assignees.map(a => a.avatar).filter(Boolean) as string[]
            }
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    const enrichedTasks = getEnrichedTasks()

    // Get ALL tasks for assignment modal (even if already assigned to others)
    // We filter out tasks ALREADY assigned to the Selected Staff Member
    const availableTasksForStaff = enrichedTasks.filter(t =>
        selectedStaffId ? !t.assignedTo.includes(selectedStaffId) : true
    )

    // --- Actions ---

    const handleCreateTask = async () => {
        if (!formData.title || !formData.projectId) {
            toast({ title: "Error", description: "Title and Project are required", variant: "destructive" })
            return
        }

        try {
            const newTask = {
                ...formData,
                createdAt: new Date().toISOString(),
                assignedBy: "Admin",
                progress: 0,
                status: "pending"
            }

            await push(ref(database, 'staffdashboard/tasks'), newTask)

            toast({ title: "Success", description: "Task created successfully" })
            setIsCreateModalOpen(false)
            resetFormData()
        } catch (e) {
            console.error(e)
            toast({ title: "Error", description: "Failed to create task", variant: "destructive" })
        }
    }

    const handleEditTask = async () => {
        if (!selectedTask) return
        try {
            // Update only metadata fields
            await update(ref(database, `staffdashboard/tasks/${selectedTask.id}`), {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate,
                estimatedHours: formData.estimatedHours,
                projectId: formData.projectId,
                assignedTo: formData.assignedTo // Full replacement of array
            })
            toast({ title: "Updated", description: "Task details updated." })
            setIsEditModalOpen(false)
            setSelectedTask(null)
            resetFormData()
        } catch (err) {
            toast({ title: "Error", description: "Failed to update task.", variant: "destructive" })
        }
    }

    const handleDeleteTask = (id: string) => {
        setTaskToDelete(id)
    }

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return
        try {
            await remove(ref(database, `staffdashboard/tasks/${taskToDelete}`))
            toast({ title: "Deleted", description: "Task removed" })
        } catch (e) {
            toast({ title: "Error", description: "Failed to delete task", variant: "destructive" })
        } finally {
            setTaskToDelete(null)
        }
    }

    // Add Staff to Existing Task (Assign Existing)
    const handleAssignExisting = async () => {
        if (!selectedStaffId || !taskToAssignId) return

        const task = tasks.find(t => t.id === taskToAssignId)
        if (!task) return

        // Add user to existing array
        const newAssignedTo = [...(task.assignedTo || []), selectedStaffId]

        try {
            await update(ref(database, `staffdashboard/tasks/${taskToAssignId}`), {
                assignedTo: newAssignedTo
            })
            toast({ title: "Assigned", description: "Task assigned to staff member." })
            setIsAssignExistingOpen(false)
            setSelectedStaffId("")
            setTaskToAssignId("")
        } catch (err) {
            toast({ title: "Error", description: "Failed to assign task.", variant: "destructive" })
        }
    }

    // Toggle Staff in Selection (Create/Edit Modal)
    const toggleStaffSelection = (uid: string) => {
        const current = formData.assignedTo
        if (current.includes(uid)) {
            setFormData({ ...formData, assignedTo: current.filter(id => id !== uid) })
        } else {
            setFormData({ ...formData, assignedTo: [...current, uid] })
        }
    }

    const openEditModal = (task: Task) => {
        setSelectedTask(task)
        setFormData({
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            assignedTo: task.assignedTo || [],
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            estimatedHours: task.estimatedHours as string,
            progress: task.progress
        })
        setIsEditModalOpen(true)
    }

    const resetFormData = () => {
        setFormData({
            title: "", description: "", projectId: "", assignedTo: [],
            status: "pending", priority: "medium", dueDate: "", estimatedHours: "", progress: 0
        })
    }

    // --- UI Helpers ---
    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
            case 'high': return <ArrowUp className="w-4 h-4 text-orange-500" />
            case 'medium': return <Minus className="w-4 h-4 text-yellow-500" />
            case 'low': return <ArrowDown className="w-4 h-4 text-green-500" />
            default: return <Minus className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
            case 'in-progress': return 'bg-blue-500/20 text-blue-500 border-blue-500/50'
            case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/50'
            case 'overdue': return 'bg-red-500/20 text-red-500 border-red-500/50'
            default: return 'bg-gray-500/20 text-gray-500'
        }
    }

    // Stats
    const pendingCount = tasks.filter(t => t.status === 'pending').length
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
    const completedCount = tasks.filter(t => t.status === 'completed').length

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Task Assignment Dashboard</h2>
                    <p className="text-sm text-gray-400">Delegate and track task assignments across your team</p>
                </div>
                <div className="flex space-x-3">
                    <Button onClick={() => { resetFormData(); setIsCreateModalOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Create Task
                    </Button>
                </div>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                    <div className="p-4">
                        <h3 className="text-yellow-400 font-semibold mb-1">Pending</h3>
                        <p className="text-2xl font-bold text-white">{pendingCount}</p>
                        <p className="text-gray-400 text-xs mt-1">Awaiting start</p>
                    </div>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <div className="p-4">
                        <h3 className="text-blue-400 font-semibold mb-1">In Progress</h3>
                        <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                        <p className="text-gray-400 text-xs mt-1">Active work</p>
                    </div>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <div className="p-4">
                        <h3 className="text-green-400 font-semibold mb-1">Completed</h3>
                        <p className="text-2xl font-bold text-white">{completedCount}</p>
                        <p className="text-gray-400 text-xs mt-1">Recently finished</p>
                    </div>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <div className="p-4">
                        <h3 className="text-orange-400 font-semibold mb-1">Total Tasks</h3>
                        <p className="text-2xl font-bold text-white">{tasks.length}</p>
                        <p className="text-gray-400 text-xs mt-1">All time</p>
                    </div>
                </Card>
            </div>

            {/* Active Assignments List (Moved to Top) */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Assignments</h3>
                <div className="space-y-4">
                    {loading ? <div className="text-white">Loading assignments...</div> : enrichedTasks.length === 0 ? <div className="text-gray-400">No active assignments found.</div> :
                        enrichedTasks.map(task => (
                            <div key={task.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group">
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="mt-1">{getPriorityIcon(task.priority)}</div>
                                            <div>
                                                <h4 className={`text-white font-medium text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Briefcase className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs text-gray-400">{task.projectName}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={`${getStatusColor(task.status)} uppercase border ml-2`}>
                                                {task.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 mt-4">
                                            <div>
                                                <span className="text-xs text-gray-500 block mb-1">Assigned To</span>
                                                <div className="flex items-center gap-2">
                                                    {/* Avatars Stack */}
                                                    <div className="flex -space-x-2">
                                                        {task.assigneeAvatars && task.assigneeAvatars.length > 0 ? (
                                                            task.assigneeAvatars.map((avatar, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center overflow-hidden">
                                                                    <img src={avatar} className="w-full h-full object-cover" />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">?</div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-300 truncate max-w-[150px]">
                                                        {task.assigneeNames && task.assigneeNames.length > 0 ? task.assigneeNames.slice(0, 2).join(", ") + (task.assigneeNames.length > 2 ? ` +${task.assigneeNames.length - 2}` : "") : "Unassigned"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 block mb-1">Due Date</span>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Calendar className="w-3 h-3" /> {task.dueDate || "No deadline"}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 block mb-1">Est. Hours</span>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Clock className="w-3 h-3" /> {task.estimatedHours || 0}h
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 shrink-0 border-l border-gray-700 pl-4 md:pl-6 ml-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs h-7 border-gray-600 hover:bg-gray-700"
                                            onClick={() => openEditModal(task)}
                                        >
                                            <Edit3 className="w-3 h-3 mr-2" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20 self-end mt-1"
                                            onClick={() => handleDeleteTask(task.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Team Availability Section (Moved to Bottom) */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-emerald-500" />
                    Team Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {staffList.map(member => {
                        const status = getStaffStatus(member)
                        return (
                            <Card key={member.uid} className="bg-gray-900 border-gray-800 p-4 flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold overflow-hidden">
                                            {member.avatar ? <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" /> : member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{member.name}</p>
                                            <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className={`text-xs font-medium ${status === 'available' ? 'text-emerald-400' :
                                        status === 'busy' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {status === 'available' ? 'Available' : status === 'busy' ? 'Busy (10+)' : 'On Leave'}
                                    </span>

                                    <Button
                                        size="sm"
                                        className="bg-orange-600/90 hover:bg-orange-700 h-7 text-xs"
                                        onClick={() => {
                                            setSelectedStaffId(member.uid);
                                            setIsAssignExistingOpen(true);
                                        }}
                                    >
                                        Assign Task
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* --- Modals --- */}

            {/* 1. Create Task Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Form Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Task Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                    placeholder="e.g. Design System"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, projectId: v })} value={formData.projectId}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Select Project" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        {projects.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Assign To (Multi-select)</Label>
                                <div className="bg-gray-800 border border-gray-700 rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                                    {staffList.map(u => (
                                        <div
                                            key={u.uid}
                                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors select-none ${formData.assignedTo.includes(u.uid) ? 'bg-orange-600/20 border border-orange-600/50' : 'hover:bg-gray-700'
                                                }`}
                                            onClick={() => toggleStaffSelection(u.uid)}
                                        >
                                            <div className={`shrink-0 w-3 h-3 rounded-full border ${formData.assignedTo.includes(u.uid) ? 'bg-orange-500 border-orange-500' : 'border-gray-500'}`} />
                                            <span className="text-sm text-gray-300 truncate">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select onValueChange={(v: any) => setFormData({ ...formData, priority: v })} defaultValue="medium" value={formData.priority}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                    placeholder="Task details..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Estimated Hours</Label>
                                <Input
                                    type="number"
                                    value={formData.estimatedHours}
                                    onChange={e => setFormData({ ...formData, estimatedHours: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTask} className="bg-orange-600 hover:bg-orange-700">Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. Edit Task Modal (Admin Edit) */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Task Details</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Task Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, projectId: v })} value={formData.projectId}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Select Project" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        {projects.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Assign To (Multi-select)</Label>
                                <div className="bg-gray-800 border border-gray-700 rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                                    {staffList.map(u => (
                                        <div
                                            key={u.uid}
                                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors select-none ${formData.assignedTo.includes(u.uid) ? 'bg-orange-600/20 border border-orange-600/50' : 'hover:bg-gray-700'
                                                }`}
                                            onClick={() => toggleStaffSelection(u.uid)}
                                        >
                                            <div className={`shrink-0 w-3 h-3 rounded-full border ${formData.assignedTo.includes(u.uid) ? 'bg-orange-500 border-orange-500' : 'border-gray-500'}`} />
                                            <span className="text-sm text-gray-300 truncate">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select onValueChange={(v: any) => setFormData({ ...formData, priority: v })} value={formData.priority}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Estimated Hours</Label>
                                <Input
                                    type="number"
                                    value={formData.estimatedHours}
                                    onChange={e => setFormData({ ...formData, estimatedHours: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditTask} className="bg-orange-600 hover:bg-orange-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 4. Assign Existing Task (from Team Availability) */}
            <Dialog open={isAssignExistingOpen} onOpenChange={setIsAssignExistingOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Assign Existing Task</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-gray-400">Select a task that to assign to this team member (can include tasks already assigned to others).</p>
                        <div className="space-y-2">
                            <Label>Select Task</Label>
                            <Select onValueChange={setTaskToAssignId}>
                                <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue placeholder="Select a task..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    {availableTasksForStaff.length === 0 ? (
                                        <SelectItem value="none" disabled>No available tasks</SelectItem>
                                    ) : (
                                        availableTasksForStaff.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.title} ({t.assigneeNames?.length ? `${t.assigneeNames.length} assigned` : 'Unassigned'})</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAssignExisting} className="bg-emerald-600 hover:bg-emerald-700">Assign Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteTask} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete Task</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, push, update, remove, onValue } from "firebase/database"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
    Trash2
} from "lucide-react"

// Types
interface Task {
    id: string
    title: string
    description: string
    projectId: string
    assignedTo: string // User UID
    status: 'pending' | 'in-progress' | 'completed' | 'overdue'
    priority: 'low' | 'medium' | 'high' | 'critical'
    dueDate: string
    estimatedHours: string
    assignedBy: string // User UID or Name
    createdAt: string
    // Helper fields for display
    projectName?: string
    assigneeName?: string
    assigneeAvatar?: string
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
    status?: string // Online/Busy etc
}

export function StaffTaskAssignments() {
    const { toast } = useToast()

    // Data State
    const [tasks, setTasks] = useState<Task[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [staffList, setStaffList] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState<Partial<Task>>({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
        estimatedHours: ""
    })

    // --- Fetch Data ---
    useEffect(() => {
        setLoading(true)

        // 1. Projects (for selection)
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

        // 2. Staff (for assignment)
        const usersRef = ref(database, 'users')
        const unsubUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setStaffList(Object.entries(data).map(([uid, val]: [string, any]) => ({
                    uid,
                    name: val.name || "Unknown",
                    role: val.role || "staff",
                    avatar: val.profilePicture,
                    status: val.status || 'offline'
                })).filter(u => u.role !== 'client' && u.name !== 'Unknown'))
            }
        })

        // 3. Tasks
        const tasksRef = ref(database, 'staffdashboard/tasks')
        const unsubTasks = onValue(tasksRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const taskList = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val
                }))
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

    // --- Helpers ---
    const getEnrichedTasks = () => {
        return tasks.map(task => {
            const project = projects.find(p => p.id === task.projectId)
            const assignee = staffList.find(s => s.uid === task.assignedTo)
            return {
                ...task,
                projectName: project?.title || "Unknown Project",
                assigneeName: assignee?.name || "Unassigned",
                assigneeAvatar: assignee?.avatar
            }
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    const enrichedTasks = getEnrichedTasks()

    const handleSaveTask = async () => {
        if (!formData.title || !formData.projectId || !formData.assignedTo) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
            return
        }

        try {
            const newTask = {
                ...formData,
                createdAt: new Date().toISOString(),
                assignedBy: "Admin" // You might want to get actual user here
            }

            await push(ref(database, 'staffdashboard/tasks'), newTask)

            toast({ title: "Success", description: "Task assigned successfully" })
            setIsModalOpen(false)
            setFormData({
                title: "", description: "", projectId: "", assignedTo: "",
                status: "pending", priority: "medium", dueDate: "", estimatedHours: ""
            })
        } catch (e) {
            console.error(e)
            toast({ title: "Error", description: "Failed to save task", variant: "destructive" })
        }
    }

    const handleDeleteTask = async (id: string) => {
        if (confirm("Delete this task assignment?")) {
            await remove(ref(database, `staffdashboard/tasks/${id}`))
            toast({ title: "Deleted", description: "Task removed" })
        }
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Task Assignment Dashboard</h2>
                        <p className="text-gray-400">Delegate and track task assignments across your team</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> New Assignment
                        </Button>
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            <Calendar className="w-4 h-4 mr-2" /> Schedule Tasks
                        </Button>
                    </div>
                </div>

                {/* Stats */}
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
            </div>

            {/* Task List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Assignments</h3>
                <div className="space-y-4">
                    {loading ? <div className="text-white">Loading...</div> : enrichedTasks.length === 0 ? <div className="text-gray-400">No tasks found.</div> :
                        enrichedTasks.map(task => (
                            <div key={task.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">{getPriorityIcon(task.priority)}</div>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">{task.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Briefcase className="w-3 h-3 text-gray-500" />
                                                <span className="text-xs text-gray-400">{task.projectName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`${getStatusColor(task.status)} uppercase border`}>
                                        {task.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Assigned To</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white overflow-hidden">
                                                {task.assigneeAvatar ? <img src={task.assigneeAvatar} /> : task.assigneeName[0]}
                                            </div>
                                            <span className="text-sm text-gray-300">{task.assigneeName}</span>
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

                                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                    <p className="text-sm text-gray-400 truncate max-w-[60%]">{task.description}</p>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* New Assignment Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create New Task Assignment</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Task Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                    placeholder="e.g. API Integration"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, projectId: v })}>
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

                            <div className="space-y-2">
                                <Label>Assign To</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, assignedTo: v })}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Select Member" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        {staffList.map(u => (
                                            <SelectItem key={u.uid} value={u.uid}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select onValueChange={(v: any) => setFormData({ ...formData, priority: v })} defaultValue="medium">
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
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveTask} className="bg-orange-600 hover:bg-orange-700">Assign Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

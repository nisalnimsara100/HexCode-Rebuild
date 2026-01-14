"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, push, update, remove, onValue } from "firebase/database"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, Plus, Search, Filter, MoreVertical, Edit2, Trash2, User, Calendar as CalendarIcon } from "lucide-react"

interface Ticket {
    id: string
    title: string
    description: string
    assignedTo: {
        id: string
        name: string
        email: string
        avatar?: string
    }
    status: 'open' | 'in-progress' | 'review' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'critical'
    dueDate: string
    estimatedHours: string
    category: string
    project: string
}

interface TeamMember {
    uid: string
    name: string
    email: string
    profilePicture?: string
}

export function StaffTicketManagement() {
    const { toast } = useToast()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [staffList, setStaffList] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assigneeId: "",
        status: "open",
        priority: "medium",
        dueDate: "",
        estimatedHours: "",
        category: "",
        project: ""
    })

    // Fetch Data
    useEffect(() => {
        const ticketsRef = ref(database, 'tickets')
        const usersRef = ref(database, 'users')

        const unsubscribeTickets = onValue(ticketsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const ticketList = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val
                }))
                setTickets(ticketList)
            } else {
                setTickets([])
            }
            setLoading(false)
        })

        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const users = Object.entries(data)
                    .map(([uid, val]: [string, any]) => ({
                        uid,
                        name: val.name,
                        email: val.email,
                        profilePicture: val.profilePicture
                    }))
                    .filter(u => u.name) // Simple filter
                setStaffList(users)
            }
        })

        return () => {
            unsubscribeTickets()
            unsubscribeUsers()
        }
    }, [])

    const handleOpenModal = (ticket?: Ticket) => {
        if (ticket) {
            setEditingTicket(ticket)
            setFormData({
                title: ticket.title,
                description: ticket.description,
                assigneeId: ticket.assignedTo?.id || "",
                status: ticket.status,
                priority: ticket.priority,
                dueDate: ticket.dueDate,
                estimatedHours: ticket.estimatedHours,
                category: ticket.category,
                project: ticket.project
            })
        } else {
            setEditingTicket(null)
            setFormData({
                title: "",
                description: "",
                assigneeId: "",
                status: "open",
                priority: "medium",
                dueDate: "",
                estimatedHours: "",
                category: "",
                project: ""
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!formData.title || !formData.assigneeId) {
            toast({ title: "Error", description: "Title and Assignee are required", variant: "destructive" })
            return
        }

        const assignee = staffList.find(u => u.uid === formData.assigneeId)
        if (!assignee) return

        const ticketData = {
            title: formData.title,
            description: formData.description,
            assignedTo: {
                id: assignee.uid,
                name: assignee.name,
                email: assignee.email,
                avatar: assignee.profilePicture || ""
            },
            status: formData.status,
            priority: formData.priority,
            dueDate: formData.dueDate,
            estimatedHours: formData.estimatedHours,
            category: formData.category,
            project: formData.project,
            updatedAt: new Date().toISOString()
        }

        try {
            if (editingTicket) {
                await update(ref(database, `tickets/${editingTicket.id}`), ticketData)
                toast({ title: "Success", description: "Ticket updated" })
            } else {
                await push(ref(database, 'tickets'), {
                    ...ticketData,
                    createdAt: new Date().toISOString()
                })
                toast({ title: "Success", description: "Ticket created" })
            }
            setIsModalOpen(false)
        } catch (error) {
            toast({ title: "Error", description: "Failed to save ticket", variant: "destructive" })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this ticket?")) return
        try {
            await remove(ref(database, `tickets/${id}`))
            toast({ title: "Deleted", description: "Ticket removed" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
        return matchesSearch && matchesStatus
    })

    // Helper for Status/Priority Colors
    const getStatusColor = (s: string) => {
        switch (s) {
            case 'open': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
            case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
            case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
            case 'closed': return 'bg-green-500/20 text-green-400 border-green-500/50'
            default: return 'bg-gray-800 text-gray-400'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Ticket Management</h2>
                    <p className="text-gray-400">Assign and track tasks across your team</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create Ticket
                </Button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search tickets..."
                        className="pl-10 bg-gray-900 border-gray-800 text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTickets.map(ticket => (
                    <Card key={ticket.id} className="bg-gray-900 border-gray-800 p-4 hover:border-orange-500/30 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline" className={`${getStatusColor(ticket.status)} capitalize`}>
                                {ticket.status}
                            </Badge>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => handleOpenModal(ticket)}>
                                    <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => handleDelete(ticket.id)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        <h3 className="font-bold text-white mb-2 line-clamp-1">{ticket.title}</h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5em]">{ticket.description}</p>

                        <div className="space-y-3 pt-3 border-t border-gray-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <User className="w-3 h-3 mr-1" /> Assignee
                                </span>
                                <span className="text-gray-300">{ticket.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> Due
                                </span>
                                <span className="text-gray-300">{ticket.dueDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <CalendarIcon className="w-3 h-3 mr-1" /> Project
                                </span>
                                <span className="text-gray-300 truncate max-w-[120px]">{ticket.project}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-gray-800 border-gray-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-gray-800 border-gray-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Assign To</Label>
                                <Select value={formData.assigneeId} onValueChange={v => setFormData({ ...formData, assigneeId: v })}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Select Staff" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        {staffList.map(u => (
                                            <SelectItem key={u.uid} value={u.uid}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Input value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="bg-gray-800 border-gray-700" placeholder="Project Name" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select value={formData.priority} onValueChange={(v: any) => setFormData({ ...formData, priority: v })}>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="bg-gray-800 border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label>Est. Hours</Label>
                                <Input type="number" value={formData.estimatedHours} onChange={e => setFormData({ ...formData, estimatedHours: e.target.value })} className="bg-gray-800 border-gray-700" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
                        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">Save Ticket</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, push, update, remove, onValue, set } from "firebase/database"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { CheckCircle, Clock, AlertCircle, Plus, Search, Filter, MoreVertical, Edit2, Trash2, User, Calendar as CalendarIcon, PlayCircle, Eye, Activity, Pencil, Users } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface Ticket {
    id: string
    title: string
    description: string
    assignedTo: string[] // Array of UIDs
    status: 'open' | 'in-progress' | 'review' | 'closed' | 'planning' | 'available' | 'completed'
    priority: 'low' | 'medium' | 'high' | 'critical'
    dueDate: string
    estimatedHours: string
    timeSpent?: number
    category: string
    project: string
}

interface TeamMember {
    uid: string
    name: string
    email: string
    profilePicture?: string
    role?: string
}

interface Team {
    id: string;
    name: string;
    members: string[]; // array of UIDs
}

export function StaffTicketManagement() {
    const { toast } = useToast()
    const { userProfile: currentUser } = useAuth()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [staffList, setStaffList] = useState<TeamMember[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null) // State for delete confirmation

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: [] as string[],
        status: "open",
        priority: "medium",
        dueDate: "",
        estimatedHours: "",
        timeSpent: 0,
        category: "",
        project: ""
    })

    // Fetch Data
    useEffect(() => {
        const ticketsRef = ref(database, 'staffdashboard/tickets')
        const usersRef = ref(database, 'users')
        const teamsRef = ref(database, 'teams') // Reference to teams

        const unsubscribeTickets = onValue(ticketsRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const ticketsList = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val,
                    assignedTo: val.assignedTo || [] // Ensure array
                }))
                // Sort by updated/created
                setTickets(ticketsList.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()))
            } else {
                setTickets([])
            }
            setLoading(false)
        })

        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const staff = Object.entries(data)
                    .map(([uid, val]: [string, any]) => ({
                        uid,
                        name: val.name || 'Unknown',
                        email: val.email,
                        profilePicture: val.profilePicture,
                        role: val.role
                    }))
                    .filter(u => u.role && u.role !== 'client') // Filter staff
                setStaffList(staff)
            }
        })

        // Fetch Teams
        const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
            if (snapshot.exists()) {
                const teamsData = snapshot.val();
                const teamsList = Object.entries(teamsData).map(([id, data]: [string, any]) => ({
                    id,
                    name: data.name,
                    members: data.members || []
                }));
                setTeams(teamsList);
            } else {
                setTeams([]);
            }
        });

        return () => {
            unsubscribeTickets()
            unsubscribeUsers()
            unsubscribeTeams()
        }
    }, [])

    const handleOpenModal = (ticket?: Ticket) => {
        if (ticket) {
            setEditingTicket(ticket)
            setFormData({
                title: ticket.title,
                description: ticket.description,
                assignedTo: ticket.assignedTo || [],
                status: ticket.status,
                priority: ticket.priority,
                // Ensure format YYYY-MM-DDTHH:MM for datetime-local input
                dueDate: ticket.dueDate ? new Date(ticket.dueDate).toISOString().slice(0, 16) : "",
                estimatedHours: ticket.estimatedHours,
                timeSpent: ticket.timeSpent || 0,
                category: ticket.category,
                project: ticket.project
            })
        } else {
            setEditingTicket(null)
            setFormData({
                title: "",
                description: "",
                assignedTo: [],
                status: "open",
                priority: "medium",
                dueDate: "",
                estimatedHours: "",
                timeSpent: 0,
                category: "",
                project: ""
            })
        }
        setIsModalOpen(true)
    }

    const toggleStaffSelection = (uid: string) => {
        setFormData(prev => {
            const assigned = prev.assignedTo.includes(uid)
                ? prev.assignedTo.filter(id => id !== uid)
                : [...prev.assignedTo, uid]
            return { ...prev, assignedTo: assigned }
        })
    }

    // Toggle Team: Add all members if not all selected, otherwise remove all team members
    const toggleTeamSelection = (team: Team) => {
        setFormData(prev => {
            const allMembersSelected = team.members.length > 0 && team.members.every(m => prev.assignedTo.includes(m));
            let newAssignedFn;

            if (allMembersSelected) {
                // Remove all team members
                newAssignedFn = prev.assignedTo.filter(id => !team.members.includes(id));
            } else {
                // Add all team members (deduplicate)
                newAssignedFn = Array.from(new Set([...prev.assignedTo, ...team.members]));
            }
            return { ...prev, assignedTo: newAssignedFn };
        });
    }

    const handleSave = async () => {
        if (!formData.title || formData.assignedTo.length === 0) {
            toast({ title: "Error", description: "Title and at least one Assignee are required", variant: "destructive" })
            return
        }

        try {
            const ticketData = {
                title: formData.title,
                description: formData.description,
                assignedTo: formData.assignedTo,
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.dueDate,
                estimatedHours: formData.estimatedHours,
                timeSpent: formData.timeSpent,
                category: formData.category,
                project: formData.project,
                updatedAt: new Date().toISOString()
            }

            if (editingTicket) {
                await update(ref(database, `staffdashboard/tickets/${editingTicket.id}`), ticketData)
                toast({ title: "Updated", description: "Ticket updated successfully." })
            } else {
                const newRef = push(ref(database, 'staffdashboard/tickets'))
                await set(newRef, {
                    ...ticketData,
                    createdAt: new Date().toISOString(),
                    createdBy: currentUser?.uid
                })
                toast({ title: "Created", description: "Ticket created successfully." })
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
            toast({ variant: "destructive", title: "Error", description: "Failed to save ticket." })
        }
    }

    const deleteTicket = (id: string) => {
        setTicketToDelete(id)
    }

    const confirmDelete = async () => {
        if (!ticketToDelete) return
        try {
            await remove(ref(database, `staffdashboard/tickets/${ticketToDelete}`))
            toast({ title: "Deleted", description: "Ticket deleted." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete ticket", variant: "destructive" })
        } finally {
            setTicketToDelete(null)
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        // Handle undefined or incorrect assignedTo format safely
        const assignedNames = (Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [])
            .map(uid => staffList.find(s => s.uid === uid)?.name || '')
            .join(' ').toLowerCase();

        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignedNames.includes(searchTerm.toLowerCase()) ||
            ticket.project.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter // logic for priority
        return matchesSearch && matchesStatus && matchesPriority
    })

    // Helper for Status/Priority Colors
    const getStatusColor = (s: string) => {
        switch (s) {
            case 'open':
            case 'planning':
            case 'available':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
            case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
            case 'review': return 'bg-teal-500/20 text-teal-400 border-teal-500/50'
            case 'closed':
            case 'completed':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
            default: return 'bg-gray-800 text-gray-400'
        }
    }

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'critical': return 'text-red-500'
            case 'high': return 'text-orange-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-blue-500'
            default: return 'text-gray-400'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Ticket Management</h2>
                    <p className="text-gray-400">Create and assign tickets to staff</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> New Ticket
                </Button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 bg-gray-900 border-gray-800"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-gray-900 border-gray-800">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[150px] bg-gray-900 border-gray-800">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTickets.map(ticket => (
                    <Card key={ticket.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all group relative">
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-800" onClick={() => handleOpenModal(ticket)}>
                                <Pencil className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-800" onClick={() => deleteTicket(ticket.id)}>
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start pr-16">
                                <Badge className={`${getStatusColor(ticket.status)} capitalize border`}>
                                    {ticket.status}
                                </Badge>
                                {(ticket.status !== 'completed' && ticket.status !== 'closed') && (
                                    <CountdownTimer dueDate={ticket.dueDate} priority={ticket.priority} className="min-w-[280px] px-6" />
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold text-white truncate pr-2">{ticket.title}</h3>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 h-[2.5em]">{ticket.description}</p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
                                </div>
                                <span className={`font-medium uppercase ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>Progress</span>
                                    <span>{Math.round((ticket.timeSpent || 0) / parseFloat(ticket.estimatedHours || '1') * 100) || 0}%</span>
                                </div>
                                <Progress value={Math.min(((ticket.timeSpent || 0) / parseFloat(ticket.estimatedHours || '1')) * 100, 100)} className="h-1.5" />
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span>{ticket.timeSpent || 0}h Spent</span>
                                    <span>{ticket.estimatedHours}h Est.</span>
                                </div>
                            </div>

                            {/* Assignee Footer */}
                            <div className="flex items-center space-x-2 pt-2">
                                {(() => {
                                    // Check if assignedTo strictly matches a team
                                    const assignedSet = new Set(ticket.assignedTo || []);
                                    const matchedTeam = teams.find(t =>
                                        t.members.length > 0 &&
                                        t.members.length === assignedSet.size &&
                                        t.members.every(m => assignedSet.has(m))
                                    );

                                    if (matchedTeam) {
                                        return (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-orange-600/20 text-orange-500 border border-orange-600/50 flex items-center justify-center">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-white">{matchedTeam.name}</span>
                                                    <span className="text-[10px] text-gray-500">Team</span>
                                                </div>
                                            </div>
                                        )
                                    }

                                    // Fallback to individual members
                                    return (
                                        <>
                                            {(Array.isArray(ticket.assignedTo) ? ticket.assignedTo : []).slice(0, 1).map((uid) => {
                                                const member = staffList.find(s => s.uid === uid)
                                                return (
                                                    <div key={uid} className="flex items-center space-x-2 flex-1">
                                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white overflow-hidden border border-gray-600">
                                                            {member?.profilePicture ? <img src={member.profilePicture} className="w-full h-full object-cover" /> : member?.name?.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-white">{member?.name || 'Unknown'}</span>
                                                            <span className="text-[10px] text-gray-500">{member?.role || 'Staff'}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {(Array.isArray(ticket.assignedTo) && ticket.assignedTo.length > 1) && (
                                                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 border border-gray-700 font-medium">
                                                    +{ticket.assignedTo.length - 1}
                                                </div>
                                            )}
                                        </>
                                    )
                                })()}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
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
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-gray-800 border-gray-700 min-h-[100px]" />
                        </div>

                        <div className="space-y-2">
                            <Label>Assign To (Multi-Select)</Label>
                            <div className="border border-gray-700 rounded-lg p-2 max-h-[250px] overflow-y-auto bg-gray-800">
                                {/* TEAMS SECTION */}
                                {teams.length > 0 && (
                                    <div className="mb-2">
                                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1 px-1">Teams</p>
                                        {teams.map(team => {
                                            const allSelected = team.members.length > 0 && team.members.every(m => formData.assignedTo.includes(m));
                                            return (
                                                <div key={team.id} className="flex items-center space-x-2 py-1 hover:bg-gray-700/50 rounded px-1 cursor-pointer" onClick={() => toggleTeamSelection(team)}>
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${allSelected ? 'bg-orange-600 border-orange-600' : 'border-gray-500'}`}>
                                                        {allSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-200">{team.name}</span>
                                                        <span className="text-[10px] text-gray-400">{team.members.length} members</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div className="h-px bg-gray-700 my-2"></div>
                                    </div>
                                )}

                                {/* STAFF SECTION */}
                                <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1 px-1">Staff Members</p>
                                {staffList.map(u => {
                                    // Calculate Active Tickets for this user
                                    const activeUserTickets = tickets.filter(t =>
                                        (Array.isArray(t.assignedTo) && t.assignedTo.includes(u.uid)) &&
                                        (t.status !== 'closed' && t.status !== 'completed')
                                    );
                                    const isBusy = activeUserTickets.length > 0;

                                    return (
                                        <div key={u.uid} className="flex items-center justify-between space-x-2 py-1 hover:bg-gray-700/50 rounded px-1 cursor-pointer border border-transparent" onClick={() => toggleStaffSelection(u.uid)}>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.assignedTo.includes(u.uid) ? 'bg-orange-600 border-orange-600' : 'border-gray-500'}`}>
                                                    {formData.assignedTo.includes(u.uid) && <CheckCircle className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-[10px]">
                                                        {u.profilePicture ? <img src={u.profilePicture} className="w-full h-full" /> : u.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-200">{u.name}</span>
                                                        <span className="text-[10px] text-gray-400">{u.role || 'Staff'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Workload Indicator */}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {isBusy && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <div className="cursor-pointer">
                                                                <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                                                                    {activeUserTickets.length} Ticket{activeUserTickets.length !== 1 ? 's' : ''}
                                                                </Badge>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent side="left" className="w-64 bg-gray-900 border-gray-700 text-white p-3 shadow-xl z-[9999]">
                                                            <h4 className="font-semibold text-xs mb-2 text-gray-300 border-b border-gray-700 pb-1">Current Active Tickets</h4>
                                                            <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                                                {activeUserTickets.map(t => (
                                                                    <div key={t.id} className="space-y-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <span className="text-xs font-medium text-white line-clamp-1">{t.title}</span>
                                                                            <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3 ${getStatusColor(t.status)}`}>
                                                                                {t.status}
                                                                            </Badge>
                                                                        </div>
                                                                        <Progress value={Math.min(((t.timeSpent || 0) / parseFloat(t.estimatedHours || '1')) * 100, 100)} className="h-1 bg-gray-800" indicatorClassName="bg-blue-500" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Input value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="bg-gray-800 border-gray-700" placeholder="Project Name" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Due Date & Time</Label>
                                <Input type="datetime-local" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="bg-gray-800 border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label>Est. Hours</Label>
                                <Input type="number" value={formData.estimatedHours} onChange={e => setFormData({ ...formData, estimatedHours: e.target.value })} className="bg-gray-800 border-gray-700" />
                            </div>
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
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
                        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">Save Ticket</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
                <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the ticket.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete Ticket</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

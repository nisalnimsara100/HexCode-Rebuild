"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, update, onValue, push, set, remove } from "firebase/database";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MoreHorizontal,
    Search,
    UserCog,
    Mail,
    Shield,
    UserX,
    FileBarChart,
    Users,
    Plus,
    Check,
    Code2,
    Palette,
    Server,
    Megaphone,
    DollarSign,
    Briefcase,
    Crown,
    Database,
    Cpu,
    Pencil,
    Trash2
} from "lucide-react";

interface StaffMember {
    uid: string;
    name: string;
    email: string;
    role: string;
    department: string;
    profilePicture?: string;
    status?: 'online' | 'offline' | 'busy';
    lastActive?: string;
}

interface Team {
    id: string;
    name: string;
    department: string;
    members: string[]; // array of UIDs
    createdAt: string;
}

const DEPARTMENTS = [
    { name: "Engineering", icon: Code2 },
    { name: "Design", icon: Palette },
    { name: "Infrastructure", icon: Server },
    { name: "Marketing", icon: Megaphone },
    { name: "Sales", icon: DollarSign },
    { name: "HR", icon: Users },
    { name: "IT", icon: Cpu },
    { name: "Leadership", icon: Crown },
    { name: "Data", icon: Database },
];

export function TeamManagement() {
    const { toast } = useToast();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- NEW STATES FOR TEAM CREATION/EDITING ---
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const [teamName, setTeamName] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [customDepartment, setCustomDepartment] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // --- DELETE STATE ---
    const [teamToDelete, setTeamToDelete] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        const teamsRef = ref(database, 'teams');

        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const staffList = Object.entries(usersData)
                    .map(([uid, data]: [string, any]) => ({
                        uid,
                        name: data.name || "Unknown",
                        email: data.email || "",
                        role: data.role || "staff",
                        department: data.department || "General",
                        profilePicture: data.profilePicture || "",
                        status: data.status || 'offline',
                        lastActive: data.lastActive || new Date().toISOString()
                    }))
                    .filter(u =>
                        u.role !== 'client' &&
                        u.role !== 'admin' &&
                        u.email !== 'admin@hexcode.lk'
                    );

                setStaff(staffList);
            } else {
                setStaff([]);
            }
            setLoading(false);
        });

        const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
            if (snapshot.exists()) {
                const teamsData = snapshot.val();
                const teamsList = Object.entries(teamsData).map(([id, data]: [string, any]) => ({
                    id,
                    name: data.name,
                    department: data.department || "General",
                    members: data.members || [],
                    createdAt: data.createdAt
                }));
                // Sort by creation date (newest first)
                setTeams(teamsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setTeams([]);
            }
        });

        return () => {
            unsubscribeUsers();
            unsubscribeTeams();
        };
    }, []);

    const handleRoleChange = async (uid: string, newRole: string) => {
        try {
            await update(ref(database, `users/${uid}`), { role: newRole });
            toast({ title: "Success", description: "User role updated", variant: "default" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
        }
    };

    // --- HANDLER TO SAVE TEAM (CREATE OR UPDATE) ---
    const handleSaveTeam = async () => {
        if (!teamName.trim()) {
            toast({ title: "Error", description: "Please enter a team name", variant: "destructive" });
            return;
        }

        const finalDepartment = selectedDepartment === "other" ? customDepartment : selectedDepartment;
        if (!finalDepartment) {
            toast({ title: "Error", description: "Please select or enter a department", variant: "destructive" });
            return;
        }

        if (selectedMembers.length === 0) {
            toast({ title: "Error", description: "Please select at least one member", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            if (editingTeamId) {
                // Update existing team
                await update(ref(database, `teams/${editingTeamId}`), {
                    name: teamName,
                    department: finalDepartment,
                    members: selectedMembers,
                    // Keep original createdAt
                });
                toast({ title: "Success", description: `Team "${teamName}" updated!` });
            } else {
                // Create new team
                const teamsRef = ref(database, 'teams');
                const newTeamRef = push(teamsRef);
                await set(newTeamRef, {
                    name: teamName,
                    department: finalDepartment,
                    members: selectedMembers,
                    createdAt: new Date().toISOString(),
                });
                toast({ title: "Success", description: `Team "${teamName}" created!` });
            }

            handleCloseDialog();
        } catch (error) {
            toast({ title: "Error", description: `Failed to ${editingTeamId ? 'update' : 'create'} team`, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDeleteTeam = async () => {
        if (!teamToDelete) return;
        try {
            await remove(ref(database, `teams/${teamToDelete.id}`));
            toast({ title: "Success", description: "Team deleted successfully", variant: "default" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete team", variant: "destructive" });
        } finally {
            setTeamToDelete(null);
        }
    };

    const openCreateDialog = () => {
        setEditingTeamId(null);
        setTeamName("");
        setSelectedDepartment("");
        setCustomDepartment("");
        setSelectedMembers([]);
        setIsDialogOpen(true);
    };

    const openEditDialog = (team: Team) => {
        setEditingTeamId(team.id);
        setTeamName(team.name);

        // Check if department is one of the predefined ones
        const isPredefined = DEPARTMENTS.some(d => d.name === team.department);
        if (isPredefined) {
            setSelectedDepartment(team.department);
            setCustomDepartment("");
        } else {
            setSelectedDepartment("other");
            setCustomDepartment(team.department);
        }

        setSelectedMembers(team.members || []);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingTeamId(null);
        setTeamName("");
        setSelectedDepartment("");
        setCustomDepartment("");
        setSelectedMembers([]);
    };

    const toggleMember = (uid: string) => {
        setSelectedMembers(prev =>
            prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
        );
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDepartmentIcon = (deptName: string) => {
        const found = DEPARTMENTS.find(d => d.name.toLowerCase() === deptName.toLowerCase());
        const Icon = found ? found.icon : Briefcase;
        return <Icon className="h-4 w-4" />;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Team Management</h2>
                    <p className="text-gray-400 mt-1">Oversee your teams, staff members, roles, and status.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={openCreateDialog}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Create Team
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingTeamId ? "Edit Team" : "Create Team"}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {editingTeamId ? "Update team details and members." : "Organize staff into a new functional group."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Team Name</label>
                                    <Input
                                        placeholder="e.g. Frontend Squad"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                            {DEPARTMENTS.map((dept) => (
                                                <SelectItem key={dept.name} value={dept.name}>
                                                    <div className="flex items-center gap-2">
                                                        <dept.icon className="h-4 w-4 text-orange-500" />
                                                        <span>{dept.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                            <DropdownMenuSeparator className="bg-gray-700" />
                                            <SelectItem value="other">
                                                <div className="flex items-center gap-2">
                                                    <Plus className="h-4 w-4" />
                                                    <span>Other (Custom)</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {selectedDepartment === "other" && (
                                        <Input
                                            placeholder="Enter custom department"
                                            value={customDepartment}
                                            onChange={(e) => setCustomDepartment(e.target.value)}
                                            className="bg-gray-800 border-gray-700 text-white mt-2"
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Members ({selectedMembers.length})</label>
                                    <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 border border-gray-800 rounded-md p-2">
                                        {staff.map((member) => (
                                            <div
                                                key={member.uid}
                                                onClick={() => toggleMember(member.uid)}
                                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedMembers.includes(member.uid) ? 'bg-orange-600/20 border border-orange-600/50' : 'hover:bg-gray-800 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarImage src={member.profilePicture} />
                                                        <AvatarFallback className="text-[10px] bg-gray-700">{member.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{member.name}</span>
                                                </div>
                                                {selectedMembers.includes(member.uid) && <Check className="h-4 w-4 text-orange-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={handleCloseDialog} className="text-gray-400">Cancel</Button>
                                <Button
                                    onClick={handleSaveTeam}
                                    disabled={isSaving}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    {isSaving ? "Saving..." : (editingTeamId ? "Update Team" : "Create Team")}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* --- ACTIVE TEAMS SECTION --- */}
            {teams.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Active Teams</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {teams.map((team) => (
                            <Card key={team.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all group relative pt-4 pb-12">
                                {/* EDIT BUTTON - TOP RIGHT */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-3 right-3 h-8 w-8 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-full"
                                    onClick={() => openEditDialog(team)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>

                                <CardHeader className="pb-2 pt-2 px-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-gray-800 rounded-xl border border-gray-700">
                                            {getDepartmentIcon(team.department)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-white leading-tight">{team.name}</CardTitle>
                                            <CardDescription className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                                <Briefcase className="w-3 h-3" />
                                                {team.department}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-2">
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="bg-gray-800 text-gray-400 hover:bg-gray-800 text-[10px] px-2 py-0.5 border border-gray-700">
                                                {team.members ? team.members.length : 0} members
                                            </Badge>
                                        </div>
                                        <div className="flex items-center -space-x-2 overflow-hidden pl-1">
                                            {team.members && team.members.slice(0, 5).map((memberId) => {
                                                const member = staff.find(s => s.uid === memberId);
                                                return (
                                                    <Avatar key={memberId} className="inline-block h-8 w-8 ring-2 ring-gray-900">
                                                        <AvatarImage src={member?.profilePicture} />
                                                        <AvatarFallback className="bg-gray-700 text-xs">
                                                            {member?.name?.charAt(0) || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                );
                                            })}
                                            {team.members && team.members.length > 5 && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-gray-900 bg-gray-800 text-xs font-medium text-white">
                                                    +{team.members.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>

                                {/* DELETE BUTTON - BOTTOM RIGHT */}
                                <div className="absolute bottom-3 right-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded-full transition-colors"
                                        onClick={() => setTeamToDelete({ id: team.id, name: team.name })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* --- STAFF DIRECTORY SECTION --- */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Staff Directory ({staff.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search team..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-gray-800/50">
                                <TableHead className="text-gray-400">Name</TableHead>
                                <TableHead className="text-gray-400">Role</TableHead>
                                <TableHead className="text-gray-400">Department</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                                <TableHead className="text-right text-gray-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading staff...</TableCell>
                                </TableRow>
                            ) : filteredStaff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">No staff members found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredStaff.map((member) => (
                                    <TableRow key={member.uid} className="border-gray-800 hover:bg-gray-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-gray-700">
                                                    <AvatarImage src={member.profilePicture} />
                                                    <AvatarFallback className="bg-orange-600 text-white font-bold">
                                                        {member.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{member.name}</p>
                                                    <p className="text-xs text-gray-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700 capitalize">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{member.department || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' :
                                                    member.status === 'busy' ? 'bg-red-500' :
                                                        'bg-gray-500'
                                                    }`} />
                                                <span className="text-gray-400 capitalize text-sm">{member.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <Mail className="mr-2 h-4 w-4" /> Send Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <FileBarChart className="mr-2 h-4 w-4" /> View Reports
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                    <DropdownMenuLabel className="text-xs text-gray-500">Change Role</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.uid, 'admin')} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <Shield className="mr-2 h-4 w-4 text-red-500" /> Make Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.uid, 'manager')} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <UserCog className="mr-2 h-4 w-4 text-blue-400" /> Make Manager
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.uid, 'staff')} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <Users className="mr-2 h-4 w-4 text-green-400" /> Make Staff
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.uid, 'employee')} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <UserCog className="mr-2 h-4 w-4 text-orange-400" /> Demote to Employee
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to fire this employee? This will remove their access.")) {
                                                                handleRoleChange(member.uid, 'fired');
                                                                // Also update status to inactive
                                                                update(ref(database, `users/${member.uid}`), { status: 'inactive' });
                                                            }
                                                        }}
                                                        className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700 text-red-400 focus:text-red-400"
                                                    >
                                                        <UserX className="mr-2 h-4 w-4" /> Fire Employee
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* --- DELETE CONFIRMATION DIALOG --- */}
            <AlertDialog open={!!teamToDelete} onOpenChange={(open) => !open && setTeamToDelete(null)}>
                <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Team</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete the team <span className="text-white font-medium">"{teamToDelete?.name}"</span>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteTeam} className="bg-red-600 hover:bg-red-700 text-white border-0">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
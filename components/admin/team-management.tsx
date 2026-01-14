"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, update, onValue } from "firebase/database";
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
import { useToast } from "@/components/ui/use-toast";
import {
    MoreHorizontal,
    Search,
    UserCog,
    Mail,
    Shield,
    Activity,
    UserX,
    FileBarChart,
    Users
} from "lucide-react";

interface StaffMember {
    uid: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    position: string;
    department: string;
    profilePicture?: string;
    status?: 'online' | 'offline' | 'busy'; // This would ideally be real-time presence
    lastActive?: string;
}

export function TeamManagement() {
    const { toast } = useToast();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const usersRef = ref(database, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const staffList = Object.entries(usersData)
                    .map(([uid, data]: [string, any]) => ({
                        uid,
                        name: data.name || "Unknown",
                        email: data.email || "",
                        role: data.role || "staff",
                        phone: data.phone || "N/A",
                        position: data.position || "Developer",
                        department: data.department || "Engineering",
                        profilePicture: data.profilePicture || "",
                        status: data.status || 'offline',
                        lastActive: data.lastActive || new Date().toISOString()
                    }))
                    .filter(u => u.role !== 'client' && u.role !== 'staff'); // Exclude clients and staff (hidden)

                setStaff(staffList);
            } else {
                setStaff([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleRoleChange = async (uid: string, newRole: string) => {
        try {
            await update(ref(database, `users/${uid}`), { role: newRole });
            toast({ title: "Success", description: "User role updated", variant: "default" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
        }
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Team Management</h2>
                    <p className="text-gray-400 mt-1">Oversee your staff members, roles, and status.</p>
                </div>
                <div className="flex gap-2">
                    {/* Add Staff Button could go here, linking to Register page */}
                </div>
            </div>

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
                                                        <Shield className="mr-2 h-4 w-4 text-red-400" /> Make Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.uid, 'manager')} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <UserCog className="mr-2 h-4 w-4 text-blue-400" /> Make Manager
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.uid, 'staff')} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                                                        <Users className="mr-2 h-4 w-4 text-green-400" /> Make Staff
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
        </div>
    );
}

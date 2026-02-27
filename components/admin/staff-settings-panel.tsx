import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, set, update } from "firebase/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface StaffUser {
    uid: string;
    role: string;
    name: string;
}

interface StaffProject {
    id: string;
    team?: string[];
}

export function StaffSettingsPanel() {
    const { toast } = useToast();
    const [hideBudget, setHideBudget] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<StaffUser[]>([]);
    const [projects, setProjects] = useState<StaffProject[]>([]);
    const [cleanupRunning, setCleanupRunning] = useState(false);

    useEffect(() => {
        const settingsRef = ref(database, 'settings/staffSystem/hideBudget');
        const unsubscribe = onValue(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                setHideBudget(snapshot.val());
            } else {
                setHideBudget(false); // Default to visible
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        const projectsRef = ref(database, 'staffdashboard/projects');

        const unsubUsers = onValue(usersRef, (snapshot) => {
            if (!snapshot.exists()) {
                setUsers([]);
                return;
            }

            const mappedUsers = Object.entries(snapshot.val() as Record<string, any>).map(([uid, value]) => {
                const data = value as Record<string, any>;
                const name = (data.name || data.profile?.name || "").trim();
                const role = (data.role || data.profile?.role || "staff").toLowerCase();

                return {
                    uid,
                    name,
                    role,
                };
            });

            setUsers(mappedUsers);
        });

        const unsubProjects = onValue(projectsRef, (snapshot) => {
            if (!snapshot.exists()) {
                setProjects([]);
                return;
            }

            const mappedProjects = Object.entries(snapshot.val() as Record<string, any>).map(([id, value]) => {
                const data = value as Record<string, any>;
                const rawTeam = data.team;
                const team = Array.isArray(rawTeam)
                    ? rawTeam.filter((entry) => typeof entry === "string" && entry)
                    : [];

                return {
                    id,
                    team,
                };
            });

            setProjects(mappedProjects);
        });

        return () => {
            unsubUsers();
            unsubProjects();
        };
    }, []);

    const validStaffIds = new Set(
        users
            .filter((user) => {
                const hasName = !!user.name && user.name.toLowerCase() !== "unknown";
                const allowedRole = user.role !== "client" && user.role !== "admin";
                return hasName && allowedRole;
            })
            .map((user) => user.uid)
    );

    const invalidProjectIds = projects
        .filter((project) => {
            const team = Array.isArray(project.team) ? project.team : [];
            return team.some((memberId) => !validStaffIds.has(memberId));
        })
        .map((project) => project.id);

    const invalidAssignmentsCount = projects.reduce((total, project) => {
        const team = Array.isArray(project.team) ? project.team : [];
        return total + team.filter((memberId) => !validStaffIds.has(memberId)).length;
    }, 0);

    const handleCleanupUnknownMembers = async () => {
        if (invalidProjectIds.length === 0) {
            toast({
                title: "No Cleanup Needed",
                description: "No unknown or invalid staff members found in project teams.",
            });
            return;
        }

        setCleanupRunning(true);
        try {
            let updatedProjectsCount = 0;

            for (const project of projects) {
                const existingTeam = Array.isArray(project.team) ? project.team : [];
                const sanitizedTeam = existingTeam.filter((memberId) => validStaffIds.has(memberId));

                if (sanitizedTeam.length !== existingTeam.length) {
                    await update(ref(database, `staffdashboard/projects/${project.id}`), {
                        team: sanitizedTeam,
                        updatedAt: new Date().toISOString(),
                    });
                    updatedProjectsCount += 1;
                }
            }

            toast({
                title: "Cleanup Completed",
                description: `Updated ${updatedProjectsCount} project(s) by removing unknown/invalid team members only.`,
            });
        } catch (error) {
            console.error("Failed to cleanup unknown members:", error);
            toast({
                title: "Cleanup Failed",
                description: "Could not complete cleanup. No other project fields were modified.",
                variant: "destructive",
            });
        } finally {
            setCleanupRunning(false);
        }
    };

    const handleToggle = async (checked: boolean) => {
        try {
            await set(ref(database, 'settings/staffSystem/hideBudget'), checked);
            setHideBudget(checked);
            toast({
                title: checked ? "Budget Hidden" : "Budget Visible",
                description: checked
                    ? "Project budgets are now hidden from staff and generic admin views."
                    : "Project budgets are now visible.",
            });
        } catch (error) {
            console.error("Failed to update setting:", error);
            toast({
                title: "Error",
                description: "Failed to save setting.",
                variant: "destructive"
            });
        }
    };

    if (loading) return <div className="text-white">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Staff System Settings</h2>
                <p className="text-gray-400 mt-1">Configure global visibility and access rules.</p>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-white">Financial Visibility</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Control who can see project financial details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="space-y-0.5">
                            <Label className="text-base text-gray-200">Hide Project Budgets</Label>
                            <p className="text-sm text-gray-400">
                                When enabled, budget information is hidden from the Staff Dashboard and the Admin Project Management view.
                                Admins also cannot add/edit budgets.
                            </p>
                        </div>
                        <Switch
                            checked={hideBudget}
                            onCheckedChange={handleToggle}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <UserX className="h-5 w-5 text-orange-500" />
                        <CardTitle className="text-white">Project Team Cleanup</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">
                        Remove unknown/invalid staff IDs from project team arrays only.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 space-y-2">
                        <p className="text-sm text-gray-300">
                            Found <span className="text-orange-400 font-semibold">{invalidAssignmentsCount}</span> invalid team assignment(s) across <span className="text-orange-400 font-semibold">{invalidProjectIds.length}</span> project(s).
                        </p>
                        <p className="text-xs text-gray-500">
                            This action only updates <span className="text-gray-300">staffdashboard/projects/*/team</span> by removing invalid/unknown member IDs. Other fields are untouched.
                        </p>
                    </div>

                    <Button
                        onClick={handleCleanupUnknownMembers}
                        disabled={cleanupRunning || invalidProjectIds.length === 0}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {cleanupRunning ? "Cleaning..." : "Remove Unknown Members"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

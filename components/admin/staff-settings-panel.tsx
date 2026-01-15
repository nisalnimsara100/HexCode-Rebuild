import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function StaffSettingsPanel() {
    const { toast } = useToast();
    const [hideBudget, setHideBudget] = useState(false);
    const [loading, setLoading] = useState(true);

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
        </div>
    );
}

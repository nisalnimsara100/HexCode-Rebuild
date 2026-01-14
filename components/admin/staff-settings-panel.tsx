"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, Shield, Mail } from "lucide-react";

export function StaffSettingsPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Staff System Settings</h2>
                <p className="text-gray-400 mt-1">Configure global settings for the staff dashboard and team.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-orange-500" />
                            <CardTitle className="text-white">Access Control</CardTitle>
                        </div>
                        <CardDescription className="text-gray-400">Manage permissions and access levels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-gray-200">Force Two-Factor Authentication</Label>
                                <p className="text-sm text-gray-400">Require all staff members to use 2FA.</p>
                            </div>
                            <Switch />
                        </div>
                        <Separator className="bg-gray-800" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-gray-200">Session Timeout</Label>
                                <p className="text-sm text-gray-400">Auto-logout after inactivity (minutes).</p>
                            </div>
                            <Input className="w-20 bg-gray-800 border-gray-700 text-white" type="number" defaultValue="30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-500" />
                            <CardTitle className="text-white">Notifications</CardTitle>
                        </div>
                        <CardDescription className="text-gray-400">Configure default notification settings for new staff.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-gray-200">Email Notifications</Label>
                                <p className="text-sm text-gray-400">Send email for critical alerts by default.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    Download,
    Calendar,
    FileText,
    TrendingUp,
    Users,
    Clock
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StaffReportsPanel() {
    const [reportType, setReportType] = useState("monthly");

    const generateReport = (type: string) => {
        console.log(`Generating ${type} report...`);
        // Placeholder for actual report generation logic
        // This would likely fetch data from Firebase and generate a CSV or PDF
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Staff Analytics & Reports</h2>
                    <p className="text-gray-400 mt-1">Generate insights on team performance and productivity.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="daily">Daily Report</SelectItem>
                            <SelectItem value="weekly">Weekly Report</SelectItem>
                            <SelectItem value="monthly">Monthly Report</SelectItem>
                            <SelectItem value="quarterly">Quarterly Report</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => generateReport(reportType)} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-400 text-sm font-medium">Total Hours Logged</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">1,248h</div>
                            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
                        </div>
                        <p className="text-xs text-green-400 mt-2 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-400 text-sm font-medium">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">342</div>
                            <FileText className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                        <p className="text-xs text-green-400 mt-2 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-400 text-sm font-medium">Active Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">12</div>
                            <Users className="h-8 w-8 text-purple-500 opacity-50" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Full capacity
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Performance Overview</CardTitle>
                    <CardDescription className="text-gray-400">Monthly productivity metrics per department.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="text-center text-gray-500">
                            <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p>Chart visualization placeholder</p>
                            <p className="text-xs">(Requires Recharts or similar library)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

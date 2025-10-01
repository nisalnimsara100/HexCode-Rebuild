"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Filter,
  Activity,
  Award,
  Briefcase,
  DollarSign,
} from "lucide-react";

interface Analytics {
  overview: {
    totalEmployees: number;
    activeProjects: number;
    completedTasks: number;
    pendingTasks: number;
    averageTaskCompletion: number;
    employeeUtilization: number;
  };
  productivity: {
    tasksCompletedThisMonth: number;
    tasksCompletedLastMonth: number;
    averageTaskDuration: number;
    onTimeCompletion: number;
  };
  teamPerformance: {
    topPerformers: Array<{
      name: string;
      tasksCompleted: number;
      efficiency: number;
      rating: number;
    }>;
    departmentStats: Array<{
      department: string;
      employees: number;
      activeProjects: number;
      completionRate: number;
    }>;
  };
}

export function ReportsAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState("productivity");

  // Mock data for charts
  const productivityData = [
    { month: "Jan", completed: 45, planned: 50, efficiency: 90 },
    { month: "Feb", completed: 52, planned: 55, efficiency: 95 },
    { month: "Mar", completed: 48, planned: 50, efficiency: 96 },
    { month: "Apr", completed: 61, planned: 60, efficiency: 102 },
    { month: "May", completed: 55, planned: 58, efficiency: 95 },
    { month: "Jun", completed: 67, planned: 65, efficiency: 103 },
  ];

  const departmentData = [
    { name: "Engineering", value: 35, color: "#10B981" },
    { name: "Design", value: 20, color: "#3B82F6" },
    { name: "Marketing", value: 25, color: "#F59E0B" },
    { name: "Sales", value: 20, color: "#EF4444" },
  ];

  const taskStatusData = [
    { status: "Completed", count: 145, percentage: 58 },
    { status: "In Progress", count: 67, percentage: 27 },
    { status: "Pending", count: 28, percentage: 11 },
    { status: "Overdue", count: 10, percentage: 4 },
  ];

  const employeePerformanceData = [
    { name: "John Smith", tasks: 28, hours: 160, efficiency: 95 },
    { name: "Sarah Johnson", tasks: 32, hours: 155, efficiency: 98 },
    { name: "Mike Davis", tasks: 25, hours: 165, efficiency: 88 },
    { name: "Emily Chen", tasks: 30, hours: 158, efficiency: 92 },
    { name: "Alex Rodriguez", tasks: 22, hours: 162, efficiency: 85 },
  ];

  const weeklyActivityData = [
    { day: "Mon", tasks: 12, hours: 8.5 },
    { day: "Tue", tasks: 15, hours: 9.2 },
    { day: "Wed", tasks: 18, hours: 8.8 },
    { day: "Thu", tasks: 14, hours: 9.1 },
    { day: "Fri", tasks: 16, hours: 8.6 },
    { day: "Sat", tasks: 8, hours: 4.2 },
    { day: "Sun", tasks: 5, hours: 2.1 },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockAnalytics: Analytics = {
        overview: {
          totalEmployees: 47,
          activeProjects: 12,
          completedTasks: 145,
          pendingTasks: 38,
          averageTaskCompletion: 85,
          employeeUtilization: 78,
        },
        productivity: {
          tasksCompletedThisMonth: 67,
          tasksCompletedLastMonth: 52,
          averageTaskDuration: 3.2,
          onTimeCompletion: 89,
        },
        teamPerformance: {
          topPerformers: [
            { name: "Sarah Johnson", tasksCompleted: 32, efficiency: 98, rating: 4.9 },
            { name: "John Smith", tasksCompleted: 28, efficiency: 95, rating: 4.7 },
            { name: "Emily Chen", tasksCompleted: 30, efficiency: 92, rating: 4.6 },
          ],
          departmentStats: [
            { department: "Engineering", employees: 18, activeProjects: 5, completionRate: 92 },
            { department: "Design", employees: 8, activeProjects: 3, completionRate: 88 },
            { department: "Marketing", employees: 12, activeProjects: 2, completionRate: 95 },
            { department: "Sales", employees: 9, activeProjects: 2, completionRate: 87 },
          ],
        },
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In real implementation, generate and download report
    alert("Report exported successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Track performance, monitor progress, and analyze team productivity.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={exportReport}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Employees</p>
                <p className="text-2xl font-semibold text-white">{analytics.overview.totalEmployees}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">+2 this month</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Active Projects</p>
                <p className="text-2xl font-semibold text-white">{analytics.overview.activeProjects}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">+1 this week</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-semibold text-white">{analytics.overview.completedTasks}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">
                    +{analytics.productivity.tasksCompletedThisMonth - analytics.productivity.tasksCompletedLastMonth} vs last month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Avg Completion Rate</p>
                <p className="text-2xl font-semibold text-white">{analytics.overview.averageTaskCompletion}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">+3% vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trends */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Productivity Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    color: "#F9FAFB",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stackId="2"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Team Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <span className="text-sm text-gray-300">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Performance */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Employee Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    color: "#F9FAFB",
                  }}
                />
                <Bar dataKey="tasks" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    color: "#F9FAFB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Top Performers</h3>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                This Month
              </Badge>
            </div>
            <div className="space-y-4">
              {analytics.teamPerformance.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{performer.name}</p>
                      <p className="text-sm text-gray-400">{performer.tasksCompleted} tasks completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-white">{performer.rating}</span>
                    </div>
                    <p className="text-sm text-gray-400">{performer.efficiency}% efficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Department Stats */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Department Statistics</h3>
            <div className="space-y-4">
              {analytics.teamPerformance.departmentStats.map((dept) => (
                <div key={dept.department} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{dept.department}</h4>
                    <Badge
                      className={
                        dept.completionRate >= 90
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : dept.completionRate >= 80
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }
                    >
                      {dept.completionRate}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {dept.employees} employees
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {dept.activeProjects} projects
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Completion Rate</span>
                      <span className="text-sm font-medium text-white">{dept.completionRate}%</span>
                    </div>
                    <Progress value={dept.completionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Task Status Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Task Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {taskStatusData.map((status) => (
              <div key={status.status} className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white mb-1">{status.count}</div>
                <div className="text-sm text-gray-400 mb-2">{status.status} Tasks</div>
                <div className="text-xs text-gray-500">{status.percentage}% of total</div>
                <Progress value={status.percentage} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-900/20 border border-emerald-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="font-medium text-emerald-400">Productivity Up</span>
              </div>
              <p className="text-sm text-gray-300">
                Task completion rate increased by 15% compared to last month, with Sarah Johnson leading the team.
              </p>
            </div>
            <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium text-blue-400">High Engagement</span>
              </div>
              <p className="text-sm text-gray-300">
                Engineering department shows highest project engagement with 92% completion rate.
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-medium text-orange-400">Time Management</span>
              </div>
              <p className="text-sm text-gray-300">
                Average task duration decreased to 3.2 days, showing improved time management skills.
              </p>
            </div>
            <div className="bg-purple-900/20 border border-purple-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 text-purple-500 mr-2" />
                <span className="font-medium text-purple-400">Goal Achievement</span>
              </div>
              <p className="text-sm text-gray-300">
                89% of tasks completed on time, exceeding the monthly target of 85%.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
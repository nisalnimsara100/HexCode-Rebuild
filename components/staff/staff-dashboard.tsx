"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/auth/auth-context";
import EmployeeView from "./employee-view-simple";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FolderOpen,
  Ticket,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  Activity,
  Target,
} from "lucide-react";

interface DashboardStats {
  totalEmployees: number;
  activeProjects: number;
  openTickets: number;
  completedTasks: number;
}

interface RecentActivity {
  id: string;
  type: "project" | "ticket" | "employee";
  title: string;
  description: string;
  time: string;
  status: "success" | "warning" | "info";
}

export function StaffDashboard() {
  const { userProfile } = useAuth();
  
  // If user is an employee, show the focused employee view
  if (userProfile?.role === "employee") {
    return <EmployeeView />;
  }

  // For admin and manager roles, show the full dashboard
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeProjects: 0,
    openTickets: 0,
    completedTasks: 0,
  });
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "project",
      title: "New Project Created",
      description: "E-commerce Platform v2.0 has been created",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: "2",
      type: "ticket",
      title: "High Priority Ticket",
      description: "Database performance issue reported",
      time: "4 hours ago",
      status: "warning",
    },
    {
      id: "3",
      type: "employee",
      title: "New Employee Added",
      description: "John Smith joined as Senior Developer",
      time: "1 day ago",
      status: "info",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In real implementation, fetch from Firebase
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStats({
          totalEmployees: 24,
          activeProjects: 8,
          openTickets: 15,
          completedTasks: 127,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      change: "+2 this month",
      changeType: "positive" as const,
      href: "/staff/employees",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: FolderOpen,
      change: "+1 this week",
      changeType: "positive" as const,
      href: "/staff/projects",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      icon: Ticket,
      change: "-3 since yesterday",
      changeType: "positive" as const,
      href: "/staff/tickets",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckCircle,
      change: "+12 this week",
      changeType: "positive" as const,
      href: "/staff/assignments",
    },
  ];

  const quickActions = [
    {
      title: "Add Employee",
      description: "Register new team member",
      icon: Users,
      href: "/staff/employees",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Create Project",
      description: "Start new project",
      icon: FolderOpen,
      href: "/staff/projects",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Create Ticket",
      description: "Add new task or issue",
      icon: Ticket,
      href: "/staff/tickets",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      title: "Assign Task",
      description: "Delegate work to team",
      icon: Target,
      href: "/staff/assignments",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Staff Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Welcome back! Here's what's happening with your team today.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Section Separator */}
      <div className="border-t border-orange-500/20"></div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-3xl font-semibold text-white">{stat.value}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-orange-400">
                                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                  {stat.change}
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Section Separator */}
      <div className="border-t border-orange-500/20"></div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className={`w-full justify-start h-auto p-4 ${action.color} text-white hover:text-white`}
                  >
                    <action.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm opacity-80">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.status === "success" && (
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                      )}
                      {activity.status === "warning" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {activity.status === "info" && (
                        <Activity className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-sm text-gray-400">{activity.description}</p>
                      <div className="mt-1 flex items-center space-x-2">
                                        <Clock className="h-6 w-6 text-red-400" />
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Section Separator */}
      <div className="border-t border-orange-500/20"></div>

      {/* Bottom Section - Today's Schedule */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </h3>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Meetings</h4>
              <div className="text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Team Standup</span>
                  <span>09:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Review</span>
                  <span>02:00 PM</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Deadlines</h4>
              <div className="text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Website Redesign</span>
                  <span>Today</span>
                </div>
                <div className="flex justify-between">
                  <span>Bug Fixes</span>
                  <span>Tomorrow</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Team Status</h4>
              <div className="text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Available</span>
                  <span className="text-orange-400">18</span>
                </div>
                <div className="flex justify-between">
                  <span>On Leave</span>
                  <span className="text-yellow-400">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Remote</span>
                  <span className="text-orange-400">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-orange-500">
        <img src="/placeholder-logo.png" alt="HexCode Staff Logo" className="mx-auto h-12 w-auto" />
        <p>HexCode Staff Portal © 2025</p>
        <p>For support, contact IT Department</p>
      </div>
    </div>
  );
}
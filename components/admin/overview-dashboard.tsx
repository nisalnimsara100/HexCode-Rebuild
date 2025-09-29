"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FolderOpen, 
  Mail, 
  Calendar,
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Plus
} from "lucide-react"

export function OverviewDashboard() {
  const dashboardStats = [
    {
      title: "Total Projects",
      value: "6",
      change: "+2 this month",
      icon: <FolderOpen className="w-5 h-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Clients",
      value: "4",
      change: "2 pending",
      icon: <Users className="w-5 h-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Messages",
      value: "12",
      change: "3 unread",
      icon: <Mail className="w-5 h-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "This Week",
      value: "3",
      change: "meetings scheduled",
      icon: <Calendar className="w-5 h-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ]

  const projectStatus = [
    { name: "E-commerce Platform", status: "In Progress", progress: 75, priority: "High" },
    { name: "Mobile App UI", status: "Review", progress: 90, priority: "Medium" },
    { name: "Portfolio Website", status: "Completed", progress: 100, priority: "Low" },
    { name: "API Development", status: "Planning", progress: 25, priority: "High" }
  ]

  const upcomingTasks = [
    { task: "Client meeting - EcoCommerce", time: "Today, 2:00 PM", urgent: true },
    { task: "Deploy staging environment", time: "Tomorrow, 10:00 AM", urgent: false },
    { task: "Code review session", time: "Friday, 3:00 PM", urgent: false },
    { task: "Project proposal review", time: "Monday, 9:00 AM", urgent: true }
  ]

  const notifications = [
    { message: "New project inquiry received", time: "5 minutes ago", type: "info" },
    { message: "EcoCommerce project milestone completed", time: "2 hours ago", type: "success" },
    { message: "Client feedback awaiting review", time: "1 day ago", type: "warning" }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
        <p className="text-emerald-100">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Project Status</h3>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="space-y-4">
            {projectStatus.map((project, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{project.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={project.status === "Completed" ? "default" : "secondary"}
                      className={
                        project.status === "Completed" 
                          ? "bg-emerald-500" 
                          : project.status === "In Progress" 
                            ? "bg-blue-500" 
                            : "bg-gray-500"
                      }
                    >
                      {project.status}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={
                        project.priority === "High" 
                          ? "border-red-500 text-red-500" 
                          : project.priority === "Medium" 
                            ? "border-orange-500 text-orange-500" 
                            : "border-green-500 text-green-500"
                      }
                    >
                      {project.priority}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{project.progress}% Complete</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {task.urgent ? (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.time}</p>
                </div>
                {task.urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Notifications</h3>
          <Bell className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                notification.type === "success" ? "bg-emerald-500" :
                notification.type === "warning" ? "bg-orange-500" : "bg-blue-500"
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button className="h-20 bg-emerald-500 hover:bg-emerald-600 flex-col space-y-2">
          <Plus className="w-6 h-6" />
          <span>Add Project</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Mail className="w-6 h-6" />
          <span>Check Messages</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <TrendingUp className="w-6 h-6" />
          <span>View Analytics</span>
        </Button>
      </div>
    </div>
  )
}
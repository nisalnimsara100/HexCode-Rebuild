"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
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
  Plus,
  Shield,
  Settings,
  Activity,
  Database,
  UserCheck,
  AlertCircle,
  BarChart3,
  Zap
} from "lucide-react"

export function OverviewDashboard() {
  const { userProfile } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const getUserDisplayName = () => {
    return userProfile?.name || "Admin"
  }

  const dashboardStats = [
    {
      title: "Total Users",
      value: "24",
      change: "+3 this month",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Projects",
      value: "12",
      change: "4 in progress",
      icon: <FolderOpen className="w-5 h-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "All systems operational",
      icon: <Activity className="w-5 h-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Open Tickets",
      value: "7",
      change: "2 critical",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ]

  const systemMetrics = [
    { name: "Database Performance", status: "Optimal", value: "99.2%", trend: "up" },
    { name: "Server Uptime", status: "Excellent", value: "99.9%", trend: "stable" },
    { name: "User Activity", status: "High", value: "1.2k", trend: "up" },
    { name: "Security Score", status: "Excellent", value: "A+", trend: "stable" }
  ]

  const recentActivities = [
    { activity: "New user registration", user: "john.doe@example.com", time: "2 minutes ago", type: "user" },
    { activity: "Project deployment completed", project: "E-commerce Platform", time: "15 minutes ago", type: "project" },
    { activity: "Security scan completed", result: "No issues found", time: "1 hour ago", type: "security" },
    { activity: "Backup completed successfully", size: "2.3 GB", time: "2 hours ago", type: "system" }
  ]

  const criticalAlerts = [
    { message: "High CPU usage on server-02", severity: "warning", time: "5 minutes ago" },
    { message: "2 failed login attempts detected", severity: "info", time: "1 hour ago" },
    { message: "SSL certificate expires in 7 days", severity: "warning", time: "Today" }
  ]

  const quickStats = [
    { label: "Active Sessions", value: "47", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Storage Used", value: "67%", icon: <Database className="w-4 h-4" /> },
    { label: "API Calls", value: "12.5k", icon: <Zap className="w-4 h-4" /> },
    { label: "Response Time", value: "125ms", icon: <Activity className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Modern Admin Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{getGreeting()}, {getUserDisplayName()}!</h2>
              <p className="text-orange-100">Administrator Dashboard - System Status: Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Role: {userProfile?.role?.toUpperCase() || 'ADMIN'}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
          Quick Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="text-orange-500">{stat.icon}</div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Metrics */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              System Health
            </h3>
            <Badge className="bg-green-500 hover:bg-green-600">All Systems Operational</Badge>
          </div>
          <div className="space-y-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">{metric.name}</h4>
                  <p className="text-sm text-muted-foreground">{metric.status}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold">{metric.value}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    metric.trend === "up" ? "bg-green-500" : 
                    metric.trend === "down" ? "bg-red-500" : "bg-blue-500"
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === "user" ? "bg-blue-500/10 text-blue-500" :
                  activity.type === "project" ? "bg-green-500/10 text-green-500" :
                  activity.type === "security" ? "bg-red-500/10 text-red-500" :
                  "bg-orange-500/10 text-orange-500"
                }`}>
                  {activity.type === "user" ? <Users className="w-4 h-4" /> :
                   activity.type === "project" ? <FolderOpen className="w-4 h-4" /> :
                   activity.type === "security" ? <Shield className="w-4 h-4" /> :
                   <Settings className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-500" />
            System Alerts
          </h3>
          <Badge variant="outline">{criticalAlerts.length} Active</Badge>
        </div>
        <div className="space-y-3">
          {criticalAlerts.map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.severity === "critical" ? "bg-red-500" :
                alert.severity === "warning" ? "bg-orange-500" : "bg-blue-500"
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                {alert.severity}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Admin Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-24 bg-orange-500 hover:bg-orange-600 flex-col space-y-2 text-left">
          <Users className="w-8 h-8" />
          <div>
            <div className="font-semibold">User Management</div>
            <div className="text-xs opacity-80">Add, edit, delete users</div>
          </div>
        </Button>
        <Button variant="outline" className="h-24 flex-col space-y-2 text-left border-gray-600 hover:bg-gray-800">
          <Settings className="w-8 h-8" />
          <div>
            <div className="font-semibold">System Settings</div>
            <div className="text-xs opacity-80">Configure system</div>
          </div>
        </Button>
        <Button variant="outline" className="h-24 flex-col space-y-2 text-left border-gray-600 hover:bg-gray-800">
          <BarChart3 className="w-8 h-8" />
          <div>
            <div className="font-semibold">Analytics</div>
            <div className="text-xs opacity-80">View detailed reports</div>
          </div>
        </Button>
        <Button variant="outline" className="h-24 flex-col space-y-2 text-left border-gray-600 hover:bg-gray-800">
          <Shield className="w-8 h-8" />
          <div>
            <div className="font-semibold">Security Center</div>
            <div className="text-xs opacity-80">Monitor & protect</div>
          </div>
        </Button>
      </div>

      {/* Additional Admin Tools */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-orange-500" />
          Admin Tools & Features
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Backup Management</h4>
            <p className="text-sm text-gray-400 mb-3">Schedule and manage system backups</p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Configure</Button>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">API Management</h4>
            <p className="text-sm text-gray-400 mb-3">Monitor API usage and endpoints</p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">View APIs</Button>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Log Viewer</h4>
            <p className="text-sm text-gray-400 mb-3">View system and application logs</p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Open Logs</Button>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Email Templates</h4>
            <p className="text-sm text-gray-400 mb-3">Manage notification templates</p>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Edit Templates</Button>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Performance Monitor</h4>
            <p className="text-sm text-gray-400 mb-3">Real-time performance metrics</p>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">Monitor</Button>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Database Admin</h4>
            <p className="text-sm text-gray-400 mb-3">Database management tools</p>
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">Access DB</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
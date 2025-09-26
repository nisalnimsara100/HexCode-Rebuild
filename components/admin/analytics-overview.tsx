import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Eye, Mail, FolderOpen, Code, Award, Zap, Globe, Shield } from "lucide-react"

interface AnalyticsCardProps {
  icon: React.ElementType;
  value: string;
  title: string;
  description: string;
}

function AnalyticsCard({ icon: Icon, value, title, description }: AnalyticsCardProps) {
  return (
    <Card className="flex flex-col items-center p-6 bg-card border border-border rounded-lg">
      <Icon className="w-10 h-10 text-emerald-500" />
      <h2 className="text-xl font-bold mt-4">{value}</h2>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  )
}

export function AnalyticsOverview() {
  const stats = [
    {
      title: "Total Visitors",
      value: "12,543",
      change: "+12.5%",
      trend: "up",
      icon: <Eye className="w-5 h-5" />,
    },
    {
      title: "Project Inquiries",
      value: "89",
      change: "+8.2%",
      trend: "up",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      title: "Active Projects",
      value: "6",
      change: "+2",
      trend: "up",
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.5%",
      trend: "down",
      icon: <Users className="w-5 h-5" />,
    },
  ]

  const recentActivity = [
    { action: "New contact form submission", time: "2 minutes ago", type: "contact" },
    { action: "Project 'EcoCommerce' updated", time: "1 hour ago", type: "project" },
    { action: "New visitor from Google", time: "3 hours ago", type: "visitor" },
    { action: "Newsletter subscription", time: "5 hours ago", type: "subscription" },
    { action: "Project inquiry received", time: "1 day ago", type: "inquiry" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 glass-effect">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass-effect">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Add New Project</h4>
              <p className="text-sm text-muted-foreground">Create a new project showcase</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Review Contacts</h4>
              <p className="text-sm text-muted-foreground">Check new contact submissions</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Update Content</h4>
              <p className="text-sm text-muted-foreground">Modify website content</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <AnalyticsCard
          icon={Code}
          value="20+"
          title="Projects Completed"
          description="Successful software projects delivered"
        />
        <AnalyticsCard
          icon={Users}
          value="10+"
          title="Happy Clients"
          description="Businesses we've helped grow"
        />
        <AnalyticsCard
          icon={Award}
          value="2+"
          title="Years Experience"
          description="Years of software development expertise"
        />
        <AnalyticsCard
          icon={Zap}
          value="99%"
          title="Uptime"
          description="Average application uptime"
        />
        <AnalyticsCard
          icon={Globe}
          value="15+"
          title="Technologies"
          description="Modern tech stack mastery"
        />
        <AnalyticsCard
          icon={Shield}
          value="100%"
          title="Secure"
          description="Security-first development approach"
        />
      </section>
    </div>
  )
}

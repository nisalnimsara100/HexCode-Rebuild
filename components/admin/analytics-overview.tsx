import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Eye, Mail, FolderOpen, BarChart3, PieChart, Calendar, Download } from "lucide-react"
import { useState, useEffect } from "react";
import { Code, Award, Zap, Globe, Shield } from "lucide-react";
import { database } from "../../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { ToastTitle, ToastDescription, ToastProvider, ToastViewport } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";

type Stat = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  isEditing: boolean;
};

export function AnalyticsOverview() {
  const { addToast } = useToast();

  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Projects Completed",
      value: "20+",
      description: "Successful software projects delivered",
      icon: <Code className="w-5 h-5" />,
      isEditing: false,
    },
    {
      title: "Happy Clients",
      value: "10+",
      description: "Businesses we've helped grow",
      icon: <Users className="w-5 h-5" />,
      isEditing: false,
    },
    {
      title: "Years Experience",
      value: "2+",
      description: "Years of software development expertise",
      icon: <Award className="w-5 h-5" />,
      isEditing: false,
    },
    {
      title: "Uptime",
      value: "99%",
      description: "Average application uptime",
      icon: <Zap className="w-5 h-5" />,
      isEditing: false,
    },
    {
      title: "Technologies",
      value: "15+",
      description: "Modern tech stack mastery",
      icon: <Globe className="w-5 h-5" />,
      isEditing: false,
    },
    {
      title: "Secure",
      value: "100%",
      description: "Security-first development approach",
      icon: <Shield className="w-5 h-5" />,
      isEditing: false,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, 'analytics/overview');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      setData(snapshot.val());
    });

    return () => unsubscribe();
  }, []);

  const trafficSources = [
    { source: "Google Search", visitors: 5420, percentage: 43.2 },
    { source: "Direct", visitors: 3200, percentage: 25.5 },
    { source: "LinkedIn", visitors: 2100, percentage: 16.7 },
    { source: "GitHub", visitors: 1200, percentage: 9.6 },
    { source: "Others", visitors: 623, percentage: 5.0 },
  ]

  const pageViews = [
    { page: "/", views: 4500, bounceRate: "32%" },
    { page: "/projects", views: 3200, bounceRate: "28%" },
    { page: "/services", views: 2800, bounceRate: "35%" },
    { page: "/about", views: 1900, bounceRate: "45%" },
    { page: "/contact", views: 1600, bounceRate: "25%" },
  ]

  const recentActivity = [
    { action: "New contact form submission", time: "2 minutes ago", type: "contact" },
    { action: "Project 'EcoCommerce' updated", time: "1 hour ago", type: "project" },
    { action: "New visitor from Google", time: "3 hours ago", type: "visitor" },
    { action: "Newsletter subscription", time: "5 hours ago", type: "subscription" },
    { action: "Project inquiry received", time: "1 day ago", type: "inquiry" },
  ]

  const handleStatChange = (index: number, field: keyof Stat, value: Stat[keyof Stat]) => {
    const updatedStats: Stat[] = [...stats];
    (updatedStats[index][field] as typeof value) = value;
    setStats(updatedStats);
  };

  const saveStatsToFirebase = (stats: Stat[]) => {
    const sanitizedStats = stats.map((stat) => {
      const { icon, ...rest } = stat;
      return {
        ...rest,
        icon: stat.icon ? stat.icon.toString() : "", // Store icon as string representation
      };
    });

    const dbRef = ref(database, "analytics/overview/list");
    set(dbRef, sanitizedStats)
      .then(() => {
        addToast("Success", "Stats saved successfully to Firebase!", "success");
      })
      .catch((error) => {
        addToast("Error", `Failed to save stats: ${error.message}`, "error");
      });
  };

  const saveStats = () => {
    console.log("Updated stats:", stats);
    saveStatsToFirebase(stats);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 text-center flex flex-col items-center justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              {stat.icon}
            </div>
            {stat.isEditing ? (
              <>
                <h3 className="text-lg font-bold">
                  <input
                    type="text"
                    className="text-center bg-transparent border-none focus:outline-none"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, "value", e.target.value)}
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  <input
                    type="text"
                    className="text-center bg-transparent border-none focus:outline-none"
                    value={stat.title}
                    onChange={(e) => handleStatChange(index, "title", e.target.value)}
                  />
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <input
                    type="text"
                    className="text-center bg-transparent border-none focus:outline-none"
                    value={stat.description}
                    onChange={(e) => handleStatChange(index, "description", e.target.value)}
                  />
                </p>
                <Button
                  onClick={() => {
                    handleStatChange(index, "isEditing", false);
                    saveStats(); 
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <Button
                  onClick={() => handleStatChange(index, "isEditing", true)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Edit
                </Button>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Analytics Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Traffic Sources</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{source.source}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium">{source.visitors.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Pages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Pages</h3>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {pageViews.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium font-mono">{page.page}</p>
                  <p className="text-xs text-muted-foreground">Bounce Rate: {page.bounceRate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{page.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
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

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold">2.4s</h3>
          <p className="text-sm text-muted-foreground">Average Load Time</p>
          <div className="flex items-center justify-center mt-2">
            <TrendingDown className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-sm text-emerald-500">-0.3s improved</span>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold">4.2</h3>
          <p className="text-sm text-muted-foreground">Pages per Session</p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-sm text-emerald-500">+0.3 improved</span>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold">68%</h3>
          <p className="text-sm text-muted-foreground">Returning Visitors</p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-sm text-emerald-500">+5% increased</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

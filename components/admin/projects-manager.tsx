import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Eye, Plus, Search } from "lucide-react"

export function ProjectsManager() {
  const projects = [
    {
      id: 1,
      title: "EcoCommerce Platform",
      category: "E-commerce",
      status: "Live",
      technologies: ["Next.js", "TypeScript", "Stripe"],
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      title: "HealthTech Dashboard",
      category: "Healthcare",
      status: "In Development",
      technologies: ["React", "Node.js", "MongoDB"],
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      title: "FinTech Mobile App",
      category: "FinTech",
      status: "Live",
      technologies: ["React Native", "Firebase"],
      lastUpdated: "3 days ago",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects Manager</h2>
          <p className="text-muted-foreground">Manage your project showcase</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 glass-effect">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10" />
          </div>
          <select className="px-3 py-2 border border-border rounded-lg bg-background">
            <option>All Categories</option>
            <option>E-commerce</option>
            <option>Healthcare</option>
            <option>FinTech</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-lg bg-background">
            <option>All Status</option>
            <option>Live</option>
            <option>In Development</option>
            <option>Completed</option>
          </select>
        </div>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 glass-effect hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                    {project.category}
                  </Badge>
                  <Badge
                    variant={project.status === "Live" ? "default" : "secondary"}
                    className={project.status === "Live" ? "bg-emerald-500 text-white" : ""}
                  >
                    {project.status}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Technologies:</span>
                  <div className="flex space-x-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <span>•</span>
                  <span>Updated {project.lastUpdated}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 bg-transparent">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

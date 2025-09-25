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

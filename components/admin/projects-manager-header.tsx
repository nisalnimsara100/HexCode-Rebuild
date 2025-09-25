import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export function ProjectsManagerHeader() {
  return (
    <header className="bg-card border-b border-border p-4 h-20 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground flex items-center">Projects Manager</h1>
      <div className="flex items-center space-x-4">
        {/* Search and Filters */}
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
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
    </header>
  )
}
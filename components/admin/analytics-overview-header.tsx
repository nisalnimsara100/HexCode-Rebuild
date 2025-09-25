import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export function AnalyticsOverviewHeader() {
  return (
    <header className="bg-card border-b border-border p-4 h-20 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground flex items-center">Analytics Overview</h1>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search analytics..." className="pl-10" />
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Analytics
        </Button>
      </div>
    </header>
  )
}
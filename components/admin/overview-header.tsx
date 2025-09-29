"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Plus, Settings } from "lucide-react"

export function OverviewHeader() {
  return (
    <div className="flex items-center justify-between p-6 bg-background border-b border-border">
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Badge className="bg-emerald-500">
            Live
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>
  )
}
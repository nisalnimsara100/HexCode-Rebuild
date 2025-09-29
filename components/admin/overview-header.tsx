"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export function OverviewHeader() {
  return (
    <header className="bg-card border-b border-border p-4 h-20 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold text-foreground">Overview Dashboard</h1>
        <Badge className="bg-emerald-500 text-white">Live</Badge>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search overview..." className="pl-10" />
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Overview
        </Button>
      </div>
    </header>
  )
}
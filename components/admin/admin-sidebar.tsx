"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, FolderOpen, Settings, BarChart3, Mail, Shield, LogOut } from "lucide-react"
import Image from "next/image"


interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" />, badge: "6" },
    { id: "contacts", label: "Contacts", icon: <Mail className="w-4 h-4" />, badge: "12" },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, badge: null },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" />, badge: null },
  ]

  return (
    <div className="flex">
      <div className="w-64 bg-card border-r border-border flex flex-col fixed inset-y-0"> {/* Adjusted to use 'inset-y-0' for proper alignment */}
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <Image src="/images/hexcode-logo.png" alt="HexCode" fill className="object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">HexCode</span>
              <Badge variant="outline" className="ml-2 text-xs border-emerald-500 text-emerald-500">
                <Shield className="w-2 h-2 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center justify-start px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground bg-transparent"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className={`ml-auto text-xs ${
                    activeTab === item.id 
                      ? "bg-white/20 text-white border-0" 
                      : "bg-emerald-500/10 text-emerald-600 border-0"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AJ</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Alex Johnson</p>
              <p className="text-xs text-muted-foreground truncate">admin@hexcode.dev</p>
            </div>
          </div>

          <Button variant="outline" className="w-full justify-start text-muted-foreground bg-transparent">
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 ml-64"> {/* Adjusted layout to remove blank area */}
        {/* Add other tab components here */}
      </div>
    </div>
  )
}

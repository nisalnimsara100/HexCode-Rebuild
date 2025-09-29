"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { OverviewHeader } from "./overview-header"
import { ProjectsManager } from "./projects-manager"
import { ContactsManager } from "./contacts-manager"
import { AnalyticsOverview } from "./analytics-overview"
import { OverviewDashboard } from "./overview-dashboard"
import { SettingsPanel } from "./settings-panel"
import { ProjectsManagerHeader } from "./projects-manager-header"
import { ContactsManagerHeader } from "./contacts-manager-header"
import { AnalyticsOverviewHeader } from "./analytics-overview-header"
import { SettingsPanelHeader } from "./settings-panel-header"

// Standardize header height
const headerStyles = "text-2xl font-bold text-foreground h-16 flex items-center"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderHeader = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewHeader />
      case "projects":
        return <ProjectsManagerHeader />
      case "contacts":
        return <ContactsManagerHeader />
      case "analytics":
        return <AnalyticsOverviewHeader />
      case "settings":
        return <SettingsPanelHeader />
      default:
        return <OverviewHeader />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col"> {/* Removed 'ml-64' to align content properly */}
          {renderHeader()} {/* Dynamically render headers based on activeTab */}

          <main className="flex-1 p-6 bg-card">
            <div className="max-w-7xl mx-auto space-y-6">
              {activeTab === "overview" && <OverviewDashboard />}
              {activeTab === "projects" && <ProjectsManager />}
              {activeTab === "contacts" && <ContactsManager />}
              {activeTab === "analytics" && <AnalyticsOverview />}
              {activeTab === "settings" && <SettingsPanel />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

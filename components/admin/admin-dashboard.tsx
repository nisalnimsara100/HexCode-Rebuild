"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { ProjectsManager } from "./projects-manager"
import { ContactsManager } from "./contacts-manager"
import { AnalyticsOverview } from "./analytics-overview"
import { SettingsPanel } from "./settings-panel"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col">
          <AdminHeader />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {activeTab === "overview" && <AnalyticsOverview />}
              {activeTab === "projects" && <ProjectsManager />}
              {activeTab === "contacts" && <ContactsManager />}
              {activeTab === "settings" && <SettingsPanel />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

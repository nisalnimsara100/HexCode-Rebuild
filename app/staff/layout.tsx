"use client";

import { useState, createContext, useContext } from "react";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { StaffHeader } from "@/components/staff/staff-header";
import { StaffAuthWrapper } from "@/components/auth/staff-auth-wrapper";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <StaffAuthWrapper allowedRoles={["admin", "manager", "employee"]}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <div className="min-h-screen bg-black">
          <StaffSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
            <StaffHeader setSidebarOpen={setSidebarOpen} />
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </StaffAuthWrapper>
  );
}
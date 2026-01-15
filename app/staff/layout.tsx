"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { StaffHeader } from "@/components/staff/staff-header";
import { StaffAuthWrapper } from "@/components/auth/staff-auth-wrapper";
import { useAuth } from "@/components/auth/auth-context";

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
  const { userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowedRoles: ("staff" | "admin" | "manager")[] = ["staff", "admin", "manager"];

  useEffect(() => {
    if (!userProfile) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/staff/dashboard"));
      return;
    }

    // Role enforcement:
    // Only 'staff', 'admin', or 'manager' are allowed in the staff dashboard.
    // 'employee' is specifically excluded here to enforce the "pending approval" state.


    if (!(allowedRoles as readonly string[]).includes(userProfile.role)) {
      // If on register or login page, don't redirect (layout typically doesn't wrap them, but safety check)
      if (!pathname.includes("/register") && !pathname.includes("/login")) {
        router.push("/unauthorized?reason=pending_approval");
      }
    }
  }, [userProfile, router, pathname]);

  // Don't render layout if user not loaded or not authorized (prevents flash of content)
  if (!userProfile || !(allowedRoles as readonly string[]).includes(userProfile.role)) {
    return null;
  }

  return (
    <StaffAuthWrapper allowedRoles={allowedRoles}>
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
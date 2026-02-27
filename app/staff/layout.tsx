"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { StaffHeader } from "@/components/staff/staff-header";
import { StaffAuthWrapper } from "@/components/auth/staff-auth-wrapper";
import { useAuth } from "@/components/auth/auth-context";
import { database } from "@/lib/firebase";
import { ref, update, onDisconnect, serverTimestamp } from "firebase/database";

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
  const { userProfile, isAuthReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowedRoles: ("staff" | "admin" | "manager" | "employee")[] = ["staff", "admin", "manager", "employee"];

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!userProfile) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/staff/dashboard"));
      return;
    }

    // Role enforcement


    if (!(allowedRoles as readonly string[]).includes(userProfile.role)) {
      // If on register or login page, don't redirect (layout typically doesn't wrap them, but safety check)
      if (!pathname.includes("/register") && !pathname.includes("/login")) {
        router.push("/unauthorized?reason=pending_approval");
      }
    }
  }, [userProfile, router, pathname, isAuthReady]);

  useEffect(() => {
    if (!userProfile?.uid) {
      return;
    }

    const userRef = ref(database, `users/${userProfile.uid}`);
    let disconnectRef: ReturnType<typeof onDisconnect> | null = null;

    const setOnline = async () => {
      await update(userRef, {
        status: "online",
        lastActive: serverTimestamp(),
      });
    };

    const setOffline = async () => {
      await update(userRef, {
        status: "offline",
        lastActive: serverTimestamp(),
      });
    };

    const setupPresence = async () => {
      try {
        disconnectRef = onDisconnect(userRef);
        await disconnectRef.update({
          status: "offline",
          lastActive: serverTimestamp(),
        });
        await setOnline();
      } catch (error) {
        console.error("Failed to setup presence:", error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        void setOffline();
      } else {
        void setOnline();
      }
    };

    const handleWindowOffline = () => {
      void setOffline();
    };

    const handleWindowOnline = () => {
      void setOnline();
    };

    void setupPresence();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("offline", handleWindowOffline);
    window.addEventListener("online", handleWindowOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("offline", handleWindowOffline);
      window.removeEventListener("online", handleWindowOnline);
      void setOffline();
      if (disconnectRef) {
        void disconnectRef.cancel();
      }
    };
  }, [userProfile?.uid]);

  // Don't render layout if user not loaded or not authorized (prevents flash of content)
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin" />
      </div>
    );
  }

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
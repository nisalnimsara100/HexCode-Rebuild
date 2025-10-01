"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, Bell, Search, Plus, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-context";

interface StaffHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function StaffHeader({ setSidebarOpen }: StaffHeaderProps) {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const getUserInitials = (displayName: string) => {
    return displayName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-lg font-semibold text-white">
            {userProfile?.role === "employee" ? "My Workspace" : "Staff Management"}
          </h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-x-2 text-sm text-gray-300 hover:bg-gray-800">
                {userProfile?.profilePicture ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
                    src={userProfile.profilePicture}
                    alt={userProfile.name}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-semibold">
                    {userProfile?.name ? getUserInitials(userProfile.name) : "U"}
                  </div>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <span className="text-sm text-gray-300">
                    {userProfile?.name || "User"}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end">
              <DropdownMenuLabel className="text-gray-300">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {userProfile?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {userProfile?.email}
                  </p>
                  <p className="text-xs text-blue-400 capitalize">
                    {userProfile?.role} • {userProfile?.department}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-gray-700 cursor-pointer"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { userProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!userProfile) {
      router.push("/admin/login")
      return
    }

    // If authenticated but not admin, redirect to unauthorized
    if (userProfile.role !== "admin") {
      router.push("/unauthorized")
      return
    }
  }, [userProfile, router])

  // Show loading while checking authentication
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin mx-auto" />
          <p className="text-orange-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Only render admin dashboard if user is admin
  if (userProfile.role !== "admin") {
    return null // Component will redirect via useEffect
  }

  return <AdminDashboard />
}

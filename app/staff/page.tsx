"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

export default function StaffPage() {
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      // Redirect based on user role
      if (userProfile.role === "admin") {
        router.push("/admin/dashboard");
      } else if (userProfile.role === "manager" || userProfile.role === "employee") {
        router.push("/staff/dashboard");
      } else {
        router.push("/unauthorized");
      }
    } else {
      // User is not authenticated, redirect to login
      router.push("/staff/login");
    }
  }, [userProfile, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin" />
    </div>
  );
}
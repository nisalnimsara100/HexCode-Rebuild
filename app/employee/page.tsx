"use client";

import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployeePortal() {
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userProfile || userProfile.role !== "employee") {
      router.push("/unauthorized");
    }
  }, [userProfile, router]);

  if (!userProfile || userProfile.role !== "employee") {
    return null; // Prevent rendering if unauthorized
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-gray-900 to-emerald-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Welcome to the Employee Portal</h1>
        <p className="text-emerald-400 mt-4">Access your tools and resources here.</p>
      </div>
    </div>
  );
}
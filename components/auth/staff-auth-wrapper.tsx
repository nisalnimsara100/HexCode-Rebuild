"use client";

import { useAuth } from "./auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface StaffAuthWrapperProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "manager" | "employee")[];
}

export function StaffAuthWrapper({ 
  children, 
  allowedRoles = ["admin", "manager"]
}: StaffAuthWrapperProps) {
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userProfile && !allowedRoles.includes(userProfile.role)) {
      router.push("/unauthorized"); // Redirect to an unauthorized page if role is not allowed
    }
  }, [userProfile, allowedRoles, router]);

  return <>{children}</>;
}
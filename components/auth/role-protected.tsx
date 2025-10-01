"use client";

import { useAuth } from "./auth-context";

interface RoleProtectedProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "manager" | "employee")[];
}

export function RoleProtected({ 
  children, 
  allowedRoles
}: RoleProtectedProps) {
  const { userProfile } = useAuth();

  if (userProfile && !allowedRoles.includes(userProfile.role)) {
    return <div>Access Denied</div>; // Simple access denied message
  }

  return <>{children}</>;
}
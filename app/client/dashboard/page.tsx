"use client";

import { ClientDashboard } from "@/components/client/client-dashboard-clean";
import { ClientAuthProvider } from "@/components/auth/client-auth-context";
import { ClientAuthWrapper } from "@/components/auth/client-auth-wrapper";

export default function ClientDashboardPage() {
  return (
    <ClientAuthProvider>
      <ClientAuthWrapper>
        <ClientDashboard />
      </ClientAuthWrapper>
    </ClientAuthProvider>
  );
}
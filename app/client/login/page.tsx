"use client";

import { LoginPageWrapper } from "@/components/client/login-page-wrapper";
import { ClientAuthProvider } from "@/components/auth/client-auth-context";

export default function ClientLoginPage() {
  return (
    <ClientAuthProvider>
      <LoginPageWrapper />
    </ClientAuthProvider>
  );
}
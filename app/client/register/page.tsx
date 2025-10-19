"use client";

import { RegisterPageWrapper } from "@/components/client/register-page-wrapper";
import { ClientAuthProvider } from "@/components/auth/client-auth-context";

export default function ClientRegisterPage() {
  return (
    <ClientAuthProvider>
      <RegisterPageWrapper />
    </ClientAuthProvider>
  );
}
import { default as UnifiedLogin } from "@/components/auth/unified-login";
import { ClientAuthProvider } from "@/components/auth/client-auth-context";

export default function LoginPage() {
  return (
    <ClientAuthProvider>
      <UnifiedLogin />
    </ClientAuthProvider>
  );
}
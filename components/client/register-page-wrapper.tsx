"use client";

import { ClientAuthModal } from "./client-auth-modal";

export function RegisterPageWrapper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <ClientAuthModal 
        isOpen={true}
        onClose={() => {}} // Prevent closing on register page
        initialMode="register"
      />
    </div>
  );
}
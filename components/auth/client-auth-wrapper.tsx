"use client";

import { useEffect, useState } from "react";
import { useClientAuth } from "./client-auth-context";
import { ClientAuthModal } from "../client/client-auth-modal";

interface ClientAuthWrapperProps {
  children: React.ReactNode;
}

export function ClientAuthWrapper({ children }: ClientAuthWrapperProps) {
  const { clientProfile, loading } = useClientAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Only show auth modal if we're not loading and there's no profile
    if (!loading) {
      if (!clientProfile) {
        // Double-check localStorage before showing modal
        try {
          const storedProfile = localStorage.getItem('clientProfile');
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            if (profile.role === "client") {
              setShowAuthModal(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error checking stored profile:", error);
        }
        setShowAuthModal(true);
      } else {
        setShowAuthModal(false);
      }
    }
  }, [clientProfile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
          <p className="text-gray-400">Verifying your credentials</p>
        </div>
      </div>
    );
  }

  if (!clientProfile || showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <ClientAuthModal 
          isOpen={true}
          onClose={() => {}} // Prevent closing without authentication
        />
      </div>
    );
  }

  return <>{children}</>;
}
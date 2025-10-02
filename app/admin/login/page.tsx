"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified login
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin mx-auto" />
        <p className="text-orange-400">Redirecting to unified login...</p>
      </div>
    </div>
  );
}

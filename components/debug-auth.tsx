"use client";

import { useState, useEffect } from "react";
import { ClientAuth } from "@/lib/client-auth";

export function DebugAuth() {
  const [profile, setProfile] = useState<any>(null);
  const [rawData, setRawData] = useState<string>("");

  useEffect(() => {
    const checkData = () => {
      const raw = localStorage.getItem('clientProfile');
      setRawData(raw || "No data");
      
      const profile = ClientAuth.getCurrentUser();
      setProfile(profile);
    };

    checkData();
    
    const interval = setInterval(checkData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm text-xs">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-2">
        <div>
          <strong>Raw localStorage:</strong>
          <pre className="whitespace-pre-wrap break-all">{rawData}</pre>
        </div>
        <div>
          <strong>Parsed Profile:</strong>
          <pre className="whitespace-pre-wrap break-all">{profile ? JSON.stringify(profile, null, 2) : "null"}</pre>
        </div>
        <div>
          <strong>Profile Name:</strong> {profile?.name || "No name"}
        </div>
      </div>
    </div>
  );
}
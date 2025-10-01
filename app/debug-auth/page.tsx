"use client";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DebugAuthPage() {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white">Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded border border-orange-500/20">
                <h3 className="font-medium text-white mb-2">Auth Status</h3>
                <p className="text-gray-300">{userProfile ? "✅ Authenticated" : "❌ Not authenticated"}</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded border border-orange-500/20">
                <h3 className="font-medium text-white mb-2">User Email</h3>
                <p className="text-gray-300 text-sm">
                  {userProfile?.email || "❌ No email"}
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded border border-orange-500/20">
                <h3 className="font-medium text-white mb-2">User Profile</h3>
                <p className="text-gray-300 text-sm">
                  {userProfile ? `✅ Role: ${userProfile.role}` : "❌ No profile"}
                </p>
              </div>
            </div>

            {userProfile && (
              <div className="bg-gray-800/50 p-4 rounded border border-orange-500/20">
                <h3 className="font-medium text-white mb-2">User Details</h3>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {JSON.stringify({
                    name: userProfile.name,
                    email: userProfile.email,
                    role: userProfile.role,
                    department: userProfile.department || 'N/A'
                  }, null, 2)}
                </pre>
              </div>
            )}

            {userProfile && (
              <div className="bg-slate-700/50 p-4 rounded">
                <h3 className="font-medium text-white mb-2">User Profile Details</h3>
                <pre className="text-xs text-slate-300 overflow-auto">
                  {JSON.stringify(userProfile, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 font-medium mb-2">🔄 Using Realtime Database</p>
              <p className="text-sm text-yellow-300">
                All authentication and data storage now uses Firebase Realtime Database at:<br />
                <code className="text-xs bg-slate-700 px-2 py-1 rounded mt-1 inline-block">
                  https://hexcode-website-897f4-default-rtdb.firebaseio.com/
                </code>
              </p>
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <Link href="/setup">Initialize Data</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/staff/login">Staff Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/staff">Staff Portal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
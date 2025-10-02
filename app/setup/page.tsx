"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initializeSampleData, sampleCredentials } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Database, Users, Key } from "lucide-react";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const setupData = async () => {
    setLoading(true);
    setError("");
    setStatus("Starting setup...");

    try {
      // First, create Firebase Auth users
      setStatus("Creating Firebase Auth users...");
      
      const authUsers = [
        { email: "admin@hexcode.com", password: "admin123" },
        { email: "manager@hexcode.com", password: "manager123" },
        { email: "employee@hexcode.com", password: "employee123" }
      ];

      for (const { email, password } of authUsers) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log(`Created auth user: ${email}`);
          setStatus(`Created auth user: ${email}`);
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log(`Auth user already exists: ${email}`);
            setStatus(`Auth user already exists: ${email}`);
          } else {
            console.error(`Error creating user ${email}:`, error);
            setError(`Failed to create user ${email}: ${error.message}`);
            return;
          }
        }
      }

      // Then initialize sample data in Firestore
      setStatus("Adding sample data to Firestore...");
      const dataResult = await initializeSampleData();
      
      if (dataResult) {
        setStatus("Setup completed successfully!");
        setSuccess(true);
      } else {
        throw new Error("Failed to initialize sample data");
      }

    } catch (error: any) {
      console.error("Setup error:", error);
      setError(error.message || "Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-orange-500/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Setup Complete!
              </CardTitle>
              <CardDescription className="text-slate-400">
                Sample data has been added to Firebase
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-2">✅ Successfully Created:</p>
                <ul className="text-sm text-green-300 space-y-1">
                  <li>• 3 Firebase Auth users</li>
                  <li>• 3 User profiles in Firestore</li>
                  <li>• 3 Sample tickets</li>
                  <li>• 2 Sample projects</li>
                  <li>• 3 Sample departments</li>
                </ul>
              </div>

              <div className="bg-black border border-black rounded-lg p-4">
                <p className="text-white font-medium mb-3">🔑 Test Credentials:</p>
                <div className="grid gap-3">
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-white font-medium">Admin Account</p>
                    <p className="text-slate-300 text-sm">Email: admin@hexcode.com</p>
                    <p className="text-slate-300 text-sm">Password: admin123</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-white font-medium">Manager Account</p>
                    <p className="text-slate-300 text-sm">Email: manager@hexcode.com</p>
                    <p className="text-slate-300 text-sm">Password: manager123</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-white font-medium">Employee Account</p>
                    <p className="text-slate-300 text-sm">Email: employee@hexcode.com</p>
                    <p className="text-slate-300 text-sm">Password: employee123</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => window.location.href = "/staff/login"}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Go to Staff Login
                </Button>
                <Button 
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
                <Database className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Setup Required
            </CardTitle>
            <CardDescription className="text-slate-400">
              Initialize sample data for the staff management system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {status && !error && (
              <Alert className="bg-blue-500/10 border-blue-500/50 text-blue-400">
                <Database className="h-4 w-4" />
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-white font-medium mb-2">This will create:</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Sample user accounts (admin, manager, employee)</li>
                <li>• Sample tickets with different priorities</li>
                <li>• Sample projects and departments</li>
                <li>• Test authentication credentials</li>
              </ul>
            </div>

            <Button
              onClick={setupData}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Setting up...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Initialize Sample Data</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, Building2, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError("Failed to send password reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-slate-400">
                Password reset instructions sent
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-center">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  We've sent password reset instructions to:
                </p>
                <p className="text-white font-medium mt-1">{email}</p>
              </div>
              
              <div className="text-sm text-slate-400 space-y-2">
                <p>Please check your email and follow the instructions to reset your password.</p>
                <p>If you don't see the email, check your spam folder.</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Send Another Email
              </Button>

              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/staff/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your email to receive reset instructions
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="text-sm text-slate-400">
                <p>
                  We'll send you a link to reset your password. Make sure to check your spam folder if you don't see it in your inbox.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Email"
                )}
              </Button>

              <Button asChild variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                <Link href="/staff/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>HexCode Staff Portal © 2025</p>
          <p>For support, contact IT Department</p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  AlertCircle, 
  ArrowRight, 
  UserPlus,
  X
} from "lucide-react";
import Link from "next/link";

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function ClientAuthModal({ isOpen, onClose, initialMode = "login" }: ClientAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: ""
  });

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Simulate Google auth
      setTimeout(() => {
        setLoading(false);
        onClose();
        router.push('/client/dashboard');
      }, 1500);
    } catch (err) {
      setError("Google authentication failed");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate login
      setTimeout(() => {
        setLoading(false);
        onClose();
        router.push('/client/dashboard');
      }, 1500);
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // Simulate registration
      setTimeout(() => {
        setLoading(false);
        onClose();
        router.push('/client/dashboard');
      }, 1500);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 border-0 bg-transparent overflow-hidden max-h-[90vh]" showCloseButton={false}>
        <div className="relative bg-background/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 rounded-2xl" />
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl animate-pulse" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-lg bg-background/80 hover:bg-muted border border-border hover:border-emerald-500/30 flex items-center justify-center transition-all duration-200 group shadow-sm"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </button>

          <div className="relative p-6">
            <DialogHeader className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    H
                  </span>
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground mb-2 text-center">
                Welcome to HexCode
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm text-center mx-auto max-w-sm">
                {mode === "login" 
                  ? "Sign in to access your dashboard and manage projects" 
                  : "Create your account and start building the future"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Button
                onClick={handleGoogleAuth}
                disabled={loading}
                variant="outline"
                className="w-full h-11 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-background text-muted-foreground">or</span>
                </div>
              </div>

              {error && (
                <Alert className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 mb-4">
                    <Link href="/forgot-password" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors hover:underline">
                      Forgot Password?
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors hover:underline"
                    >
                      Sign Up
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
              )}

              {/* Register Form */}
              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Company (Optional)</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Your company name"
                        value={registerData.company}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, company: e.target.value }))}
                        className="pl-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10 h-10 bg-muted/50 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      By signing up, you agree to our{" "}
                      <Link href="/terms" className="text-emerald-500 hover:underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-emerald-500 hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 group"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>Create Account</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors hover:underline"
                  >
                    {mode === "login" ? "Create account" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
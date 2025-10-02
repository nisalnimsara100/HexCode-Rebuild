"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  User, 
  Building, 
  Phone, 
  Users,
  Building2,
  AlertCircle,
  UserPlus,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function UnifiedRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Admin registration removed - only employees can register through this form
  const { signUp } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    employeeId: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create employee user profile
      const profile = {
        name: `${formData.firstName} ${formData.lastName}`,
        role: 'employee' as const,
        department: formData.department || 'General',
        employeeId: formData.employeeId || `EMP-${Date.now().toString().slice(-6)}`
      };
      
      await signUp(formData.email, formData.password, profile);
      
      setSuccess("Registration successful! You can now sign in as an employee.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-2xl">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Join HexCode
          </h1>
          <p className="text-slate-400 text-lg">Create your employee account</p>
        </div>

        {/* Registration Card */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Employee Registration</h2>
            <p className="text-slate-300">Register for staff portal access</p>
          </div>



          {/* Status Messages */}
          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 text-red-300 mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-500/20 border-green-500/50 text-green-300 mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-slate-300">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="firstName" 
                    name="firstName"
                    type="text" 
                    placeholder="John" 
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-slate-300">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="lastName" 
                    name="lastName"
                    type="text" 
                    placeholder="Doe" 
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="employee@hexcode.dev"
                  className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            {/* Phone and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-300">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="phone" 
                    name="phone"
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-slate-300">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="department" 
                    name="department"
                    type="text" 
                    placeholder="Department" 
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl" 
                    value={formData.department}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Employee ID (optional) */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-medium text-slate-300">Employee ID (Optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="employeeId" 
                  name="employeeId"
                  type="text" 
                  placeholder="EMP-123456"
                  className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl" 
                  value={formData.employeeId}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className="pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10 mt-0.5" required />
              <span className="text-slate-300">
                I agree to the{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300">
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Employee Account</span>
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-slate-400 mb-4">Already have an account?</p>
              <Button asChild variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                <Link href="/login" className="flex items-center justify-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Sign In</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Employee accounts will be activated after admin approval.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>&copy; 2025 HexCode. All rights reserved.</p>
          <p className="mt-1">For support, contact IT Department</p>
        </div>
      </div>
    </div>
  );
}
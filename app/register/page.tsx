"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, Building2, AlertCircle, CheckCircle, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { uploadProfileImage, validateImageFile } from "@/lib/imageUpload";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "" as string
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Auto-generate employee ID
      const employeeId = `EMP${Date.now().toString().slice(-6)}`;
      
      // Handle image upload if file is selected
      let profilePictureUrl = "";
      if (profilePictureFile) {
        try {
          profilePictureUrl = await uploadProfileImage(profilePictureFile, employeeId);
        } catch (uploadError) {
          setError("Failed to upload profile image. Please try again.");
          return;
        }
      }
      
      await signUp(formData.email, formData.password, {
        name: formData.name,
        employeeId: employeeId,
        role: "employee",
        profilePicture: profilePictureUrl
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
          <p className="text-blue-300 mb-6">Your employee account has been created successfully. Redirecting to login...</p>
          <div className="w-8 h-8 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mx-auto" />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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

        {/* Register Card */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Employee Registration</h2>
            <p className="text-slate-300">Fill in your details to get started</p>
          </div>

          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 text-red-300 mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200"
                  required
                />
              </div>
              <p className="text-xs text-slate-400">Employee ID will be auto-generated after registration</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your work email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-300">Profile Picture (Optional)</label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setProfilePictureFile(null);
                        setFormData(prev => ({ ...prev, profilePicture: "" }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate image file
                      const validation = validateImageFile(file);
                      if (!validation.isValid) {
                        setError(validation.error || "Invalid image file");
                        return;
                      }
                      
                      setError(""); // Clear any previous errors
                      setProfilePictureFile(file);
                      setFormData(prev => ({ ...prev, profilePicture: file.name }));
                      
                      // Create preview URL
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setImagePreview(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs text-slate-400">Image will be saved to Images folder. Department will be assigned by admin after registration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
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
                  <span>Back to Login</span>
                </Link>
              </Button>
            </div>
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
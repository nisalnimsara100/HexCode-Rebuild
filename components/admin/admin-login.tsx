"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"
import Image from "next/image"

export function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      const userProfile = await signIn(email, password)
      
      // Check if user is admin
      if (userProfile.role === 'admin') {
        // Successful admin login
        router.push('/admin')
      } else {
        setError('Access denied. Admin privileges required.')
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-emerald-500/30 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-emerald-400/30 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-emerald-600/20 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-emerald-500/20 rounded-full"></div>
      </div>

      <Card className="w-full max-w-md p-8 glass-effect relative">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative w-10 h-10">
                <Image src="/images/hexcode-logo.png" alt="HexCode" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold gradient-text">HexCode</span>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                <Shield className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="admin@hexcode.dev" className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-emerald-500 hover:text-emerald-600">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Registration Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need an admin account?{" "}
              <a href="/admin/register" className="text-orange-500 hover:text-orange-600 font-medium">
                Register here
              </a>
            </p>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This is a secure admin area. All activities are logged and monitored.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

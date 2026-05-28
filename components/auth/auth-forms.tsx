"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Hash, AtSign, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type FormType = "login" | "signup"

export function AuthForms() {
  const [activeForm, setActiveForm] = useState<FormType>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  
  // Signup form state
  const [studentId, setStudentId] = useState("")
  const [realName, setRealName] = useState("")
  const [schoolEmail, setSchoolEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login attempt:", { loginEmail, rememberMe })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Signup attempt:", { studentId, realName, schoolEmail, nickname })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="lg:w-1/2 bg-primary relative overflow-hidden flex flex-col justify-center items-center p-8 lg:p-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 text-balance">
              Unam High School
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl font-medium">
              Community Board
            </p>
          </div>
          
          <div className="max-w-sm mx-auto">
            <p className="text-primary-foreground/70 text-sm lg:text-base leading-relaxed">
              Connect with fellow students, share ideas, and stay updated with school activities in a safe and verified environment.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="hidden lg:flex mt-16 gap-4 justify-center">
            <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
            <div className="w-3 h-3 rounded-full bg-primary-foreground/50" />
            <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
          </div>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          {/* Form Toggle */}
          <div className="flex bg-secondary rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => setActiveForm("login")}
              className={cn(
                "flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200",
                activeForm === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveForm("signup")}
              className={cn(
                "flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200",
                activeForm === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          <div
            className={cn(
              "transition-all duration-300",
              activeForm === "login"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 hidden"
            )}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground mt-1">Sign in to access your community</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium">
                  Email or Student ID
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="Enter your email or ID"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10 h-11 bg-card border-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-card border-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-sm text-primary hover:underline font-medium">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium">
                Login
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {"Don't have an account? "}
              <button
                type="button"
                onClick={() => setActiveForm("signup")}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Signup Form */}
          <div
            className={cn(
              "transition-all duration-300",
              activeForm === "signup"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 hidden"
            )}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
              <p className="text-muted-foreground mt-1">Join the Unam High School community</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* School Authentication Identity Section */}
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  School Authentication
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="student-id" className="text-sm font-medium">
                      Student ID
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="student-id"
                        type="text"
                        placeholder="10101"
                        maxLength={5}
                        pattern="[0-9]{5}"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        className="pl-10 h-10 bg-card border-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="real-name" className="text-sm font-medium">
                      Real Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="real-name"
                        type="text"
                        placeholder="Your name"
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                        className="pl-10 h-10 bg-card border-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school-email" className="text-sm font-medium">
                  School Email
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="school-email"
                    type="email"
                    placeholder="2024000...@school.hs.kr"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    className="pl-10 h-11 bg-card border-input"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use your official school email for verification
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">
                  Nickname
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Your anonymous display name"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="pl-10 h-11 bg-card border-input"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be displayed in community activities
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-card border-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-card border-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium">
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveForm("login")}
                className="text-primary hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

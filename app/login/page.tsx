"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { loginSuccess } from "@/lib/slices/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Demo credentials
    if (email === "user@example.com" && password === "password") {
      dispatch(
        loginSuccess({
          id: "user1",
          name: "John Reader",
          email: "user@example.com",
          role: "user",
        }),
      )
      router.push("/library")
    } else if (email === "admin@example.com" && password === "password") {
      dispatch(
        loginSuccess({
          id: "admin1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        }),
      )
      router.push("/admin/dashboard")
    } else {
      setError("Invalid email or password. Try user@example.com / admin@example.com with password 'password'")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome to BookWorm</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-4 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-muted/50 border border-border/50">
                  <p className="font-medium text-foreground">User Demo:</p>
                  <p className="text-muted-foreground">Email: user@example.com</p>
                  <p className="text-muted-foreground">Password: password</p>
                </div>
                <div className="p-2 rounded bg-muted/50 border border-border/50">
                  <p className="font-medium text-foreground">Admin Demo:</p>
                  <p className="text-muted-foreground">Email: admin@example.com</p>
                  <p className="text-muted-foreground">Password: password</p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

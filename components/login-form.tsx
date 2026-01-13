"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench } from "lucide-react"

// Import backend functions
import { login, saveAuth } from "@/api/auth"

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Call backend API
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      // Expected response:
      // { token: "...", role: "CLIENT" | "ADMIN", user: {...} }
      const { token, role } = response

      // Save token + role
      saveAuth(token, role)

      // Redirect based on role
      if (role === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/client/dashboard")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Welcome back</CardTitle>
        </div>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}


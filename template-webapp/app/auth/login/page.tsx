"use client"

import type React from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setReturnUrl(params.get("returnUrl"))
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const destination = returnUrl || "/"
      router.push(destination)
    }
  }, [user, authLoading, returnUrl, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to returnUrl if provided, otherwise to home
      window.location.href = returnUrl || "/"
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 sm:px-6">
        <Card className="w-full max-w-md space-y-8 border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg sm:p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6" aria-busy={isLoading}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-11 transition-colors focus-visible:ring-2"
                  autoComplete="email"
                  aria-invalid={!!error}
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 h-11 transition-colors focus-visible:ring-2"
                  autoComplete="current-password"
                  aria-invalid={!!error}
                />
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="h-11 w-full text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href={returnUrl ? `/auth/signup?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth/signup"}
                className="text-primary underline-offset-4 transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}

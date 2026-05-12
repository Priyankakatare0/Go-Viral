"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function HomeCtaAnalyzeButton() {
  const { user, isLoading } = useAuth()

  const primaryHref = user ? "/tools/virality-analyzer" : "/auth/signup"

  return (
    <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90" asChild>
      <Link href={isLoading ? "/auth/signup" : primaryHref}>
        Start Analyzing Free
      </Link>
    </Button>
  )
}

export function HomeCtaSignupButton() {
  const { user, isLoading } = useAuth()

  return (
    <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90" asChild>
      <Link href={isLoading ? "/auth/signup" : user ? "/tools/virality-analyzer" : "/auth/signup"}>
        Get Started Free
      </Link>
    </Button>
  )
}
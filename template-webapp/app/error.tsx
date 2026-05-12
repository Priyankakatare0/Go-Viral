"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[App Error Boundary]", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Card className="border-destructive/50 bg-destructive/10 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            An unexpected error occurred while loading this page.
          </p>
          <Button onClick={reset} className="h-11">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background px-4 py-12 text-foreground">
        <div className="mx-auto max-w-xl rounded-lg border border-destructive/50 bg-card p-8 text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Critical application error</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            The app encountered a critical issue. Please try reloading.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={reset} className="h-11">Reload app state</Button>
            <Button
              variant="outline"
              className="h-11"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/"
                }
              }}
            >
              Go to home
            </Button>
          </div>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-4 text-xs text-muted-foreground">{error.message}</p>
          ) : null}
        </div>
      </body>
    </html>
  )
}

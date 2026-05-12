"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import Link from "next/link"
import { ArrowRight, Zap, BarChart3, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface Analysis {
  id: string
  created_at: string
  content_type: string
  virality_score: number
}

interface TempAnalysis extends Analysis {
  caption?: string
  hook_score?: number
  pacing_score?: number
  thumbnail_score?: number
  caption_score?: number
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { isPro } = useSubscription()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAnalyses()
    } else {
      setLoadingAnalyses(false)
    }
  }, [user])

  const fetchAnalyses = async () => {
    try {
      const supabaseQuery = supabase
        .from("virality_analyses")
        .select("id, created_at, content_type, virality_score")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10)

      const result = (await Promise.race([
        supabaseQuery,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ])) as { data: any; error: any } | null

      let data = null
      let error = null

      if (result !== null) {
        data = result.data
        error = result.error
      }

      if (error) throw error

      const tempAnalyses = Object.keys(localStorage)
        .filter((key) => key.startsWith("analysis_"))
        .map((key) => {
          try {
            return JSON.parse(localStorage.getItem(key) || "null") as TempAnalysis | null
          } catch {
            return null
          }
        })
        .filter((analysis): analysis is TempAnalysis => Boolean(analysis && analysis.id && analysis.created_at))

      const mergedAnalyses = [...(data || []), ...tempAnalyses]
        .filter((analysis, index, self) => self.findIndex((item) => item.id === analysis.id) === index)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setAnalyses(mergedAnalyses)
    } catch (error) {
      const tempAnalyses = Object.keys(localStorage)
        .filter((key) => key.startsWith("analysis_"))
        .map((key) => {
          try {
            return JSON.parse(localStorage.getItem(key) || "null") as TempAnalysis | null
          } catch {
            return null
          }
        })
        .filter((analysis): analysis is TempAnalysis => Boolean(analysis && analysis.id && analysis.created_at))

      setAnalyses(tempAnalyses)
    } finally {
      setLoadingAnalyses(false)
    }
  }

  const deleteAnalysis = async (id: string) => {
    try {
      if (id.startsWith("temp_")) {
        localStorage.removeItem(`analysis_${id}`)
        setAnalyses(analyses.filter(a => a.id !== id))
        return
      }

      const { error } = await supabase
        .from("virality_analyses")
        .delete()
        .eq("id", id)

      if (error) throw error
      setAnalyses(analyses.filter(a => a.id !== id))
    } catch (error) {
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            {isPro ? (
              <>
                <Zap className="inline w-4 h-4 mr-2 text-primary" />
                You're on the <span className="text-primary font-semibold">Pro plan</span>
              </>
            ) : (
              "Upgrade to Pro for unlimited analyses"
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 hover:border-primary/50 transition-colors">
            <BarChart3 className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">New Analysis</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Analyze your content's virality potential
            </p>
            <Link href="/tools/virality-analyzer">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:border-primary/50 transition-colors">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upgrade Plan</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get unlimited analyses and advanced features
            </p>
            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                View Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Analysis History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Analyses</h2>
          
          {loadingAnalyses ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Card className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by analyzing your first piece of content
              </p>
              <Link href="/tools/virality-analyzer">
                <Button className="bg-primary hover:bg-primary/90">
                  Create First Analysis
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground capitalize">
                        {analysis.content_type} • Virality Score: {analysis.virality_score}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString()} at{" "}
                        {new Date(analysis.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 sm:shrink-0 sm:pl-4">
                      <Link href={`/analysis/${analysis.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAnalysis(analysis.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Analyses</p>
            <p className="text-3xl font-bold text-foreground">{analyses.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Current Plan</p>
            <p className="text-3xl font-bold text-primary">{isPro ? "Pro" : "Free"}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Member Since</p>
            <p className="text-3xl font-bold text-foreground">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Today"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

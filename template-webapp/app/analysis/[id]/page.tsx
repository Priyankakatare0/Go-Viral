"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { ArrowLeft, Download, Share2, Zap, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useParams } from "next/navigation"
import { jsPDF } from "jspdf"

interface Analysis {
  id: string
  virality_score: number
  hook_score: number
  pacing_score: number
  thumbnail_score: number
  caption_score: number
  caption: string
  content_type: string
  created_at: string
}

export default function AnalysisPage() {
  const { user, isLoading: authLoading } = useAuth()
  const params = useParams()
  const analysisId = params.id as string

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (analysisId) {
      // Check if it's a temporary analysis (stored in localStorage)
      if (analysisId.startsWith("temp_")) {
        const tempData = localStorage.getItem(`analysis_${analysisId}`)
        if (tempData) {
          try {
            setAnalysis(JSON.parse(tempData))
            setLoading(false)
            return
          } catch (err) {
            console.error("Failed to parse temp analysis:", err)
          }
        }
      }

      // Otherwise fetch from Supabase
      if (user) {
        fetchAnalysis()
      }
    }
  }, [user, analysisId])

  const fetchAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from("virality_analyses")
        .select("*")
        .eq("id", analysisId)
        .eq("user_id", user?.id)
        .single()

      if (error) throw error
      setAnalysis(data)
    } catch (error) {
      console.error("Failed to fetch analysis:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-lg w-32" />
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Analysis not found</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20"
    if (score >= 60) return "bg-yellow-500/20"
    if (score >= 40) return "bg-orange-500/20"
    return "bg-red-500/20"
  }

  const handleDownloadPdf = () => {
    if (!analysis) return

    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 16
      let cursorY = 18

      const ensureSpace = (neededHeight: number) => {
        if (cursorY + neededHeight > pageHeight - margin) {
          pdf.addPage()
          cursorY = 18
        }
      }

      const drawSectionTitle = (title: string) => {
        ensureSpace(12)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(14)
        pdf.text(title, margin, cursorY)
        cursorY += 8
      }

      const drawLine = (label: string, value: string) => {
        ensureSpace(7)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(11)
        pdf.text(`${label}:`, margin, cursorY)
        pdf.setFont("helvetica", "bold")
        pdf.text(value, margin + 52, cursorY)
        cursorY += 6
      }

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(20)
      pdf.text("Go Viral Analysis Report", margin, cursorY)
      cursorY += 10

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, cursorY)
      cursorY += 10

      drawSectionTitle("Summary")
      drawLine("Virality Score", `${analysis.virality_score}/100`)
      drawLine("Content Type", analysis.content_type)
      drawLine("Created", new Date(analysis.created_at).toLocaleString())

      drawSectionTitle("Score Breakdown")
      drawLine("Hook Strength", `${analysis.hook_score}/25`)
      drawLine("Pacing Analysis", `${analysis.pacing_score}/25`)
      drawLine("Thumbnail Rating", `${analysis.thumbnail_score}/25`)
      drawLine("Caption Quality", `${analysis.caption_score}/25`)

      drawSectionTitle("Caption")
      const captionLines = pdf.splitTextToSize(analysis.caption || "", pageWidth - margin * 2)
      pdf.setFont("helvetica", "normal")
      pdf.text(captionLines, margin, cursorY)
      cursorY += captionLines.length * 6 + 4

      drawSectionTitle("AI Recommendations")
      const recommendations = [
        "Hook Improvement: Add a question or surprising stat in the first 3 seconds",
        'Use Trending Audio: Current trending: "Never Gonna Give You Up" remix',
        "Hashtags to Use: #FYP #ForYouPage #Trending #Viral",
      ]

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      for (const recommendation of recommendations) {
        ensureSpace(10)
        const wrapped = pdf.splitTextToSize(`• ${recommendation}`, pageWidth - margin * 2)
        pdf.text(wrapped, margin, cursorY)
        cursorY += wrapped.length * 6 + 2
      }

      pdf.save(`analysis_${analysis.id}.pdf`)
      toast.success("Downloaded PDF report")
    } catch (error) {
      console.error("PDF download failed", error)
      toast.error("Failed to download PDF")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground mt-2">
            {new Date(analysis.created_at).toLocaleDateString()} at{" "}
            {new Date(analysis.created_at).toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Virality Score */}
          <Card className="lg:col-span-1 p-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Virality Score</p>
              <div
                className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${getScoreBgColor(
                  analysis.virality_score
                )} mb-4`}
              >
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(analysis.virality_score)}`}>
                    {analysis.virality_score}
                  </p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysis.virality_score >= 80
                  ? "🔥 Highly Viral"
                  : analysis.virality_score >= 60
                    ? "⭐ Good Potential"
                    : analysis.virality_score >= 40
                      ? "📈 Moderate Potential"
                      : "💡 Needs Work"}
              </p>
            </div>
          </Card>

          {/* Component Scores */}
          <Card className="lg:col-span-2 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Score Breakdown</h2>
            <div className="space-y-6">
              {/* Hook Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Hook Strength</p>
                  <p className={`font-bold ${getScoreColor(analysis.hook_score)}`}>
                    {analysis.hook_score}/25
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(analysis.hook_score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  How engaging is your first 3 seconds?
                </p>
              </div>

              {/* Pacing Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Pacing Analysis</p>
                  <p className={`font-bold ${getScoreColor(analysis.pacing_score)}`}>
                    {analysis.pacing_score}/25
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(analysis.pacing_score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Is your content paced well?
                </p>
              </div>

              {/* Thumbnail Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Thumbnail Rating</p>
                  <p className={`font-bold ${getScoreColor(analysis.thumbnail_score)}`}>
                    {analysis.thumbnail_score}/25
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(analysis.thumbnail_score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Visual appeal of cover image
                </p>
              </div>

              {/* Caption Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Caption Quality</p>
                  <p className={`font-bold ${getScoreColor(analysis.caption_score)}`}>
                    {analysis.caption_score}/25
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(analysis.caption_score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Copy effectiveness
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Caption */}
          <Card className="p-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Your Caption</h3>
            <p className="text-foreground leading-relaxed">{analysis.caption}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Content Type: <span className="capitalize font-semibold">{analysis.content_type}</span>
            </p>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold text-foreground">Hook Improvement</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add a question or surprising stat in the first 3 seconds
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold text-foreground">Use Trending Audio</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Current trending: "Never Gonna Give You Up" remix
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold text-foreground">Hashtags to Use</p>
                <p className="text-xs text-muted-foreground mt-1">
                  #FYP #ForYouPage #Trending #Viral
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownloadPdf}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={async () => {
              if (!analysis) return
              try {
                const shareData = {
                  title: `Go Viral Analysis (${analysis.virality_score}/100)`,
                  text: `Virality score: ${analysis.virality_score}/100 — view the full analysis at this link.`,
                  url: window.location.href,
                }

                if ((navigator as any).share) {
                  try {
                    await (navigator as any).share(shareData)
                    toast.success("Shared successfully")
                    return
                  } catch (err) {
                    // fallthrough to clipboard
                  }
                }

                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard")
              } catch (err) {
                console.error("Share failed", err)
                toast.error("Failed to share")
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Link href="/tools/virality-analyzer" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analyze Another
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

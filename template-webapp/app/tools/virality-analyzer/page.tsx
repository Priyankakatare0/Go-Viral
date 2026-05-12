"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useState, useRef } from "react"
import { Upload, Zap, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ViralizerPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { isPro } = useSubscription()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
  const MAX_FREE_ANALYSES = 3 // Daily limit for free tier

  const handleFileSelect = (selectedFile: File) => {
    setError(null)

    if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
      setError("Please upload an image or video file")
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 100MB")
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!file) {
      setError("Please select a file to analyze")
      return
    }

    if (!caption.trim()) {
      setError("Please enter a caption")
      return
    }

    setIsAnalyzing(true)

    try {
      // Simulate analysis delay (2.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Generate mock analysis results
      const mockAnalysis = {
        virality_score: Math.floor(Math.random() * 40) + 55, // 55-95 score
        hook_score: Math.floor(Math.random() * 25),
        pacing_score: Math.floor(Math.random() * 25),
        thumbnail_score: Math.floor(Math.random() * 25),
        caption_score: Math.floor(Math.random() * 25),
        content_type: file.type.startsWith("video") ? "video" : "image",
        category: ["Trending", "Educational", "Entertainment", "Lifestyle"][
          Math.floor(Math.random() * 4)
        ],
      }

      // Save to Supabase with timeout. If it takes too long, silently fall back.
      const response = (await Promise.race([
        (async () => {
          const { supabase } = await import("@/lib/supabase/client")
          return await supabase
            .from("virality_analyses")
            .insert({
              user_id: user?.id,
              content_type: mockAnalysis.content_type,
              caption: caption,
              virality_score: mockAnalysis.virality_score,
              hook_score: mockAnalysis.hook_score,
              pacing_score: mockAnalysis.pacing_score,
              thumbnail_score: mockAnalysis.thumbnail_score,
              caption_score: mockAnalysis.caption_score,
            })
            .select()
        })(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ])) as { data: Array<{ id: string }> | null; error: unknown } | null

      if (response?.data?.[0]?.id) {
        router.push(`/analysis/${response.data[0].id}`)
        return
      }

      // Fallback: Show mock results if database fails
      // Store in localStorage as temporary analysis
      const tempId = `temp_${Date.now()}`
      const tempAnalysis = {
        id: tempId,
        ...mockAnalysis,
        caption: caption,
        created_at: new Date().toISOString(),
      }
      localStorage.setItem(`analysis_${tempId}`, JSON.stringify(tempAnalysis))
      router.push(`/analysis/${tempId}`)
    } catch (err) {
      console.error("Analysis error:", err)
      setError("Failed to analyze content. Please try again.")
      setIsAnalyzing(false)
    }
  }

  if (authLoading) {
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
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-2">Virality Analyzer</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Upload your content and get an instant virality score
            </p>
          </div>

          {/* Upgrade Prompt for Free Tier */}
          {!isPro && (
            <Card className="mb-8 p-4 border-primary/50 bg-primary/5">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">Limited to 3 analyses per day</p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Pro for unlimited analyses and advanced features
                  </p>
                  <Link href="/pricing">
                    <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <Card
              className="cursor-pointer border-2 border-dashed border-primary/30 p-5 transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 focus-within:border-primary/70 sm:p-8"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload content for analysis"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                aria-label="Choose image or video file"
              />

              <div className="flex flex-col items-center justify-center py-8">
                {preview ? (
                  <div className="w-full">
                    {file?.type.startsWith("video") ? (
                      <video
                        src={preview}
                        className="w-full max-h-64 rounded-lg object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-64 rounded-lg object-cover"
                      />
                    )}
                    <p className="text-sm text-muted-foreground mt-4 text-center">{file?.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 h-11 w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                        setPreview(null)
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Drag & drop your video or image
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      or click to browse your files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: MP4, WebM, JPG, PNG (Max 100MB)
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Caption Input */}
            <div>
              <Label htmlFor="caption" className="text-base font-semibold mb-2 block">
                Caption
              </Label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter the caption or description for your content..."
                className="w-full rounded-lg border border-border/50 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={4}
                maxLength={500}
                aria-describedby="caption-count"
              />
              <p
                id="caption-count"
                className={`mt-2 text-xs ${caption.length > 450 ? "text-amber-500" : "text-muted-foreground"}`}
              >
                {caption.length}/500 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="border-destructive/50 bg-destructive/10 p-4" role="alert" aria-live="polite">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isAnalyzing || !file || !caption.trim()}
              size="lg"
              className="h-12 w-full bg-primary py-6 text-base transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>

            {/* Info Section */}
            <Card className="border-border/50 bg-muted/50 p-5 sm:p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Instant Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      Get virality score, hook strength, pacing analysis in seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Trending Insights</p>
                    <p className="text-xs text-muted-foreground">
                      Get recommendations for hashtags and trending audio
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Saved History</p>
                    <p className="text-xs text-muted-foreground">
                      Access all your past analyses in your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}

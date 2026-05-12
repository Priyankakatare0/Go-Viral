import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Sparkles, Zap, Shield, TrendingUp, Target, Lightbulb, BarChart3 } from "lucide-react"
import { HomeCtaAnalyzeButton, HomeCtaSignupButton } from "@/components/home-cta-buttons"

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: "Virality Score Analysis",
      description: "Get an instant 0-100 virality score with detailed breakdown of hook strength, pacing, thumbnail quality, and caption optimization.",
    },
    {
      icon: Lightbulb,
      title: "Hook Analysis",
      description: "AI-powered analysis of your first 3 seconds to identify what catches viewers' attention and keeps them watching.",
    },
    {
      icon: TrendingUp,
      title: "Trending Recommendations",
      description: "Discover trending audio, hashtags, and content patterns that align with your niche for maximum reach.",
    },
    {
      icon: BarChart3,
      title: "Competitor Comparison",
      description: "Compare your content metrics against trending videos in your category to find improvement opportunities.",
    },
  ]

  // Mock gallery of example analyses
  const exampleAnalyses = [
    {
      id: 1,
      contentType: "Video",
      title: "Product Demo - Fashion Haul",
      score: 87,
      hookScore: 23,
      pacingScore: 22,
      thumbnailScore: 21,
      captionScore: 21,
      category: "Fashion",
    },
    {
      id: 2,
      contentType: "Video",
      title: "Mukbang - Late Night Snacks",
      score: 76,
      hookScore: 20,
      pacingScore: 19,
      thumbnailScore: 18,
      captionScore: 19,
      category: "Food",
    },
    {
      id: 3,
      contentType: "Image",
      title: "Fitness Transformation",
      score: 92,
      hookScore: 24,
      pacingScore: 23,
      thumbnailScore: 23,
      captionScore: 22,
      category: "Fitness",
    },
    {
      id: 4,
      contentType: "Video",
      title: "Beauty Tutorial - Natural Glow",
      score: 81,
      hookScore: 21,
      pacingScore: 20,
      thumbnailScore: 20,
      captionScore: 20,
      category: "Beauty",
    },
    {
      id: 5,
      contentType: "Video",
      title: "Comedy Skit - Office Life",
      score: 79,
      hookScore: 20,
      pacingScore: 21,
      thumbnailScore: 19,
      captionScore: 19,
      category: "Comedy",
    },
    {
      id: 6,
      contentType: "Image",
      title: "Travel Vlog - Beach Paradise",
      score: 85,
      hookScore: 22,
      pacingScore: 21,
      thumbnailScore: 21,
      captionScore: 21,
      category: "Travel",
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10"
    if (score >= 60) return "bg-yellow-500/10"
    if (score >= 40) return "bg-orange-500/10"
    return "bg-red-500/10"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0 opacity-20" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30">
              <Sparkles className="w-4 h-4" />
              AI-Powered Content Analytics
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
              Make Your Content{" "}
              <span className="text-primary">Go Viral</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
              Get instant AI analysis on your videos and images. Discover your virality score, hook strength, 
              trending opportunities, and actionable feedback to optimize every upload.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <HomeCtaAnalyzeButton />
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-primary/30 hover:bg-primary/5" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>3 analyses free per day</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>AI-powered insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Powerful Features for Creators</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to understand and optimize your content's viral potential
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="flex gap-4 p-6 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Gallery Section */}
      <section className="container mx-auto px-6 py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Example Analyses</h2>
            <p className="text-muted-foreground text-lg">
              See how our AI analyzes different types of content across various categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 transition-all hover:border-primary/30 p-6 space-y-4 cursor-pointer"
              >
                {/* Content Type Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">{analysis.contentType}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50 border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">{analysis.category}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {analysis.title}
                </h3>

                {/* Score Display */}
                <div className={`flex items-center gap-3 p-4 rounded-lg ${getScoreBgColor(analysis.score)}`}>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Virality Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Hook Strength</span>
                    <span className="font-semibold text-foreground">{analysis.hookScore}/25</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(analysis.hookScore / 25) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground pt-2">
                    <span>Pacing</span>
                    <span className="font-semibold text-foreground">{analysis.pacingScore}/25</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(analysis.pacingScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* View Analysis CTA */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-primary font-semibold group-hover:text-primary/80">
                    See full analysis →
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-12 border border-primary/20">
          <h2 className="text-4xl font-bold">Ready to Optimize Your Content?</h2>
          <p className="text-lg text-muted-foreground">
            Join creators worldwide using Go Viral to understand and improve their content strategy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HomeCtaSignupButton />
            <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-primary/30 hover:bg-primary/5" asChild>
              <Link href="/tools/virality-analyzer">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

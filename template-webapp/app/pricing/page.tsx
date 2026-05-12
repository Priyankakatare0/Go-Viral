"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import Link from "next/link"
import { Check, Zap, Star } from "lucide-react"

export default function PricingPage() {
  const { user } = useAuth()
  const { isPro, tier } = useSubscription()

  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "3 analyses per day",
        "Basic virality score",
        "Hook strength analysis",
        "Pacing breakdown",
        "Community support",
      ],
      notIncluded: [
        "Unlimited analyses",
        "Advanced AI insights",
        "Trending recommendations",
        "Competitor comparison",
        "Priority support",
      ],
      cta: "Get Started",
      ctaHref: "/auth/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For serious creators",
      features: [
        "Unlimited analyses",
        "Advanced virality score",
        "Deep hook analysis",
        "Detailed pacing insights",
        "Trending audio & hashtag recommendations",
        "Competitor comparison",
        "Save & export reports",
        "Priority email support",
        "Advanced analytics dashboard",
      ],
      notIncluded: [],
      cta: isPro ? "You're on Pro" : "Upgrade Now",
      ctaHref: isPro ? "#" : "/checkout",
      highlighted: true,
      badge: "Most Popular",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Choose the perfect plan for your content creation journey. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {tiers.map((tierOption) => (
            <div key={tierOption.name} className="relative">
              {/* Badge */}
              {tierOption.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {tierOption.badge}
                  </span>
                </div>
              )}

              <Card
                className={`flex h-full flex-col p-6 transition-all duration-300 sm:p-8 ${
                  tierOption.highlighted
                    ? "scale-[1.01] border-primary/50 bg-primary/5 shadow-md md:scale-105"
                    : "hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {tierOption.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {tierOption.description}
                  </p>
                  <div>
                    <span className="text-4xl font-bold text-foreground">
                      {tierOption.price}
                    </span>
                    {tierOption.period && (
                      <span className="text-muted-foreground ml-1">
                        {tierOption.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Included Features */}
                <div className="mb-8 flex-1">
                  <p className="text-sm font-semibold text-foreground mb-4">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {tierOption.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Included */}
                {tierOption.notIncluded.length > 0 && (
                  <div className="mb-8 pb-8 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-3">
                      Not included:
                    </p>
                    <ul className="space-y-2">
                      {tierOption.notIncluded.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="text-muted-foreground/50">✕</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                {tierOption.ctaHref === "#" ? (
                  <Button
                    disabled
                    className="h-12 w-full bg-primary py-6 text-base"
                  >
                    {tierOption.cta}
                  </Button>
                ) : (
                  <Link href={tierOption.ctaHref} className="block w-full">
                    <Button
                      className={`h-12 w-full py-6 text-base transition-all duration-200 hover:shadow-md ${
                        tierOption.highlighted
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {tierOption.name === "Pro" && !isPro ? (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          {tierOption.cta}
                        </>
                      ) : (
                        tierOption.cta
                      )}
                    </Button>
                  </Link>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade anytime?",
                a: "Yes! You can change your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards including Visa, Mastercard, and American Express.",
              },
              {
                q: "Is there a free trial for Pro?",
                a: "The Free plan gives you 3 analyses per day to try the platform. Start now!",
              },
              {
                q: "What happens if I cancel?",
                a: "Your account remains active until the end of your billing cycle. No hidden charges.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer 30-day money-back guarantee for Pro subscriptions.",
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to level up your content?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join hundreds of creators using Go Viral to optimize their content
          </p>
          {!user ? (
            <Link href="/auth/signup">
              <Button className="h-12 bg-primary px-8 py-6 text-base hover:bg-primary/90">
                Start Free Today
              </Button>
            </Link>
          ) : !isPro ? (
            <Link href="/checkout">
              <Button className="h-12 bg-primary px-8 py-6 text-base hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          ) : (
            <Link href="/tools/virality-analyzer">
              <Button className="h-12 bg-primary px-8 py-6 text-base hover:bg-primary/90">
                Go to Analyzer
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

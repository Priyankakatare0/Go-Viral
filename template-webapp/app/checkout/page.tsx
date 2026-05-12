"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Check, Zap } from "lucide-react"

export default function CheckoutPage() {
  const { user, isLoading } = useAuth()
  const { upgradeToPro } = useSubscription()
  const router = useRouter()

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <Card className="max-w-md mx-auto p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You need to be signed in to upgrade
            </p>
            <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90">
                Sign In to Continue
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!cardName.trim()) {
      setError("Cardholder name is required")
      return
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Card number must be 16 digits")
      return
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Expiry date must be MM/YY")
      return
    }
    if (cvv.length !== 3) {
      setError("CVV must be 3 digits")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call upgrade function
      await upgradeToPro()

      // Redirect to success page
      router.push("/upgrade/success")
    } catch (err) {
      console.error("Upgrade error:", err)
      setError("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/pricing">
          <Button variant="ghost" size="sm" className="mb-6 sm:mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-5 sm:p-8">
              <h1 className="text-2xl font-bold text-foreground mb-2 sm:text-3xl">
                Upgrade to Pro
              </h1>
              <p className="text-muted-foreground mb-8">
                Complete your upgrade to unlock unlimited analyses and premium features
              </p>

              <form onSubmit={handleUpgrade} className="space-y-6" aria-busy={isProcessing}>
                {/* Cardholder Name */}
                <div>
                  <Label htmlFor="cardName" className="text-base font-semibold mb-2 block">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    disabled={isProcessing}
                    className="h-11"
                    autoComplete="cc-name"
                    aria-invalid={!!error}
                  />
                </div>

                {/* Card Number */}
                <div>
                  <Label htmlFor="cardNumber" className="text-base font-semibold mb-2 block">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const formatted = e.target.value
                        .replace(/\s/g, "")
                        .slice(0, 16)
                        .replace(/(\d{4})/g, "$1 ")
                        .trim()
                      setCardNumber(formatted)
                    }}
                    disabled={isProcessing}
                    maxLength={19}
                    className="h-11"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    aria-invalid={!!error}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is a demo. Use any 16-digit number.
                  </p>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-base font-semibold mb-2 block">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "")
                        if (val.length >= 2) {
                          val = val.slice(0, 2) + "/" + val.slice(2, 4)
                        }
                        setExpiryDate(val)
                      }}
                      disabled={isProcessing}
                      maxLength={5}
                      className="h-11"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      aria-invalid={!!error}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-base font-semibold mb-2 block">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      disabled={isProcessing}
                      maxLength={3}
                      className="h-11"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      aria-invalid={!!error}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <Card className="border-destructive/50 bg-destructive/10 p-4" role="alert" aria-live="polite">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  </Card>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  size="lg"
                  className="h-12 w-full bg-primary py-6 text-base transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Complete Upgrade
                    </>
                  )}
                </Button>

                {/* Demo Notice */}
                <Card className="p-4 bg-primary/10 border-primary/50">
                  <p className="text-xs text-primary font-semibold mb-1">📝 Demo Payment</p>
                  <p className="text-xs text-muted-foreground">
                    This is a demonstration. No actual payment will be processed. Click the button to simulate a successful payment.
                  </p>
                </Card>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4 p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
                <div className="flex justify-between items-center">
                  <p className="text-foreground">Pro Plan (Monthly)</p>
                  <p className="font-semibold text-foreground">$9.99</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3">What you get:</p>
                <ul className="space-y-2">
                  {[
                    "Unlimited analyses",
                    "Advanced AI insights",
                    "Trending recommendations",
                    "Competitor comparison",
                    "Export reports",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-foreground mb-1">30-Day Guarantee</p>
                <p className="text-xs text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-foreground font-semibold">Total</p>
                  <p className="text-2xl font-bold text-primary">$9.99</p>
                </div>
                <p className="text-xs text-muted-foreground">Billed monthly, cancel anytime</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

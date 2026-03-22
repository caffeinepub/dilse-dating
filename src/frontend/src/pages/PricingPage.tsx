import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Crown, Loader2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateMembershipSession } from "../hooks/useQueries";

const PLANS = [
  {
    name: "Basic",
    tier: "basic",
    price: 20,
    icon: Star,
    color: "text-muted-foreground",
    features: [
      "Browse 10 profiles per day",
      "Send 5 messages per day",
      "Basic matching algorithm",
      "Profile visibility to others",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Premium",
    tier: "premium",
    price: 99,
    icon: Zap,
    color: "text-primary",
    features: [
      "Unlimited profile browsing",
      "Unlimited messages",
      "Advanced AI matching",
      "See who liked your profile",
      "Priority search visibility",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Gold",
    tier: "gold",
    price: 299,
    icon: Crown,
    color: "text-amber-600",
    features: [
      "Everything in Premium",
      "Weekly profile boost",
      "Read receipts",
      "Exclusive filter options",
      "Dedicated relationship concierge",
      "VIP badge on profile",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const { identity, login } = useInternetIdentity();
  const createSession = useCreateMembershipSession();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (!identity) {
      login();
      return;
    }
    setSelectedTier(tier);
    try {
      const successUrl = `${window.location.origin}/payment/success?tier=${tier}`;
      const cancelUrl = `${window.location.origin}/payment/cancel`;
      const sessionUrl = await createSession.mutateAsync({
        tier,
        successUrl,
        cancelUrl,
      });
      window.location.href = sessionUrl;
    } catch {
      toast.error("Failed to create checkout session. Please try again.");
      setSelectedTier(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <Badge className="mb-4 rounded-pill bg-secondary text-secondary-foreground border-0 px-4 py-1.5">
              Simple, transparent pricing
            </Badge>
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold mb-4">
              Choose Your{" "}
              <span className="text-gradient-primary italic">Love Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Unlock the full DilSe experience. Starting at just ₹20/month — no
              hidden fees, cancel anytime.
            </p>
          </motion.div>

          {!identity && (
            <Alert
              className="mb-8 border-primary/30 bg-primary/5 rounded-2xl"
              data-ocid="pricing.error_state"
            >
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                Please{" "}
                <button
                  type="button"
                  onClick={() => login()}
                  className="font-semibold text-primary underline"
                >
                  sign in
                </button>{" "}
                to subscribe to a plan.
              </AlertDescription>
            </Alert>
          )}

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-ocid="pricing.list"
          >
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative bg-card rounded-2xl p-6 flex flex-col card-shadow ${
                  plan.popular
                    ? "border-2 border-primary scale-[1.02] shadow-primary/10"
                    : "border border-border"
                }`}
                data-ocid={`pricing.item.${i + 1}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-pill bg-primary text-primary-foreground border-0 px-4 py-1 text-xs font-semibold shadow-sm">
                      ✨ Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <plan.icon className={`w-5 h-5 ${plan.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-xl">
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-extrabold text-primary">
                      ₹{plan.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed monthly, cancel anytime
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={
                    createSession.isPending && selectedTier === plan.tier
                  }
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full rounded-pill ${!plan.popular ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" : ""}`}
                  data-ocid={`pricing.item.${i + 1}`}
                >
                  {createSession.isPending && selectedTier === plan.tier ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    `Get ${plan.name}`
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">🔒 Secure payments</span>
            <span className="flex items-center gap-2">↩ Cancel anytime</span>
            <span className="flex items-center gap-2">🇮🇳 INR billing</span>
            <span className="flex items-center gap-2">
              🛡️ Money-back guarantee
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

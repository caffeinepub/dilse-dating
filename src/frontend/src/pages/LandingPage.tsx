import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, Heart, Shield, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const SAMPLE_PROFILES = [
  {
    name: "Priya S.",
    age: 26,
    city: "Mumbai",
    img: 1,
    interests: ["Yoga", "Travel", "Poetry"],
    score: 92,
  },
  {
    name: "Rahul M.",
    age: 28,
    city: "Delhi",
    img: 12,
    interests: ["Music", "Hiking", "Cooking"],
    score: 87,
  },
  {
    name: "Ananya R.",
    age: 24,
    city: "Bangalore",
    img: 5,
    interests: ["Art", "Books", "Dance"],
    score: 95,
  },
  {
    name: "Arjun K.",
    age: 30,
    city: "Hyderabad",
    img: 15,
    interests: ["Films", "Cricket", "Coffee"],
    score: 89,
  },
];

const PRICING_PLANS = [
  {
    name: "Basic",
    price: "₹20",
    period: "/month",
    features: [
      "Browse 10 profiles/day",
      "Send 5 messages/day",
      "Basic matching",
      "Profile visibility",
    ],
    tier: "basic",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹99",
    period: "/month",
    features: [
      "Unlimited browsing",
      "Unlimited messages",
      "Advanced matching",
      "See who liked you",
      "Priority support",
    ],
    tier: "premium",
    popular: true,
  },
  {
    name: "Gold",
    price: "₹299",
    period: "/month",
    features: [
      "Everything in Premium",
      "Profile boost (weekly)",
      "Read receipts",
      "Exclusive filters",
      "Dedicated concierge",
    ],
    tier: "gold",
    popular: false,
  },
];

export default function LandingPage() {
  const { login } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge className="mb-4 rounded-pill bg-secondary text-secondary-foreground border-0 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> India's Most Trusted
              Dating App
            </Badge>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Find Your{" "}
              <span className="text-gradient-primary italic">Perfect</span>
              <br />
              Match Today
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
              Connect with thousands of verified singles across India. Start
              your love story with DilSe — where every connection is meaningful.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="rounded-pill px-8 text-base"
                onClick={() => login()}
                data-ocid="hero.primary_button"
              >
                <Heart className="w-4 h-4 mr-2 fill-current" /> Get Started Free
              </Button>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-pill px-8 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
                  data-ocid="hero.secondary_button"
                >
                  View Plans from ₹20/mo
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required to sign up
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              <div>
                <p className="font-display font-bold text-2xl text-primary">
                  50K+
                </p>
                <p className="text-xs text-muted-foreground">Active Members</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-primary">
                  12K+
                </p>
                <p className="text-xs text-muted-foreground">
                  Successful Matches
                </p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-primary">
                  4.8★
                </p>
                <p className="text-xs text-muted-foreground">App Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden card-shadow-hover">
              <img
                src="/assets/generated/hero-couple.dim_800x600.jpg"
                alt="Happy couple"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -bottom-4 -left-4 bg-card rounded-2xl card-shadow p-3 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  New Match!
                </p>
                <p className="text-xs text-muted-foreground">
                  92% compatibility
                </p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -top-4 -right-4 bg-card rounded-2xl card-shadow p-3 flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-primary" />
              <p className="text-xs font-semibold text-foreground">
                1,234 online now
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sample Profiles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50" id="profiles">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Your Daily Suggestions
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Carefully curated matches based on your preferences and values.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            data-ocid="profiles.list"
          >
            {SAMPLE_PROFILES.map((profile, i) => (
              <motion.div
                key={profile.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300 group"
                data-ocid={`profiles.item.${i + 1}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={`https://i.pravatar.cc/300?img=${profile.img}`}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm">
                      {profile.name}, {profile.age}
                    </h3>
                    <p className="text-white/70 text-xs">{profile.city}</p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${profile.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {profile.score}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-secondary text-secondary-foreground rounded-pill px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => login()}
                    className="mt-3 w-full py-1.5 rounded-pill bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-1"
                    data-ocid={`profiles.item.${i + 1}`}
                  >
                    <Heart className="w-3 h-3" /> Connect
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => login()}
              className="rounded-pill px-8"
              data-ocid="profiles.primary_button"
            >
              See All Profiles
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Smart Matching",
                desc: "AI-powered compatibility algorithm finds your ideal partner based on values and lifestyle.",
              },
              {
                icon: Shield,
                title: "Verified Profiles",
                desc: "All profiles are manually verified to ensure a safe and authentic dating experience.",
              },
              {
                icon: Users,
                title: "Active Community",
                desc: "Join thousands of singles across India building genuine, lasting connections.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="bg-card rounded-2xl p-6 card-shadow text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50" id="pricing">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Flexible Subscription Plans
            </h2>
            <p className="text-muted-foreground">
              Starting at just ₹20/month — love shouldn't break the bank.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            data-ocid="pricing.list"
          >
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative bg-card rounded-2xl p-6 card-shadow flex flex-col ${plan.popular ? "border-2 border-primary" : "border border-border"}`}
                data-ocid={`pricing.item.${i + 1}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-pill bg-primary text-primary-foreground border-0 px-4 py-1 text-xs font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-display font-bold text-xl mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-extrabold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => login()}
                  className={`rounded-pill w-full ${plan.popular ? "" : "variant-outline"}`}
                  variant={plan.popular ? "default" : "outline"}
                  data-ocid={`pricing.item.${i + 1}`}
                >
                  Choose {plan.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

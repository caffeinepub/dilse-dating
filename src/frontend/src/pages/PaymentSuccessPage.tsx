import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Heart, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          navigate({ to: "/discover" });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="bg-card rounded-3xl card-shadow p-10 max-w-md w-full text-center"
          data-ocid="payment.success_state"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome to DilSe! 💕
          </h1>
          <p className="text-muted-foreground mb-6">
            Your membership is now active. Start discovering amazing people and
            find your perfect match!
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting in {countdown}s...
          </div>

          <Button
            onClick={() => navigate({ to: "/discover" })}
            className="rounded-pill px-8 w-full"
            data-ocid="payment.primary_button"
          >
            <Heart className="w-4 h-4 mr-2 fill-current" /> Start Discovering
            Now
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

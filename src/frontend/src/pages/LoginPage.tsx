import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyProfile } from "../hooks/useQueries";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (identity && !profileLoading) {
      if (!profile) {
        navigate({ to: "/setup" });
      } else {
        navigate({ to: "/discover" });
      }
    }
  }, [identity, profile, profileLoading, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl card-shadow p-8 sm:p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue your journey to finding love.
          </p>

          <Button
            size="lg"
            className="rounded-pill px-10 w-full text-base"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="login.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2 fill-current" /> Continue with
                Internet Identity
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMatches } from "../hooks/useQueries";

export default function MatchesPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: matches = [], isLoading } = useMatches();

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/login" });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Heart className="w-7 h-7 text-primary fill-primary" /> Your
              Matches
            </h1>
            <p className="text-muted-foreground mt-1">
              {matches.length > 0
                ? `${matches.length} people liked you back!`
                : "Your mutual connections will appear here"}
            </p>
          </div>
          {matches.length > 0 && (
            <Badge className="rounded-pill bg-primary text-primary-foreground px-4 py-1.5">
              {matches.length} Match{matches.length !== 1 ? "es" : ""}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            data-ocid="matches.loading_state"
          >
            {["a", "b", "c", "d"].map((k) => (
              <div key={k} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
            data-ocid="matches.empty_state"
          >
            <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              No Matches Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start liking profiles to get matches. When someone likes you back,
              they'll appear here!
            </p>
            <Button
              onClick={() => navigate({ to: "/discover" })}
              className="rounded-pill"
              data-ocid="matches.primary_button"
            >
              <Heart className="w-4 h-4 mr-2" /> Start Discovering
            </Button>
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            data-ocid="matches.list"
          >
            {matches.map((match, i) => (
              <div
                key={`${match.displayName}-${i}`}
                className="relative"
                data-ocid={`matches.item.${i + 1}`}
              >
                <ProfileCard profile={match} liked index={i} />
                <div className="mt-2">
                  <Button
                    size="sm"
                    className="w-full rounded-pill"
                    variant="outline"
                    data-ocid={`matches.item.${i + 1}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

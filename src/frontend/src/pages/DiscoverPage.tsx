import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDiscoverProfiles } from "../hooks/useQueries";

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profiles = [], isLoading, refetch } = useDiscoverProfiles();
  const [likedIndices, setLikedIndices] = useState<Set<number>>(new Set());
  const [passedIndices, setPassedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/login" });
    }
  }, [identity, navigate]);

  const handleLike = (index: number) => {
    setLikedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    toast.success(`You liked ${profiles[index]?.displayName}! 💕`, {
      duration: 2000,
    });
  };

  const handlePass = (index: number) => {
    setPassedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const visibleProfiles = profiles.filter((_, i) => !passedIndices.has(i));

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-primary" /> Discover
            </h1>
            <p className="text-muted-foreground mt-1">
              Find your perfect match today
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-pill"
            data-ocid="discover.secondary_button"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            data-ocid="discover.loading_state"
          >
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
              <div key={k} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleProfiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
            data-ocid="discover.empty_state"
          >
            <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              No More Profiles
            </h3>
            <p className="text-muted-foreground mb-6">
              You've seen everyone for now. Check back later!
            </p>
            <Button
              onClick={() => {
                setPassedIndices(new Set());
                refetch();
              }}
              className="rounded-pill"
              data-ocid="discover.primary_button"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            data-ocid="discover.list"
          >
            {visibleProfiles.map((profile, i) => {
              const originalIndex = profiles.indexOf(profile);
              return (
                <div key={originalIndex} data-ocid={`discover.item.${i + 1}`}>
                  <ProfileCard
                    profile={profile}
                    showActions
                    onLike={() => handleLike(originalIndex)}
                    onPass={() => handlePass(originalIndex)}
                    liked={likedIndices.has(originalIndex)}
                    index={originalIndex}
                  />
                </div>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div
            className="flex justify-center mt-8"
            data-ocid="discover.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

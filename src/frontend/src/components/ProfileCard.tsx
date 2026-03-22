import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Heart, MapPin, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Profile } from "../backend";

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  onLike?: () => void;
  onPass?: () => void;
  liked?: boolean;
  index?: number;
  avatarUrl?: string;
}

export default function ProfileCard({
  profile,
  showActions = false,
  onLike,
  onPass,
  liked = false,
  index = 0,
  avatarUrl,
}: ProfileCardProps) {
  const [heartAnim, setHeartAnim] = useState(false);

  const handleLike = () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    onLike?.();
  };

  const photoUrl =
    profile.photo?.getDirectURL() ??
    avatarUrl ??
    `https://i.pravatar.cc/300?img=${(index % 70) + 1}`;
  const matchScore = 65 + ((index * 13) % 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300 group"
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={photoUrl}
          alt={profile.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Liked overlay */}
        <AnimatePresence>
          {liked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/20 flex items-center justify-center"
            >
              <Heart className="w-16 h-16 fill-primary text-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-display font-semibold text-lg">
            {profile.displayName}, {Number(profile.age)}
          </h3>
          {profile.city && (
            <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              {profile.city}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Match Score */}
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground font-medium">
            Match Score
          </span>
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${matchScore}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-primary">
            {matchScore}%
          </span>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {profile.bio}
          </p>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.interests.slice(0, 3).map((interest) => (
              <Badge
                key={interest}
                variant="secondary"
                className="text-xs px-2 py-0.5 rounded-pill"
              >
                {interest}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onPass}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-pill border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" /> Pass
            </button>
            <button
              type="button"
              onClick={handleLike}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-pill text-sm font-medium transition-all",
                liked
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
                heartAnim && "animate-heart-pop",
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} /> Like
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

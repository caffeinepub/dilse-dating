import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Crown, Loader2, Plus, Save, Upload, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, Gender, MembershipTier } from "../backend";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useMyProfile,
  useSaveProfile,
  useSaveProfilePhoto,
} from "../hooks/useQueries";

const TIER_LABELS: Record<MembershipTier, string> = {
  [MembershipTier.basic]: "Basic",
  [MembershipTier.premium]: "Premium",
  [MembershipTier.gold]: "Gold",
};

const TIER_COLORS: Record<MembershipTier, string> = {
  [MembershipTier.basic]: "bg-secondary text-secondary-foreground",
  [MembershipTier.premium]: "bg-primary text-primary-foreground",
  [MembershipTier.gold]: "bg-amber-100 text-amber-800",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useMyProfile();
  const saveProfile = useSaveProfile();
  const savePhoto = useSaveProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.female);
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/login" });
      return;
    }
    if (profile) {
      setDisplayName(profile.displayName);
      setAge(String(Number(profile.age)));
      setGender(profile.gender);
      setCity(profile.city);
      setBio(profile.bio);
      setInterests(profile.interests);
      if (profile.photo) {
        setPhotoPreview(profile.photo.getDirectURL());
      }
    }
  }, [identity, profile, navigate]);

  const addInterest = () => {
    const val = interestInput.trim();
    if (val && !interests.includes(val)) {
      setInterests((prev) => [...prev, val]);
      setInterestInput("");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      await saveProfile.mutateAsync({
        displayName,
        age: BigInt(age || 18),
        gender,
        city,
        bio,
        interests,
        membershipTier: profile.membershipTier,
        membershipExpiry: profile.membershipExpiry,
      });

      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        await savePhoto.mutateAsync(blob);
      }

      toast.success("Profile updated successfully! 💕");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const isSubmitting = saveProfile.isPending || savePhoto.isPending;

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold flex items-center gap-2">
                <User className="w-7 h-7 text-primary" /> My Profile
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your dating profile and settings
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4" data-ocid="profile.loading_state">
              {["a", "b", "c", "d", "e"].map((k) => (
                <Skeleton key={k} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Membership Status */}
              {profile && (
                <div className="bg-card rounded-2xl p-6 card-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" /> Membership
                        Status
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.membershipExpiry > BigInt(0)
                          ? `Active until ${new Date(Number(profile.membershipExpiry) / 1_000_000).toLocaleDateString()}`
                          : "No active subscription"}
                      </p>
                    </div>
                    <Badge
                      className={`rounded-pill px-4 py-1 ${TIER_COLORS[profile.membershipTier]}`}
                    >
                      {TIER_LABELS[profile.membershipTier]}
                    </Badge>
                  </div>
                  {profile.membershipTier === MembershipTier.basic && (
                    <Button
                      size="sm"
                      className="mt-4 rounded-pill"
                      onClick={() => navigate({ to: "/pricing" })}
                      data-ocid="profile.primary_button"
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              )}

              {/* Profile Photo */}
              <div className="bg-card rounded-2xl p-6 card-shadow">
                <h3 className="font-semibold mb-4">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    className="w-24 h-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="profile.upload_button"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </button>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => fileInputRef.current?.click()}
                      data-ocid="profile.upload_button"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="bg-card rounded-2xl p-6 card-shadow space-y-4">
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profileName">Display Name</Label>
                    <Input
                      id="profileName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-1 rounded-xl"
                      data-ocid="profile.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileAge">Age</Label>
                    <Input
                      id="profileAge"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="mt-1 rounded-xl"
                      data-ocid="profile.age.input"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select
                      value={gender}
                      onValueChange={(v) => setGender(v as Gender)}
                    >
                      <SelectTrigger
                        className="mt-1 rounded-xl"
                        data-ocid="profile.gender.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Gender.female}>Female</SelectItem>
                        <SelectItem value={Gender.male}>Male</SelectItem>
                        <SelectItem value={Gender.other}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="profileCity">City</Label>
                    <Input
                      id="profileCity"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 rounded-xl"
                      data-ocid="profile.city.input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profileBio">About You</Label>
                  <Textarea
                    id="profileBio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-1 rounded-xl resize-none"
                    data-ocid="profile.bio.textarea"
                  />
                </div>

                <Separator />

                <div>
                  <Label>Interests</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addInterest();
                        }
                      }}
                      placeholder="Add an interest..."
                      className="rounded-xl flex-1"
                      data-ocid="profile.interest.input"
                    />
                    <Button
                      onClick={addInterest}
                      variant="outline"
                      size="icon"
                      className="rounded-xl shrink-0"
                      data-ocid="profile.save_button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-pill px-3 py-1 text-sm"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() =>
                            setInterests((p) => p.filter((x) => x !== interest))
                          }
                          className="hover:text-destructive ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="rounded-pill px-8 flex-1"
                  data-ocid="profile.submit_button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    clear();
                    navigate({ to: "/" });
                  }}
                  className="rounded-pill border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  data-ocid="profile.delete_button"
                >
                  Log Out
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

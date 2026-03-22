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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, Gender, MembershipTier } from "../backend";
import Navbar from "../components/Navbar";
import { useSaveProfile, useSaveProfilePhoto } from "../hooks/useQueries";

const STEPS = ["Basic Info", "About You", "Photo", "Interests"];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.female);
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveProfile = useSaveProfile();
  const savePhoto = useSaveProfilePhoto();

  const addInterest = () => {
    const val = interestInput.trim();
    if (val && !interests.includes(val) && interests.length < 10) {
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

  const handleSubmit = async () => {
    try {
      const profile = {
        displayName,
        age: BigInt(age || 18),
        gender,
        city,
        bio,
        interests,
        membershipTier: MembershipTier.basic,
        membershipExpiry: BigInt(0),
      };

      await saveProfile.mutateAsync(profile);

      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        await savePhoto.mutateAsync(blob);
      }

      toast.success("Profile created! Welcome to DilSe 💕");
      navigate({ to: "/discover" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const isSubmitting = saveProfile.isPending || savePhoto.isPending;

  const canProceed = () => {
    if (step === 0) return displayName.trim() && age && city;
    if (step === 1) return bio.trim().length >= 10;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 rounded ${i < step ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-3xl card-shadow p-8"
          >
            <h2 className="font-display text-2xl font-bold mb-1">
              {STEPS[step]}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Step {step + 1} of {STEPS.length}
            </p>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Priya S."
                      className="mt-1 rounded-xl"
                      data-ocid="setup.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="80"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        className="mt-1 rounded-xl"
                        data-ocid="setup.age.input"
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
                          data-ocid="setup.gender.select"
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
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="mt-1 rounded-xl"
                      data-ocid="setup.city.input"
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="bio">About You</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell potential matches a bit about yourself, your values, and what you're looking for..."
                      rows={5}
                      className="mt-1 rounded-xl resize-none"
                      data-ocid="setup.bio.textarea"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {bio.length} / 500 characters
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all w-full"
                    data-ocid="setup.dropzone"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <p className="font-medium text-sm">
                      {photoPreview ? "Change photo" : "Upload your best photo"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG up to 10MB
                    </p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Your Interests</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Add up to 10 interests (press Enter to add)
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInterest();
                          }
                        }}
                        placeholder="e.g. Yoga, Travel, Music..."
                        className="rounded-xl flex-1"
                        data-ocid="setup.interest.input"
                      />
                      <Button
                        onClick={addInterest}
                        variant="outline"
                        size="icon"
                        className="rounded-xl shrink-0"
                        data-ocid="setup.interest.button"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                      {interests.map((interest) => (
                        <span
                          key={interest}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-pill px-3 py-1 text-sm"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() =>
                              setInterests((p) =>
                                p.filter((x) => x !== interest),
                              )
                            }
                            className="hover:text-destructive ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((p) => p - 1)}
                  className="rounded-pill"
                  data-ocid="setup.cancel_button"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              <Button
                onClick={
                  step === STEPS.length - 1
                    ? handleSubmit
                    : () => setStep((p) => p + 1)
                }
                disabled={!canProceed() || isSubmitting}
                className="rounded-pill flex-1"
                data-ocid="setup.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : step === STEPS.length - 1 ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current" /> Complete
                    Setup
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import { Icons } from "../components/Icons";
import {
  UserProfile,
  RelationshipIntent,
  Gender,
  SmokingHabit,
  DrinkingHabit,
  SocialSpeed,
  AuraPersonality,
  MatchGenderPreference,
} from "../types";
import { compressImage } from "../utils/image";

interface EditProfileProps {
  onBack: () => void;
  currentUser: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  onBack,
  currentUser,
  onSave,
}) => {
  // Photos & Bio
  const [photos, setPhotos] = useState<string[]>(currentUser.photos || []);
  const [bio, setBio] = useState(currentUser.bio || "");

  // Basics
  const [name, setName] = useState(currentUser.name || "");
  const [age, setAge] = useState(currentUser.age || 18);
  const [job, setJob] = useState(currentUser.job || "");
  const [location, setLocation] = useState(currentUser.location || "");
  const [gender, setGender] = useState<Gender>(
    currentUser.dating?.gender || "other",
  );

  // Tags
  const [interests, setInterests] = useState(currentUser.interests.join(", "));
  const [vibeWords, setVibeWords] = useState(currentUser.vibeTags.join(", "));

  // Lifestyle & Intent
  const [intent, setIntent] = useState<RelationshipIntent>(
    currentUser.dating?.relationshipIntent || "serious_relationship",
  );
  const [smoking, setSmoking] = useState<SmokingHabit>(
    currentUser.details?.smoking || "no",
  );
  const [drinking, setDrinking] = useState<DrinkingHabit>(
    currentUser.details?.drinking || "sometimes",
  );

  // Aura Tuning
  const [introversion, setIntroversion] = useState(
    currentUser.aura?.introversionLevel || 5,
  );
  const [socialSpeed, setSocialSpeed] = useState<SocialSpeed>(
    currentUser.aura?.socialSpeed || "normal",
  );
  const [writingStyle, setWritingStyle] = useState<
    AuraPersonality["writingStyle"]
  >(currentUser.aura?.writingStyle || "casual_emoji");

  // Safety
  const [greenFlags, setGreenFlags] = useState(
    currentUser.aura?.greenFlags?.join(", ") || "",
  );
  const [redFlags, setRedFlags] = useState(
    currentUser.aura?.redFlags?.join(", ") || "",
  );

  // Preferences
  const [matchGender, setMatchGender] = useState<MatchGenderPreference>(
    currentUser.preferences?.preferredGenders || "any",
  );

  const handleSave = () => {
    onSave({
      name,
      age,
      job,
      location,
      photos,
      bio,
      interests: interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      vibeTags: vibeWords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      details: {
        ...currentUser.details,
        smoking,
        drinking,
        lookingFor:
          intent === "serious_relationship" ? "Relationship" : "Casual",
      },
      dating: {
        ...currentUser.dating!,
        gender,
        relationshipIntent: intent,
        displayName: name,
      },
      preferences: {
        ...currentUser.preferences!,
        preferredGenders: matchGender,
      },
      aura: {
        ...currentUser.aura!,
        introversionLevel: introversion,
        socialSpeed,
        writingStyle,
        greenFlags: greenFlags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        redFlags: redFlags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        vibeWords: vibeWords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const newUrl = await compressImage(file, 600, 0.7);
        setPhotos([...photos, newUrl]);
      } catch (error) {
        console.error("Failed to compress image", error);
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Fixed Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray shrink-0 z-20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full"
        >
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main">
          Edit Profile
        </h1>
        <button
          onClick={handleSave}
          className="text-coral font-bold text-sm px-2"
        >
          Save
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 space-y-8 pb-32">
          {/* Photos Grid */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm font-bold text-text-main">Photos</h2>
              <span className="text-xs text-text-muted">{photos.length}/6</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((url, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] relative rounded-xl overflow-hidden bg-warm-gray group"
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt="Me"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                  >
                    <Icons.X size={10} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-text-main shadow-sm">
                      Main
                    </span>
                  )}
                </div>
              ))}

              {photos.length < 6 && (
                <button
                  onClick={() =>
                    document.getElementById("edit-profile-upload")?.click()
                  }
                  className="aspect-[2/3] rounded-xl border-2 border-dashed border-warm-gray flex flex-col items-center justify-center gap-2 text-coral hover:bg-coral-light/20 hover:border-coral transition-colors"
                >
                  <Icons.Plus size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Add
                  </span>
                </button>
              )}
              <input
                id="edit-profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </section>

          {/* Identity Basics */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text-main">The Basics</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-sec uppercase tracking-wider">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-sec uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none appearance-none"
                  >
                    <option value="woman">Woman</option>
                    <option value="man">Man</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase tracking-wider">
                  Job Title
                </label>
                <input
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase tracking-wider">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
                />
              </div>
            </div>
          </section>

          {/* Bio */}
          <section>
            <h2 className="text-sm font-bold text-text-main mb-2">Bio</h2>
            <textarea
              className="w-full text-sm text-text-main bg-warm-white border border-warm-gray rounded-2xl p-4 resize-none outline-none focus:border-coral min-h-[120px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </section>

          {/* Aura Tuning (Social Energy) */}
          <section className="space-y-4 bg-coral/5 p-4 rounded-2xl border border-coral/10">
            <div className="flex items-center gap-2">
              <Icons.Sparkles size={18} className="text-coral" />
              <h2 className="text-sm font-bold text-text-main">Aura Tuning</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-text-sec uppercase">
                    Social Energy
                  </label>
                  <span className="text-xs font-bold text-coral">
                    {introversion}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={introversion}
                  onChange={(e) => setIntroversion(parseInt(e.target.value))}
                  className="w-full accent-coral"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-sec uppercase">
                  Social Speed
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["slow", "normal", "fast"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSocialSpeed(s as SocialSpeed)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${socialSpeed === s ? "bg-coral text-white border-coral" : "bg-white border-warm-gray"}`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-sec uppercase">
                  AI Writing Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "casual_emoji", label: "Casual 👋" },
                    { id: "lowercase_aesthetic", label: "aesthetic" },
                    { id: "formal_proper", label: "Proper." },
                    { id: "short_direct", label: "Short" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setWritingStyle(style.id as any)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-colors ${writingStyle === style.id ? "bg-text-main text-white border-text-main" : "bg-white border-warm-gray"}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interests & Vibe */}
          <section className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-sec uppercase">
                Interests (Comma separated)
              </label>
              <input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
                placeholder="Gaming, Coffee, Hiking..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-sec uppercase">
                Vibe Words
              </label>
              <input
                value={vibeWords}
                onChange={(e) => setVibeWords(e.target.value)}
                className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
                placeholder="Chill, Adventurous, Cozy..."
              />
            </div>
          </section>

          {/* Lifestyle */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text-main">Lifestyle</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase">
                  Smoking
                </label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm outline-none"
                >
                  <option value="no">No</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase">
                  Drinking
                </label>
                <select
                  value={drinking}
                  onChange={(e) => setDrinking(e.target.value)}
                  className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm outline-none"
                >
                  <option value="never">Never</option>
                  <option value="socially">Socially</option>
                  <option value="often">Often</option>
                </select>
              </div>
            </div>
          </section>

          {/* Intent & Match Prefs */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text-main">Intentions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                "serious_relationship",
                "casual_dating",
                "friends_only",
                "open_to_see",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setIntent(opt as RelationshipIntent)}
                  className={`py-3 rounded-xl text-[10px] font-bold border transition-colors ${intent === opt ? "bg-text-main text-white border-text-main" : "bg-warm-white border-warm-gray text-text-sec"}`}
                >
                  {opt.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-text-sec uppercase mb-2 block">
                Interested In
              </label>
              <div className="flex flex-wrap gap-2">
                {["women", "men", "women_and_men", "any"].map((pref) => (
                  <button
                    key={pref}
                    onClick={() =>
                      setMatchGender(pref as MatchGenderPreference)
                    }
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${matchGender === pref ? "bg-coral text-white border-coral" : "bg-warm-white border-warm-gray"}`}
                  >
                    {pref.replace("_", " & ").toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Aura Safety Fields */}
          <section className="bg-sage-light/20 p-4 rounded-2xl border border-sage/20">
            <div className="flex items-center gap-2 mb-3">
              <Icons.ShieldCheck size={16} className="text-sage-dark" />
              <h2 className="text-sm font-bold text-sage-dark">
                Safety & Boundaries
              </h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase">
                  Green Flags
                </label>
                <input
                  value={greenFlags}
                  onChange={(e) => setGreenFlags(e.target.value)}
                  className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-sage outline-none"
                  placeholder="kindness, honesty..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sec uppercase">
                  Red Flags
                </label>
                <input
                  value={redFlags}
                  onChange={(e) => setRedFlags(e.target.value)}
                  className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-sage outline-none"
                  placeholder="ghosting, rudeness..."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

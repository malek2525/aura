// screens/EditProfileScreen.tsx
import React, { useState } from "react";
import {
  AuraProfile,
  RelationshipIntent,
  MatchGenderPreference,
  ProfilePhoto,
} from "../types";

interface EditProfileScreenProps {
  profile: AuraProfile;
  onCancel: () => void;
  onProfileUpdated: (updated: AuraProfile) => void;
}

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const joinList = (value?: string[]): string =>
  value && value.length > 0 ? value.join(", ") : "";

const sortPhotos = (photos?: ProfilePhoto[]): ProfilePhoto[] => {
  if (!photos) return [];
  return [...photos].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  profile,
  onCancel,
  onProfileUpdated,
}) => {
  const dating = profile.dating;
  const aura = profile.aura;
  const prefs = profile.preferences;

  // ---- Photos (from dating.photos, fallback to legacy photoUrls) ----
  const initialPhotos: string[] =
    sortPhotos(dating.photos).map((p) => p.url) || profile.photoUrls || [];

  // ---- Basic identity ----
  const [displayName, setDisplayName] = useState(
    dating.displayName || profile.displayName || "",
  );
  const [dob, setDob] = useState(dating.dateOfBirth || "");
  const [country, setCountry] = useState(dating.country || "");

  const [photos, setPhotos] = useState<string[]>(initialPhotos.slice(0, 6));

  // ---- Intent & preferences ----
  const [relationshipIntent, setRelationshipIntent] = useState<
    RelationshipIntent | ""
  >(dating.relationshipIntent || profile.relationshipIntent || "");

  const [preferredMatchGender, setPreferredMatchGender] = useState<
    MatchGenderPreference | ""
  >(prefs.preferredGenders || profile.preferredMatchGender || "");

  // ---- Personality / text fields (aura + dating) ----
  const [vibeWordsInput, setVibeWordsInput] = useState(
    joinList(aura.vibeWords || profile.vibeWords || []),
  );
  const [interestsInput, setInterestsInput] = useState(
    joinList(dating.interests || profile.interests || []),
  );
  const [goalsInput, setGoalsInput] = useState(
    joinList(aura.goals || profile.goals || []),
  );
  const [topicsLikeInput, setTopicsLikeInput] = useState(
    joinList(aura.topicsLike || profile.topicsLike || []),
  );
  const [topicsAvoidInput, setTopicsAvoidInput] = useState(
    joinList(aura.topicsAvoid || profile.topicsAvoid || []),
  );
  const [greenFlagsInput, setGreenFlagsInput] = useState(
    joinList(aura.greenFlags || profile.greenFlags || []),
  );
  const [redFlagsInput, setRedFlagsInput] = useState(
    joinList(aura.redFlags || profile.redFlags || []),
  );
  const [whatFeelsSafe, setWhatFeelsSafe] = useState(
    aura.whatFeelsSafe ||
      profile.whatFeelsSafe ||
      profile.prompts?.whatFeelsSafe ||
      "",
  );
  const [whatShouldPeopleKnow, setWhatShouldPeopleKnow] = useState(
    aura.whatShouldPeopleKnow ||
      profile.whatShouldPeopleKnow ||
      profile.prompts?.whatShouldPeopleKnow ||
      "",
  );
  const [idealFirstMessage, setIdealFirstMessage] = useState(
    dating.idealFirstMessage ||
      profile.idealFirstMessage ||
      profile.prompts?.idealFirstMessage ||
      "",
  );
  const [idealFirstMeeting, setIdealFirstMeeting] = useState(
    dating.idealFirstMeeting ||
      profile.idealFirstMeeting ||
      profile.prompts?.idealFirstMeeting ||
      "",
  );
  const [lifestyleNotes, setLifestyleNotes] = useState(
    profile.lifestyleNotes || profile.prompts?.lifestyleNotes || "",
  );

  const [summary, setSummary] = useState(
    aura.summary || profile.summary || dating.bio || "",
  );

  const handlePhotoChange = (index: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPhotos((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newVibeWords = splitList(vibeWordsInput);
    const newInterests = splitList(interestsInput);
    const newGoals = splitList(goalsInput);
    const newTopicsLike = splitList(topicsLikeInput);
    const newTopicsAvoid = splitList(topicsAvoidInput);
    const newGreenFlags = splitList(greenFlagsInput);
    const newRedFlags = splitList(redFlagsInput);

    const trimmedPhotos = photos.filter(Boolean);

    const newPhotoObjs: ProfilePhoto[] = trimmedPhotos.map((url, index) => ({
      id: dating.photos?.[index]?.id || `photo_${index}_${Date.now()}`,
      url,
      isPrimary: index === 0,
      position: index,
    }));

    const safeDisplayName =
      displayName.trim() || dating.displayName || profile.displayName;

    // ---- Build updated profile with new layered model ----
    const updated: AuraProfile = {
      ...profile,
      displayName: safeDisplayName,

      aura: {
        ...aura,
        goals: newGoals,
        vibeWords: newVibeWords,
        topicsLike: newTopicsLike,
        topicsAvoid: newTopicsAvoid,
        greenFlags: newGreenFlags,
        redFlags: newRedFlags,
        whatFeelsSafe,
        whatShouldPeopleKnow,
        summary:
          summary ||
          aura.summary ||
          whatShouldPeopleKnow ||
          "A thoughtful introvert looking for safe, genuine connections.",
      },

      dating: {
        ...dating,
        displayName: safeDisplayName,
        dateOfBirth: dob || dating.dateOfBirth,
        country: country.trim() || dating.country || null,
        photos: newPhotoObjs,
        // Use dedicated bio, but keep summary + bio aligned a bit:
        bio: summary || dating.bio,
        idealFirstMessage,
        idealFirstMeeting,
        // keep musicTaste, favoriteQuote, lifestyle, etc. as-is
        relationshipIntent:
          (relationshipIntent as RelationshipIntent) ||
          dating.relationshipIntent,
        interests: newInterests.length ? newInterests : dating.interests,
      },

      preferences: {
        ...prefs,
        preferredGenders:
          (preferredMatchGender as MatchGenderPreference) ||
          prefs.preferredGenders,
        relationshipIntent:
          (relationshipIntent as RelationshipIntent) ||
          prefs.relationshipIntent,
      },

      // Transitional avatar
      avatarUrl: newPhotoObjs[0]?.url || profile.avatarUrl,

      /* ----------------- LEGACY MIRRORS (KEEP OLD UI SAFE) ----------------- */
      relationshipIntent:
        (relationshipIntent as RelationshipIntent) ||
        profile.relationshipIntent,
      preferredMatchGender:
        (preferredMatchGender as MatchGenderPreference) ||
        profile.preferredMatchGender,

      vibeWords: newVibeWords,
      interests: newInterests.length ? newInterests : profile.interests,
      goals: newGoals,
      topicsLike: newTopicsLike,
      topicsAvoid: newTopicsAvoid,
      greenFlags: newGreenFlags,
      redFlags: newRedFlags,

      whatFeelsSafe,
      whatShouldPeopleKnow,
      idealFirstMessage,
      idealFirstMeeting,
      lifestyleNotes,
      summary:
        summary || profile.summary || aura.summary || whatShouldPeopleKnow,

      photoUrls: newPhotoObjs.map((p) => p.url),
      photos: newPhotoObjs.map(({ id, url }) => ({ id, url })),

      prompts: {
        idealFirstMessage,
        idealFirstMeeting,
        lifestyleNotes,
        whatShouldPeopleKnow,
        whatFeelsSafe,
      },
    };

    onProfileUpdated(updated);
  };

  return (
    <div className="rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(15,23,42,0.95)] p-4 sm:p-6 lg:p-7 space-y-5 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-50 tracking-wide">
            Dating Profile
          </h1>
          <p className="text-[11px] text-slate-400">
            This is what other people will see when Aura matches you.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-slate-300 bg-slate-900/70 hover:bg-slate-800/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-pink-500/40 hover:scale-[1.01] transition-all"
          >
            Save & return
          </button>
        </div>
      </div>

      {/* Photos */}
      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Photos
        </h2>
        <p className="text-[11px] text-slate-400">
          First photo is your main profile picture. Aura uses these for matching
          and preview cards.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => {
            const url = photos[index];
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-dashed border-white/15 bg-slate-900/60 overflow-hidden flex items-center justify-center h-24"
              >
                {url ? (
                  <>
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <label className="flex flex-col items-center justify-center text-[10px] text-slate-400 cursor-pointer">
                      <span className="mb-1 text-slate-200 text-base">＋</span>
                      Add photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handlePhotoChange(index, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Identity */}
      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Identity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/30"
              placeholder="How people see you"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">
              Date of birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">Country</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/30"
              placeholder="e.g. Hungary"
            />
          </div>
        </div>
      </section>

      {/* Intent */}
      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Intent & People
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 ml-1">
              What are you open to?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "friends_only", label: "Friends only" },
                { id: "casual_dating", label: "Casual dating" },
                { id: "serious_relationship", label: "Serious relationship" },
                { id: "open_to_see", label: "Open to see" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setRelationshipIntent(opt.id as RelationshipIntent)
                  }
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    relationshipIntent === opt.id
                      ? "bg-sky-500/20 border-sky-400/70 text-sky-100"
                      : "bg-slate-900/60 border-white/15 text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 ml-1">
              Who do you want Aura to match you with?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "any", label: "Anyone" },
                { id: "women", label: "Women" },
                { id: "men", label: "Men" },
                { id: "women_and_men", label: "Women & Men" },
                { id: "lgbtq_plus", label: "LGBTQ+" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setPreferredMatchGender(opt.id as MatchGenderPreference)
                  }
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    preferredMatchGender === opt.id
                      ? "bg-pink-500/20 border-pink-400/70 text-pink-100"
                      : "bg-slate-900/60 border-white/15 text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personality & interests */}
      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Personality & Interests
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">
              Vibe words (comma separated)
            </label>
            <input
              value={vibeWordsInput}
              onChange={(e) => setVibeWordsInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/30"
              placeholder="soft, observant, chaotic good..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">
              Interests (comma separated)
            </label>
            <input
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/30"
              placeholder="anime, gym, techno, late-night walks..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">
              Goals (comma separated)
            </label>
            <input
              value={goalsInput}
              onChange={(e) => setGoalsInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/30"
              placeholder="make friends, practice talking, maybe dating..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 ml-1">
              Short profile summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/30 resize-none"
              placeholder="One or two sentences that feel like you."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-emerald-300/90 ml-1">
              Topics you like (comma separated)
            </label>
            <input
              value={topicsLikeInput}
              onChange={(e) => setTopicsLikeInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-emerald-400/40 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50"
              placeholder="music, movies, late-night walks..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-rose-300/90 ml-1">
              Topics you avoid (comma separated)
            </label>
            <input
              value={topicsAvoidInput}
              onChange={(e) => setTopicsAvoidInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-rose-400/40 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-400/80 focus:ring-1 focus:ring-rose-400/50"
              placeholder="politics, heavy drama..."
            />
          </div>
        </div>
      </section>

      {/* Safety & boundaries */}
      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Safety & Boundaries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-emerald-300/90 ml-1">
              Green flags (comma separated)
            </label>
            <input
              value={greenFlagsInput}
              onChange={(e) => setGreenFlagsInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-emerald-400/40 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50"
              placeholder="kindness, emotional maturity..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-rose-300/90 ml-1">
              Red flags (comma separated)
            </label>
            <input
              value={redFlagsInput}
              onChange={(e) => setRedFlagsInput(e.target.value)}
              className="w-full bg-slate-900/70 border border-rose-400/40 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-400/80 focus:ring-1 focus:ring-rose-400/50"
              placeholder="ghosting, mocking others..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-sky-300/90 ml-1">
              What feels safe
            </label>
            <textarea
              value={whatFeelsSafe}
              onChange={(e) => setWhatFeelsSafe(e.target.value)}
              rows={3}
              className="w-full bg-slate-900/70 border border-sky-400/40 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/80 focus:ring-1 focus:ring-sky-400/50 resize-none"
              placeholder="How do you like people to approach you? What makes things feel okay?"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 ml-1">
              What should people know before talking to you?
            </label>
            <textarea
              value={whatShouldPeopleKnow}
              onChange={(e) => setWhatShouldPeopleKnow(e.target.value)}
              rows={3}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/40 resize-none"
              placeholder="For example: I reply slowly, I struggle with eye contact, I need clear communication..."
            />
          </div>
        </div>
      </section>

      {/* First contact */}
      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          First contact & lifestyle
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 ml-1">
              First message that makes you reply
            </label>
            <textarea
              value={idealFirstMessage}
              onChange={(e) => setIdealFirstMessage(e.target.value)}
              rows={2}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 resize-none"
              placeholder="e.g. something specific about your interests, not just 'hey'"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 ml-1">
              Ideal first meet / date
            </label>
            <textarea
              value={idealFirstMeeting}
              onChange={(e) => setIdealFirstMeeting(e.target.value)}
              rows={2}
              className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 resize-none"
              placeholder="coffee, quiet bar, late-night walk, gaming call..."
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-300 ml-1">
            Lifestyle notes (optional)
          </label>
          <textarea
            value={lifestyleNotes}
            onChange={(e) => setLifestyleNotes(e.target.value)}
            rows={3}
            className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 resize-none"
            placeholder="Sleep schedule, work/study situation, social battery, anything Aura should consider."
          />
        </div>
      </section>
    </div>
  );
};

export default EditProfileScreen;

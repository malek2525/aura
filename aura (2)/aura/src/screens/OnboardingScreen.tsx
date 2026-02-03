// screens/OnboardingScreen.tsx
import React, { useState } from "react";
import {
  AuraProfile,
  AuraPersonality,
  DatingProfile,
  Gender,
  SexualOrientation,
  RelationshipIntent,
  MatchGenderPreference,
  SmokingHabit,
  DrinkingHabit,
  KidsPreference,
  SleepSchedule,
  LifestyleInfo,
  MatchPreferences,
  ProfilePhoto,
  SocialSpeed,
} from "../types";

interface OnboardingScreenProps {
  userId: string;
  onProfileCreated: (profile: AuraProfile) => void;
}

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const buildPhotos = (
  primaryUrl: string,
  url2: string,
  url3: string,
): { profilePhotos: ProfilePhoto[]; primaryPhotoUrl?: string } => {
  const urls = [primaryUrl, url2, url3].filter((u) => u && u.trim());
  const photos: ProfilePhoto[] = urls.map((url, index) => ({
    id: `photo_${index}_${Date.now()}`,
    url,
    isPrimary: index === 0,
    position: index,
  }));
  return {
    profilePhotos: photos,
    primaryPhotoUrl: photos[0]?.url,
  };
};

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  userId,
  onProfileCreated,
}) => {
  // Basic identity
  const [displayName, setDisplayName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [gender, setGender] = useState<Gender | "">("");
  const [orientation, setOrientation] = useState<SexualOrientation | "">("");

  // Photos as URLs (for now)
  const [primaryPhotoUrl, setPrimaryPhotoUrl] = useState("");
  const [photo2Url, setPhoto2Url] = useState("");
  const [photo3Url, setPhoto3Url] = useState("");

  // Dating text
  const [bio, setBio] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState("");
  const [musicTaste, setMusicTaste] = useState("");
  const [interestsInput, setInterestsInput] = useState("");

  const [idealFirstMessage, setIdealFirstMessage] = useState("");
  const [idealFirstMeeting, setIdealFirstMeeting] = useState("");

  // Lifestyle
  const [smoking, setSmoking] = useState<SmokingHabit>("prefer_not_say");
  const [drinking, setDrinking] = useState<DrinkingHabit>("prefer_not_say");
  const [kids, setKids] = useState<KidsPreference>("prefer_not_say");
  const [petsInput, setPetsInput] = useState("");
  const [sleepSchedule, setSleepSchedule] =
    useState<SleepSchedule>("prefer_not_say");
  const [jobOrStudy, setJobOrStudy] = useState("");
  const [religionNote, setReligionNote] = useState("");

  // Aura personality
  const [introversionLevel, setIntroversionLevel] = useState(7);
  const [socialSpeed, setSocialSpeed] = useState<SocialSpeed>("slow");
  const [goalsInput, setGoalsInput] = useState("friends, practice_talking");
  const [vibeWordsInput, setVibeWordsInput] = useState("thoughtful, calm");
  const [topicsLikeInput, setTopicsLikeInput] = useState(
    "late-night chats, music, games",
  );
  const [topicsAvoidInput, setTopicsAvoidInput] = useState("politics");
  const [greenFlagsInput, setGreenFlagsInput] = useState(
    "kindness, emotional maturity",
  );
  const [redFlagsInput, setRedFlagsInput] = useState("ghosting, mocking");
  const [whatFeelsSafe, setWhatFeelsSafe] = useState(
    "slow pace, clear communication, no pressure to call.",
  );
  const [whatShouldPeopleKnow, setWhatShouldPeopleKnow] = useState(
    "I’m introverted, I reply slow, but I care a lot.",
  );

  // Preferences
  const [preferredGenders, setPreferredGenders] =
    useState<MatchGenderPreference>("any");
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(35);
  const [relationshipIntent, setRelationshipIntent] =
    useState<RelationshipIntent>("open_to_see");
  const [filterByIntent, setFilterByIntent] = useState<RelationshipIntent | "">(
    "",
  );

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!displayName.trim()) {
      alert("Please enter a display name.");
      return;
    }
    if (!dateOfBirth) {
      alert("Please select your date of birth.");
      return;
    }

    setSubmitting(true);

    const { profilePhotos, primaryPhotoUrl: mainPhoto } = buildPhotos(
      primaryPhotoUrl,
      photo2Url,
      photo3Url,
    );
    const interests = splitList(interestsInput);
    const goals = splitList(goalsInput);
    const vibeWords = splitList(vibeWordsInput);
    const topicsLike = splitList(topicsLikeInput);
    const topicsAvoid = splitList(topicsAvoidInput);
    const greenFlags = splitList(greenFlagsInput);
    const redFlags = splitList(redFlagsInput);
    const pets = splitList(petsInput);

    const lifestyle: LifestyleInfo = {
      smoking,
      drinking,
      kids,
      pets: pets.length ? pets : undefined,
      sleepSchedule,
      religionNote: religionNote || undefined,
      jobOrStudy: jobOrStudy || undefined,
    };

    const dating: DatingProfile = {
      displayName: displayName.trim(),
      dateOfBirth,
      gender: gender || undefined,
      orientation: orientation || undefined,
      country: country ? country.trim() : null,
      city: city ? city.trim() : null,
      photos: profilePhotos,
      bio: bio || undefined,
      favoriteQuote: favoriteQuote || undefined,
      musicTaste: musicTaste || undefined,
      interests: interests.length ? interests : undefined,
      idealFirstMessage: idealFirstMessage || undefined,
      idealFirstMeeting: idealFirstMeeting || undefined,
      lifestyle,
      relationshipIntent,
    };

    const auraSummary =
      bio ||
      whatShouldPeopleKnow ||
      "A thoughtful introvert looking for safe, genuine connections.";

    const aura: AuraPersonality = {
      introversionLevel,
      goals,
      vibeWords,
      topicsLike,
      topicsAvoid,
      socialSpeed,
      hardBoundaries: redFlags, // treat redFlags roughly as hard boundaries for now
      greenFlags,
      redFlags,
      whatFeelsSafe,
      whatShouldPeopleKnow,
      summary: auraSummary,
    };

    const preferences: MatchPreferences = {
      preferredGenders,
      minAge,
      maxAge,
      relationshipIntent: filterByIntent || undefined,
    };

    const profileId = `profile_${userId}`;

    const profile: AuraProfile = {
      id: profileId,
      userId,
      displayName: dating.displayName,
      aura,
      dating,
      preferences,
      avatarUrl: mainPhoto,

      // ---- Legacy flattening for compatibility ----
      ageRange: null,
      country: dating.country || null,
      introversionLevel,
      goals,
      vibeWords,
      topicsLike,
      topicsAvoid,
      socialSpeed,
      hardBoundaries: aura.hardBoundaries,
      greenFlags,
      redFlags,
      whatFeelsSafe,
      whatShouldPeopleKnow,
      summary: auraSummary,
      photoUrls: profilePhotos.map((p) => p.url),
      photos: profilePhotos.map((p) => ({ id: p.id, url: p.url })),
      relationshipIntent,
      preferredMatchGender: preferredGenders,
      idealFirstMessage,
      idealFirstMeeting,
      lifestyleNotes: lifestyle.jobOrStudy || "",
      musicTaste: dating.musicTaste,
      favoriteQuote: dating.favoriteQuote,
      interests,
      prompts: {
        idealFirstMessage,
        idealFirstMeeting,
        lifestyleNotes: lifestyle.jobOrStudy || "",
        whatShouldPeopleKnow,
        whatFeelsSafe,
      },
    };

    onProfileCreated(profile);
  };

  const today = todayISO();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-lg font-semibold text-slate-50">
          Let&apos;s set up your Aura twin
        </h1>
        <p className="text-xs text-slate-400">
          This is both your dating profile and the brain your Aura will use to
          protect you and match you.
        </p>
      </header>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
        {/* BASIC IDENTITY */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Basic Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Display name
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
                placeholder="What people see on your card"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Date of birth
              </label>
              <input
                type="date"
                max={today}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">Country</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
                placeholder="e.g. Hungary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender | "")}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
              >
                <option value="">Prefer not to say</option>
                <option value="woman">Woman</option>
                <option value="man">Man</option>
                <option value="non_binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer_not_say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) =>
                  setOrientation(e.target.value as SexualOrientation | "")
                }
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
              >
                <option value="">Prefer not to say</option>
                <option value="straight">Straight</option>
                <option value="gay">Gay</option>
                <option value="lesbian">Lesbian</option>
                <option value="bisexual">Bisexual</option>
                <option value="pansexual">Pansexual</option>
                <option value="asexual">Asexual</option>
                <option value="questioning">Questioning</option>
                <option value="prefer_not_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        {/* PHOTOS (URL-BASED FOR NOW) */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Photos
          </h2>
          <p className="text-[11px] text-slate-400">
            For now, paste image URLs. Later this will use real uploads.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Main photo URL
              </label>
              <input
                value={primaryPhotoUrl}
                onChange={(e) => setPrimaryPhotoUrl(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Extra photo 2
              </label>
              <input
                value={photo2Url}
                onChange={(e) => setPhoto2Url(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Extra photo 3
              </label>
              <input
                value={photo3Url}
                onChange={(e) => setPhoto3Url(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="Optional"
              />
            </div>
          </div>
        </section>

        {/* DATING TEXT */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Dating Profile Text
          </h2>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 ml-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40 resize-none"
              placeholder="Short description that feels like you."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Interests (comma separated)
              </label>
              <input
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="travel, anime, fitness..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Music taste
              </label>
              <input
                value={musicTaste}
                onChange={(e) => setMusicTaste(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="R&B, techno, Arabic pop..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Favorite quote (optional)
              </label>
              <input
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="“Something that feels like you.”"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Ideal first meet
              </label>
              <input
                value={idealFirstMeeting}
                onChange={(e) => setIdealFirstMeeting(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="coffee, quiet bar, gaming call..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 ml-1">
              First message that makes you reply
            </label>
            <textarea
              value={idealFirstMessage}
              onChange={(e) => setIdealFirstMessage(e.target.value)}
              rows={2}
              className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40 resize-none"
              placeholder="For example: something specific about your interests, not just 'hey'."
            />
          </div>
        </section>

        {/* LIFESTYLE */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Lifestyle
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">Smoking</label>
              <select
                value={smoking}
                onChange={(e) => setSmoking(e.target.value as SmokingHabit)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
              >
                <option value="prefer_not_say">Prefer not to say</option>
                <option value="no">No</option>
                <option value="sometimes">Sometimes</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Drinking
              </label>
              <select
                value={drinking}
                onChange={(e) => setDrinking(e.target.value as DrinkingHabit)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
              >
                <option value="prefer_not_say">Prefer not to say</option>
                <option value="no">No</option>
                <option value="sometimes">Sometimes</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">Kids</label>
              <select
                value={kids}
                onChange={(e) => setKids(e.target.value as KidsPreference)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
              >
                <option value="prefer_not_say">Prefer not to say</option>
                <option value="dont_want">Don&apos;t want</option>
                <option value="want_some_day">Want someday</option>
                <option value="have_and_done">Have & done</option>
                <option value="have_and_open">Have & open</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Sleep schedule
              </label>
              <select
                value={sleepSchedule}
                onChange={(e) =>
                  setSleepSchedule(e.target.value as SleepSchedule)
                }
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
              >
                <option value="prefer_not_say">Prefer not to say</option>
                <option value="early_bird">Early bird</option>
                <option value="night_owl">Night owl</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Pets (comma separated)
              </label>
              <input
                value={petsInput}
                onChange={(e) => setPetsInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
                placeholder="dog, cat..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Job / study
              </label>
              <input
                value={jobOrStudy}
                onChange={(e) => setJobOrStudy(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 ml-1">
              Religion / values note (optional)
            </label>
            <input
              value={religionNote}
              onChange={(e) => setReligionNote(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40"
              placeholder="Only if you want Aura to factor it."
            />
          </div>
        </section>

        {/* AURA PERSONALITY */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Aura Personality
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Introversion (1–10)
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={introversionLevel}
                onChange={(e) =>
                  setIntroversionLevel(parseInt(e.target.value, 10))
                }
                className="w-full"
              />
              <p className="text-[10px] text-slate-400">
                You set:{" "}
                <span className="text-slate-100">{introversionLevel}</span>{" "}
                (higher = more introvert)
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Social speed
              </label>
              <div className="flex gap-1.5">
                {(["slow", "normal", "fast"] as SocialSpeed[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSocialSpeed(s)}
                    className={`flex-1 px-2 py-1 rounded-full text-[11px] border ${
                      socialSpeed === s
                        ? "bg-sky-500/20 border-sky-400/70 text-sky-100"
                        : "bg-slate-900/70 border-white/10 text-slate-300"
                    }`}
                  >
                    {s === "slow" ? "Slow" : s === "normal" ? "Normal" : "Fast"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Goals (comma separated)
              </label>
              <input
                value={goalsInput}
                onChange={(e) => setGoalsInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="friends, practice_talking, dating..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Vibe words (comma separated)
              </label>
              <input
                value={vibeWordsInput}
                onChange={(e) => setVibeWordsInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/40"
                placeholder="calm, sarcastic, deep..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-emerald-300 ml-1">
                Topics you like (comma)
              </label>
              <input
                value={topicsLikeInput}
                onChange={(e) => setTopicsLikeInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-emerald-400/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50"
                placeholder="music, games, late-night walks..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-rose-300 ml-1">
                Topics you avoid (comma)
              </label>
              <input
                value={topicsAvoidInput}
                onChange={(e) => setTopicsAvoidInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-rose-400/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-400/80 focus:ring-1 focus:ring-rose-400/50"
                placeholder="politics, heavy drama..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-emerald-300 ml-1">
                Green flags (comma)
              </label>
              <input
                value={greenFlagsInput}
                onChange={(e) => setGreenFlagsInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-emerald-400/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50"
                placeholder="kindness, emotional maturity..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-rose-300 ml-1">
                Red flags / hard boundaries (comma)
              </label>
              <input
                value={redFlagsInput}
                onChange={(e) => setRedFlagsInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-rose-400/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-400/80 focus:ring-1 focus:ring-rose-400/50"
                placeholder="ghosting, yelling..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                What feels safe?
              </label>
              <textarea
                value={whatFeelsSafe}
                onChange={(e) => setWhatFeelsSafe(e.target.value)}
                rows={3}
                className="w-full bg-slate-900/70 border border-sky-400/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/80 focus:ring-1 focus:ring-sky-400/50 resize-none"
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
                className="w-full bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-white/70 focus:ring-1 focus:ring-white/40 resize-none"
              />
            </div>
          </div>
        </section>

        {/* MATCH PREFERENCES */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Match Preferences
          </h2>
          <div className="space-y-1">
            <p className="text-[11px] text-slate-300 ml-1">
              Who do you want Aura to match you with?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  "any",
                  "women",
                  "men",
                  "women_and_men",
                  "lgbtq_plus",
                ] as MatchGenderPreference[]
              ).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPreferredGenders(opt)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border ${
                    preferredGenders === opt
                      ? "bg-pink-500/20 border-pink-400/70 text-pink-100"
                      : "bg-slate-900/70 border-white/10 text-slate-300"
                  }`}
                >
                  {opt === "any"
                    ? "Anyone"
                    : opt === "women"
                      ? "Women"
                      : opt === "men"
                        ? "Men"
                        : opt === "women_and_men"
                          ? "Women & Men"
                          : "LGBTQ+"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Min age you want to see
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={minAge}
                onChange={(e) =>
                  setMinAge(parseInt(e.target.value || "18", 10))
                }
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 ml-1">
                Max age you want to see
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={maxAge}
                onChange={(e) =>
                  setMaxAge(parseInt(e.target.value || "35", 10))
                }
                className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-slate-300 ml-1">
              What are you open to?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  "friends_only",
                  "casual_dating",
                  "serious_relationship",
                  "open_to_see",
                ] as RelationshipIntent[]
              ).map((intent) => (
                <button
                  key={intent}
                  type="button"
                  onClick={() => setRelationshipIntent(intent)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border ${
                    relationshipIntent === intent
                      ? "bg-sky-500/20 border-sky-400/70 text-sky-100"
                      : "bg-slate-900/70 border-white/10 text-slate-300"
                  }`}
                >
                  {intent === "friends_only"
                    ? "Friends only"
                    : intent === "casual_dating"
                      ? "Casual dating"
                      : intent === "serious_relationship"
                        ? "Serious"
                        : "Open to see"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-slate-300 ml-1">
              Filter by intent in Discover? (optional)
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterByIntent("")}
                className={`px-2.5 py-1 rounded-full text-[11px] border ${
                  !filterByIntent
                    ? "bg-slate-100 text-slate-900 border-slate-100"
                    : "bg-slate-900/70 border-white/10 text-slate-300"
                }`}
              >
                No filter
              </button>
              {(
                [
                  "friends_only",
                  "casual_dating",
                  "serious_relationship",
                  "open_to_see",
                ] as RelationshipIntent[]
              ).map((intent) => (
                <button
                  key={intent}
                  type="button"
                  onClick={() => setFilterByIntent(intent)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border ${
                    filterByIntent === intent
                      ? "bg-emerald-500/20 border-emerald-400/70 text-emerald-100"
                      : "bg-slate-900/70 border-white/10 text-slate-300"
                  }`}
                >
                  {intent === "friends_only"
                    ? "Friends only"
                    : intent === "casual_dating"
                      ? "Casual"
                      : intent === "serious_relationship"
                        ? "Serious"
                        : "Open"}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="flex items-center justify-between pt-2 border-t border-white/10">
        <p className="text-[10px] text-slate-500 max-w-xs">
          You can edit this later. Aura never shares your exact date of birth or
          private notes with other users.
        </p>
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating..." : "Create my Aura profile"}
        </button>
      </footer>
    </div>
  );
};

export default OnboardingScreen;

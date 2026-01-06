import React, { useState, useEffect } from "react";

import { AuraProfile, AuraChatMessage, AuraState } from "./types";
import OnboardingScreen from "./screens/OnboardingScreen";
import NeuralLinkScreen from "./screens/NeuralLinkScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import MatchesScreen from "./screens/MatchesScreen";
import { AuthScreen } from "./screens/AuthScreen";
import { loadAuraProfile, persistAuraProfile } from "./storage/profileStorage";
import { useAuraVoice } from "./hooks/useAuraVoice";
import SkillsPanel from "./panels/SkillsPanel";
import TwinsPanel from "./panels/TwinsPanel";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ----- existing tab type -----
type ActiveTab = "link" | "skills" | "twins" | "mirror";

// ----- new high-level sections -----
type AppSection = "neural" | "discover" | "matches" | "settings";

// 🔢 helper: calculate age from DOB (YYYY-MM-DD)
const getAgeFromDob = (dob?: string | null): number | null => {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return age;
};

// derive age from AuraProfile v2 (prefers dating.dateOfBirth, falls back to legacy)
const getAgeFromProfile = (profile: AuraProfile): number | null => {
  const dob =
    profile.dating?.dateOfBirth ||
    (profile as any).dateOfBirth ||
    (profile as any).dob;
  return getAgeFromDob(dob);
};

// SAMPLE PROFILE (UPDATED TO AURAPROFILE V2 SHAPE)
const SAMPLE_LINA_PROFILE: AuraProfile = {
  id: "sample_lina",
  userId: "sample_lina_user",
  displayName: "Lina",

  aura: {
    introversionLevel: 6,
    goals: ["friends", "practice_talking"],
    vibeWords: ["thoughtful", "kind", "curious"],
    topicsLike: ["art", "music", "late-night walks"],
    topicsAvoid: ["politics"],
    socialSpeed: "slow",
    hardBoundaries: ["no explicit content", "no heavy drama"],
    greenFlags: ["honesty", "emotional maturity"],
    redFlags: ["ghosting", "mocking others"],
    whatFeelsSafe: "Slow pace, clear communication, no pressure.",
    whatShouldPeopleKnow:
      "She warms up slowly but cares deeply once she feels safe.",
    summary:
      "Lina is a quiet, thoughtful person who loves deep conversations and gentle people.",
  },

  dating: {
    displayName: "Lina",
    dateOfBirth: "2000-01-01", // demo
    gender: "woman",
    orientation: "straight",
    country: "Germany",
    city: "Berlin",
    photos: [],
    bio: "Soft-spoken, art & music lover who prefers slow, genuine connections.",
    favoriteQuote: undefined,
    musicTaste: "Indie, lo-fi, movie scores",
    interests: ["art", "music", "late-night walks"],
    idealFirstMessage:
      "Ask about her current favourite song or artwork, not just 'hey'.",
    idealFirstMeeting: "Quiet cafe, museum or late walk by the river.",
    lifestyle: {
      smoking: "no",
      drinking: "sometimes",
      kids: "prefer_not_say",
      pets: ["cat"],
      sleepSchedule: "night_owl",
      jobOrStudy: "Design student",
    },
    relationshipIntent: "open_to_see",
  },

  preferences: {
    preferredGenders: "any",
    minAge: 20,
    maxAge: 32,
    relationshipIntent: "open_to_see",
  },

  avatarUrl: undefined,

  // legacy mirror fields (kept so old UI bits don't break)
  ageRange: "22-27",
  country: "Germany",
  introversionLevel: 6,
  goals: ["friends", "practice_talking"],
  vibeWords: ["thoughtful", "kind", "curious"],
  topicsLike: ["art", "music", "late-night walks"],
  topicsAvoid: ["politics"],
  socialSpeed: "slow",
  hardBoundaries: ["no explicit content", "no heavy drama"],
  greenFlags: ["honesty", "emotional maturity"],
  redFlags: ["ghosting", "mocking others"],
  whatFeelsSafe: "Slow pace, clear communication, no pressure.",
  whatShouldPeopleKnow:
    "She warms up slowly but cares deeply once she feels safe.",
  summary:
    "Lina is a quiet, thoughtful person who loves deep conversations and gentle people.",
  photoUrls: [],
  photos: [],
  relationshipIntent: "open_to_see",
  preferredMatchGender: "any",
};

const TAB_CONFIG: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "link",
    label: "LINK",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    id: "skills",
    label: "SKILLS",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    id: "twins",
    label: "TWINS",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: "mirror",
    label: "MIRROR",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
];

const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>("link");
  const [appSection, setAppSection] = useState<AppSection>("neural");
  const [activeScreen, setActiveScreen] = useState<"main" | "editProfile">(
    "main",
  );

  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: "neutral",
    moodIntensity: 0.2,
  });
  const [replyLabPrefill, setReplyLabPrefill] = useState<string | undefined>(
    undefined,
  );

  // Me panel state (now read-only – editing moved to EditProfileScreen)
  const [isMeOpen, setIsMeOpen] = useState(false);
  const [meDraft, setMeDraft] = useState({
    displayName: "",
    avatarUrl: "",
  });

  const voice = useAuraVoice();

  useEffect(() => {
    if (user) {
      const saved = loadAuraProfile(user.uid);
      if (saved) {
        setProfile(saved);
        if (chatHistory.length === 0) {
          setChatHistory([
            {
              id: "init",
              from: "aura",
              text: `Hello ${saved.displayName}. I am your Aura. Welcome back.`,
              timestamp: Date.now(),
            },
          ]);
        }
        setAuraState({ mood: "calm", moodIntensity: 0.5 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Sync Me draft when profile changes or Me panel opens
  useEffect(() => {
    if (profile && isMeOpen) {
      setMeDraft({
        displayName:
          profile.dating?.displayName || profile.displayName || "You",
        avatarUrl:
          profile.dating?.photos?.[0]?.url ||
          profile.avatarUrl ||
          (profile.photoUrls && profile.photoUrls[0]) ||
          "",
      });
    }
  }, [profile, isMeOpen]);

  const handleOpenReplyLab = (prefillText?: string) => {
    setReplyLabPrefill(prefillText);
    setAppSection("neural");
    setActiveTab("mirror");
  };

  const handleProfileCreated = (newProfile: AuraProfile) => {
    if (user) {
      persistAuraProfile(newProfile, user.uid);
    }

    const primaryVibe =
      newProfile.aura?.vibeWords?.[0] ||
      newProfile.vibeWords?.[0] ||
      "connected";

    setProfile(newProfile);
    setChatHistory([
      {
        id: "init",
        from: "aura",
        text: `Hello ${newProfile.displayName}. I am your Aura. I've analyzed your profile, and I feel... ${primaryVibe}. I'm here for you.`,
        timestamp: Date.now(),
      },
    ]);
    setAuraState({ mood: "calm", moodIntensity: 0.5 });
  };

  const handleProfileUpdated = (updated: AuraProfile) => {
    setProfile(updated);
    if (user) {
      persistAuraProfile(updated, user.uid);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setProfile(null);
    setChatHistory([]);
  };

  // AUTH LOADING
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">
            Initializing Aura...
          </p>
        </div>
      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return <AuthScreen />;
  }

  // ONBOARDING (NO PROFILE YET)
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-900/60 hover:bg-red-500/20 backdrop-blur-xl border border-white/10 hover:border-red-500/30 rounded-full transition-all flex items-center gap-2"
          >
            <span>Sign Out</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl p-6 lg:p-8">
            {/* v2 onboarding needs userId */}
            <OnboardingScreen
              userId={user.uid}
              onProfileCreated={handleProfileCreated}
            />
          </div>
        </div>
      </div>
    );
  }

  // FULL-SCREEN EDIT PROFILE
  if (activeScreen === "editProfile") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-4">
          <header className="flex items-center justify-between rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl px-4 py-2 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
            <button
              onClick={() => setActiveScreen("main")}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Aura
            </button>
            <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Edit Profile
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-150 shadow-sm flex items-center gap-1"
            >
              <span>Sign Out</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </header>

          <EditProfileScreen
            profile={profile}
            onCancel={() => setActiveScreen("main")}
            onProfileUpdated={(updated) => {
              handleProfileUpdated(updated);
              setActiveScreen("main");
            }}
          />
        </div>
      </div>
    );
  }

  // MAIN APP LAYOUT (PROFILE PRESENT)
  const ageFromDob = getAgeFromProfile(profile);
  const dating = profile.dating;
  const auraLayer = profile.aura;
  const legacyTagline = (profile as any).tagline as string | undefined;

  const displayName = dating?.displayName || profile.displayName;
  const displayCity = dating?.city || null;
  const displayCountry = dating?.country ?? profile.country ?? null;

  const topBarLocation =
    ageFromDob != null
      ? `${ageFromDob} · ${displayCity || displayCountry || "Planet Earth"}`
      : displayCity || displayCountry || "";

  // Me panel helpers
  const primaryPhotoUrl =
    dating?.photos?.find((p) => p.isPrimary)?.url ||
    dating?.photos?.[0]?.url ||
    profile.avatarUrl ||
    (profile.photoUrls && profile.photoUrls[0]) ||
    meDraft.avatarUrl;

  const bioText = dating?.bio || auraLayer?.summary || profile.summary;
  const vibeWords = auraLayer?.vibeWords || profile.vibeWords || [];
  const interests = dating?.interests || profile.interests || [];
  const musicTaste = dating?.musicTaste || profile.musicTaste;
  const favoriteQuote = dating?.favoriteQuote || profile.favoriteQuote;

  const lifestyle = dating?.lifestyle;
  const relationshipIntent =
    dating?.relationshipIntent || profile.relationshipIntent;

  const intentLabel =
    relationshipIntent === "friends_only"
      ? "Friends only"
      : relationshipIntent === "casual_dating"
        ? "Casual dating"
        : relationshipIntent === "serious_relationship"
          ? "Serious"
          : relationshipIntent === "open_to_see"
            ? "Open to see"
            : undefined;

  const lifestyleBits: string[] = [];
  if (lifestyle?.smoking && lifestyle.smoking !== "prefer_not_say") {
    lifestyleBits.push(
      lifestyle.smoking === "no"
        ? "Non-smoker"
        : lifestyle.smoking === "sometimes"
          ? "Smokes sometimes"
          : "Smokes",
    );
  }
  if (lifestyle?.drinking && lifestyle.drinking !== "prefer_not_say") {
    lifestyleBits.push(
      lifestyle.drinking === "no"
        ? "Doesn't drink"
        : lifestyle.drinking === "sometimes"
          ? "Drinks sometimes"
          : "Drinks",
    );
  }
  if (lifestyle?.kids && lifestyle.kids !== "prefer_not_say") {
    lifestyleBits.push(
      lifestyle.kids === "dont_want"
        ? "Doesn't want kids"
        : lifestyle.kids === "want_some_day"
          ? "Wants kids someday"
          : lifestyle.kids === "have_and_done"
            ? "Has kids & done"
            : "Has kids & open",
    );
  }
  if (
    lifestyle?.sleepSchedule &&
    lifestyle.sleepSchedule !== "prefer_not_say"
  ) {
    lifestyleBits.push(
      lifestyle.sleepSchedule === "early_bird"
        ? "Early bird"
        : lifestyle.sleepSchedule === "night_owl"
          ? "Night owl"
          : "Flexible sleep",
    );
  }

  const lifestyleLine =
    lifestyleBits.length > 0 ? lifestyleBits.join(" · ") : undefined;

  const hardBoundaries = auraLayer?.hardBoundaries || profile.hardBoundaries;
  const greenFlags = auraLayer?.greenFlags || profile.greenFlags;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div
        className="max-w-6xl mx-auto h-screen px-4 py-4 flex flex-col gap-4 relative"
        style={{ zIndex: 1 }}
      >
        {/* TOP BAR — GLOBAL */}
        <header className="flex items-center justify-between rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl px-4 py-2 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
          {/* LEFT: App title + Me avatar button */}
          <div className="flex items-center gap-3">
            {/* Me avatar button */}
            <button
              onClick={() => setIsMeOpen(true)}
              className="relative h-9 w-9 rounded-full border border-white/10 bg-slate-900/80 shadow-[0_0_18px_rgba(56,189,248,0.7)] overflow-hidden flex items-center justify-center hover:border-white/40 hover:shadow-[0_0_26px_rgba(129,140,248,0.9)] transition-all"
            >
              {primaryPhotoUrl ? (
                <img
                  src={primaryPhotoUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/70 via-violet-500/70 to-fuchsia-500/70" />
                  <span className="relative z-10 text-sm font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </>
              )}
            </button>

            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Aura Twin
              </span>
              <span className="text-sm font-medium text-slate-100">
                Neural Link · MVP
              </span>
              <span className="text-[10px] text-slate-500">
                {topBarLocation}
              </span>
            </div>
          </div>

          {/* RIGHT: Signed in + sign out */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-xs text-slate-300">
              Signed in as{" "}
              <span className="font-medium text-slate-100 ml-1">
                {displayName}
              </span>
            </span>

            <button
              onClick={handleSignOut}
              className="text-xs px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-150 shadow-sm flex items-center gap-1"
            >
              <span>Sign Out</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* APP-LEVEL SECTION NAV */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 bg-slate-950/70 border border-white/10 rounded-2xl px-1 py-1 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.8)]">
            {[
              { id: "neural", label: "Aura Neural", dot: "sky" },
              { id: "discover", label: "Discover", dot: "violet" },
              { id: "matches", label: "Matches", dot: "pink" },
              { id: "settings", label: "Settings", dot: "slate" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setAppSection(s.id as AppSection)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-[0.14em] uppercase transition-all ${
                  appSection === s.id
                    ? "bg-gradient-to-r from-sky-500/80 via-violet-500/80 to-pink-500/80 text-white shadow-lg shadow-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    s.id === "neural"
                      ? "bg-sky-400"
                      : s.id === "discover"
                        ? "bg-violet-400"
                        : s.id === "matches"
                          ? "bg-pink-400"
                          : "bg-slate-500"
                  }`}
                />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN AREA — SPLIT LAYOUT */}
        <main className="flex-1 flex flex-col lg:flex-row gap-4 pb-2">
          {/* LEFT: AURA STAGE */}
          <section className="lg:w-[55%] flex">
            <div className="relative flex-1">
              {/* Voice status pill on stage */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 backdrop-blur-md rounded-full border border-white/10">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${
                      voice.isListening
                        ? "bg-red-400 shadow-red-400/60"
                        : voice.isSpeaking
                          ? "bg-amber-400 shadow-amber-400/60"
                          : "bg-emerald-400 shadow-emerald-400/60"
                    }`}
                  />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300">
                    {voice.isListening
                      ? "Listening"
                      : voice.isSpeaking
                        ? "Speaking"
                        : `${displayName} · Online`}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: PANELS / DISCOVER / MATCHES */}
          <section className="flex-1 flex flex-col rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(15,23,42,0.95)] overflow-hidden">
            {/* TAB NAV (only in neural section) */}
            {appSection === "neural" && (
              <div className="flex-shrink-0 p-3 border-b border-white/5">
                <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-2xl">
                  {TAB_CONFIG.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-br from-violet-600/80 to-blue-600/80 text-white shadow-lg shadow-violet-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE CONTENT */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {appSection === "neural" && (
                <>
                  {activeTab === "link" && (
                    <div className="h-full">
                      <NeuralLinkScreen
                        profile={profile}
                        history={chatHistory}
                        setHistory={setChatHistory}
                        auraState={auraState}
                        setAuraState={setAuraState}
                        voice={voice}
                      />
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div className="h-full overflow-hidden">
                      <SkillsPanel profile={profile} />
                    </div>
                  )}

                  {activeTab === "twins" && (
                    <div className="h-full overflow-hidden">
                      <TwinsPanel
                        profile={profile}
                        sampleProfile={SAMPLE_LINA_PROFILE}
                      />
                    </div>
                  )}

                  {activeTab === "mirror" && (
                    <div className="h-full overflow-y-auto">
                      <div className="p-8 text-center text-slate-500">
                        Mirror panel coming soon.
                      </div>
                    </div>
                  )}
                </>
              )}

              {appSection === "discover" && (
                <DiscoverScreen
                  currentUserUid={user.uid}
                  currentUserProfile={profile}
                />
              )}

              {appSection === "matches" && (
                <MatchesScreen
                  currentUserUid={user.uid}
                  currentUserProfile={profile}
                  onOpenReplyLab={handleOpenReplyLab}
                />
              )}

              {appSection === "settings" && (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Settings hub coming soon.
                </div>
              )}
            </div>

            {/* FOOTER STATUS */}
            <div className="flex-shrink-0 px-4 py-2 border-t border-white/5 bg-slate-950/30">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                <span className="font-mono tracking-widest uppercase">
                  Neural Link Active · {displayName}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ME PANEL – slide-over from right (read-only, opens full editor) */}
      {isMeOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          {/* backdrop click closes */}
          <div className="flex-1" onClick={() => setIsMeOpen(false)} />
          <div className="w-full max-w-xs sm:max-w-sm h-full bg-slate-950/95 border-l border-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)] px-5 py-6 flex flex-col gap-4">
            {/* header */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                Me
              </div>
              <button
                onClick={() => setIsMeOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* profile header */}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15 bg-slate-900/70">
                {primaryPhotoUrl ? (
                  <img
                    src={primaryPhotoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/70 via-violet-500/70 to-fuchsia-500/70" />
                    <span className="relative z-10 flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-100">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {ageFromDob != null
                    ? `${ageFromDob} y`
                    : profile.ageRange || "Age not set"}
                  {displayCity || displayCountry
                    ? ` · ${displayCity || displayCountry}`
                    : ""}
                </span>
                {legacyTagline && (
                  <span className="text-[11px] text-slate-300 mt-0.5">
                    {legacyTagline}
                  </span>
                )}
              </div>
            </div>

            {/* read-only summary */}
            <div className="text-xs text-slate-300 bg-slate-900/60 border border-white/10 rounded-2xl p-3 leading-relaxed space-y-1 mt-2">
              <p>
                {bioText ||
                  "Your Aura uses this profile for matching, replies, and safety. Add more details so people feel like they already know you."}
              </p>

              {vibeWords && vibeWords.length > 0 && (
                <p className="text-[11px] text-slate-400">
                  Vibe:{" "}
                  <span className="text-slate-200">
                    {vibeWords.slice(0, 3).join(" · ")}
                  </span>
                </p>
              )}

              {interests && interests.length > 0 && (
                <p className="text-[11px] text-slate-400">
                  Interests:{" "}
                  <span className="text-slate-200">
                    {interests.join(" · ")}
                  </span>
                </p>
              )}

              {musicTaste && (
                <p className="text-[11px] text-slate-400">
                  Music: <span className="text-slate-200">{musicTaste}</span>
                </p>
              )}

              {favoriteQuote && (
                <p className="text-[11px] text-slate-400">
                  Quote:{" "}
                  <span className="text-slate-200">“{favoriteQuote}”</span>
                </p>
              )}

              {lifestyleLine && (
                <p className="text-[11px] text-slate-400">
                  Lifestyle:{" "}
                  <span className="text-slate-200">{lifestyleLine}</span>
                </p>
              )}

              {intentLabel && (
                <p className="text-[11px] text-slate-400">
                  Open to: <span className="text-slate-200">{intentLabel}</span>
                </p>
              )}

              {hardBoundaries && hardBoundaries.length > 0 && (
                <p className="text-[11px] text-rose-300">
                  Hard boundaries:{" "}
                  <span className="text-slate-200">
                    {hardBoundaries.slice(0, 3).join(" · ")}
                  </span>
                </p>
              )}

              {greenFlags && greenFlags.length > 0 && (
                <p className="text-[11px] text-emerald-300">
                  Green flags:{" "}
                  <span className="text-slate-200">
                    {greenFlags.slice(0, 3).join(" · ")}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2 mt-2">
              <button
                onClick={() => {
                  setIsMeOpen(false);
                  setActiveScreen("editProfile");
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800/80 transition-all text-xs text-slate-100"
              >
                <span>Edit full profile</span>
                <span className="text-[10px] text-sky-300">
                  Photos, intent, vibe
                </span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800/80 transition-all text-xs text-slate-100">
                <span>Settings</span>
                <span className="text-[10px] text-slate-500">Soon</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/40 hover:bg-red-500/20 transition-all text-xs text-red-200 mt-3"
              >
                <span>Sign out</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-auto pt-2 text-[10px] text-slate-500 border-t border-white/5">
              <p>
                Your Aura uses this profile for matching, replies, and safety.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

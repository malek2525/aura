import React, { useState, useEffect } from "react";
import { AuraProfile, AuraChatMessage, AuraState } from "./types";
import OnboardingScreen from "./screens/OnboardingScreen";
import NeuralLinkScreen from "./screens/NeuralLinkScreen";
import MatchTestScreen from "./screens/MatchTestScreen";
import { TwinConversationScreen } from "./screens/TwinConversationScreen";
import { TwinVideoMomentsScreen } from "./screens/TwinVideoMomentsScreen";
import { NightDebriefScreen } from "./screens/NightDebriefScreen";

import AuraStage from "./components/AuraStage";

import {
  loadAuraProfile,
  persistAuraProfile,
  clearAuraProfile,
} from "./storage/profileStorage";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthScreen } from "./screens/AuthScreen";

type Tab = "neural" | "match" | "twin";

const SAMPLE_LINA_PROFILE: AuraProfile = {
  id: "sample_lina",
  displayName: "Lina",
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
  summary:
    "Lina is a quiet, thoughtful person who loves deep conversations and gentle people.",
};

const AppContent = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [tab, setTab] = useState<Tab>("neural");

  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: "neutral",
    moodIntensity: 0.28,
  });

  // Load profile at startup
  useEffect(() => {
    if (user) {
      const saved = loadAuraProfile(user.uid);
      if (saved) {
        setProfile(saved);
        if (chatHistory.length === 0) {
          setChatHistory([
            {
              id: "initial",
              from: "aura",
              text: `Hello ${saved.displayName}. I am your Aura — I’m here with you.`,
              timestamp: Date.now(),
            },
          ]);
        }
        setAuraState({ mood: "calm", moodIntensity: 0.35 });
      }
    }
  }, [user]);

  const handleOnboardingComplete = (p: AuraProfile) => {
    if (!user) return;
    persistAuraProfile(p, user.uid);
    setProfile(p);
    setTab("neural");

    setChatHistory([
      {
        id: "onboarding-init",
        from: "aura",
        text: `Welcome ${p.displayName}. I’ve connected to your profile. Let’s talk.`,
        timestamp: Date.now(),
      },
    ]);

    setAuraState({ mood: "calm", moodIntensity: 0.4 });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (!profile)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4">
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 overflow-hidden">
      {/* TOP SECTION — Aura Stage */}
      <div className="w-full max-w-5xl mx-auto pt-6 px-4">
        <AuraStage profile={profile} auraState={auraState} />
      </div>

      {/* NAV TABS */}
      <div className="w-full max-w-3xl mx-auto mt-6 px-4 flex justify-center">
        <div className="flex bg-slate-900/60 border border-white/10 backdrop-blur-lg rounded-full overflow-hidden">
          <button
            onClick={() => setTab("neural")}
            className={`px-5 py-2 text-sm transition-all ${
              tab === "neural"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Talk to Aura
          </button>
          <button
            onClick={() => setTab("match")}
            className={`px-5 py-2 text-sm transition-all ${
              tab === "match"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Match Score
          </button>
          <button
            onClick={() => setTab("twin")}
            className={`px-5 py-2 text-sm transition-all ${
              tab === "twin"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Twin Intro
          </button>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="max-w-5xl mx-auto mt-8 px-4 pb-20">
        {tab === "neural" && (
          <NeuralLinkScreen
            profile={profile}
            history={chatHistory}
            setHistory={setChatHistory}
            auraState={auraState}
            setAuraState={setAuraState}
          />
        )}

        {tab === "match" && <MatchTestScreen profile={profile} />}

        {tab === "twin" && (
          <TwinConversationScreen
            profileA={profile}
            profileB={SAMPLE_LINA_PROFILE}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

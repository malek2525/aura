import React from "react";
import { AuraProfile, AuraState } from "../types";
import AuraAvatar from "./AuraAvatar";

interface AuraStageProps {
  profile: AuraProfile | null;
  auraState: AuraState;
  isSpeaking?: boolean;
  isListening?: boolean;
}

export const AuraStage: React.FC<AuraStageProps> = ({ 
  profile, 
  auraState,
  isSpeaking = false,
  isListening = false
}) => {
  const intensityPct = Math.round((auraState.moodIntensity ?? 0.2) * 100);

  if (!profile) {
    return (
      <div className="relative w-full h-full min-h-[300px] lg:min-h-[420px] rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/30 border border-white/10 animate-pulse" />
          <p className="text-slate-500 text-sm">Complete onboarding to meet your Aura</p>
        </div>
      </div>
    );
  }

  const primaryVibe = profile.vibeWords?.[0] ?? "calm";
  const snapshot =
    profile.summary ||
    `${profile.displayName} · ${primaryVibe} · ${profile.goals?.join(", ") || "getting to know themselves"}`;

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-[420px] rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden px-4 py-4 lg:px-8 lg:py-6 transition-all duration-700 flex flex-col">
      
      <div
        className="absolute inset-0 pointer-events-none opacity-30 blur-3xl"
        style={{
          background: auraState.mood === 'happy' || auraState.mood === 'excited'
            ? 'radial-gradient(circle at center, rgba(244,114,182,0.5), transparent 70%)'
            : auraState.mood === 'calm' || auraState.mood === 'peaceful'
            ? 'radial-gradient(circle at center, rgba(96,165,250,0.5), transparent 70%)'
            : auraState.mood === 'playful' || auraState.mood === 'flirty'
            ? 'radial-gradient(circle at center, rgba(217,70,239,0.5), transparent 70%)'
            : auraState.mood === 'anxious'
            ? 'radial-gradient(circle at center, rgba(251,191,36,0.4), transparent 70%)'
            : auraState.mood === 'sad'
            ? 'radial-gradient(circle at center, rgba(99,102,241,0.5), transparent 70%)'
            : 'radial-gradient(circle at center, rgba(148,163,184,0.4), transparent 70%)'
        }}
      />

      <div className="relative z-10 flex items-start justify-between mb-2 lg:mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px] animate-pulse ${
              isListening 
                ? 'bg-red-400 shadow-red-400/80' 
                : isSpeaking 
                ? 'bg-amber-400 shadow-amber-400/80' 
                : 'bg-emerald-400 shadow-emerald-400/80'
            }`} />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-slate-300">
              {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Aura · Neural Link'}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-white">
            {profile.displayName}'s Twin
          </h1>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            Social Battery
          </span>
          <span className="text-[11px] font-mono text-slate-100 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            {profile.socialSpeed === "fast"
              ? "Fast paced"
              : profile.socialSpeed === "slow"
                ? "Slow & gentle"
                : "Balanced"}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center min-h-0">
        <AuraAvatar
          profile={profile}
          auraState={auraState}
          size="xl"
          showName={false}
          showVibes={true}
          showMood={false}
          isSpeaking={isSpeaking}
          isListening={isListening}
        />
      </div>

      <div className="relative z-10 mt-auto bg-black/30 border border-white/10 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 flex flex-col gap-2 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400">
              Mood
            </span>
            <span className="text-sm font-mono text-slate-100">
              {auraState.mood.toUpperCase()}{" "}
              <span className="text-xs text-slate-400">({intensityPct}%)</span>
            </span>
          </div>

          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400">
              Calibration
            </span>
            <span className="text-lg font-mono text-cyan-300">
              {profile.introversionLevel ?? 5}/10
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[10px] font-mono text-slate-300 truncate">
            {snapshot}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuraStage;

import React from "react";
import { AuraProfile, AuraState } from "../types";
import HologramAvatar from "./HologramAvatar";
import HologramField from "./HologramField";

interface AuraStageProps {
  profile: AuraProfile | null;
  auraState: AuraState;
  isSpeaking?: boolean;
  isListening?: boolean;
}

/**
 * AuraStage
 *
 * Minimal VisionOS-style hologram stage:
 * - Avatar floats alone in the center
 * - HologramField + subtle gradients as background
 * - No info cards, no borders, no bottom bar
 * - All status / text lives outside in App layout
 */
export const AuraStage: React.FC<AuraStageProps> = ({
  profile,
  auraState,
  isSpeaking = false,
  isListening = false,
}) => {
  // If no profile yet, show a simple "empty stage" hint
  if (!profile) {
    return (
      <div className="relative w-full h-full min-h-[320px] lg:min-h-[440px] overflow-hidden rounded-[2.5rem] bg-slate-950/40 border border-white/5 backdrop-blur-3xl shadow-[0_0_120px_rgba(15,23,42,1)] flex items-center justify-center">
        <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.25),transparent_65%)] opacity-80 mix-blend-screen" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/40 to-sky-400/40 blur-2xl animate-pulse" />
          <p className="text-slate-400 text-xs tracking-wide uppercase font-mono">
            Complete onboarding to meet your Aura
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[320px] lg:min-h-[440px] overflow-hidden rounded-[2.5rem] bg-slate-950/40 border border-white/5 backdrop-blur-3xl shadow-[0_0_120px_rgba(15,23,42,1)]">
      {/* Background hologram field + gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.23),transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.3),transparent_65%)] opacity-80 mix-blend-screen" />
        <HologramField
          mood={auraState.mood}
          moodIntensity={auraState.moodIntensity}
          isSpeaking={isSpeaking}
          isListening={isListening}
        />
      </div>

      {/* Centered avatar */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Ground glow under avatar */}
          <div className="pointer-events-none absolute inset-x-[-40%] bottom-[-40%] h-40 rounded-full bg-sky-400/15 blur-3xl opacity-80" />

          <HologramAvatar
            auraState={auraState}
            isSpeaking={isSpeaking}
            isListening={isListening}
          />
        </div>
      </div>
    </div>
  );
};

export default AuraStage;

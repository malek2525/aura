import React, { useState } from 'react';
import { AuraProfile, MatchResult } from '../types';
import { matchAuras } from '../services/auraLLM';

export interface MatchTestScreenProps {
  profile: AuraProfile;
}

const sampleOtherProfile: AuraProfile = {
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
  summary: "Lina is a quiet, thoughtful person who loves deep conversations and gentle people."
};

export const MatchTestScreen: React.FC<MatchTestScreenProps> = ({ profile }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    setIsMatching(true);
    setError(null);
    try {
      const matchRes = await matchAuras(profile, sampleOtherProfile);
      setResult(matchRes);
    } catch (e) {
      console.error(e);
      setError("Unable to establish connection between Auras. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  // Helper to render a mini profile summary card
  const ProfileSummaryCard = ({ p, title }: { p: AuraProfile; title: string }) => (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white border border-white/10">
          {p.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{title}</div>
          <div className="text-lg font-light text-white">{p.displayName}</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {p.vibeWords.slice(0, 3).map((word, i) => (
          <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wide text-slate-300">
            {word}
          </span>
        ))}
      </div>
      
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
        {p.summary}
      </p>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-10">
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-light text-white">Twin Match Test</h2>
        <p className="text-slate-400 text-sm">Simulate a conversation between your Aura and another.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileSummaryCard p={profile} title="Your Aura" />
        <ProfileSummaryCard p={sampleOtherProfile} title="Potential Match" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleMatch}
          disabled={isMatching}
          className="group relative inline-flex items-center justify-center px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 border border-white/10 text-sm text-slate-100 transition-all shadow-lg hover:shadow-blue-900/10 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className={`relative z-10 flex items-center gap-2 ${isMatching ? 'animate-pulse' : ''}`}>
             {isMatching ? (
               <>
                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                 Connecting Neural Pathways...
               </>
             ) : (
               "Let our Auras talk"
             )}
          </span>
        </button>
        {error && <span className="text-xs text-red-400 bg-red-950/30 px-3 py-1 rounded-full border border-red-500/20">{error}</span>}
      </div>

      {result && (
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl p-8 flex flex-col gap-6 shadow-2xl animate-[fadeIn_0.6s_ease-out]">
          
          {/* Header Score */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Compatibility Resonance</div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extralight text-white">
                  {result.compatibilityScore}%
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border ${
                  result.compatibilityLabel === 'high' ? 'bg-green-500/10 text-green-300 border-green-500/20' :
                  result.compatibilityLabel === 'medium' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                  'bg-slate-500/10 text-slate-300 border-slate-500/20'
                }`}>
                  {result.compatibilityLabel} match
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reasons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Why it works</h4>
              <ul className="space-y-2">
                {result.matchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 leading-relaxed">
                    <span className="text-blue-400 mt-1">✦</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            {result.riskFlags.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300">Things to consider</h4>
                <ul className="space-y-2">
                  {result.riskFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 leading-relaxed">
                      <span className="text-slate-600 mt-1">⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Aura Summary */}
          <div className="space-y-4">
             <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Aura Analysis</span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    "{result.auraToUserSummaryA}"
                  </p>
                </div>
             </div>
          </div>

          {/* Opener */}
          <div className="bg-slate-950/40 rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Suggested Opener</span>
            <code className="text-sm font-mono text-blue-200/90 break-words">
              {result.suggestedOpeningForUserA}
            </code>
          </div>

        </div>
      )}
    </div>
  );
};

export default MatchTestScreen;
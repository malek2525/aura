import React, { useState } from 'react';
import AuraAvatar from '../components/AuraAvatar';
import { AuraProfile, AuraState, MatchResult } from '../types';
import { matchAuras } from '../services/auraLLM';

interface MatchTestScreenProps {
  userProfile: AuraProfile;
  auraState: AuraState;
}

const LINA_PROFILE: AuraProfile = {
  id: "lina_01",
  displayName: "Lina",
  bio: "Bubbly photographer who loves dragging introverts out of their shells... gently",
  avatarUrl: "",
  vibeTags: ["sunny", "energetic", "spontaneous"],
  introversionLevel: 3,
  goals: ["find friends", "explore city"],
  vibeWords: ["sunny", "energetic", "random"],
  topicsLike: ["photography", "indie music", "hiking"],
  topicsAvoid: ["politics", "horror movies"],
  socialSpeed: "fast",
  hardBoundaries: ["no rudeness"],
  greenFlags: ["humor", "spontaneity"],
  redFlags: ["judgmental people"],
  summary: "Lina is a bubbly photographer who loves dragging introverts out of their shells, but gently. She talks a lot but listens well."
};

const MatchTestScreen: React.FC<MatchTestScreenProps> = ({ userProfile, auraState }) => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const matchAuraState: AuraState = { mood: 'happy', moodIntensity: 0.6 };

  const handleRunMatch = async () => {
    setIsLoading(true);
    try {
      const result = await matchAuras(userProfile, LINA_PROFILE);
      setMatchResult(result);
    } catch (e) {
      alert("Match calculation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-[11px] tracking-[0.3em] uppercase text-slate-500 mb-2">Match Score Lab</div>
        <h2 className="text-2xl font-semibold text-slate-100">See how two Auras fit</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          This is a sandbox. Aura compares two profiles and imagines how their energy might blend. It's a demo of the matching brain, not a final dating score.
        </p>
      </div>
      
      {/* Two Auras Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Your Aura - Living Avatar */}
        <div className="flex-1 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center">
          <p className="text-center text-slate-500 text-xs uppercase tracking-wider mb-4">Your Aura</p>
          
          <AuraAvatar
            profile={userProfile}
            auraState={auraState}
            size="md"
            showName={true}
            showVibes={true}
            showMood={false}
          />
          
          {userProfile.bio && (
            <p className="text-center text-xs text-slate-400 mt-4 line-clamp-2 max-w-xs">
              {userProfile.bio}
            </p>
          )}
        </div>

        {/* Center Action */}
        <div className="flex flex-col items-center justify-center py-4 lg:py-0 lg:px-4 gap-3">
          {!matchResult && !isLoading && (
            <>
              <button 
                onClick={handleRunMatch}
                className="bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-200 font-medium py-4 px-8 rounded-2xl shadow-lg shadow-violet-900/20 transform transition-all hover:scale-105"
              >
                Run Match Analysis
              </button>
              <p className="text-[11px] text-slate-500 text-center max-w-[200px]">
                Let Aura guess how these two energies would feel together.
              </p>
            </>
          )}
          {isLoading && (
            <div className="text-violet-400 animate-pulse font-medium text-sm">
              Synchronizing Neural Waves...
            </div>
          )}
          {matchResult && (
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                {matchResult.compatibilityScore}%
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Compatibility</p>
            </div>
          )}
        </div>

        {/* Potential Match - VisionOS Style Glassy Avatar */}
        <div className="flex-1 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center">
          <p className="text-center text-slate-500 text-xs uppercase tracking-wider mb-4">Potential Match</p>
          
          <AuraAvatar
            profile={LINA_PROFILE}
            auraState={matchAuraState}
            size="md"
            showName={true}
            showVibes={true}
            showMood={false}
          />
          
          {LINA_PROFILE.bio && (
            <p className="text-center text-xs text-slate-400 mt-4 line-clamp-2 max-w-xs">
              {LINA_PROFILE.bio}
            </p>
          )}
        </div>
      </div>

      {/* Match Results */}
      {matchResult && (
        <div className="glass-panel-light rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="text-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest">What Aura sees</span>
            <div className="text-sm text-slate-400 capitalize mt-2">
              Rough intuition only. The real magic is in the twin-to-twin intros.
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 p-5 rounded-xl">
              <h4 className="text-slate-200 font-medium mb-3 uppercase text-xs tracking-wide">Why it might work</h4>
              <ul className="space-y-2">
                {matchResult.matchReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-teal-400 mt-0.5">+</span> {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/5 p-5 rounded-xl">
              <h4 className="text-slate-200 font-medium mb-3 uppercase text-xs tracking-wide">Possible friction points</h4>
              <ul className="space-y-2">
                {matchResult.riskFlags.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-rose-400 mt-0.5">!</span> {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/30 border border-white/5 p-5 rounded-xl">
            <h4 className="text-slate-200 font-medium mb-2">Your Aura says:</h4>
            <p className="text-slate-400 italic text-sm">"{matchResult.auraToUserSummaryA}"</p>
            
            <div className="mt-5 pt-5 border-t border-white/5">
              <h4 className="text-slate-200 font-medium mb-2">Suggested Opener:</h4>
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-violet-300 text-sm">
                {matchResult.suggestedOpeningForUserA}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchTestScreen;

import React, { useState } from 'react';
import AuraAvatarCard from '../components/AuraAvatarCard';
import { AuraProfile, MatchResult } from '../types';
import { matchAuras } from '../services/auraLLM';

interface MatchTestScreenProps {
  userProfile: AuraProfile;
}

const LINA_PROFILE: AuraProfile = {
  id: "lina_01",
  displayName: "Lina",
  bio: "Bubbly photographer who loves dragging introverts out of their shells... gently 📸",
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

const ProfileCard: React.FC<{ profile: AuraProfile; label: string }> = ({ profile, label }) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="glass-panel-light rounded-2xl p-4 space-y-3">
      <p className="text-center text-slate-500 text-xs uppercase tracking-wider">{label}</p>
      
      {/* Avatar or Initials */}
      <div className="flex justify-center">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-16 h-16 rounded-full object-cover border border-violet-500/30"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/40 to-blue-600/40 border border-violet-500/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-violet-200">
              {getInitials(profile.displayName)}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-center font-medium text-slate-100">{profile.displayName}</p>

      {/* Bio */}
      {profile.bio && (
        <p className="text-center text-xs text-slate-400 line-clamp-2">{profile.bio}</p>
      )}

      {/* Vibe Tags */}
      {(profile.vibeTags && profile.vibeTags.length > 0) || (profile.vibeWords && profile.vibeWords.length > 0) ? (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {(profile.vibeTags || profile.vibeWords)?.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const MatchTestScreen: React.FC<MatchTestScreenProps> = ({ userProfile }) => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <h2 className="text-xl font-semibold text-slate-100">Neural Twin Match Simulation</h2>
        <p className="text-slate-400 text-sm mt-1">Let your Auras talk and discover compatibility</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1">
          <ProfileCard profile={userProfile} label="Your Aura" />
        </div>

        <div className="flex items-center justify-center py-4 md:py-0 md:px-4">
          {!matchResult && !isLoading && (
            <button 
              onClick={handleRunMatch}
              className="bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-200 font-medium py-4 px-8 rounded-2xl shadow-lg shadow-violet-900/20 transform transition-all hover:scale-105"
            >
              Let Auras Talk
            </button>
          )}
          {isLoading && (
            <div className="text-violet-400 animate-pulse font-medium text-sm">
              Synchronizing Neural Waves...
            </div>
          )}
        </div>

        <div className="flex-1">
          <ProfileCard profile={LINA_PROFILE} label="Potential Match" />
        </div>
      </div>

      {matchResult && (
        <div className="glass-panel-light rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="text-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Compatibility</span>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 mt-2">
              {matchResult.compatibilityScore}%
            </div>
            <div className="text-lg text-slate-300 capitalize mt-1">{matchResult.compatibilityLabel} Match</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 p-5 rounded-xl">
              <h4 className="text-violet-300 font-medium mb-3 uppercase text-xs tracking-wide">Why it works</h4>
              <ul className="space-y-2">
                {matchResult.matchReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-teal-400 mt-0.5">+</span> {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/5 p-5 rounded-xl">
              <h4 className="text-rose-300 font-medium mb-3 uppercase text-xs tracking-wide">Things to Watch</h4>
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

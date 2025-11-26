import React, { useState } from 'react';
import AuraAvatarCard from '../components/AuraAvatarCard';
import { AuraProfile, MatchResult } from '../types';
import { matchAuras } from '../services/auraLLM';

interface MatchTestScreenProps {
  userProfile: AuraProfile;
}

// Dummy Profile for "Lina"
const LINA_PROFILE: AuraProfile = {
  id: "lina_01",
  displayName: "Lina",
  introversionLevel: 3, // More extroverted
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
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Neural Twin Match Simulation</h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* User Card */}
          <div className="flex-1">
            <h3 className="text-center text-aura-muted mb-2">Your Aura</h3>
            <AuraAvatarCard 
              profile={userProfile} 
              auraState={{ mood: 'curious', moodIntensity: 0.5 }} 
              compact 
            />
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center justify-center p-4">
             {!matchResult && !isLoading && (
               <button 
                onClick={handleRunMatch}
                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transform transition hover:scale-105"
               >
                 Let Auras Talk
               </button>
             )}
             {isLoading && (
               <div className="text-aura-accent animate-pulse font-mono">Synchronizing Neural Waves...</div>
             )}
          </div>

          {/* Lina Card */}
          <div className="flex-1">
            <h3 className="text-center text-aura-muted mb-2">Potential Match</h3>
            <AuraAvatarCard 
              profile={LINA_PROFILE} 
              auraState={{ mood: 'excited', moodIntensity: 0.7 }} 
              compact 
            />
          </div>
        </div>

        {/* Results */}
        {matchResult && (
          <div className="bg-aura-card border border-white/10 rounded-2xl p-8 animate-fade-in shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-sm text-aura-muted uppercase tracking-widest">Compatibility</span>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mt-2">
                {matchResult.compatibilityScore}%
              </div>
              <div className="text-xl text-white capitalize mt-1 opacity-80">{matchResult.compatibilityLabel} Match</div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-6 rounded-xl">
                <h4 className="text-aura-accent font-bold mb-4 uppercase text-sm tracking-wide">Why it works</h4>
                <ul className="space-y-2">
                  {matchResult.matchReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 p-6 rounded-xl">
                 <h4 className="text-red-400 font-bold mb-4 uppercase text-sm tracking-wide">Things to Watch</h4>
                 <ul className="space-y-2">
                  {matchResult.riskFlags.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-red-400">!</span> {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-aura-dark to-aura-card border border-white/10 p-6 rounded-xl">
              <h4 className="text-white font-bold mb-2">Your Aura says:</h4>
              <p className="text-gray-300 italic">"{matchResult.auraToUserSummaryA}"</p>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-bold mb-2">Suggested Opener:</h4>
                <div className="bg-black/30 p-4 rounded-lg text-aura-accent font-mono text-sm">
                  {matchResult.suggestedOpeningForUserA}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchTestScreen;
import React from 'react';
import { AuraProfile, AuraState } from '../types';

interface AuraAvatarCardProps {
  profile: AuraProfile;
  auraState: AuraState;
  compact?: boolean;
}

const AuraAvatarCard: React.FC<AuraAvatarCardProps> = ({ profile, auraState, compact = false }) => {
  // Determine color based on mood
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-yellow-400 shadow-yellow-400/50';
      case 'excited': return 'bg-orange-400 shadow-orange-400/50';
      case 'anxious': return 'bg-purple-500 shadow-purple-500/50';
      case 'sad': return 'bg-blue-400 shadow-blue-400/50';
      case 'calm': return 'bg-teal-400 shadow-teal-400/50';
      case 'curious': return 'bg-pink-400 shadow-pink-400/50';
      default: return 'bg-white shadow-white/50'; // neutral
    }
  };

  // Determine pulse speed/scale based on intensity
  const scale = 1 + (auraState.moodIntensity * 0.2);

  return (
    <div className={`bg-aura-card rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden ${compact ? 'p-4' : 'p-8 h-full'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-aura-dark to-aura-card opacity-50 z-0" />

      {/* The Aura Orb */}
      <div className="relative z-10 mb-6">
        <div 
          className={`rounded-full transition-all duration-1000 ease-in-out blur-xl shadow-[0_0_60px_rgba(255,255,255,0.3)] ${getMoodColor(auraState.mood)} animate-pulse-slow`}
          style={{
            width: compact ? '80px' : '160px',
            height: compact ? '80px' : '160px',
            transform: `scale(${scale})`
          }}
        />
        <div 
          className={`absolute inset-0 rounded-full mix-blend-overlay opacity-80 ${getMoodColor(auraState.mood)}`}
           style={{
            width: compact ? '80px' : '160px',
            height: compact ? '80px' : '160px',
            transform: `scale(${scale * 0.8})`
          }}
        />
      </div>

      {/* Text Info */}
      <div className="relative z-10 text-center">
        <h2 className={`font-bold text-aura-text ${compact ? 'text-lg' : 'text-3xl mb-2'}`}>
          {profile.displayName}'s Aura
        </h2>
        
        {!compact && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {profile.vibeWords.map((word, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs text-aura-accent uppercase tracking-wider">
                  {word}
                </span>
              ))}
            </div>
            
            <p className="mt-6 text-aura-muted text-sm px-4 italic">
              "{profile.summary}"
            </p>

            <div className="mt-6 w-full text-left">
              <p className="text-xs text-aura-muted uppercase tracking-widest mb-2">Current State</p>
              <div className="flex items-center gap-2">
                <span className="capitalize text-white">{auraState.mood}</span>
                <div className="h-1 bg-white/10 flex-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-aura-accent transition-all duration-1000" 
                    style={{ width: `${auraState.moodIntensity * 100}%`}} 
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuraAvatarCard;
import React from 'react';
import { AuraProfile, AuraState } from '../types';

interface AuraAvatarCardProps {
  profile: AuraProfile;
  auraState: AuraState;
  compact?: boolean;
}

const AuraAvatarCard: React.FC<AuraAvatarCardProps> = ({ profile, auraState, compact = false }) => {
  const getMoodGradient = (mood: string) => {
    switch (mood) {
      case 'happy': return 'from-amber-400/60 via-orange-400/40 to-yellow-300/30';
      case 'excited': return 'from-orange-400/60 via-rose-400/40 to-amber-300/30';
      case 'anxious': return 'from-violet-500/60 via-purple-400/40 to-indigo-400/30';
      case 'sad': return 'from-blue-500/60 via-indigo-400/40 to-slate-400/30';
      case 'calm': return 'from-teal-400/60 via-cyan-400/40 to-blue-300/30';
      case 'curious': return 'from-pink-400/60 via-fuchsia-400/40 to-violet-300/30';
      default: return 'from-slate-400/60 via-blue-400/40 to-violet-300/30';
    }
  };

  const getMoodShadow = (mood: string) => {
    switch (mood) {
      case 'happy': return 'shadow-amber-400/30';
      case 'excited': return 'shadow-orange-400/30';
      case 'anxious': return 'shadow-violet-500/30';
      case 'sad': return 'shadow-blue-400/30';
      case 'calm': return 'shadow-teal-400/30';
      case 'curious': return 'shadow-pink-400/30';
      default: return 'shadow-slate-400/30';
    }
  };

  const scale = 1 + (auraState.moodIntensity * 0.15);
  const orbSize = compact ? 80 : 140;

  return (
    <div className={`flex flex-col items-center justify-center w-full ${compact ? 'py-4' : 'py-8'}`}>
      
      <div className="relative aura-orb mb-6">
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-radial ${getMoodGradient(auraState.mood)} aura-glow`}
          style={{
            width: orbSize * 1.8,
            height: orbSize * 1.8,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        <div 
          className={`relative rounded-full bg-gradient-to-br ${getMoodGradient(auraState.mood)} shadow-2xl ${getMoodShadow(auraState.mood)}`}
          style={{
            width: orbSize,
            height: orbSize,
            transform: `scale(${scale})`,
            transition: 'transform 1s ease-in-out',
            boxShadow: `0 0 60px 20px rgba(139, 92, 246, 0.15), 0 0 100px 40px rgba(59, 130, 246, 0.1)`,
          }}
        >
          <div 
            className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/20 to-transparent"
          />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className={`font-semibold text-slate-100 ${compact ? 'text-lg' : 'text-2xl'}`}>
          {profile.displayName}'s Aura
        </h2>
        
        {!compact && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {profile.vibeWords?.slice(0, 4).map((word, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-violet-300 uppercase tracking-wider"
                >
                  {word}
                </span>
              ))}
            </div>
            
            {profile.summary && (
              <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                "{profile.summary}"
              </p>
            )}

            <div className="mt-6 w-full max-w-xs mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase tracking-wider">Current State</span>
                <span className="capitalize text-slate-300">{auraState.mood}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${auraState.moodIntensity * 100}%`}} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuraAvatarCard;

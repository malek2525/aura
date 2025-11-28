import React from 'react';
import { AuraProfile, AuraState } from '../types';

interface AuraStageProps {
  profile?: AuraProfile | null;
  auraState?: AuraState;
}

export const AuraStage: React.FC<AuraStageProps> = ({ profile, auraState }) => {
  const mood = auraState?.mood || 'neutral';
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden rounded-[40px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating Avatar Container */}
      <div className="relative z-10 animate-float">
        {/* Breathing Inner Circle */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 p-1 shadow-2xl animate-breathe flex items-center justify-center relative overflow-hidden border border-white/20">
          
          {/* Inner Glow/Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 rounded-full" />
          
          {/* Avatar or Placeholder */}
          {profile?.avatarUrl ? (
            <img 
              src={profile.avatarUrl} 
              alt={profile.displayName} 
              className="w-full h-full object-cover rounded-full z-0"
            />
          ) : (
            <div className="text-8xl select-none filter drop-shadow-lg z-0">
              ⚪️
            </div>
          )}

          {/* Glass Reflection Overlay */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full" />
        </div>
      </div>

      {/* Info Section */}
      <div className="relative z-10 mt-12 text-center space-y-2">
        <h1 className="text-4xl font-thin tracking-[0.2em] text-white drop-shadow-sm">
          {profile?.displayName ? `${profile.displayName}'s` : ''} AURA
        </h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-300 backdrop-blur-md">
            Mood: {mood}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-300 backdrop-blur-md">
            Digital Twin
          </span>
          {profile?.vibeWords?.slice(0, 2).map((vibe, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-300 backdrop-blur-md">
              {vibe}
            </span>
          ))}
        </div>
        <p className="text-slate-400 text-sm font-light mt-4 max-w-xs mx-auto leading-relaxed">
          {profile?.summary || '"I am learning to feel what you feel."'}
        </p>
      </div>

    </div>
  );
};

export default AuraStage;

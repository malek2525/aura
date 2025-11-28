import React from 'react';
import { AuraProfile, AuraState } from '../types';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AuraAvatarProps {
  profile: AuraProfile;
  auraState: AuraState;
  size?: AvatarSize;
  showName?: boolean;
  showVibes?: boolean;
  showMood?: boolean;
}

const getMoodGradient = (mood: string): { gradient: string; glow: string; shadow: string } => {
  switch (mood.toLowerCase()) {
    case 'happy':
    case 'flirty':
    case 'excited':
      return {
        gradient: 'from-pink-400/70 via-rose-300/60 to-amber-300/50',
        glow: 'from-pink-500/40 via-rose-400/30 to-amber-400/20',
        shadow: '0 0 80px 30px rgba(244, 114, 182, 0.25), 0 0 120px 60px rgba(251, 146, 60, 0.15)'
      };
    case 'calm':
    case 'peaceful':
      return {
        gradient: 'from-blue-400/70 via-purple-400/60 to-indigo-400/50',
        glow: 'from-blue-500/40 via-purple-400/30 to-indigo-400/20',
        shadow: '0 0 80px 30px rgba(96, 165, 250, 0.25), 0 0 120px 60px rgba(167, 139, 250, 0.15)'
      };
    case 'anxious':
    case 'nervous':
      return {
        gradient: 'from-amber-400/70 via-orange-400/60 to-rose-400/50',
        glow: 'from-amber-500/35 via-orange-400/25 to-rose-400/20',
        shadow: '0 0 80px 30px rgba(251, 191, 36, 0.2), 0 0 120px 60px rgba(251, 146, 60, 0.12)'
      };
    case 'sad':
    case 'melancholy':
      return {
        gradient: 'from-blue-500/70 via-indigo-500/60 to-slate-500/50',
        glow: 'from-blue-600/40 via-indigo-500/30 to-slate-500/20',
        shadow: '0 0 80px 30px rgba(99, 102, 241, 0.25), 0 0 120px 60px rgba(100, 116, 139, 0.15)'
      };
    case 'focused':
    case 'thinking':
      return {
        gradient: 'from-cyan-400/70 via-sky-400/60 to-blue-400/50',
        glow: 'from-cyan-500/40 via-sky-400/30 to-blue-400/20',
        shadow: '0 0 80px 30px rgba(34, 211, 238, 0.25), 0 0 120px 60px rgba(56, 189, 248, 0.15)'
      };
    case 'curious':
      return {
        gradient: 'from-fuchsia-400/70 via-pink-400/60 to-violet-400/50',
        glow: 'from-fuchsia-500/40 via-pink-400/30 to-violet-400/20',
        shadow: '0 0 80px 30px rgba(217, 70, 239, 0.25), 0 0 120px 60px rgba(167, 139, 250, 0.15)'
      };
    case 'neutral':
    default:
      return {
        gradient: 'from-slate-400/70 via-blue-400/60 to-indigo-400/50',
        glow: 'from-slate-500/35 via-blue-400/25 to-indigo-400/20',
        shadow: '0 0 80px 30px rgba(148, 163, 184, 0.2), 0 0 120px 60px rgba(99, 102, 241, 0.1)'
      };
  }
};

const sizeConfig: Record<AvatarSize, { orb: string; glow: string; inner: string }> = {
  sm: { orb: 'h-20 w-20', glow: '-inset-6', inner: 'text-3xl' },
  md: { orb: 'h-32 w-32', glow: '-inset-8', inner: 'text-4xl' },
  lg: { orb: 'h-48 w-48 lg:h-56 lg:w-56', glow: '-inset-12', inner: 'text-6xl' },
  xl: { orb: 'h-56 w-56 lg:h-64 lg:w-64', glow: '-inset-16', inner: 'text-7xl' }
};

const getSizeClasses = (size: AvatarSize) => sizeConfig[size];

const AuraAvatar: React.FC<AuraAvatarProps> = ({
  profile,
  auraState,
  size = 'lg' as AvatarSize,
  showName = true,
  showVibes = true,
  showMood = false
}) => {
  const { gradient, glow, shadow } = getMoodGradient(auraState.mood);
  const sizeClasses = sizeConfig[size];
  const intensityScale = 1 + (auraState.moodIntensity * 0.08);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      
      {/* Floating + Breathing Avatar Container */}
      <div className="relative animate-aura-float">
        
        {/* Outer Ambient Glow */}
        <div
          className={`absolute ${sizeClasses.glow} rounded-full bg-gradient-radial ${glow} blur-3xl animate-aura-breathe pointer-events-none`}
          style={{ boxShadow: shadow }}
        />
        
        {/* Main Orb with Breathing Animation */}
        <div
          className={`relative ${sizeClasses.orb} rounded-full bg-gradient-to-br ${gradient} p-[3px] shadow-2xl animate-aura-breathe`}
          style={{ 
            transform: `scale(${intensityScale})`,
            transition: 'transform 1.5s ease-in-out'
          }}
        >
          {/* Inner Glass Surface */}
          <div className="h-full w-full rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center overflow-hidden relative">
            
            {/* Avatar Image or Placeholder */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <div className={`${sizeClasses.inner} select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
                ✨
              </div>
            )}
            
            {/* Top Glass Reflection */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent rounded-t-full pointer-events-none" />
            
            {/* Bottom Shadow */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/30 to-transparent rounded-b-full pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Shadow on "Floor" */}
      <div className="w-24 h-4 bg-black/30 rounded-full blur-xl -mt-2" />

      {/* Name */}
      {showName && (
        <h2 className="text-xl lg:text-2xl font-semibold text-white tracking-tight">
          {profile.displayName}'s Aura
        </h2>
      )}

      {/* Vibe Words */}
      {showVibes && profile.vibeWords && profile.vibeWords.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {profile.vibeWords.slice(0, 3).map((word, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-[0.15em] text-slate-300 backdrop-blur-md"
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Current Mood Badge */}
      {showMood && (
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient} animate-pulse`} />
          <span className="uppercase tracking-[0.2em]">
            {auraState.mood} · {Math.round(auraState.moodIntensity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AuraAvatar;

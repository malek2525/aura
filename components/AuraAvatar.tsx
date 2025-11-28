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

const getMoodGradient = (mood: string): { gradient: string; glow: string; shadow: string; skinTone: string; eyeColor: string } => {
  switch (mood.toLowerCase()) {
    case 'happy':
    case 'flirty':
    case 'excited':
      return {
        gradient: 'from-pink-400/70 via-rose-300/60 to-amber-300/50',
        glow: 'from-pink-500/40 via-rose-400/30 to-amber-400/20',
        shadow: '0 0 80px 30px rgba(244, 114, 182, 0.25), 0 0 120px 60px rgba(251, 146, 60, 0.15)',
        skinTone: 'from-rose-200/90 via-pink-100/80 to-amber-100/70',
        eyeColor: '#ec4899'
      };
    case 'calm':
    case 'peaceful':
      return {
        gradient: 'from-blue-400/70 via-purple-400/60 to-indigo-400/50',
        glow: 'from-blue-500/40 via-purple-400/30 to-indigo-400/20',
        shadow: '0 0 80px 30px rgba(96, 165, 250, 0.25), 0 0 120px 60px rgba(167, 139, 250, 0.15)',
        skinTone: 'from-blue-100/90 via-indigo-100/80 to-purple-100/70',
        eyeColor: '#8b5cf6'
      };
    case 'anxious':
    case 'nervous':
      return {
        gradient: 'from-amber-400/70 via-orange-400/60 to-rose-400/50',
        glow: 'from-amber-500/35 via-orange-400/25 to-rose-400/20',
        shadow: '0 0 80px 30px rgba(251, 191, 36, 0.2), 0 0 120px 60px rgba(251, 146, 60, 0.12)',
        skinTone: 'from-amber-100/90 via-orange-100/80 to-rose-100/70',
        eyeColor: '#f59e0b'
      };
    case 'sad':
    case 'melancholy':
      return {
        gradient: 'from-blue-500/70 via-indigo-500/60 to-slate-500/50',
        glow: 'from-blue-600/40 via-indigo-500/30 to-slate-500/20',
        shadow: '0 0 80px 30px rgba(99, 102, 241, 0.25), 0 0 120px 60px rgba(100, 116, 139, 0.15)',
        skinTone: 'from-slate-200/90 via-blue-100/80 to-indigo-100/70',
        eyeColor: '#6366f1'
      };
    case 'focused':
    case 'thinking':
      return {
        gradient: 'from-cyan-400/70 via-sky-400/60 to-blue-400/50',
        glow: 'from-cyan-500/40 via-sky-400/30 to-blue-400/20',
        shadow: '0 0 80px 30px rgba(34, 211, 238, 0.25), 0 0 120px 60px rgba(56, 189, 248, 0.15)',
        skinTone: 'from-cyan-100/90 via-sky-100/80 to-blue-100/70',
        eyeColor: '#0ea5e9'
      };
    case 'curious':
      return {
        gradient: 'from-fuchsia-400/70 via-pink-400/60 to-violet-400/50',
        glow: 'from-fuchsia-500/40 via-pink-400/30 to-violet-400/20',
        shadow: '0 0 80px 30px rgba(217, 70, 239, 0.25), 0 0 120px 60px rgba(167, 139, 250, 0.15)',
        skinTone: 'from-fuchsia-100/90 via-pink-100/80 to-violet-100/70',
        eyeColor: '#d946ef'
      };
    case 'neutral':
    default:
      return {
        gradient: 'from-slate-400/70 via-blue-400/60 to-indigo-400/50',
        glow: 'from-slate-500/35 via-blue-400/25 to-indigo-400/20',
        shadow: '0 0 80px 30px rgba(148, 163, 184, 0.2), 0 0 120px 60px rgba(99, 102, 241, 0.1)',
        skinTone: 'from-slate-100/90 via-blue-50/80 to-indigo-50/70',
        eyeColor: '#64748b'
      };
  }
};

const sizeConfig: Record<AvatarSize, { 
  container: string; 
  orb: string; 
  glow: string; 
  inner: string;
  face: string;
  eye: string;
  eyeGap: string;
  shoulder: string;
}> = {
  sm: { 
    container: 'h-24 w-24',
    orb: 'h-20 w-20', 
    glow: '-inset-6', 
    inner: 'text-3xl',
    face: 'h-12 w-12',
    eye: 'w-1.5 h-2',
    eyeGap: 'gap-3',
    shoulder: 'h-6 w-16'
  },
  md: { 
    container: 'h-36 w-36',
    orb: 'h-32 w-32', 
    glow: '-inset-8', 
    inner: 'text-4xl',
    face: 'h-18 w-18',
    eye: 'w-2 h-3',
    eyeGap: 'gap-4',
    shoulder: 'h-8 w-24'
  },
  lg: { 
    container: 'h-52 w-52 lg:h-60 lg:w-60',
    orb: 'h-48 w-48 lg:h-56 lg:w-56', 
    glow: '-inset-12', 
    inner: 'text-6xl',
    face: 'h-28 w-28 lg:h-32 lg:w-32',
    eye: 'w-2.5 h-4',
    eyeGap: 'gap-6',
    shoulder: 'h-10 w-36 lg:h-12 lg:w-40'
  },
  xl: { 
    container: 'h-60 w-60 lg:h-72 lg:w-72',
    orb: 'h-56 w-56 lg:h-64 lg:w-64', 
    glow: '-inset-16', 
    inner: 'text-7xl',
    face: 'h-32 w-32 lg:h-40 lg:w-40',
    eye: 'w-3 h-5',
    eyeGap: 'gap-8',
    shoulder: 'h-12 w-44 lg:h-14 lg:w-52'
  }
};

const AuraAvatar: React.FC<AuraAvatarProps> = ({
  profile,
  auraState,
  size = 'lg' as AvatarSize,
  showName = true,
  showVibes = true,
  showMood = false
}) => {
  const { gradient, glow, shadow, skinTone, eyeColor } = getMoodGradient(auraState.mood);
  const sizeClasses = sizeConfig[size];
  const intensityScale = 1 + (auraState.moodIntensity * 0.06);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      
      {/* Floating + Breathing Avatar Container */}
      <div className="relative animate-aura-float">
        
        {/* Outer Ambient Glow */}
        <div
          className={`absolute ${sizeClasses.glow} rounded-full bg-gradient-radial ${glow} blur-3xl animate-aura-breathe pointer-events-none`}
          style={{ boxShadow: shadow }}
        />
        
        {/* Main Circular Frame with Character */}
        <div
          className={`relative ${sizeClasses.orb} rounded-full bg-gradient-to-br ${gradient} p-[3px] shadow-2xl animate-aura-breathe`}
          style={{ 
            transform: `scale(${intensityScale})`,
            transition: 'transform 1.5s ease-in-out'
          }}
        >
          {/* Inner Glass Surface */}
          <div className="h-full w-full rounded-full bg-slate-900/40 backdrop-blur-xl border border-white/20 flex items-center justify-center overflow-hidden relative">
            
            {/* If user has avatar URL, show image; otherwise show character */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              /* 2D Character Silhouette */
              <div className="relative flex flex-col items-center justify-end h-full w-full pt-4 pb-0 overflow-hidden">
                
                {/* Ambient Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${skinTone} opacity-30 rounded-full`} />
                
                {/* Character Body Container */}
                <div className="relative flex flex-col items-center z-10">
                  
                  {/* Head */}
                  <div className={`${sizeClasses.face} rounded-full bg-gradient-to-br from-slate-200/95 via-slate-100/90 to-slate-50/85 relative shadow-lg`}>
                    
                    {/* Face inner shadow for depth */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-slate-300/20" />
                    
                    {/* Subtle cheek blush */}
                    <div className="absolute inset-x-0 top-1/2 flex justify-between px-[12%]">
                      <div className="w-[18%] h-[18%] rounded-full bg-rose-300/25 blur-[2px]" />
                      <div className="w-[18%] h-[18%] rounded-full bg-rose-300/25 blur-[2px]" />
                    </div>
                    
                    {/* Eyes Container */}
                    <div className={`absolute inset-x-0 top-[38%] flex items-center justify-center ${sizeClasses.eyeGap}`}>
                      {/* Left Eye */}
                      <div className="relative">
                        <div 
                          className={`${sizeClasses.eye} rounded-full shadow-inner`}
                          style={{ backgroundColor: eyeColor }}
                        >
                          {/* Pupil */}
                          <div className="absolute inset-[15%] rounded-full bg-slate-900" />
                          {/* Eye highlight */}
                          <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/80" />
                        </div>
                        {/* Eyelid for blinking */}
                        <div 
                          className={`absolute inset-0 ${sizeClasses.eye} rounded-full bg-gradient-to-b from-slate-200/98 via-slate-100/95 to-slate-200/98 animate-aura-blink`}
                        />
                      </div>
                      
                      {/* Right Eye */}
                      <div className="relative">
                        <div 
                          className={`${sizeClasses.eye} rounded-full shadow-inner`}
                          style={{ backgroundColor: eyeColor }}
                        >
                          {/* Pupil */}
                          <div className="absolute inset-[15%] rounded-full bg-slate-900" />
                          {/* Eye highlight */}
                          <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/80" />
                        </div>
                        {/* Eyelid for blinking */}
                        <div 
                          className={`absolute inset-0 ${sizeClasses.eye} rounded-full bg-gradient-to-b from-slate-200/98 via-slate-100/95 to-slate-200/98 animate-aura-blink`}
                        />
                      </div>
                    </div>
                    
                    {/* Subtle Nose (just a tiny shadow hint) */}
                    <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[4%] h-[8%] bg-gradient-to-b from-transparent via-slate-400/10 to-slate-400/15 rounded-full" />
                    
                    {/* Mouth - subtle and calm */}
                    <div className="absolute top-[68%] left-1/2 -translate-x-1/2 w-[22%] h-[3%] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent rounded-full" />
                    
                    {/* Hair suggestion - soft wisps at top */}
                    <div className="absolute -top-[5%] inset-x-[10%] h-[25%] bg-gradient-to-b from-slate-500/50 via-slate-400/30 to-transparent rounded-t-full blur-[1px]" />
                    
                    {/* Side hair wisps */}
                    <div className="absolute top-[5%] -left-[3%] w-[20%] h-[35%] bg-gradient-to-br from-slate-500/40 to-transparent rounded-full blur-[1px]" />
                    <div className="absolute top-[5%] -right-[3%] w-[20%] h-[35%] bg-gradient-to-bl from-slate-500/40 to-transparent rounded-full blur-[1px]" />
                  </div>
                  
                  {/* Neck */}
                  <div className="w-[35%] h-[12%] bg-gradient-to-b from-slate-100/90 to-slate-200/80 -mt-1" style={{ aspectRatio: '1/0.4' }} />
                  
                  {/* Shoulders */}
                  <div className={`${sizeClasses.shoulder} bg-gradient-to-b from-slate-300/80 via-slate-400/70 to-slate-500/60 rounded-t-[100%] -mt-1`}>
                    {/* Collar hint */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[30%] bg-gradient-to-b from-slate-200/50 to-transparent rounded-b-full" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Top Glass Reflection */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent rounded-t-full pointer-events-none" />
            
            {/* Bottom Shadow */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/30 to-transparent rounded-b-full pointer-events-none" />
            
            {/* Mood-reactive inner rim glow */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none animate-mood-pulse"
              style={{
                boxShadow: `inset 0 0 30px 5px ${eyeColor}20`
              }}
            />
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

import React from 'react';
import { AuraProfile, AuraState } from '../types';

import auraNeutralVideo from '@assets/aura-neutral.mp4';
import auraNeutralImg from '@assets/aura-neutral.png';
import auraHappyVideo from '@assets/aura-happy.mp4';
import auraHappyImg from '@assets/aura-happy.png';
import auraPlayfulImg from '@assets/aura-playful.png';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AuraAvatarProps {
  profile: AuraProfile;
  auraState: AuraState;
  size?: AvatarSize;
  showName?: boolean;
  showVibes?: boolean;
  showMood?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
}

const getMoodAssets = (mood: string): { video: string | null; image: string } => {
  const m = mood.toLowerCase();
  
  if (['happy', 'joy', 'excited'].includes(m)) {
    return { video: auraHappyVideo, image: auraHappyImg };
  }
  
  if (['playful', 'flirty', 'romantic'].includes(m)) {
    return { video: null, image: auraPlayfulImg };
  }
  
  return { video: auraNeutralVideo, image: auraNeutralImg };
};

const getMoodGlow = (mood: string, intensity: number): { color: string; shadow: string } => {
  const glowOpacity = 0.2 + (intensity * 0.2);
  const m = mood.toLowerCase();
  
  if (['happy', 'joy', 'excited'].includes(m)) {
    return {
      color: `rgba(244, 114, 182, ${glowOpacity})`,
      shadow: `0 0 80px 30px rgba(244, 114, 182, ${glowOpacity}), 0 0 120px 50px rgba(251, 146, 60, ${glowOpacity * 0.5})`
    };
  }
  
  if (['playful', 'flirty', 'romantic'].includes(m)) {
    return {
      color: `rgba(217, 70, 239, ${glowOpacity})`,
      shadow: `0 0 80px 30px rgba(217, 70, 239, ${glowOpacity}), 0 0 120px 50px rgba(244, 114, 182, ${glowOpacity * 0.5})`
    };
  }
  
  if (['calm', 'peaceful'].includes(m)) {
    return {
      color: `rgba(139, 92, 246, ${glowOpacity})`,
      shadow: `0 0 80px 30px rgba(139, 92, 246, ${glowOpacity}), 0 0 120px 50px rgba(96, 165, 250, ${glowOpacity * 0.5})`
    };
  }
  
  if (['sad', 'melancholy'].includes(m)) {
    return {
      color: `rgba(99, 102, 241, ${glowOpacity * 0.7})`,
      shadow: `0 0 60px 25px rgba(99, 102, 241, ${glowOpacity * 0.7}), 0 0 100px 40px rgba(100, 116, 139, ${glowOpacity * 0.4})`
    };
  }
  
  if (['anxious', 'nervous'].includes(m)) {
    return {
      color: `rgba(251, 191, 36, ${glowOpacity * 0.6})`,
      shadow: `0 0 60px 25px rgba(251, 191, 36, ${glowOpacity * 0.6}), 0 0 100px 40px rgba(251, 146, 60, ${glowOpacity * 0.4})`
    };
  }
  
  return {
    color: `rgba(148, 163, 184, ${glowOpacity})`,
    shadow: `0 0 70px 28px rgba(148, 163, 184, ${glowOpacity}), 0 0 110px 45px rgba(99, 102, 241, ${glowOpacity * 0.4})`
  };
};

const sizeConfig: Record<AvatarSize, { shell: string; glowInset: string; speakingRing: string }> = {
  sm: { shell: 'h-20 w-20', glowInset: '-inset-4', speakingRing: '-inset-1' },
  md: { shell: 'h-32 w-32', glowInset: '-inset-6', speakingRing: '-inset-1.5' },
  lg: { shell: 'h-48 w-48 lg:h-56 lg:w-56', glowInset: '-inset-10', speakingRing: '-inset-2' },
  xl: { shell: 'h-56 w-56 lg:h-64 lg:w-64', glowInset: '-inset-14', speakingRing: '-inset-2.5' }
};

const AuraAvatar: React.FC<AuraAvatarProps> = ({
  profile,
  auraState,
  size = 'lg',
  showName = true,
  showVibes = true,
  showMood = false,
  isSpeaking = false,
  isListening = false
}) => {
  const { video, image } = getMoodAssets(auraState.mood);
  const { color: glowColor, shadow: glowShadow } = getMoodGlow(auraState.mood, auraState.moodIntensity);
  const dims = sizeConfig[size];
  const intensityScale = 1 + (auraState.moodIntensity * 0.03);

  return (
    <div className="flex flex-col items-center justify-center gap-6">

      {/* Main Floating Container */}
      <div className="relative animate-aura-float">

        {/* Outer Radial Glow */}
        <div
          className={`absolute ${dims.glowInset} rounded-full blur-3xl pointer-events-none animate-aura-breathe`}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            boxShadow: glowShadow
          }}
        />

        {/* Speaking Ring (when isSpeaking is true) */}
        {isSpeaking && (
          <>
            <div
              className={`absolute ${dims.speakingRing} rounded-full pointer-events-none`}
              style={{
                background: 'transparent',
                border: `3px solid ${glowColor}`,
                boxShadow: `0 0 20px 8px ${glowColor}, inset 0 0 15px 5px ${glowColor}`,
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
            <div
              className={`absolute ${dims.speakingRing} rounded-full pointer-events-none`}
              style={{
                background: 'transparent',
                boxShadow: `0 0 40px 15px ${glowColor}`,
                opacity: 0.5,
                animation: 'pulse 2s ease-in-out infinite 0.3s'
              }}
            />
          </>
        )}

        {/* Listening Ring (when isListening is true) */}
        {isListening && !isSpeaking && (
          <>
            <div
              className={`absolute ${dims.speakingRing} rounded-full pointer-events-none`}
              style={{
                background: 'transparent',
                border: '3px solid rgba(239, 68, 68, 0.6)',
                boxShadow: '0 0 20px 8px rgba(239, 68, 68, 0.4), inset 0 0 15px 5px rgba(239, 68, 68, 0.3)',
                animation: 'pulse 1s ease-in-out infinite'
              }}
            />
            <div
              className={`absolute ${dims.speakingRing} rounded-full pointer-events-none`}
              style={{
                background: 'transparent',
                boxShadow: '0 0 40px 15px rgba(239, 68, 68, 0.3)',
                opacity: 0.6,
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }}
            />
          </>
        )}

        {/* Glass Shell */}
        <div
          className={`relative ${dims.shell} rounded-full shadow-2xl animate-aura-breathe`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
            padding: '3px',
            transform: `scale(${intensityScale})`,
            transition: 'transform 1s ease-in-out'
          }}
        >
          {/* Inner Hologram Container */}
          <div
            className="h-full w-full rounded-full overflow-hidden relative"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.08), transparent 60%), linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 0 30px 10px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.1)'
            }}
          >

            {/* Video or Image Avatar */}
            {video ? (
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover rounded-full"
                style={{ 
                  filter: 'contrast(1.05) saturate(1.1)',
                  mixBlendMode: 'normal'
                }}
              />
            ) : (
              <img
                src={image}
                alt={`${profile.displayName}'s Aura`}
                className="absolute inset-0 h-full w-full object-cover rounded-full"
                style={{ 
                  filter: 'contrast(1.05) saturate(1.1)',
                  mixBlendMode: 'normal'
                }}
              />
            )}

            {/* Hologram Scanlines Overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.015) 2px,
                  rgba(255,255,255,0.015) 4px
                )`,
                opacity: 0.6
              }}
            />

            {/* Soft Light Overlay Top */}
            <div
              className="absolute top-0 left-0 w-full h-2/5 rounded-t-full pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)'
              }}
            />

            {/* Soft Light Overlay Bottom */}
            <div
              className="absolute bottom-0 left-0 w-full h-1/3 rounded-b-full pointer-events-none"
              style={{
                background: 'linear-gradient(0deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)'
              }}
            />

            {/* Inner Glow Ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: `inset 0 0 25px 8px ${glowColor}`
              }}
            />

            {/* Holographic Shimmer */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 55%, transparent 60%)',
                animation: 'lightSweep 8s ease-in-out infinite'
              }}
            />

            {/* Edge Highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 1px 0 rgba(255,255,255,0.3)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floor Shadow */}
      <div
        className="rounded-full blur-xl -mt-2"
        style={{
          width: size === 'xl' ? 100 : size === 'lg' ? 80 : size === 'md' ? 60 : 45,
          height: size === 'xl' ? 16 : size === 'lg' ? 12 : size === 'md' ? 10 : 8,
          background: 'rgba(0,0,0,0.4)'
        }}
      />

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
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: glowColor }}
          />
          <span className="uppercase tracking-[0.2em]">
            {auraState.mood} · {Math.round(auraState.moodIntensity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AuraAvatar;

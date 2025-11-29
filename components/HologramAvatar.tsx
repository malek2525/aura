import React from 'react';
import { AuraState } from '../types';

import auraNeutralVideo from '@assets/aura-neutral.mp4';
import auraNeutralImg from '@assets/aura-neutral.png';
import auraHappyVideo from '@assets/aura-happy.mp4';
import auraHappyImg from '@assets/aura-happy.png';
import auraPlayfulImg from '@assets/aura-playful.png';

interface HologramAvatarProps {
  auraState: AuraState;
  isSpeaking?: boolean;
  isListening?: boolean;
  className?: string;
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
  const glowOpacity = 0.15 + (intensity * 0.15);
  const m = mood.toLowerCase();
  
  if (['happy', 'joy', 'excited'].includes(m)) {
    return {
      color: `rgba(244, 114, 182, ${glowOpacity})`,
      shadow: `0 0 120px 60px rgba(244, 114, 182, ${glowOpacity}), 0 0 200px 100px rgba(251, 146, 60, ${glowOpacity * 0.4})`
    };
  }
  
  if (['playful', 'flirty', 'romantic'].includes(m)) {
    return {
      color: `rgba(217, 70, 239, ${glowOpacity})`,
      shadow: `0 0 120px 60px rgba(217, 70, 239, ${glowOpacity}), 0 0 200px 100px rgba(244, 114, 182, ${glowOpacity * 0.4})`
    };
  }
  
  if (['calm', 'peaceful'].includes(m)) {
    return {
      color: `rgba(139, 92, 246, ${glowOpacity})`,
      shadow: `0 0 120px 60px rgba(139, 92, 246, ${glowOpacity}), 0 0 200px 100px rgba(96, 165, 250, ${glowOpacity * 0.4})`
    };
  }
  
  if (['sad', 'melancholy'].includes(m)) {
    return {
      color: `rgba(99, 102, 241, ${glowOpacity * 0.7})`,
      shadow: `0 0 100px 50px rgba(99, 102, 241, ${glowOpacity * 0.6}), 0 0 180px 80px rgba(100, 116, 139, ${glowOpacity * 0.3})`
    };
  }
  
  if (['anxious', 'nervous'].includes(m)) {
    return {
      color: `rgba(251, 191, 36, ${glowOpacity * 0.6})`,
      shadow: `0 0 100px 50px rgba(251, 191, 36, ${glowOpacity * 0.5}), 0 0 180px 80px rgba(251, 146, 60, ${glowOpacity * 0.3})`
    };
  }
  
  return {
    color: `rgba(139, 92, 246, ${glowOpacity})`,
    shadow: `0 0 120px 60px rgba(139, 92, 246, ${glowOpacity}), 0 0 200px 100px rgba(99, 102, 241, ${glowOpacity * 0.4})`
  };
};

const HologramAvatar: React.FC<HologramAvatarProps> = ({
  auraState,
  isSpeaking = false,
  isListening = false,
  className = ''
}) => {
  const { video, image } = getMoodAssets(auraState.mood);
  const { shadow: glowShadow } = getMoodGlow(auraState.mood, auraState.moodIntensity);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 70% at 50% 60%, ${getMoodGlow(auraState.mood, auraState.moodIntensity).color} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: isSpeaking ? 0.8 : 0.5,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />

      <div 
        className="relative w-full h-full flex items-end justify-center animate-aura-float"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <div 
          className="relative animate-aura-breathe"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              className="max-w-full max-h-full"
              style={{ 
                objectFit: 'contain',
                filter: isSpeaking 
                  ? 'contrast(1.1) saturate(1.15) brightness(1.05) drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))' 
                  : 'contrast(1.05) saturate(1.1) drop-shadow(0 0 20px rgba(139, 92, 246, 0.25))',
                transition: 'filter 0.3s ease-in-out'
              }}
            />
          ) : (
            <img
              src={image}
              alt="Aura"
              className="max-w-full max-h-full"
              style={{ 
                objectFit: 'contain',
                filter: isSpeaking 
                  ? 'contrast(1.1) saturate(1.15) brightness(1.05) drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))' 
                  : 'contrast(1.05) saturate(1.1) drop-shadow(0 0 20px rgba(139, 92, 246, 0.25))',
                transition: 'filter 0.3s ease-in-out'
              }}
            />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.008) 3px,
                rgba(255,255,255,0.008) 6px
              )`,
              opacity: 0.4,
              mixBlendMode: 'overlay'
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
              animation: 'lightSweep 10s ease-in-out infinite'
            }}
          />
        </div>

        {isSpeaking && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: glowShadow,
              opacity: 0.6,
              animation: 'pulse 2s ease-in-out infinite',
              borderRadius: '50%'
            }}
          />
        )}

        {isListening && !isSpeaking && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: '0 0 100px 40px rgba(239, 68, 68, 0.25), 0 0 160px 70px rgba(239, 68, 68, 0.15)',
              opacity: 0.7,
              animation: 'pulse 1.5s ease-in-out infinite',
              borderRadius: '50%'
            }}
          />
        )}
      </div>

      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 blur-2xl"
        style={{
          width: '60%',
          maxWidth: '300px',
          height: '20px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

export default HologramAvatar;

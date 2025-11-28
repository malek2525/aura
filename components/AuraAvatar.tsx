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

const getMoodStyle = (mood: string, intensity: number): {
  gradient: string;
  glow: string;
  shadow: string;
  skinBase: string;
  skinHighlight: string;
  hairColor: string;
  lipColor: string;
  cheekColor: string;
  ambientColor: string;
  glowOpacity: number;
} => {
  const baseOpacity = 0.6 + (intensity * 0.25);
  const glowOpacity = 0.15 + (intensity * 0.15);

  switch (mood.toLowerCase()) {
    case 'happy':
    case 'flirty':
    case 'excited':
      return {
        gradient: 'from-rose-400/60 via-pink-300/50 to-amber-200/40',
        glow: 'from-rose-400/30 via-pink-300/20 to-amber-200/15',
        shadow: `0 0 60px 20px rgba(244, 114, 182, ${glowOpacity})`,
        skinBase: `rgba(255, 241, 235, ${baseOpacity})`,
        skinHighlight: 'rgba(255, 250, 248, 0.9)',
        hairColor: 'rgba(71, 85, 105, 0.85)',
        lipColor: 'rgba(244, 114, 182, 0.5)',
        cheekColor: 'rgba(251, 207, 232, 0.35)',
        ambientColor: 'rgba(244, 114, 182, 0.15)',
        glowOpacity
      };
    case 'calm':
    case 'peaceful':
      return {
        gradient: 'from-blue-400/60 via-violet-400/50 to-indigo-300/40',
        glow: 'from-blue-400/25 via-violet-400/20 to-indigo-300/15',
        shadow: `0 0 60px 20px rgba(139, 92, 246, ${glowOpacity})`,
        skinBase: `rgba(241, 245, 255, ${baseOpacity})`,
        skinHighlight: 'rgba(250, 251, 255, 0.9)',
        hairColor: 'rgba(71, 85, 105, 0.8)',
        lipColor: 'rgba(167, 139, 250, 0.4)',
        cheekColor: 'rgba(196, 181, 253, 0.25)',
        ambientColor: 'rgba(139, 92, 246, 0.12)',
        glowOpacity
      };
    case 'anxious':
    case 'nervous':
      return {
        gradient: 'from-amber-400/50 via-orange-300/40 to-violet-300/35',
        glow: 'from-amber-400/20 via-orange-300/15 to-violet-300/12',
        shadow: `0 0 50px 15px rgba(251, 191, 36, ${glowOpacity * 0.7})`,
        skinBase: `rgba(255, 251, 235, ${baseOpacity * 0.85})`,
        skinHighlight: 'rgba(255, 253, 248, 0.8)',
        hairColor: 'rgba(100, 116, 139, 0.75)',
        lipColor: 'rgba(251, 146, 60, 0.35)',
        cheekColor: 'rgba(254, 215, 170, 0.2)',
        ambientColor: 'rgba(251, 191, 36, 0.1)',
        glowOpacity: glowOpacity * 0.7
      };
    case 'sad':
    case 'melancholy':
      return {
        gradient: 'from-blue-500/55 via-indigo-500/45 to-slate-400/35',
        glow: 'from-blue-500/20 via-indigo-500/15 to-slate-400/10',
        shadow: `0 0 50px 15px rgba(99, 102, 241, ${glowOpacity * 0.6})`,
        skinBase: `rgba(235, 240, 255, ${baseOpacity * 0.75})`,
        skinHighlight: 'rgba(245, 248, 255, 0.75)',
        hairColor: 'rgba(71, 85, 105, 0.7)',
        lipColor: 'rgba(129, 140, 248, 0.3)',
        cheekColor: 'rgba(165, 180, 252, 0.15)',
        ambientColor: 'rgba(99, 102, 241, 0.08)',
        glowOpacity: glowOpacity * 0.6
      };
    case 'focused':
    case 'thinking':
      return {
        gradient: 'from-cyan-400/55 via-sky-400/45 to-blue-400/40',
        glow: 'from-cyan-400/25 via-sky-400/20 to-blue-400/15',
        shadow: `0 0 60px 20px rgba(34, 211, 238, ${glowOpacity})`,
        skinBase: `rgba(240, 253, 255, ${baseOpacity})`,
        skinHighlight: 'rgba(250, 254, 255, 0.9)',
        hairColor: 'rgba(71, 85, 105, 0.8)',
        lipColor: 'rgba(56, 189, 248, 0.4)',
        cheekColor: 'rgba(186, 230, 253, 0.25)',
        ambientColor: 'rgba(34, 211, 238, 0.12)',
        glowOpacity
      };
    case 'curious':
      return {
        gradient: 'from-fuchsia-400/55 via-pink-400/45 to-violet-400/40',
        glow: 'from-fuchsia-400/25 via-pink-400/20 to-violet-400/15',
        shadow: `0 0 60px 20px rgba(217, 70, 239, ${glowOpacity})`,
        skinBase: `rgba(253, 244, 255, ${baseOpacity})`,
        skinHighlight: 'rgba(254, 250, 255, 0.9)',
        hairColor: 'rgba(71, 85, 105, 0.8)',
        lipColor: 'rgba(232, 121, 249, 0.45)',
        cheekColor: 'rgba(245, 208, 254, 0.28)',
        ambientColor: 'rgba(217, 70, 239, 0.12)',
        glowOpacity
      };
    case 'neutral':
    default:
      return {
        gradient: 'from-slate-400/55 via-blue-400/45 to-indigo-400/40',
        glow: 'from-slate-400/20 via-blue-400/15 to-indigo-400/12',
        shadow: `0 0 50px 15px rgba(148, 163, 184, ${glowOpacity * 0.8})`,
        skinBase: `rgba(248, 250, 255, ${baseOpacity})`,
        skinHighlight: 'rgba(252, 253, 255, 0.85)',
        hairColor: 'rgba(71, 85, 105, 0.75)',
        lipColor: 'rgba(148, 163, 184, 0.35)',
        cheekColor: 'rgba(203, 213, 225, 0.2)',
        ambientColor: 'rgba(148, 163, 184, 0.1)',
        glowOpacity: glowOpacity * 0.8
      };
  }
};

const sizeConfig: Record<AvatarSize, {
  container: number;
  shell: string;
  glowInset: string;
  face: number;
  eyeWidth: number;
  eyeHeight: number;
  eyeGap: number;
  noseWidth: number;
  lipWidth: number;
  shoulderWidth: number;
}> = {
  sm: {
    container: 96,
    shell: 'h-20 w-20',
    glowInset: '-inset-4',
    face: 48,
    eyeWidth: 4,
    eyeHeight: 2,
    eyeGap: 12,
    noseWidth: 3,
    lipWidth: 10,
    shoulderWidth: 56
  },
  md: {
    container: 144,
    shell: 'h-32 w-32',
    glowInset: '-inset-6',
    face: 72,
    eyeWidth: 5,
    eyeHeight: 2.5,
    eyeGap: 16,
    noseWidth: 4,
    lipWidth: 14,
    shoulderWidth: 84
  },
  lg: {
    container: 224,
    shell: 'h-48 w-48 lg:h-56 lg:w-56',
    glowInset: '-inset-10',
    face: 110,
    eyeWidth: 7,
    eyeHeight: 3.5,
    eyeGap: 24,
    noseWidth: 5,
    lipWidth: 20,
    shoulderWidth: 130
  },
  xl: {
    container: 280,
    shell: 'h-56 w-56 lg:h-64 lg:w-64',
    glowInset: '-inset-14',
    face: 140,
    eyeWidth: 9,
    eyeHeight: 4.5,
    eyeGap: 32,
    noseWidth: 6,
    lipWidth: 26,
    shoulderWidth: 170
  }
};

const AuraAvatar: React.FC<AuraAvatarProps> = ({
  profile,
  auraState,
  size = 'lg',
  showName = true,
  showVibes = true,
  showMood = false
}) => {
  const moodStyle = getMoodStyle(auraState.mood, auraState.moodIntensity);
  const dims = sizeConfig[size];
  const intensityScale = 1 + (auraState.moodIntensity * 0.04);

  return (
    <div className="flex flex-col items-center justify-center gap-6">

      {/* Main Floating Container */}
      <div className="relative animate-aura-living">

        {/* Outer Ambient Glow */}
        <div
          className={`absolute ${dims.glowInset} rounded-full bg-gradient-radial ${moodStyle.glow} blur-3xl pointer-events-none`}
          style={{ boxShadow: moodStyle.shadow }}
        />

        {/* Glass Shell */}
        <div
          className={`relative ${dims.shell} rounded-full p-[2px] shadow-2xl`}
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)`,
            transform: `scale(${intensityScale})`,
            transition: 'transform 1.2s ease-in-out'
          }}
        >
          {/* Inner Glass Surface */}
          <div
            className="h-full w-full rounded-full overflow-hidden relative"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${moodStyle.ambientColor}, transparent 60%), 
                           linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.7) 100%)`,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >

            {/* Light Sweep Effect */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
                animation: 'lightSweep 8s ease-in-out infinite'
              }}
            />

            {/* Avatar Image Fallback */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              /* Holographic Character */
              <div className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden">

                {/* Ambient Glow Behind Head */}
                <div
                  className="absolute rounded-full blur-2xl animate-aura-breathe"
                  style={{
                    width: dims.face * 1.3,
                    height: dims.face * 1.3,
                    top: '8%',
                    background: `radial-gradient(circle, ${moodStyle.ambientColor} 0%, transparent 70%)`
                  }}
                />

                {/* Character Layers */}
                <div className="relative z-10 flex flex-col items-center" style={{ marginBottom: '-5%' }}>

                  {/* Hair Back Layer */}
                  <div
                    className="absolute rounded-[50%_50%_45%_45%]"
                    style={{
                      width: dims.face * 1.15,
                      height: dims.face * 0.65,
                      top: dims.face * -0.12,
                      background: `linear-gradient(180deg, ${moodStyle.hairColor} 0%, rgba(51,65,85,0.6) 100%)`,
                      filter: 'blur(0.5px)'
                    }}
                  />

                  {/* Face */}
                  <div
                    className="relative rounded-[48%_48%_44%_44%] overflow-visible"
                    style={{
                      width: dims.face,
                      height: dims.face * 1.1,
                      background: `linear-gradient(180deg, ${moodStyle.skinHighlight} 0%, ${moodStyle.skinBase} 60%, rgba(200,210,230,0.5) 100%)`,
                      boxShadow: `inset 0 ${dims.face * 0.02}px ${dims.face * 0.08}px rgba(255,255,255,0.3), 
                                  inset 0 -${dims.face * 0.05}px ${dims.face * 0.1}px rgba(0,0,0,0.1)`
                    }}
                  >

                    {/* Forehead Highlight */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '50%',
                        height: '20%',
                        top: '8%',
                        left: '25%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                        filter: 'blur(2px)'
                      }}
                    />

                    {/* Hair Fringe */}
                    <div
                      className="absolute"
                      style={{
                        width: '110%',
                        height: '28%',
                        top: '-8%',
                        left: '-5%',
                        background: `linear-gradient(180deg, ${moodStyle.hairColor} 0%, ${moodStyle.hairColor} 60%, transparent 100%)`,
                        borderRadius: '50% 50% 40% 40%',
                        clipPath: 'ellipse(55% 100% at 50% 0%)'
                      }}
                    />

                    {/* Side Hair Left */}
                    <div
                      className="absolute"
                      style={{
                        width: '25%',
                        height: '55%',
                        top: '5%',
                        left: '-8%',
                        background: `linear-gradient(90deg, transparent 0%, ${moodStyle.hairColor} 40%, ${moodStyle.hairColor} 100%)`,
                        borderRadius: '40% 20% 30% 50%',
                        filter: 'blur(0.3px)'
                      }}
                    />

                    {/* Side Hair Right */}
                    <div
                      className="absolute"
                      style={{
                        width: '25%',
                        height: '55%',
                        top: '5%',
                        right: '-8%',
                        background: `linear-gradient(-90deg, transparent 0%, ${moodStyle.hairColor} 40%, ${moodStyle.hairColor} 100%)`,
                        borderRadius: '20% 40% 50% 30%',
                        filter: 'blur(0.3px)'
                      }}
                    />

                    {/* Eyes Container */}
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        top: '38%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        gap: dims.eyeGap
                      }}
                    >
                      {/* Left Eye */}
                      <div className="relative" style={{ width: dims.eyeWidth, height: dims.eyeHeight }}>
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'linear-gradient(180deg, rgba(51,65,85,0.9) 0%, rgba(30,41,59,0.95) 100%)',
                            boxShadow: 'inset 0 0.5px 1px rgba(255,255,255,0.3)'
                          }}
                        />
                        {/* Eyelid */}
                        <div
                          className="absolute inset-0 rounded-full animate-aura-blink"
                          style={{
                            background: `linear-gradient(180deg, ${moodStyle.skinHighlight} 0%, ${moodStyle.skinBase} 100%)`
                          }}
                        />
                      </div>

                      {/* Right Eye */}
                      <div className="relative" style={{ width: dims.eyeWidth, height: dims.eyeHeight }}>
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'linear-gradient(180deg, rgba(51,65,85,0.9) 0%, rgba(30,41,59,0.95) 100%)',
                            boxShadow: 'inset 0 0.5px 1px rgba(255,255,255,0.3)'
                          }}
                        />
                        {/* Eyelid */}
                        <div
                          className="absolute inset-0 rounded-full animate-aura-blink"
                          style={{
                            background: `linear-gradient(180deg, ${moodStyle.skinHighlight} 0%, ${moodStyle.skinBase} 100%)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Nose */}
                    <div
                      className="absolute"
                      style={{
                        width: dims.noseWidth,
                        height: dims.face * 0.12,
                        top: '52%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(180deg, transparent 0%, rgba(180,190,210,0.15) 60%, rgba(180,190,210,0.25) 100%)',
                        borderRadius: '40%'
                      }}
                    />

                    {/* Lips */}
                    <div
                      className="absolute"
                      style={{
                        width: dims.lipWidth,
                        height: dims.face * 0.04,
                        top: '70%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: `linear-gradient(90deg, transparent 0%, ${moodStyle.lipColor} 30%, ${moodStyle.lipColor} 70%, transparent 100%)`,
                        borderRadius: '50%'
                      }}
                    />

                    {/* Cheek Blush Left */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: dims.face * 0.18,
                        height: dims.face * 0.1,
                        top: '55%',
                        left: '12%',
                        background: moodStyle.cheekColor,
                        filter: 'blur(3px)'
                      }}
                    />

                    {/* Cheek Blush Right */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: dims.face * 0.18,
                        height: dims.face * 0.1,
                        top: '55%',
                        right: '12%',
                        background: moodStyle.cheekColor,
                        filter: 'blur(3px)'
                      }}
                    />

                    {/* Jawline Shadow */}
                    <div
                      className="absolute"
                      style={{
                        width: '100%',
                        height: '25%',
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 100%)',
                        borderRadius: '0 0 44% 44%'
                      }}
                    />
                  </div>

                  {/* Neck */}
                  <div
                    style={{
                      width: dims.face * 0.28,
                      height: dims.face * 0.15,
                      marginTop: -2,
                      background: `linear-gradient(180deg, ${moodStyle.skinBase} 0%, rgba(200,210,230,0.4) 100%)`,
                      borderRadius: '0 0 40% 40%'
                    }}
                  />

                  {/* Shoulders */}
                  <div
                    style={{
                      width: dims.shoulderWidth,
                      height: dims.face * 0.35,
                      marginTop: -4,
                      background: `linear-gradient(180deg, rgba(100,116,139,0.6) 0%, rgba(71,85,105,0.5) 50%, rgba(51,65,85,0.3) 100%)`,
                      borderRadius: '50% 50% 0 0',
                      boxShadow: 'inset 0 5px 15px rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Collar Detail */}
                    <div
                      className="absolute"
                      style={{
                        width: '35%',
                        height: '40%',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(180deg, rgba(200,210,230,0.3) 0%, transparent 100%)',
                        borderRadius: '0 0 50% 50%'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Glass Specular Highlight */}
            <div
              className="absolute top-0 left-0 w-full h-1/3 rounded-t-full pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)'
              }}
            />

            {/* Bottom Glass Shadow */}
            <div
              className="absolute bottom-0 left-0 w-full h-1/4 rounded-b-full pointer-events-none"
              style={{
                background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)'
              }}
            />

            {/* Inner Rim Glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px 3px ${moodStyle.ambientColor}`
              }}
            />
          </div>
        </div>
      </div>

      {/* Floor Shadow */}
      <div
        className="rounded-full blur-xl -mt-2"
        style={{
          width: dims.container * 0.35,
          height: dims.container * 0.06,
          background: 'rgba(0,0,0,0.35)'
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
          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${moodStyle.gradient} animate-pulse`} />
          <span className="uppercase tracking-[0.2em]">
            {auraState.mood} · {Math.round(auraState.moodIntensity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AuraAvatar;

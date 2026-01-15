import React, { useState } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 32, 
  className = "",
  showText = false 
}) => {
  const [imageError, setImageError] = useState(false);

  // Inline SVG fallback - gradient circle with sparkle
  const FallbackLogo = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
    >
      <defs>
        <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FFD93D" />
        </linearGradient>
      </defs>
      
      {/* Main circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#auraGradient)"
      />
      
      {/* Inner glow */}
      <circle 
        cx="50" 
        cy="50" 
        r="35" 
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* Sparkle/star shape */}
      <path
        d="M50 25 L53 40 L68 43 L55 50 L60 65 L50 55 L40 65 L45 50 L32 43 L47 40 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );

  if (imageError) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <FallbackLogo />
        {showText && (
          <span className="font-extrabold text-xl text-text-main tracking-tight">
            Aura
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/icon-1.svg"
        alt="Aura"
        width={size} 
        height={size} 
        className="object-contain"
        onError={() => setImageError(true)}
      />
      {showText && (
        <span className="font-extrabold text-xl text-text-main tracking-tight">
          Aura
        </span>
      )}
    </div>
  );
};

// Alternative: Pure SVG Logo Component (no external file needed)
export const AuraIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 32, 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
  >
    <defs>
      <linearGradient id="auraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#FF8E53" />
        <stop offset="100%" stopColor="#FFD93D" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Outer ring */}
    <circle 
      cx="50" 
      cy="50" 
      r="46" 
      fill="none"
      stroke="url(#auraGrad)"
      strokeWidth="3"
      opacity="0.3"
    />
    
    {/* Main circle */}
    <circle 
      cx="50" 
      cy="50" 
      r="40" 
      fill="url(#auraGrad)"
      filter="url(#glow)"
    />
    
    {/* Sparkle */}
    <g fill="white" opacity="0.95">
      {/* Main star */}
      <path d="M50 28 L52 42 L66 44 L54 50 L58 64 L50 54 L42 64 L46 50 L34 44 L48 42 Z" />
      
      {/* Small sparkles */}
      <circle cx="35" cy="35" r="2" opacity="0.6" />
      <circle cx="65" cy="38" r="1.5" opacity="0.5" />
      <circle cx="62" cy="62" r="1" opacity="0.4" />
    </g>
  </svg>
);
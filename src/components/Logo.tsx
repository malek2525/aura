
import React from 'react';

export const Logo = ({ size = 32, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="aura_gradient" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF6B6B" /> {/* Coral Red */}
          <stop offset="1" stopColor="#FFA502" /> {/* Warm Gold */}
        </linearGradient>
        <filter id="glow_filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="20" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Aura */}
      <path 
        d="M256 32C190 140 64 240 64 352C64 458 150 544 256 544C362 544 448 458 448 352C448 240 322 140 256 32Z" 
        fill="url(#aura_gradient)" 
        opacity="0.2"
        transform="scale(0.9) translate(28, 0)"
      />
      
      {/* Main Flame Soul */}
      <path 
        d="M256 64C200 160 96 240 96 336C96 424.366 167.634 496 256 496C344.366 496 416 424.366 416 336C416 240 312 160 256 64Z" 
        fill="url(#aura_gradient)" 
      />
      
      {/* Inner Light */}
      <path 
        d="M256 160C220 220 160 280 160 336C160 389 203 432 256 432C309 432 352 389 352 336C352 280 292 220 256 160Z" 
        fill="white" 
        fillOpacity="0.2"
      />
    </svg>
  );
};

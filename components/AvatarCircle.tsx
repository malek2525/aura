import React, { useState } from 'react';

interface AvatarCircleProps {
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  fallbackColor?: 'slate' | 'warm';
  alt?: string;
}

const AvatarCircle: React.FC<AvatarCircleProps> = ({ 
  imageUrl, 
  size = 'md', 
  fallbackColor = 'slate',
  alt = 'Avatar'
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const fallbackGradient = fallbackColor === 'warm' 
    ? 'bg-gradient-to-br from-amber-600/50 via-orange-500/40 to-rose-600/50'
    : 'bg-gradient-to-br from-slate-300 via-slate-100 to-slate-300';

  const showImage = imageUrl?.trim() && !imageError;

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full bg-slate-950/80 border border-white/15 overflow-hidden flex items-center justify-center shadow-lg flex-shrink-0`}>
      {showImage ? (
        <img 
          src={imageUrl} 
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`h-full w-full rounded-full ${fallbackGradient} shadow-inner`} />
      )}
    </div>
  );
};

export default AvatarCircle;

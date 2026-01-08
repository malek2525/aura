import React from 'react';
import { Icons } from './Icons';
import { UserProfile } from '../types';

interface MatchOverlayProps {
  matchedProfile: UserProfile;
  myPhoto?: string;
  onClose: () => void;
  onChat: () => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({ 
  matchedProfile, 
  myPhoto = 'https://picsum.photos/200/200?random=100',
  onClose, 
  onChat 
}) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-6 animate-fade-in">
      
      {/* Title */}
      <div className="text-center mb-8 relative">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-coral to-gold italic tracking-tighter animate-bounce">
          IT'S A<br/>MATCH!
        </h1>
        <div className="absolute -inset-10 bg-coral/20 blur-3xl -z-10 rounded-full" />
      </div>

      {/* Photos */}
      <div className="flex items-center justify-center gap-4 mb-12 relative">
        {/* My Photo */}
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden -rotate-6 animate-slide-in">
          <img 
            src={myPhoto} 
            className="w-full h-full object-cover" 
            alt="Me" 
          />
        </div>
        
        {/* Heart Icon */}
        <div className="absolute z-10 bg-white rounded-full p-2 shadow-lg">
          <Icons.Heart className="text-coral fill-coral" size={24} />
        </div>

        {/* Their Photo */}
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden rotate-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <img 
            src={matchedProfile.photos[0]} 
            className="w-full h-full object-cover" 
            alt={matchedProfile.name} 
          />
        </div>
      </div>

      {/* Message */}
      <div className="text-white text-center mb-8 space-y-2">
        <p className="font-medium text-lg">You and {matchedProfile.name} vibed!</p>
        <p className="text-white/60 text-sm">Your Auras think this has potential.</p>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3 max-w-xs">
        <button 
          onClick={onChat}
          className="w-full py-4 bg-coral text-white font-bold rounded-full shadow-lg shadow-coral/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
          <Icons.MessageCircle size={20} />
          Say Hello
        </button>
        
        <button 
          onClick={onClose}
          className="w-full py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
        >
          Keep Swiping
        </button>
      </div>
    </div>
  );
};

export default MatchOverlay;

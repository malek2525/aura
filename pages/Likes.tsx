import React from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';

interface LikesProps {
    onProfileClick: (profile: UserProfile) => void;
}

export const Likes: React.FC<LikesProps> = ({ onProfileClick }) => {
  return (
    <div className="h-full bg-bg-light flex flex-col pt-4 pb-24 px-4 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Likes</h1>
          <p className="text-xs text-text-sec font-medium">People who vibed with you</p>
        </div>
        <button className="text-text-sec hover:bg-white p-2 rounded-full transition-colors">
          <Icons.SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl shadow-black/10 group cursor-pointer">
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div>
              <div className="flex items-center gap-2 mb-1">
                 <Icons.Crown size={18} className="text-gold fill-gold animate-pulse-slow" />
                 <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Aura Gold</span>
              </div>
              <h3 className="text-white font-extrabold text-xl leading-tight">See who likes you</h3>
              <p className="text-white/60 text-xs font-medium">Unlock all your admirers waiting for you.</p>
          </div>
          <button className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg">
            Unlock Now
          </button>
        </div>
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-gold/30 to-coral/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 blur-2xl rounded-full translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* Matches Section - Empty State */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-1">Your Matches</h2>
        <div className="text-center py-8 bg-white rounded-2xl border border-warm-gray">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icons.Heart size={24} className="text-primary" />
          </div>
          <p className="text-sm font-semibold text-text-main mb-1">No matches yet</p>
          <p className="text-xs text-text-muted px-4">Keep swiping to find your perfect match!</p>
        </div>
      </div>

      {/* Likes Info - Hidden until upgrade */}
      <div className="flex-1">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-1">People Who Like You</h2>
        
        <div className="bg-white rounded-3xl p-8 text-center border border-warm-gray">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Lock size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">Your Admirers Are Hidden</h3>
          <p className="text-sm text-text-sec mb-6">
            Upgrade to Aura Gold to see who's interested in you and match instantly.
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors">
            Upgrade to See Likes
          </button>
        </div>
      </div>
    </div>
  );
};

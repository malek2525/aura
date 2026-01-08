import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';
import { TEST_PROFILES } from '../data/testProfiles';

interface DiscoverProps {
  onOpenFilters: () => void;
  onViewProfile: (profile: UserProfile) => void;
  onViewStory: (profile: UserProfile) => void;
  onStartAuraChat: (profile: UserProfile) => void;
  onLike: (profile: UserProfile) => void;
  onPass: () => void;
  userPhoto?: string;
}

export const Discover: React.FC<DiscoverProps> = ({ 
  onOpenFilters, 
  onViewProfile, 
  onViewStory, 
  onStartAuraChat,
  onLike,
  onPass,
  userPhoto 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'stack' | 'picks'>('stack');
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  
  // Filter out passed profiles
  const availableProfiles = TEST_PROFILES.filter(p => !passedIds.has(p.id));
  const currentProfile = availableProfiles[currentIndex % Math.max(availableProfiles.length, 1)];

  const handleAction = (action: 'pass' | 'like') => {
    if (!currentProfile) return;
    
    if (action === 'like') {
      onLike(currentProfile);
    } else {
      onPass();
    }
    
    // Move to next profile
    if (action === 'pass') {
      setPassedIds(prev => new Set([...prev, currentProfile.id]));
    }
    setCurrentIndex(prev => prev + 1);
  };

  // No more profiles
  if (!currentProfile || availableProfiles.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center">
        <div className="w-20 h-20 bg-coral-light rounded-full flex items-center justify-center mb-4">
          <Icons.Heart size={40} className="text-coral" />
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">No more profiles</h2>
        <p className="text-text-sec text-sm mb-6">Check back later or adjust your preferences</p>
        <button 
          onClick={onOpenFilters}
          className="px-6 py-3 bg-coral text-white rounded-full font-semibold"
        >
          Update Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="pt-4 pb-2 px-4 flex items-center justify-between bg-white z-30">
        <h1 className="text-2xl font-bold text-coral flex items-center gap-1">
          <Icons.Sparkles size={20} className="fill-coral" /> Aura
        </h1>
        
        {/* Toggle Switch */}
        <div className="flex bg-warm-gray/50 p-1 rounded-full">
          <button 
            onClick={() => setMode('stack')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'stack' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec'
            }`}
          >
            Discover
          </button>
          <button 
            onClick={() => setMode('picks')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'picks' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec'
            }`}
          >
            Today's Picks
          </button>
        </div>

        <button 
          onClick={onOpenFilters}
          className="p-2 bg-warm-white rounded-full text-text-main hover:bg-warm-gray transition-colors border border-warm-gray"
        >
          <Icons.SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {mode === 'picks' ? (
          /* Today's Picks Mode */
          <div className="p-4 pb-24 space-y-6 animate-slide-in">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-text-main">Curated for you</h2>
              <p className="text-sm text-text-sec">Based on your shared interests</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {availableProfiles.map((profile) => (
                <div 
                  key={profile.id} 
                  onClick={() => onViewProfile(profile)}
                  className="aspect-[3/4] rounded-2xl relative overflow-hidden shadow-md cursor-pointer group"
                >
                  <img 
                    src={profile.photos[0]} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={profile.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full">
                    <Icons.Heart className="text-white w-4 h-4" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-1 mb-1 bg-gold/90 text-black px-2 py-0.5 rounded-md w-fit">
                      <Icons.Sparkles size={10} />
                      <span className="text-[10px] font-bold uppercase">{profile.vibeTags[0]}</span>
                    </div>
                    <h3 className="font-bold text-lg">{profile.name}, {profile.age}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Stack/Swipe Mode */
          <div className="animate-slide-in">
            {/* Stories Rail */}
            <div className="px-4 mb-4">
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {/* Add Story (User) */}
                <div className="flex flex-col items-center gap-1 min-w-[70px]">
                  <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-text-muted flex items-center justify-center relative cursor-pointer hover:bg-warm-white overflow-hidden">
                    {userPhoto ? (
                      <img src={userPhoto} className="w-full h-full object-cover" alt="You" />
                    ) : (
                      <Icons.Plus className="text-coral" size={24} />
                    )}
                  </div>
                  <span className="text-xs font-medium text-text-sec">You</span>
                </div>

                {/* User Stories */}
                {TEST_PROFILES.filter(p => p.stories && p.stories.length > 0).map((p) => (
                  <div 
                    key={p.id} 
                    className="flex flex-col items-center gap-1 min-w-[70px] cursor-pointer" 
                    onClick={() => onViewStory(p)}
                  >
                    <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${p.stories[0]?.isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-coral to-gold'} hover:scale-105 transition-transform`}>
                      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                        <img src={p.photos[0]} className="w-full h-full object-cover" alt={p.name} />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-text-main">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Card */}
            <div className="px-4 pb-24">
              <div 
                onClick={() => onViewProfile(currentProfile)}
                className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-warm-gray cursor-pointer group"
              >
                <img 
                  src={currentProfile.photos[0]} 
                  alt={currentProfile.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-bold text-white">New here</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  {currentProfile.verificationTier !== 'Bronze' && (
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Icons.Star size={12} className="text-gold fill-gold" />
                      <span className="text-xs font-bold text-text-main">{currentProfile.verificationTier}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                  
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <h2 className="text-3xl font-bold flex items-center gap-2">
                        {currentProfile.name}, {currentProfile.age} 
                        {currentProfile.verified && <Icons.ShieldCheck className="text-success fill-success/20" size={24} />}
                      </h2>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Icons.MapPin size={14} />
                        <span>{currentProfile.location} • {currentProfile.distance}km</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewProfile(currentProfile); }} 
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-md"
                    >
                      <Icons.ChevronRight className="text-white" />
                    </button>
                  </div>

                  {/* Aura Read */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl mb-3">
                    <div className="flex items-center gap-1.5 mb-1 text-gold">
                      <Icons.Sparkles size={12} className="fill-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Aura says</span>
                    </div>
                    <p className="text-sm text-white/90 leading-snug line-clamp-2 italic">
                      "{currentProfile.auraRead}"
                    </p>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.slice(0, 3).map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-medium border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-6 mt-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAction('pass'); }}
                  className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-text-muted border border-warm-gray hover:text-coral hover:border-coral transition-all hover:scale-105 active:scale-95"
                >
                  <Icons.X size={32} strokeWidth={2.5} />
                </button>
                
                {/* Aura Chat Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onStartAuraChat(currentProfile); }}
                  className="h-12 px-6 rounded-full bg-gradient-to-r from-coral-light to-white shadow-lg border border-coral/20 flex items-center gap-2 text-coral font-bold text-sm hover:scale-105 transition-transform active:scale-95"
                >
                  <Icons.Sparkles size={18} className="animate-pulse" />
                  Let Auras Chat
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleAction('like'); }}
                  className="w-16 h-16 rounded-full bg-coral shadow-xl shadow-coral/30 flex items-center justify-center text-white hover:scale-105 transition-transform hover:bg-coral-dark active:scale-95"
                >
                  <Icons.Heart size={32} fill="currentColor" strokeWidth={0} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;

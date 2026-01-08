
import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';
import { fetchDiscoverProfiles, likeProfile, PublicProfileSummary } from '../services/matchService';

interface DiscoverProps {
  onOpenFilters: () => void;
  onViewProfile: (profile: UserProfile) => void;
  onViewStory: (profile: UserProfile) => void;
  onStartAuraChat: (profile: UserProfile) => void;
  onLike: () => void;
  onPass: () => void;
}

export const Discover: React.FC<DiscoverProps> = ({ 
  onOpenFilters, 
  onViewProfile, 
  onViewStory, 
  onStartAuraChat,
  onLike,
  onPass 
}) => {
  const [profiles, setProfiles] = useState<PublicProfileSummary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
       const data = await fetchDiscoverProfiles("me");
       setProfiles(data);
       setLoading(false);
    };
    load();
  }, []);

  const currentProfileData = profiles[currentIndex % profiles.length];
  // Cast AuraProfile to UserProfile for UI compatibility
  const currentProfile = currentProfileData?.auraProfile as UserProfile;

  const handleAction = async (action: 'pass' | 'like') => {
    if (!currentProfile) return;
    
    if (action === 'like') {
      await likeProfile("me", currentProfile.id);
      onLike();
    } else {
      onPass();
    }
    
    // Simple loop for demo
    setCurrentIndex(prev => (prev + 1) % profiles.length);
  };

  if (loading || !currentProfile) {
    return (
      <div className="h-full flex items-center justify-center bg-warm-white">
         <Icons.Loader2 className="animate-spin text-coral" size={32} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-warm-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="pt-6 pb-2 px-6 flex items-center justify-between z-30">
        <div className="flex flex-col">
           <h1 className="text-2xl font-extrabold text-text-main">Discover</h1>
           <p className="text-xs text-text-sec font-medium flex items-center gap-1">
             <Icons.MapPin size={10} /> {currentProfile.location || "Nearby"}
           </p>
        </div>
        <button 
          onClick={onOpenFilters}
          className="p-3 bg-white rounded-2xl text-text-main hover:text-coral shadow-sm border border-warm-gray transition-colors"
        >
          <Icons.SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Main Discover Stack */}
      <div className="flex-1 px-4 pb-28 flex flex-col relative">
          <div className="flex-1 relative mt-4">
            
            {/* Background Card */}
            <div className="absolute inset-x-4 top-4 bottom-0 bg-white rounded-[32px] border border-warm-gray shadow-sm transform scale-95 translate-y-2 opacity-60 z-0"></div>

            {/* Active Card */}
            <div 
              onClick={() => onViewProfile(currentProfile)}
              className="absolute inset-0 bg-white rounded-[36px] overflow-hidden shadow-float border border-warm-gray cursor-pointer z-10 group"
            >
              {/* Main Photo */}
              <img 
                src={currentProfile.photos[0]} 
                alt={currentProfile.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

              {/* Compatibility Badge (Dynamic Logic in real app) */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                 <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                    <div className="w-2 h-2 bg-sage rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                        {currentProfile.verificationScore > 70 ? 'High Compatibility' : 'New Match'}
                    </span>
                 </div>
              </div>

              {/* Bottom Elements */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                 <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-1 shadow-black/10 drop-shadow-lg">
                          {currentProfile.name}, {currentProfile.age} 
                        </h2>
                        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                          <Icons.Briefcase size={14} className="text-coral" />
                          <span>{currentProfile.job}</span>
                        </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onViewProfile(currentProfile); }} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-colors border border-white/30">
                      <Icons.ChevronRight className="text-white" size={20} />
                    </button>
                 </div>

                 {/* Aura Read Pill */}
                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl mb-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icons.Sparkles size={14} className="text-gold" />
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Aura Insight</span>
                    </div>
                    <p className="text-sm text-white/95 leading-relaxed font-medium line-clamp-2">
                      "{currentProfile.summary || currentProfile.bio}"
                    </p>
                 </div>

                 {/* Tags */}
                 <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="h-24 flex items-center justify-center gap-6 mt-4 z-20">
             <button 
               onClick={(e) => { e.stopPropagation(); handleAction('pass'); }}
               className="w-16 h-16 rounded-full bg-warm-white border border-warm-gray text-text-muted flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-400 transition-all active:scale-95 shadow-sm"
             >
               <Icons.X size={28} strokeWidth={2.5} />
             </button>
             
             {/* Center Primary Action - Aura Chat */}
             <button 
                onClick={(e) => { e.stopPropagation(); onStartAuraChat(currentProfile); }}
                className="h-14 px-8 bg-text-main rounded-full flex items-center gap-2 text-white font-bold shadow-lg shadow-black/10 hover:bg-black transition-all active:scale-95 border border-white/10"
             >
                <Icons.Sparkles size={18} className="text-coral" />
                <span className="text-sm">Aura Chat</span>
             </button>

             <button 
               onClick={(e) => { e.stopPropagation(); handleAction('like'); }}
               className="w-16 h-16 rounded-full bg-coral text-white flex items-center justify-center shadow-lg shadow-coral/30 hover:bg-coral-dark transition-all active:scale-95 border-4 border-coral-light"
             >
               <Icons.Heart size={28} fill="currentColor" />
             </button>
          </div>

      </div>
    </div>
  );
};

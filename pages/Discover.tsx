import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile, PublicProfileSummary } from '../types';
import { fetchDiscoverProfiles, fetchDailyPicks, likeProfile } from '../services/matchService';

interface DiscoverProps {
  onOpenFilters: () => void;
  onViewProfile: (profile: UserProfile) => void;
  onViewStory: (profile: UserProfile) => void;
  onStartAuraChat: (profile: UserProfile) => void;
  onLike: () => void;
  onPass: () => void;
}

type DiscoverMode = 'stack' | 'picks';

export const Discover: React.FC<DiscoverProps> = ({ 
  onOpenFilters, 
  onViewProfile, 
  onViewStory, 
  onStartAuraChat,
  onLike,
  onPass 
}) => {
  const [mode, setMode] = useState<DiscoverMode>('stack');
  const [profiles, setProfiles] = useState<PublicProfileSummary[]>([]);
  const [dailyPicks, setDailyPicks] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Swipe State
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const swipeThreshold = 120; // Increased from 100 for less sensitivity
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  
  // Direction Locking State
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const directionLockedRef = useRef<'horizontal' | 'vertical' | null>(null);
  const DIRECTION_LOCK_THRESHOLD = 10; // Pixels before we decide direction
  
  // Aura Match Loading
  const [isAuraMatching, setIsAuraMatching] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
       const [discoverData, picksData] = await Promise.all([
           fetchDiscoverProfiles("me"),
           fetchDailyPicks("me")
       ]);
       setProfiles(discoverData);
       setDailyPicks(picksData);
       setLoading(false);
    };
    load();
  }, []);

  // Reset scroll and swipe on profile change
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
      }
      setSwipeOffset(0);
      setIsAnimating(false);
      setIsAuraMatching(false);
  }, [currentIndex]);

  const currentProfileData = profiles[currentIndex % profiles.length];
  const currentProfile = currentProfileData?.auraProfile as UserProfile;

  const handleAction = async (action: 'pass' | 'like', isAura = false) => {
    if (!currentProfile) return;
    
    setIsAnimating(true);
    setSwipeOffset(action === 'like' ? screenWidth : -screenWidth);
    
    setTimeout(async () => {
        const nextIndex = (currentIndex + 1) % profiles.length;
        setCurrentIndex(nextIndex);
        setSwipeOffset(0);
        setIsAnimating(false);

        if (isAura) {
             onLike(); 
        } else {
            if (action === 'like') {
              await likeProfile("me", currentProfile.id);
              onLike();
            } else {
              onPass();
            }
        }
    }, 300);
  };

  const handleAuraMatchClick = async () => {
      if (isAuraMatching) return;
      setIsAuraMatching(true);
      
      await onStartAuraChat(currentProfile);
      
      setTimeout(() => {
          handleAction('like', true);
      }, 500);
  };

  // === IMPROVED TOUCH HANDLERS WITH DIRECTION LOCKING ===
  
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    directionLockedRef.current = null; // Reset direction lock
    setIsAnimating(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.targetTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine direction if not yet locked
    if (!directionLockedRef.current) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      // Only lock direction after moving beyond threshold
      if (absX > DIRECTION_LOCK_THRESHOLD || absY > DIRECTION_LOCK_THRESHOLD) {
        if (absY > absX) {
          // User is scrolling vertically - allow scroll, no swipe
          directionLockedRef.current = 'vertical';
        } else {
          // User is swiping horizontally - enable swipe, prevent scroll
          directionLockedRef.current = 'horizontal';
        }
      }
    }
    
    // Only update swipe offset if locked to horizontal
    if (directionLockedRef.current === 'horizontal') {
      e.preventDefault(); // Prevent vertical scroll while swiping
      setSwipeOffset(deltaX);
    }
    // If vertical, do nothing - let natural scroll happen
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current) return;
    
    // Only trigger action if we were swiping horizontally
    if (directionLockedRef.current === 'horizontal') {
      if (swipeOffset > swipeThreshold) {
        handleAction('like');
      } else if (swipeOffset < -swipeThreshold) {
        handleAction('pass');
      } else {
        // Snap back
        setIsAnimating(true);
        setSwipeOffset(0);
      }
    }
    
    // Reset
    touchStartRef.current = null;
    directionLockedRef.current = null;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-warm-white">
         <Icons.Loader2 className="animate-spin text-coral" size={32} />
      </div>
    );
  }

  // Calculate rotation and opacity for overlays
  const rotation = (swipeOffset / screenWidth) * 15; // Reduced rotation
  const likeOpacity = Math.max(0, Math.min(1, swipeOffset / (swipeThreshold * 1.5)));
  const nopeOpacity = Math.max(0, Math.min(1, -swipeOffset / (swipeThreshold * 1.5)));

  return (
    <div className="h-full flex flex-col bg-warm-white relative overflow-hidden">
      
      {/* Top Toggle & Filters */}
      <div className="absolute top-0 left-0 right-0 pt-6 pb-4 px-6 flex items-center justify-between z-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        
        {/* Toggle Switch */}
        <div className="flex bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10 pointer-events-auto">
            <button 
                onClick={() => setMode('stack')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'stack' ? 'bg-white text-black shadow-sm' : 'text-white/80 hover:text-white'}`}
            >
                Discover
            </button>
            <button 
                onClick={() => setMode('picks')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${mode === 'picks' ? 'bg-white text-black shadow-sm' : 'text-white/80 hover:text-white'}`}
            >
                Daily Picks
                <span className="w-1.5 h-1.5 bg-coral rounded-full"></span>
            </button>
        </div>

        {/* Filters Button */}
        <button 
            onClick={onOpenFilters}
            className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white/90 hover:bg-black/40 transition-colors border border-white/10 pointer-events-auto"
        >
            <Icons.SlidersHorizontal size={18} />
        </button>
      </div>

      {/* MODE: STACK */}
      {mode === 'stack' && (
          currentProfile ? (
            <div 
              className="h-full w-full relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Card */}
              <div 
                className={`absolute inset-0 ${isAnimating ? 'transition-transform duration-300 ease-out' : ''}`}
                style={{ 
                  transform: `translateX(${swipeOffset}px) rotate(${rotation}deg)`,
                  transformOrigin: 'bottom center'
                }}
              >
                {/* LIKE Overlay */}
                <div 
                  className="absolute top-20 left-6 z-30 pointer-events-none"
                  style={{ opacity: likeOpacity }}
                >
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-black text-2xl tracking-wider border-4 border-green-400 rotate-[-15deg]">
                    LIKE
                  </div>
                </div>

                {/* NOPE Overlay */}
                <div 
                  className="absolute top-20 right-6 z-30 pointer-events-none"
                  style={{ opacity: nopeOpacity }}
                >
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-black text-2xl tracking-wider border-4 border-red-400 rotate-[15deg]">
                    NOPE
                  </div>
                </div>

                {/* Scrollable Content */}
                <div 
                  ref={scrollRef}
                  className="h-full w-full overflow-y-auto no-scrollbar overscroll-contain"
                  style={{ 
                    // Disable scroll when swiping horizontally
                    touchAction: directionLockedRef.current === 'horizontal' ? 'none' : 'pan-y'
                  }}
                >
                    {/* Hero Image */}
                    <div className="relative h-[85vh] min-h-[600px]">
                        <img 
                          src={currentProfile.photos[0]} 
                          className="w-full h-full object-cover" 
                          alt={currentProfile.name}
                          draggable={false}
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        
                        {/* Profile Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-black">{currentProfile.name}</h1>
                                <span className="text-2xl font-light">{currentProfile.age}</span>
                                {currentProfile.verified && (
                                    <Icons.ShieldCheck size={24} className="text-sage" />
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                                <Icons.Briefcase size={14} />
                                <span>{currentProfile.job}</span>
                                <span className="mx-1">•</span>
                                <Icons.MapPin size={14} />
                                <span>{currentProfile.location}</span>
                            </div>
                            
                            {/* Vibe Tags */}
                            {currentProfile.vibeTags && currentProfile.vibeTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {currentProfile.vibeTags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Details Section */}
                    <div className="bg-warm-white p-6 space-y-6 pb-40">
                        
                        {/* Aura Insight */}
                        {currentProfile.auraRead && (
                            <div className="bg-white p-5 rounded-3xl border border-warm-gray shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-2 text-coral">
                                    <Icons.Sparkles size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Aura Insight</span>
                                </div>
                                <p className="text-text-main font-medium italic text-lg leading-relaxed">"{currentProfile.auraRead}"</p>
                            </div>
                        )}

                        {/* Bio */}
                        {currentProfile.bio && (
                            <div>
                                <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-2 ml-1">About Me</h3>
                                <p className="text-text-main text-lg leading-relaxed">{currentProfile.bio}</p>
                            </div>
                        )}

                        {/* Essentials */}
                        <div>
                             <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">The Basics</h3>
                             <div className="grid grid-cols-2 gap-3">
                                 {currentProfile.details && Object.entries(currentProfile.details).map(([key, val], i) => (
                                     val && Array.isArray(val) ? 
                                       val.length > 0 && <div key={i} className="bg-white p-3 rounded-2xl border border-warm-gray"><span className="text-[10px] text-text-muted uppercase block">{key}</span><span className="text-sm font-bold text-text-main">{val.join(', ')}</span></div> :
                                       val && <div key={i} className="bg-white p-3 rounded-2xl border border-warm-gray"><span className="text-[10px] text-text-muted uppercase block">{key}</span><span className="text-sm font-bold text-text-main">{val}</span></div>
                                 ))}
                             </div>
                        </div>

                        {/* Photo 2 */}
                        {currentProfile.photos[1] && (
                            <div className="rounded-3xl overflow-hidden shadow-sm aspect-[4/5] relative">
                                <img src={currentProfile.photos[1]} className="w-full h-full object-cover" draggable={false} />
                            </div>
                        )}

                        {/* Prompts */}
                        {currentProfile.prompts?.map((prompt, i) => (
                            <div key={i} className="bg-coral-light/10 p-6 rounded-[24px] border border-coral/10">
                                <p className="text-xs font-bold text-coral uppercase mb-2">{prompt.question}</p>
                                <p className="text-xl font-bold text-text-main">"{prompt.answer}"</p>
                            </div>
                        ))}

                        {/* Photo 3 */}
                        {currentProfile.photos[2] && (
                            <div className="rounded-3xl overflow-hidden shadow-sm aspect-square relative">
                                <img src={currentProfile.photos[2]} className="w-full h-full object-cover" draggable={false} />
                            </div>
                        )}

                        {/* Interests */}
                        {currentProfile.interests && currentProfile.interests.length > 0 && (
                            <div>
                                <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentProfile.interests.map((tag, i) => (
                                        <span key={i} className="px-4 py-2 bg-white border border-warm-gray rounded-full text-sm text-text-main font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Report Link */}
                        <div className="flex justify-center pt-8 pb-4">
                            <button className="text-text-muted text-xs font-medium hover:text-red-400 transition-colors">
                                Report or Block {currentProfile.name}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
          </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-warm-white p-8 text-center pt-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 animate-in zoom-in">
                  <Icons.Search size={32} />
                </div>
                <h2 className="text-xl font-bold text-text-main">No more profiles</h2>
                <p className="text-text-sec mt-2">Check back later or adjust your filters.</p>
                <button onClick={onOpenFilters} className="mt-6 px-6 py-3 bg-white border border-warm-gray rounded-xl text-sm font-bold shadow-sm hover:border-coral transition-colors">
                    Adjust Filters
                </button>
            </div>
          )
      )}

      {/* Floating Action Buttons */}
      {mode === 'stack' && currentProfile && (
        <div className="fixed bottom-24 left-0 right-0 px-6 flex justify-center items-center gap-6 z-[60] pointer-events-none">
            <button 
                onClick={(e) => { e.stopPropagation(); handleAction('pass'); }}
                className="w-16 h-16 rounded-full bg-white shadow-float border border-warm-gray text-text-muted flex items-center justify-center hover:text-red-500 hover:border-red-200 transition-all active:scale-95 pointer-events-auto"
            >
                <Icons.X size={32} strokeWidth={2.5} />
            </button>
            
            <button 
                onClick={(e) => { e.stopPropagation(); handleAuraMatchClick(); }}
                disabled={isAuraMatching}
                className="h-12 px-5 bg-white shadow-float rounded-full flex items-center gap-2 text-text-main font-bold border border-warm-gray hover:border-coral/50 hover:text-coral transition-all active:scale-95 pointer-events-auto disabled:opacity-80"
            >
                {isAuraMatching ? (
                   <Icons.Loader2 size={18} className="text-coral animate-spin" />
                ) : (
                   <Icons.Sparkles size={18} className="text-coral" />
                )}
                <span className="text-xs">{isAuraMatching ? 'Talking...' : 'Aura Match'}</span>
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); handleAction('like'); }}
                className="w-16 h-16 rounded-full bg-coral text-white flex items-center justify-center shadow-glow hover:bg-coral-dark transition-all active:scale-95 border-4 border-transparent pointer-events-auto"
            >
                <Icons.Heart size={32} fill="currentColor" />
            </button>
        </div>
      )}

      {/* MODE: DAILY PICKS */}
      {mode === 'picks' && (
          <div className="h-full overflow-y-auto pt-24 px-4 pb-32 no-scrollbar">
              <div className="mb-6">
                 <h2 className="text-2xl font-extrabold text-text-main">Daily Picks</h2>
                 <p className="text-sm text-text-sec">Curated just for you based on your Aura.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                    {dailyPicks.map(p => (
                        <div key={p.id} onClick={() => onViewProfile(p)} className="aspect-[3/4] relative rounded-2xl overflow-hidden group shadow-md cursor-pointer border border-warm-gray">
                            <img src={p.photos[0]} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                <Icons.ShieldCheck size={10} className="text-sage" />
                                <span className="text-[9px] font-bold text-white">{p.verificationScore}%</span>
                            </div>

                            <div className="absolute bottom-3 left-3 text-white">
                                <h3 className="font-bold text-sm">{p.name}, {p.age}</h3>
                                <p className="text-[10px] text-white/80">{p.job}</p>
                            </div>
                            <div className="absolute bottom-3 right-3">
                                 <button onClick={(e) => {e.stopPropagation(); onLike();}} className="bg-coral p-1.5 rounded-full text-white shadow-sm">
                                    <Icons.Heart size={14} fill="currentColor" />
                                 </button>
                            </div>
                        </div>
                    ))}
                    <div className="aspect-[3/4] bg-white border-2 border-dashed border-warm-gray rounded-2xl flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 bg-warm-gray rounded-full flex items-center justify-center mb-3 text-text-muted">
                            <Icons.Lock size={20} />
                        </div>
                        <p className="text-sm font-bold text-text-muted">More tomorrow</p>
                    </div>
                </div>
          </div>
      )}

    </div>
  );
};
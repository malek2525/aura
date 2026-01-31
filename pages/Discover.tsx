import React, { useState, useEffect, useRef } from "react";
import { Icons } from "../components/Icons";
import { UserProfile } from "../types";
import {
    fetchDiscoverProfiles,
    fetchDailyPicks,
    likeProfile,
} from "../services/matchService";

interface DiscoverProps {
    onViewProfile: (profile: UserProfile) => void;
    onViewStory: (profile: UserProfile) => void;
    onStartAuraChat: (profile: UserProfile) => void;
    onLike: () => void;
    onPass: () => void;
}

type DiscoverMode = "stack" | "picks";

interface DiscoverProfileData {
    id: string;
    auraProfile: UserProfile;
}

type ProfileDataType = DiscoverProfileData | UserProfile;

export const Discover: React.FC<DiscoverProps> = ({
    onViewProfile,
    onViewStory,
    onStartAuraChat,
    onLike,
    onPass,
}) => {
    const [mode, setMode] = useState<DiscoverMode>("stack");
    const [profiles, setProfiles] = useState<ProfileDataType[]>([]);
    const [dailyPicks, setDailyPicks] = useState<UserProfile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter State
    const [gender, setGender] = useState<'women'|'men'|'everyone'>('women');
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(35);
    const [distance, setDistance] = useState(25);
    const [expandAge, setExpandAge] = useState(true);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const interestsList = ['Gym', 'Art', 'Music', 'Tech', 'Travel', 'Foodie', 'Gaming', 'Outdoors'];

    // Swipe State
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const swipeThreshold = 120;
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 400;

    // Direction Locking State
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const directionLockedRef = useRef<"horizontal" | "vertical" | null>(null);
    const DIRECTION_LOCK_THRESHOLD = 10;

    // Aura Match Loading
    const [isAuraMatching, setIsAuraMatching] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            console.log("[Discover] Loading profiles...");
            const [discoverData, picksData] = await Promise.all([
                fetchDiscoverProfiles("me"),
                fetchDailyPicks("me"),
            ]);
            console.log("[Discover] Loaded profiles:", discoverData.length, "discover,", picksData.length, "picks");
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

    const currentProfileData = profiles[currentIndex];
    const currentProfile = currentProfileData 
        ? ('auraProfile' in currentProfileData 
            ? currentProfileData.auraProfile 
            : currentProfileData) as UserProfile
        : null;
    const hasProfiles = profiles.length > 0 && currentIndex < profiles.length;

    const handleAction = async (action: "pass" | "like", isAura = false) => {
        if (!currentProfile) return;

        setIsAnimating(true);
        setSwipeOffset(action === "like" ? screenWidth : -screenWidth);

        setTimeout(async () => {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSwipeOffset(0);
            setIsAnimating(false);

            if (isAura) {
                onLike();
            } else {
                if (action === "like" && currentProfile) {
                    await likeProfile("me", currentProfile);
                    onLike();
                } else {
                    onPass();
                }
            }
        }, 300);
    };

    const handleAuraMatchClick = async () => {
        if (isAuraMatching || !currentProfile) return;
        setIsAuraMatching(true);

        await onStartAuraChat(currentProfile);

        setTimeout(() => {
            handleAction("like", true);
        }, 500);
    };

    const toggleInterest = (item: string) => {
        if (selectedInterests.includes(item)) {
            setSelectedInterests(selectedInterests.filter(i => i !== item));
        } else {
            setSelectedInterests([...selectedInterests, item]);
        }
    };

    const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val < maxAge) {
            setMinAge(val);
        }
    };

    const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val > minAge) {
            setMaxAge(val);
        }
    };

    const handleApplyFilters = () => {
        setShowFilters(false);
        // Reset to start with new filters
        setCurrentIndex(0);
    };

    // === TOUCH HANDLERS WITH DIRECTION LOCKING ===

    const onTouchStart = (e: React.TouchEvent) => {
        const touch = e.targetTouches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        directionLockedRef.current = null;
        setIsAnimating(false);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;

        const touch = e.targetTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (!directionLockedRef.current) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (
                absX > DIRECTION_LOCK_THRESHOLD ||
                absY > DIRECTION_LOCK_THRESHOLD
            ) {
                if (absY > absX) {
                    directionLockedRef.current = "vertical";
                } else {
                    directionLockedRef.current = "horizontal";
                }
            }
        }

        if (directionLockedRef.current === "horizontal") {
            e.preventDefault();
            setSwipeOffset(deltaX);
        }
    };

    const onTouchEnd = () => {
        if (!touchStartRef.current) return;

        if (directionLockedRef.current === "horizontal") {
            if (swipeOffset > swipeThreshold) {
                handleAction("like");
            } else if (swipeOffset < -swipeThreshold) {
                handleAction("pass");
            } else {
                setIsAnimating(true);
                setSwipeOffset(0);
            }
        }

        touchStartRef.current = null;
        directionLockedRef.current = null;
    };

    if (loading) {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#f8f6f6]">
                <Icons.Loader2 className="animate-spin text-coral" size={32} />
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col bg-[#f8f6f6] overflow-hidden">
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 sticky top-0 z-50 px-4 pt-4 pb-3 bg-warm-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex bg-white rounded-full p-1 shadow-sm border border-warm-gray">
                        <button
                            onClick={() => setMode("stack")}
                            className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${mode === "stack" ? "bg-text-main text-white shadow-md" : "text-text-muted hover:text-text-main"}`}
                        >
                            Discover
                        </button>
                        <button
                            onClick={() => setMode("picks")}
                            className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${mode === "picks" ? "bg-text-main text-white shadow-md" : "text-text-muted hover:text-text-main"}`}
                        >
                            Daily Picks
                            <span className="w-2 h-2 bg-coral rounded-full animate-pulse"></span>
                        </button>
                    </div>
                    <button
                        onClick={() => setShowFilters(true)}
                        className="p-3 bg-white rounded-2xl border border-warm-gray shadow-sm hover:border-coral transition-colors"
                    >
                        <Icons.SlidersHorizontal
                            size={18}
                            className="text-text-main"
                        />
                    </button>
                </div>
            </div>

            {/* MODE: STACK */}
            {mode === "stack" &&
                (hasProfiles && currentProfile ? (
                    <div className="flex-1 overflow-hidden relative">
                        {/* Swipeable Card Container */}
                        <div
                            ref={scrollRef}
                            className="absolute inset-0 overflow-y-auto no-scrollbar"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            style={{
                                transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 30}deg)`,
                                transition: isAnimating
                                    ? "transform 0.3s ease-out"
                                    : "none",
                                transformOrigin: "bottom center",
                            }}
                        >
                            {/* Main Photo Section */}
                            <div className="relative aspect-[3/4] w-full bg-warm-gray">
                                <img
                                    src={currentProfile.photos[0]}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                    alt={currentProfile.name}
                                />

                                {/* Gradient Overlays */}
                                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
                                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>

                                {/* Photo indicators */}
                                <div className="absolute top-4 inset-x-4 flex gap-1">
                                    {currentProfile.photos
                                        .slice(0, 5)
                                        .map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`}
                                            ></div>
                                        ))}
                                </div>

                                {/* Swipe Indicators */}
                                {swipeOffset > 50 && (
                                    <div className="absolute top-20 left-6 border-4 border-green-500 text-green-500 px-4 py-2 rounded-xl rotate-[-20deg] font-black text-2xl opacity-90">
                                        LIKE
                                    </div>
                                )}
                                {swipeOffset < -50 && (
                                    <div className="absolute top-20 right-6 border-4 border-red-500 text-red-500 px-4 py-2 rounded-xl rotate-[20deg] font-black text-2xl opacity-90">
                                        NOPE
                                    </div>
                                )}

                                {/* Bottom Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h1 className="text-3xl font-black">
                                                    {currentProfile.name},{" "}
                                                    {currentProfile.age}
                                                </h1>
                                                {currentProfile.verified && (
                                                    <div className="bg-sage/90 p-1 rounded-full">
                                                        <Icons.ShieldCheck
                                                            size={16}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/90">
                                                <span className="flex items-center gap-1">
                                                    <Icons.Briefcase
                                                        size={14}
                                                    />
                                                    {currentProfile.job}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Icons.MapPin size={14} />
                                                    {currentProfile.distance}km
                                                </span>
                                            </div>
                                        </div>

                                        {/* Story Ring */}
                                        {currentProfile.stories &&
                                            currentProfile.stories.length >
                                                0 && (
                                                <button
                                                    onClick={() =>
                                                        onViewStory(
                                                            currentProfile,
                                                        )
                                                    }
                                                    className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-coral to-gold animate-pulse"
                                                >
                                                    <div className="w-full h-full rounded-full border-2 border-black/30 overflow-hidden">
                                                        <img
                                                            src={
                                                                currentProfile
                                                                    .photos[0]
                                                            }
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </div>
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Details Section */}
                            <div className="bg-warm-white p-6 space-y-6 pb-40">
                                {/* Aura Insight */}
                                {currentProfile.auraRead && (
                                    <div className="bg-white p-5 rounded-3xl border border-warm-gray shadow-sm relative overflow-hidden">
                                        <div className="flex items-center gap-2 mb-2 text-coral">
                                            <Icons.Sparkles size={16} />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Aura Insight
                                            </span>
                                        </div>
                                        <p className="text-text-main font-medium italic text-lg leading-relaxed">
                                            "{currentProfile.auraRead}"
                                        </p>
                                    </div>
                                )}

                                {/* Bio */}
                                {currentProfile.bio && (
                                    <div>
                                        <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-2 ml-1">
                                            About Me
                                        </h3>
                                        <p className="text-text-main text-lg leading-relaxed">
                                            {currentProfile.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Essentials */}
                                <div>
                                    <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">
                                        The Basics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {currentProfile.details &&
                                            Object.entries(
                                                currentProfile.details,
                                            ).map(([key, val], i) =>
                                                val && Array.isArray(val)
                                                    ? val.length > 0 && (
                                                          <div
                                                              key={i}
                                                              className="bg-white p-3 rounded-2xl border border-warm-gray"
                                                          >
                                                              <span className="text-[10px] text-text-muted uppercase block">
                                                                  {key}
                                                              </span>
                                                              <span className="text-sm font-bold text-text-main">
                                                                  {val.join(
                                                                      ", ",
                                                                  )}
                                                              </span>
                                                          </div>
                                                      )
                                                    : val && (
                                                          <div
                                                              key={i}
                                                              className="bg-white p-3 rounded-2xl border border-warm-gray"
                                                          >
                                                              <span className="text-[10px] text-text-muted uppercase block">
                                                                  {key}
                                                              </span>
                                                              <span className="text-sm font-bold text-text-main">
                                                                  {val}
                                                              </span>
                                                          </div>
                                                      ),
                                            )}
                                    </div>
                                </div>

                                {/* Photo 2 */}
                                {currentProfile.photos[1] && (
                                    <div className="rounded-3xl overflow-hidden shadow-sm aspect-[4/5] relative">
                                        <img
                                            src={currentProfile.photos[1]}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                            alt=""
                                        />
                                    </div>
                                )}

                                {/* Prompts */}
                                {currentProfile.prompts?.map((prompt, i) => (
                                    <div
                                        key={i}
                                        className="bg-coral-light/10 p-6 rounded-[24px] border border-coral/10"
                                    >
                                        <p className="text-xs font-bold text-coral uppercase mb-2">
                                            {prompt.question}
                                        </p>
                                        <p className="text-xl font-bold text-text-main">
                                            "{prompt.answer}"
                                        </p>
                                    </div>
                                ))}

                                {/* Photo 3 */}
                                {currentProfile.photos[2] && (
                                    <div className="rounded-3xl overflow-hidden shadow-sm aspect-square relative">
                                        <img
                                            src={currentProfile.photos[2]}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                            alt=""
                                        />
                                    </div>
                                )}

                                {/* Interests */}
                                {currentProfile.interests &&
                                    currentProfile.interests.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">
                                                Interests
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {currentProfile.interests.map(
                                                    (tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-4 py-2 bg-white border border-warm-gray rounded-full text-sm text-text-main font-bold"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ),
                                                )}
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
                ) : (
                    /* Empty State - No more profiles */
                    <div className="flex-1 flex flex-col items-center justify-center bg-warm-white p-8 text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Icons.Users size={40} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-main mb-2">
                            You've seen everyone!
                        </h2>
                        <p className="text-text-sec mb-6 max-w-xs">
                            No more profiles match your current filters. Try expanding your preferences to discover more people.
                        </p>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="px-8 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Icons.SlidersHorizontal size={18} />
                            Edit Filters
                        </button>
                        <button
                            onClick={() => setCurrentIndex(0)}
                            className="mt-4 px-6 py-3 text-primary font-semibold text-sm hover:bg-primary/10 rounded-xl transition-colors"
                        >
                            Start Over
                        </button>
                    </div>
                ))}

            {/* Floating Action Buttons */}
            {mode === "stack" && hasProfiles && currentProfile && (
                <div className="absolute bottom-24 left-0 right-0 px-6 flex justify-center items-center gap-6 z-[60] pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction("pass");
                        }}
                        className="w-16 h-16 rounded-full bg-white shadow-float border border-warm-gray text-text-muted flex items-center justify-center hover:text-red-500 hover:border-red-200 transition-all active:scale-95 pointer-events-auto"
                    >
                        <Icons.X size={32} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAuraMatchClick();
                        }}
                        disabled={isAuraMatching}
                        className="h-12 px-5 bg-white shadow-float rounded-full flex items-center gap-2 text-text-main font-bold border border-warm-gray hover:border-coral/50 hover:text-coral transition-all active:scale-95 pointer-events-auto disabled:opacity-80"
                    >
                        {isAuraMatching ? (
                            <Icons.Loader2
                                size={18}
                                className="text-coral animate-spin"
                            />
                        ) : (
                            <Icons.Sparkles size={18} className="text-coral" />
                        )}
                        <span className="text-xs">
                            {isAuraMatching ? "Talking..." : "Aura Match"}
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction("like");
                        }}
                        className="w-16 h-16 rounded-full bg-coral text-white flex items-center justify-center shadow-glow hover:bg-coral-dark transition-all active:scale-95 border-4 border-transparent pointer-events-auto"
                    >
                        <Icons.Heart size={32} fill="currentColor" />
                    </button>
                </div>
            )}

            {/* MODE: DAILY PICKS */}
            {mode === "picks" && (
                <div className="flex-1 overflow-y-auto px-4 pb-32 no-scrollbar">
                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-text-main">
                            Daily Picks
                        </h2>
                        <p className="text-sm text-text-sec">
                            Curated just for you based on your Aura.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {dailyPicks.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => onViewProfile(p)}
                                className="aspect-[3/4] relative rounded-2xl overflow-hidden group shadow-md cursor-pointer border border-warm-gray"
                            >
                                <img
                                    src={p.photos[0]}
                                    className="w-full h-full object-cover"
                                    alt={p.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                    <Icons.ShieldCheck
                                        size={10}
                                        className="text-sage"
                                    />
                                    <span className="text-[9px] font-bold text-white">
                                        {p.verificationScore}%
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="font-bold text-white text-lg">
                                        {p.name}, {p.age}
                                    </h3>
                                    <p className="text-white/80 text-xs">
                                        {p.distance}km away
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FILTERS BOTTOM SHEET */}
            {showFilters && (
                <div className="fixed inset-0 z-[100]">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowFilters(false)}
                    />
                    
                    {/* Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
                        {/* Header */}
                        <div className="sticky top-0 bg-white px-4 py-4 flex items-center justify-between border-b border-warm-gray z-10">
                            <button 
                                onClick={() => setShowFilters(false)} 
                                className="p-2 -ml-2 text-text-sec hover:bg-warm-gray rounded-full"
                            >
                                <Icons.X size={24} />
                            </button>
                            <h2 className="text-lg font-bold text-text-main">Match Filters</h2>
                            <button 
                                onClick={handleApplyFilters}
                                className="text-primary font-bold text-sm"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-4 pb-8 space-y-5 max-h-[70vh]">
                            {/* Gender */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <h3 className="text-sm font-bold text-text-main mb-3">Show me</h3>
                                <div className="flex bg-white p-1 rounded-xl border border-warm-gray">
                                    {(['women', 'men', 'everyone'] as const).map((opt) => (
                                        <button 
                                            key={opt}
                                            onClick={() => setGender(opt)} 
                                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize ${gender === opt ? 'bg-primary text-white shadow-sm' : 'text-text-sec'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Age Range - DUAL SLIDER */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <div className="flex justify-between mb-4">
                                    <span className="text-sm font-bold text-text-main">Age Range</span>
                                    <span className="text-sm font-bold text-primary">{minAge} - {maxAge}</span>
                                </div>
                                
                                {/* Min Age Slider */}
                                <div className="mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-semibold text-text-sec">Min Age</label>
                                        <span className="text-xs font-bold text-text-main bg-white px-2 py-1 rounded-lg border border-warm-gray">{minAge}</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                                            <div className="w-full h-2 bg-white rounded-full border border-warm-gray">
                                                <div 
                                                    className="h-full bg-primary/30 rounded-full"
                                                    style={{ width: `${((minAge - 18) / 42) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="18" 
                                            max="59" 
                                            value={minAge} 
                                            onChange={handleMinAgeChange}
                                            className="w-full h-2 appearance-none cursor-pointer bg-transparent relative z-10"
                                            style={{
                                                WebkitAppearance: 'none',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Max Age Slider */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-semibold text-text-sec">Max Age</label>
                                        <span className="text-xs font-bold text-text-main bg-white px-2 py-1 rounded-lg border border-warm-gray">{maxAge}</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                                            <div className="w-full h-2 bg-white rounded-full border border-warm-gray">
                                                <div 
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${((maxAge - 19) / 41) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="19" 
                                            max="60" 
                                            value={maxAge} 
                                            onChange={handleMaxAgeChange}
                                            className="w-full h-2 appearance-none cursor-pointer bg-transparent relative z-10"
                                            style={{
                                                WebkitAppearance: 'none',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Expand Toggle */}
                                <div className="flex justify-between items-center border-t border-warm-gray pt-4">
                                    <span className="text-xs text-text-sec">Expand range if needed</span>
                                    <div 
                                        onClick={() => setExpandAge(!expandAge)}
                                        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${expandAge ? 'bg-primary' : 'bg-warm-gray'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${expandAge ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </section>

                            {/* Distance */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <div className="flex justify-between mb-4">
                                    <span className="text-sm font-bold text-text-main">Maximum Distance</span>
                                    <span className="text-sm font-bold text-primary">{distance} km</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="100" 
                                    value={distance} 
                                    onChange={(e) => setDistance(parseInt(e.target.value))}
                                    className="w-full h-2 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-primary" 
                                />
                            </section>

                            {/* Interests */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <h3 className="text-sm font-bold text-text-main mb-3">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {interestsList.map((tag) => {
                                        const isSelected = selectedInterests.includes(tag);
                                        return (
                                            <button 
                                                key={tag} 
                                                onClick={() => toggleInterest(tag)}
                                                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white border-warm-gray text-text-sec hover:border-primary'}`}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 p-4 bg-white border-t border-warm-gray">
                            <button 
                                onClick={handleApplyFilters}
                                className="w-full py-4 bg-primary text-white font-bold text-sm rounded-2xl"
                            >
                                Show Matches
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

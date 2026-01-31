import React, { useState, useEffect, useRef } from "react";
import { Icons } from "../components/Icons";
import { UserProfile } from "../types";
import {
    fetchDiscoverProfiles,
    fetchDailyPicks,
    likeProfile,
    resetDiscoverPagination,
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
    
    // Additional Filter State
    const [lookingFor, setLookingFor] = useState<string[]>([]);
    const [lifestyle, setLifestyle] = useState<{drinking: string; smoking: string}>({ drinking: 'any', smoking: 'any' });
    const [minHeight, setMinHeight] = useState<string>('any');
    const [education, setEducation] = useState<string[]>([]);
    const [hasPhotos, setHasPhotos] = useState(true);
    const [verified, setVerified] = useState(false);
    
    // Pagination State
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const interestsList = ['Gym', 'Art', 'Music', 'Tech', 'Travel', 'Foodie', 'Gaming', 'Outdoors', 'Reading', 'Movies', 'Cooking', 'Photography', 'Coffee', 'Design', 'Books', 'Hiking'];
    const lookingForOptions = ['Relationship', 'Casual', 'Friends', 'Not Sure'];
    const educationOptions = ['Bachelors', 'Masters', 'Self-taught', 'Student', 'Art School'];
    const heightOptions = ['any', "5'0\"", "5'3\"", "5'5\"", "5'6\"", "5'7\"", "5'9\"", "5'11\"", "6'0\"", "6'3\""];

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
            // Reset pagination on initial load
            resetDiscoverPagination();
            
            const [discoverData, picksData] = await Promise.all([
                fetchDiscoverProfiles("me", 1, 10),
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

    // Client-side filter function
    const applyFiltersToProfiles = (allProfiles: ProfileDataType[]): ProfileDataType[] => {
        return allProfiles.filter(profileData => {
            const profile = ('auraProfile' in profileData ? profileData.auraProfile : profileData) as UserProfile;
            
            // Age filter
            if (profile.age < minAge || profile.age > maxAge) return false;
            
            // Distance filter
            if (profile.distance > distance) return false;
            
            // Verified filter
            if (verified && !profile.verified) return false;
            
            // Has photos filter
            if (hasPhotos && (!profile.photos || profile.photos.length === 0)) return false;
            
            // Gender filter (simulate based on name patterns for demo)
            // In real app, this would check profile.gender field
            
            // Looking for filter - if filter is set, profile must match
            if (lookingFor.length > 0) {
                if (!profile.details?.lookingFor) return false;
                if (!lookingFor.includes(profile.details.lookingFor)) return false;
            }
            
            // Education filter - if filter is set, profile must match
            if (education.length > 0) {
                if (!profile.details?.education) return false;
                if (!education.includes(profile.details.education)) return false;
            }
            
            // Lifestyle - drinking - if filter is set, profile must match
            if (lifestyle.drinking !== 'any') {
                if (!profile.details?.drinking) return false;
                if (profile.details.drinking.toLowerCase() !== lifestyle.drinking) return false;
            }
            
            // Lifestyle - smoking - if filter is set, profile must match
            if (lifestyle.smoking !== 'any') {
                if (!profile.details?.smoking) return false;
                if (profile.details.smoking.toLowerCase() !== lifestyle.smoking) return false;
            }
            
            // Min height filter
            if (minHeight !== 'any' && profile.details?.height) {
                // Parse height to compare - heights are like "5'6\"" or "5'11\""
                const heightOrder = ["5'0\"", "5'3\"", "5'5\"", "5'6\"", "5'7\"", "5'9\"", "5'11\"", "6'0\"", "6'3\""];
                // Profile height might be like '5\'6"' - normalize it
                const profileHeight = profile.details.height.replace(/\s.*$/, ''); // Remove any trailing text
                const profileIdx = heightOrder.findIndex(h => profileHeight.includes(h.replace('"', '')));
                const minIdx = heightOrder.indexOf(minHeight);
                if (profileIdx !== -1 && minIdx !== -1 && profileIdx < minIdx) return false;
            }
            
            // Interests filter
            if (selectedInterests.length > 0) {
                const hasMatchingInterest = profile.interests.some(i => selectedInterests.includes(i));
                if (!hasMatchingInterest) return false;
            }
            
            return true;
        });
    };

    const handleApplyFilters = async () => {
        setShowFilters(false);
        setLoading(true);
        setPage(1);
        setHasMore(true);
        
        // Reset pagination tracking
        resetDiscoverPagination();

        // Re-fetch all profiles (page 1)
        const [discoverData, picksData] = await Promise.all([
            fetchDiscoverProfiles("me", 1, 10),
            fetchDailyPicks("me"),
        ]);
        
        // Apply client-side filters
        const filteredProfiles = applyFiltersToProfiles(discoverData);
        const filteredPicks = applyFiltersToProfiles(picksData.map(p => ({ id: p.id, auraProfile: p })))
            .map(p => ('auraProfile' in p ? p.auraProfile : p) as UserProfile);
        
        setProfiles(filteredProfiles);
        setDailyPicks(filteredPicks);
        setLoading(false);
        setCurrentIndex(0);
    };
    
    const loadMoreProfiles = async () => {
        if (loadingMore || !hasMore) return;
        
        const nextPage = page + 1;
        setLoadingMore(true);
        console.log("[Discover] Loading more profiles, page:", nextPage);
        
        // Fetch next page of profiles
        const moreProfiles = await fetchDiscoverProfiles("me", nextPage, 10);
        
        // Apply filters to new batch
        const filteredNew = applyFiltersToProfiles(moreProfiles);
        
        if (filteredNew.length === 0) {
            setHasMore(false);
        } else {
            setProfiles(prev => [...prev, ...filteredNew]);
            setPage(nextPage);
        }
        
        setLoadingMore(false);
    };
    
    const toggleLookingFor = (item: string) => {
        if (lookingFor.includes(item)) {
            setLookingFor(lookingFor.filter(i => i !== item));
        } else {
            setLookingFor([...lookingFor, item]);
        }
    };
    
    const toggleEducation = (item: string) => {
        if (education.includes(item)) {
            setEducation(education.filter(i => i !== item));
        } else {
            setEducation([...education, item]);
        }
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
                    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-[#f8f6f6] p-8 text-center">
                        <div className="w-24 h-24 bg-coral/10 rounded-full flex items-center justify-center mb-6">
                            <Icons.Users size={40} className="text-coral" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-main mb-3">
                            You've seen everyone!
                        </h2>
                        <p className="text-text-sec mb-8 max-w-xs leading-relaxed">
                            No more profiles match your current filters. Try expanding your preferences to discover more people.
                        </p>
                        
                        {/* Load More Button */}
                        {hasMore && (
                            <button
                                onClick={loadMoreProfiles}
                                disabled={loadingMore}
                                className="px-8 py-4 bg-coral text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-coral-dark transition-colors flex items-center gap-2 mb-4 disabled:opacity-70"
                            >
                                {loadingMore ? (
                                    <>
                                        <Icons.Loader2 size={18} className="animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <Icons.RefreshCw size={18} />
                                        Load More Profiles
                                    </>
                                )}
                            </button>
                        )}
                        
                        <button
                            onClick={() => setShowFilters(true)}
                            className="px-8 py-4 bg-white border-2 border-coral text-coral rounded-2xl text-sm font-bold hover:bg-coral/5 transition-colors flex items-center gap-2"
                        >
                            <Icons.SlidersHorizontal size={18} />
                            Edit Filters
                        </button>
                        <button
                            onClick={() => setCurrentIndex(0)}
                            className="mt-4 px-6 py-3 text-text-sec font-semibold text-sm hover:text-coral transition-colors"
                        >
                            Start Over from Beginning
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

                            {/* Looking For */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <h3 className="text-sm font-bold text-text-main mb-3">Looking For</h3>
                                <div className="flex flex-wrap gap-2">
                                    {lookingForOptions.map((opt) => {
                                        const isSelected = lookingFor.includes(opt);
                                        return (
                                            <button 
                                                key={opt} 
                                                onClick={() => toggleLookingFor(opt)}
                                                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${isSelected ? 'bg-coral text-white border-coral' : 'bg-white border-warm-gray text-text-sec hover:border-coral'}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Minimum Height */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <h3 className="text-sm font-bold text-text-main mb-3">Minimum Height</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {heightOptions.map((h) => (
                                        <button 
                                            key={h} 
                                            onClick={() => setMinHeight(h)}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${minHeight === h ? 'bg-primary text-white border-primary' : 'bg-white border-warm-gray text-text-sec hover:border-primary'}`}
                                        >
                                            {h === 'any' ? 'Any Height' : h}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Education */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <h3 className="text-sm font-bold text-text-main mb-3">Education</h3>
                                <div className="flex flex-wrap gap-2">
                                    {educationOptions.map((ed) => {
                                        const isSelected = education.includes(ed);
                                        return (
                                            <button 
                                                key={ed} 
                                                onClick={() => toggleEducation(ed)}
                                                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white border-warm-gray text-text-sec hover:border-primary'}`}
                                            >
                                                {ed}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Lifestyle */}
                            <section className="bg-bg-light p-4 rounded-2xl">
                                <h3 className="text-sm font-bold text-text-main mb-3">Lifestyle</h3>
                                
                                {/* Drinking */}
                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-text-sec mb-2 block">Drinking</label>
                                    <div className="flex gap-2">
                                        {['any', 'socially', 'sometimes'].map((opt) => (
                                            <button 
                                                key={opt} 
                                                onClick={() => setLifestyle(prev => ({ ...prev, drinking: opt }))}
                                                className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize ${lifestyle.drinking === opt ? 'bg-primary text-white border-primary' : 'bg-white border-warm-gray text-text-sec'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Smoking */}
                                <div>
                                    <label className="text-xs font-semibold text-text-sec mb-2 block">Smoking</label>
                                    <div className="flex gap-2">
                                        {['any', 'no', 'sometimes'].map((opt) => (
                                            <button 
                                                key={opt} 
                                                onClick={() => setLifestyle(prev => ({ ...prev, smoking: opt }))}
                                                className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize ${lifestyle.smoking === opt ? 'bg-primary text-white border-primary' : 'bg-white border-warm-gray text-text-sec'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
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

                            {/* Additional Preferences */}
                            <section className="bg-bg-light p-4 rounded-2xl space-y-4">
                                <h3 className="text-sm font-bold text-text-main">Additional Preferences</h3>
                                
                                {/* Has Photos Toggle */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm text-text-main font-medium">Has Photos</span>
                                        <p className="text-xs text-text-sec">Only show profiles with photos</p>
                                    </div>
                                    <div 
                                        onClick={() => setHasPhotos(!hasPhotos)}
                                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${hasPhotos ? 'bg-primary' : 'bg-warm-gray'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${hasPhotos ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                {/* Verified Only Toggle */}
                                <div className="flex justify-between items-center pt-3 border-t border-warm-gray">
                                    <div>
                                        <span className="text-sm text-text-main font-medium">Verified Only</span>
                                        <p className="text-xs text-text-sec">Only show verified profiles</p>
                                    </div>
                                    <div 
                                        onClick={() => setVerified(!verified)}
                                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${verified ? 'bg-primary' : 'bg-warm-gray'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${verified ? 'right-1' : 'left-1'}`}></div>
                                    </div>
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

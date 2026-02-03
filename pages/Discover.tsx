import React, { useState, useEffect, useRef } from "react";
import { Icons } from "../components/Icons";
import { UserProfile } from "../types";
import {
    fetchDiscoverProfiles,
    fetchDailyPicks,
    likeProfile,
    resetDiscoverPagination,
} from "../services/matchService";
import { Filters } from "./Filters";

interface DiscoverProps {
    onViewProfile: (profile: UserProfile) => void;
    onViewStory: (profile: UserProfile) => void;
    onStartAuraChat: (profile: UserProfile) => void;
    onLike: () => void;
    onPass: () => void;
}

type DiscoverMode = "stack" | "picks";

export const Discover: React.FC<DiscoverProps> = ({
    onViewProfile,
    onViewStory,
    onStartAuraChat,
    onLike,
    onPass,
}) => {
    const [mode, setMode] = useState<DiscoverMode>("stack");
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [dailyPicks, setDailyPicks] = useState<UserProfile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Swipe Animation State
    const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Aura Match Loading
    const [isAuraMatching, setIsAuraMatching] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<
        "left" | "right" | null
    >(null);

    useEffect(() => {
        const load = async () => {
            try {
                resetDiscoverPagination();
                const [discoverData, picksData] = await Promise.all([
                    fetchDiscoverProfiles("me", 1, 15),
                    fetchDailyPicks("me"),
                ]);
                console.log("Loaded profiles:", discoverData.length);
                setProfiles(discoverData);
                setDailyPicks(picksData);
            } catch (error) {
                console.error("Error loading profiles:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const currentProfile = profiles[currentIndex] || null;
    const nextProfile = profiles[currentIndex + 1] || null;
    const hasProfiles = profiles.length > 0 && currentIndex < profiles.length;

    const handleSwipe = async (direction: "left" | "right") => {
        if (!currentProfile || isDragging) return;

        setSwipeDirection(direction);
        setSwipeOffset({
            x: direction === "right" ? 1000 : -1000,
            y: 0,
        });

        setTimeout(async () => {
            if (direction === "right") {
                await likeProfile("me", currentProfile);
                onLike();
            } else {
                onPass();
            }

            setCurrentIndex((prev) => prev + 1);
            setSwipeOffset({ x: 0, y: 0 });
            setSwipeDirection(null);
        }, 300);
    };

    const handleAuraMatch = async () => {
        if (isAuraMatching || !currentProfile) return;
        setIsAuraMatching(true);
        await onStartAuraChat(currentProfile);
        setTimeout(() => {
            handleSwipe("right");
            setIsAuraMatching(false);
        }, 500);
    };

    const handleResetDiscovery = async () => {
        setLoading(true);
        setCurrentIndex(0);
        resetDiscoverPagination();
        const newProfiles = await fetchDiscoverProfiles("me", 1, 15);
        setProfiles(newProfiles);
        setLoading(false);
    };

    // Touch/Mouse Handlers for Swipe
    const handleDragStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        dragStartRef.current = { x: clientX, y: clientY };
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (!isDragging || !dragStartRef.current) return;

        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;

        setSwipeOffset({ x: deltaX, y: deltaY });
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        dragStartRef.current = null;

        if (Math.abs(swipeOffset.x) > 120) {
            handleSwipe(swipeOffset.x > 0 ? "right" : "left");
        } else {
            setSwipeOffset({ x: 0, y: 0 });
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-cream">
                <Icons.Loader2
                    className="animate-spin text-primary"
                    size={32}
                />
            </div>
        );
    }

    if (showFilters) {
        return <Filters onClose={() => setShowFilters(false)} />;
    }

    return (
        <div className="flex-1 flex flex-col bg-cream overflow-hidden relative">
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-cream">
                <div className="flex items-center justify-between">
                    <div className="flex bg-white rounded-full p-1 shadow-sm border border-warm-gray">
                        <button
                            onClick={() => setMode("stack")}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                mode === "stack"
                                    ? "bg-primary text-white shadow-md"
                                    : "text-text-sec"
                            }`}
                        >
                            Discover
                        </button>
                        <button
                            onClick={() => setMode("picks")}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                                mode === "picks"
                                    ? "bg-primary text-white shadow-md"
                                    : "text-text-sec"
                            }`}
                        >
                            Daily Picks
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowFilters(true)}
                        className="w-11 h-11 rounded-full border border-warm-gray bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                    >
                        <Icons.SlidersHorizontal
                            size={20}
                            className="text-text-main"
                        />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {mode === "stack" &&
                (hasProfiles ? (
                    <div className="flex-1 relative px-4 pb-4">
                        {/* Stack of Cards - Show next card behind */}
                        <div className="relative w-full h-full">
                            {/* Next Card (behind) */}
                            {nextProfile && (
                                <div
                                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg"
                                    style={{
                                        transform:
                                            "scale(0.95) translateY(10px)",
                                        opacity: 0.5,
                                        zIndex: 1,
                                    }}
                                >
                                    <img
                                        src={nextProfile.photos[0]}
                                        className="w-full h-full object-cover"
                                        alt={nextProfile.name}
                                    />
                                </div>
                            )}

                            {/* Current Card */}
                            <div
                                ref={cardRef}
                                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
                                style={{
                                    transform: `
                                        translateX(${swipeOffset.x}px) 
                                        translateY(${swipeOffset.y * 0.3}px) 
                                        rotate(${swipeOffset.x * 0.03}deg)
                                    `,
                                    transition: isDragging
                                        ? "none"
                                        : "transform 0.3s ease-out",
                                    zIndex: 10,
                                }}
                                onMouseDown={(e) =>
                                    handleDragStart(e.clientX, e.clientY)
                                }
                                onMouseMove={(e) =>
                                    handleDragMove(e.clientX, e.clientY)
                                }
                                onMouseUp={handleDragEnd}
                                onMouseLeave={handleDragEnd}
                                onTouchStart={(e) =>
                                    handleDragStart(
                                        e.touches[0].clientX,
                                        e.touches[0].clientY,
                                    )
                                }
                                onTouchMove={(e) =>
                                    handleDragMove(
                                        e.touches[0].clientX,
                                        e.touches[0].clientY,
                                    )
                                }
                                onTouchEnd={handleDragEnd}
                            >
                                {/* Swipe Indicators */}
                                {swipeOffset.x !== 0 && (
                                    <>
                                        {swipeOffset.x > 0 && (
                                            <div
                                                className="absolute top-12 right-12 bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-2xl transform rotate-12 shadow-lg z-20"
                                                style={{
                                                    opacity: Math.min(
                                                        Math.abs(
                                                            swipeOffset.x,
                                                        ) / 120,
                                                        1,
                                                    ),
                                                }}
                                            >
                                                LIKE
                                            </div>
                                        )}
                                        {swipeOffset.x < 0 && (
                                            <div
                                                className="absolute top-12 left-12 bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-2xl transform -rotate-12 shadow-lg z-20"
                                                style={{
                                                    opacity: Math.min(
                                                        Math.abs(
                                                            swipeOffset.x,
                                                        ) / 120,
                                                        1,
                                                    ),
                                                }}
                                            >
                                                NOPE
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="relative w-full h-full">
                                    {/* Profile Image */}
                                    <img
                                        src={currentProfile.photos[0]}
                                        className="w-full h-full object-cover"
                                        alt={currentProfile.name}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Profile Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-black">
                                                {currentProfile.name},{" "}
                                                {currentProfile.age}
                                            </h1>
                                            {currentProfile.verified && (
                                                <Icons.ShieldCheck
                                                    size={24}
                                                    className="text-green-400"
                                                />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Icons.Briefcase size={16} />
                                                {currentProfile.job}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Icons.MapPin size={16} />
                                                {currentProfile.distance}km
                                            </span>
                                        </div>

                                        {/* Quick Bio */}
                                        <p className="text-white/90 text-sm line-clamp-2 mb-4">
                                            {currentProfile.bio}
                                        </p>

                                        {/* Interests Pills */}
                                        <div className="flex flex-wrap gap-2">
                                            {currentProfile.interests
                                                .slice(0, 3)
                                                .map((interest, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            {currentProfile.interests.length >
                                                3 && (
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                                                    +
                                                    {currentProfile.interests
                                                        .length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* View Full Profile Button */}
                                    <button
                                        onClick={() =>
                                            onViewProfile(currentProfile)
                                        }
                                        className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                    >
                                        <Icons.Info size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating Action Buttons */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 px-4 z-50">
                            <button
                                onClick={() => handleSwipe("left")}
                                disabled={isDragging}
                                className="w-16 h-16 rounded-full bg-white shadow-2xl border-2 border-warm-gray text-red-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Icons.X size={32} strokeWidth={3} />
                            </button>

                            <button
                                onClick={handleAuraMatch}
                                disabled={isAuraMatching || isDragging}
                                className="h-16 px-8 bg-white shadow-2xl rounded-full flex items-center gap-2 text-primary font-bold border-2 border-primary hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isAuraMatching ? (
                                    <>
                                        <Icons.Loader2
                                            size={22}
                                            className="animate-spin"
                                        />
                                        <span>Matching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icons.Sparkles size={22} />
                                        <span>Aura</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleSwipe("right")}
                                disabled={isDragging}
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Icons.Heart
                                    size={28}
                                    fill="currentColor"
                                    strokeWidth={0}
                                />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-warm-gray rounded-full flex items-center justify-center mb-6">
                            <Icons.Users
                                size={40}
                                className="text-text-muted"
                            />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-text-main">
                            No more profiles for now!
                        </h2>
                        <p className="text-text-sec mb-8 max-w-sm">
                            We've shown you everyone matching your preferences.
                            Try adjusting your filters or check back later.
                        </p>
                        <button
                            onClick={handleResetDiscovery}
                            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        >
                            Reset & See Again
                        </button>
                    </div>
                ))}

            {mode === "picks" && (
                <div className="flex-1 overflow-y-auto px-4 pb-32 no-scrollbar">
                    <div className="mt-4 mb-6">
                        <h2 className="text-2xl font-black text-text-main mb-1">
                            Daily Picks
                        </h2>
                        <p className="text-sm text-text-sec">
                            Curated for your aura today ✨
                        </p>
                    </div>

                    {dailyPicks.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {dailyPicks.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => onViewProfile(p)}
                                    className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                >
                                    <img
                                        src={p.photos[0]}
                                        className="w-full h-full object-cover"
                                        alt={p.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white text-lg">
                                                {p.name}, {p.age}
                                            </h3>
                                            {p.verified && (
                                                <Icons.ShieldCheck
                                                    size={16}
                                                    className="text-green-400"
                                                />
                                            )}
                                        </div>
                                        <p className="text-white/80 text-xs">
                                            {p.distance}km away
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <Icons.Heart
                                size={56}
                                className="text-warm-gray mb-4"
                            />
                            <h3 className="text-xl font-bold mb-2">
                                No Daily Picks Yet
                            </h3>
                            <p className="text-text-sec text-sm">
                                Check back tomorrow for fresh recommendations!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

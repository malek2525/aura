// src/pages/Moments.tsx
// Fixed version with correct Moment type

import React, { useState, useEffect, useRef } from "react";
import { Icons } from "../components/Icons";
import { Moment } from "../types";
import { compressImage } from "../utils/image";

// Mock Data - includes all required fields
const DEFAULT_MOMENTS: Moment[] = [
  {
    id: "m1",
    userIds: ["user1", "user2"],
    userNames: ["Alex", "Sarah"],
    userAvatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    ],
    location: "The Barn Café, Berlin",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&fit=crop",
    caption:
      "first coffee date and we talked for 4 hours straight 😭 aura knew what it was doing",
    likes: 124,
    timestamp: "2h ago",
    vibeTag: "Cozy",
    isPublic: true,
  },
  {
    id: "m2",
    userIds: ["user3", "user4"],
    userNames: ["Leo", "Mina"],
    userAvatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    ],
    location: "Urban Spree",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&fit=crop",
    caption:
      "we both swiped for the art vibes and ended up at the same gallery 🎨 coincidence? i think not",
    likes: 89,
    timestamp: "5h ago",
    vibeTag: "Artsy",
    isPublic: true,
  },
  {
    id: "m3",
    userIds: ["user5", "user6"],
    userNames: ["Jordan", "Riley"],
    userAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    ],
    location: "Tempelhofer Feld",
    imageUrl:
      "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=800&fit=crop",
    caption:
      "sunset picnic was their idea and honestly... best first date ever? the bar has been raised",
    likes: 203,
    timestamp: "1d ago",
    vibeTag: "Romantic",
    isPublic: true,
  },
];

const VIBE_TAGS = [
  "Cozy",
  "Romantic",
  "Adventure",
  "Foodie",
  "Artsy",
  "Chill",
  "Wild",
  "Fresh",
];

type FilterTab = "trending" | "recent" | "following";

export const Moments: React.FC = () => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("trending");
  const [likedMoments, setLikedMoments] = useState<Set<string>>(new Set());
  const [savedMoments, setSavedMoments] = useState<Set<string>>(new Set());
  const [showHeartAnimation, setShowHeartAnimation] = useState<string | null>(
    null,
  );

  // Creation State
  const [showCreator, setShowCreator] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("Fresh");
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aura_moments");
      const liked = localStorage.getItem("aura_liked_moments");
      const saved = localStorage.getItem("aura_saved_moments");

      if (stored) {
        setMoments(JSON.parse(stored));
      } else {
        setMoments(DEFAULT_MOMENTS);
      }

      if (liked) setLikedMoments(new Set(JSON.parse(liked)));
      if (saved) setSavedMoments(new Set(JSON.parse(saved)));
    } catch (e) {
      console.error("Failed to load moments", e);
      setMoments(DEFAULT_MOMENTS);
    }
  }, []);

  // Sort moments based on tab
  const sortedMoments = [...moments].sort((a, b) => {
    if (activeTab === "trending") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await compressImage(file, 800, 0.8);
        setNewImage(url);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }
  };

  const handlePost = async () => {
    if (!newImage) return;

    setIsPosting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMoment: Moment = {
      id: `new_${Date.now()}`,
      userIds: ["current_user", "match_user"],
      userNames: ["You", "Your Match"],
      userAvatars: [
        "https://ui-avatars.com/api/?name=You&background=FF6B6B&color=fff",
        "https://ui-avatars.com/api/?name=Match&background=FFD93D&color=fff",
      ],
      location: "Somewhere Special",
      imageUrl: newImage,
      caption: newCaption || "just vibing ✨",
      likes: 0,
      timestamp: "just now",
      vibeTag: selectedVibe,
      isPublic: true,
    };

    const updatedMoments = [newMoment, ...moments];
    setMoments(updatedMoments);
    localStorage.setItem("aura_moments", JSON.stringify(updatedMoments));

    setShowCreator(false);
    setNewImage(null);
    setNewCaption("");
    setSelectedVibe("Fresh");
    setIsPosting(false);
  };

  const handleLike = (momentId: string) => {
    const newLiked = new Set(likedMoments);
    const isCurrentlyLiked = likedMoments.has(momentId);

    if (isCurrentlyLiked) {
      newLiked.delete(momentId);
    } else {
      newLiked.add(momentId);
      setShowHeartAnimation(momentId);
      setTimeout(() => setShowHeartAnimation(null), 800);
    }

    setLikedMoments(newLiked);
    localStorage.setItem("aura_liked_moments", JSON.stringify([...newLiked]));

    setMoments((prev) =>
      prev.map((m) =>
        m.id === momentId
          ? { ...m, likes: isCurrentlyLiked ? m.likes - 1 : m.likes + 1 }
          : m,
      ),
    );
  };

  const handleSave = (momentId: string) => {
    const newSaved = new Set(savedMoments);

    if (savedMoments.has(momentId)) {
      newSaved.delete(momentId);
    } else {
      newSaved.add(momentId);
    }

    setSavedMoments(newSaved);
    localStorage.setItem("aura_saved_moments", JSON.stringify([...newSaved]));
  };

  const handleDoubleTap = (momentId: string) => {
    if (!likedMoments.has(momentId)) {
      handleLike(momentId);
    } else {
      setShowHeartAnimation(momentId);
      setTimeout(() => setShowHeartAnimation(null), 800);
    }
  };

  return (
    <div className="h-full bg-warm-white flex flex-col pt-6 pb-24 relative overflow-hidden">
      {/* Header */}
      <div className="px-6 mb-4">
        <h1 className="text-2xl font-extrabold text-text-main tracking-tight">
          Moments
        </h1>
        <p className="text-xs text-text-sec mt-0.5">
          real dates. real vibes. real stories ✨
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "trending"}
            onClick={() => setActiveTab("trending")}
            icon={Icons.Zap}
            label="trending"
          />
          <TabButton
            active={activeTab === "recent"}
            onClick={() => setActiveTab("recent")}
            icon={Icons.Calendar}
            label="recent"
          />
          <TabButton
            active={activeTab === "following"}
            onClick={() => setActiveTab("following")}
            icon={Icons.Heart}
            label="following"
          />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 space-y-5 no-scrollbar pb-24">
        {sortedMoments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-coral-light/20 rounded-full flex items-center justify-center mb-4">
              <Icons.Camera size={32} className="text-coral" />
            </div>
            <h3 className="font-bold text-text-main mb-2">no moments yet</h3>
            <p className="text-sm text-text-sec text-center max-w-[200px] mb-4">
              go on a date and share your first moment!
            </p>
            <button
              onClick={() => setShowCreator(true)}
              className="px-6 py-3 bg-coral text-white font-bold rounded-2xl text-sm hover:bg-coral-dark transition-colors"
            >
              create moment
            </button>
          </div>
        ) : (
          sortedMoments.map((moment, index) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              isLiked={likedMoments.has(moment.id)}
              isSaved={savedMoments.has(moment.id)}
              showHeartAnimation={showHeartAnimation === moment.id}
              onLike={() => handleLike(moment.id)}
              onSave={() => handleSave(moment.id)}
              onDoubleTap={() => handleDoubleTap(moment.id)}
              delay={index * 100}
            />
          ))
        )}

        {sortedMoments.length > 0 && (
          <div className="py-8 text-center">
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
              thats all for now
            </p>
            <p className="text-xs text-text-sec mt-1">
              go on a date to add yours! 💫
            </p>
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreator(true)}
        className="absolute bottom-24 right-5 w-14 h-14 bg-coral text-white rounded-full shadow-lg shadow-coral/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40"
      >
        <Icons.Plus size={26} />
      </button>

      {/* Create Moment Modal */}
      {showCreator && (
        <div className="fixed inset-0 z-[90] bg-black/80 flex flex-col justify-end">
          <div className="bg-white rounded-t-[32px] p-6 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-bold text-lg">share a moment</h3>
                <p className="text-xs text-text-sec">show off ur date ✨</p>
              </div>
              <button
                onClick={() => setShowCreator(false)}
                className="p-2 bg-warm-white rounded-full hover:bg-gray-100"
              >
                <Icons.X size={20} />
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[4/3] bg-warm-white rounded-2xl mb-4 flex items-center justify-center border-2 border-dashed border-warm-gray text-text-muted cursor-pointer hover:border-coral/50 hover:bg-coral-light/5 transition-all overflow-hidden"
            >
              {newImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={newImage}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewImage(null);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <Icons.X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Icons.Camera size={32} />
                  <span className="text-xs font-bold">tap to add photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />

            <div className="mb-4">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                vibe tag
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_TAGS.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setSelectedVibe(vibe)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedVibe === vibe
                        ? "bg-coral text-white"
                        : "bg-warm-white text-text-sec hover:bg-gray-100"
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="how was the vibe? tell the story..."
              className="w-full bg-warm-white p-4 rounded-xl text-sm border border-warm-gray outline-none focus:border-coral mb-4 resize-none h-20"
              maxLength={200}
            />
            <p className="text-[10px] text-text-muted text-right -mt-3 mb-4">
              {newCaption.length}/200
            </p>

            <button
              disabled={!newImage || isPosting}
              onClick={handlePost}
              className="w-full py-4 bg-coral text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isPosting ? (
                <>
                  <Icons.Loader2 size={18} className="animate-spin" />
                  posting...
                </>
              ) : (
                <>post moment ✨</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
      active
        ? "bg-coral text-white"
        : "bg-white text-text-sec border border-warm-gray hover:border-coral/30"
    }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

interface MomentCardProps {
  moment: Moment;
  isLiked: boolean;
  isSaved: boolean;
  showHeartAnimation: boolean;
  onLike: () => void;
  onSave: () => void;
  onDoubleTap: () => void;
  delay: number;
}

const MomentCard: React.FC<MomentCardProps> = ({
  moment,
  isLiked,
  isSaved,
  showHeartAnimation,
  onLike,
  onSave,
  onDoubleTap,
  delay,
}) => {
  const [lastTap, setLastTap] = useState(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      onDoubleTap();
    }
    setLastTap(now);
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-warm-gray animate-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="aspect-[4/3] relative cursor-pointer" onClick={handleTap}>
        <img
          src={moment.imageUrl}
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Icons.Heart
              size={80}
              className="text-white fill-white animate-ping opacity-80"
            />
          </div>
        )}

        {/* Avatars */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {moment.userAvatars.map((url, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
              >
                <img src={url} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
          <span className="text-white text-xs font-bold drop-shadow-lg">
            {moment.userNames.join(" & ")}
          </span>
        </div>

        {/* Vibe Tag */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {moment.vibeTag}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-coral text-xs font-bold">
            <Icons.MapPin size={12} />
            {moment.location}
          </div>
          <span className="text-[10px] text-text-muted">
            {moment.timestamp}
          </span>
        </div>

        <p className="text-sm text-text-main leading-relaxed mb-3">
          {moment.caption}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={onLike} className="flex items-center gap-1.5 group">
            <Icons.Heart
              size={22}
              className={`transition-all ${
                isLiked
                  ? "text-red-500 fill-red-500 scale-110"
                  : "text-text-muted group-hover:text-red-500"
              }`}
            />
            <span
              className={`text-xs font-bold ${isLiked ? "text-red-500" : "text-text-sec"}`}
            >
              {moment.likes}
            </span>
          </button>

          <button className="text-text-muted hover:text-text-main transition-colors">
            <Icons.MessageCircle size={22} />
          </button>

          <button className="text-text-muted hover:text-text-main transition-colors">
            <Icons.Send size={20} />
          </button>

          <button onClick={onSave} className="ml-auto">
            <Icons.Star
              size={22}
              className={`transition-all ${
                isSaved
                  ? "text-gold fill-gold"
                  : "text-text-muted hover:text-gold"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Moments;

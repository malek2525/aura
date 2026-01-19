import React from "react";
import { Icons } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { loadAuraProfile } from "../storage/profileStorage";
import { useState, useEffect } from "react";
import { UserProfile } from "../types";

interface AuraProps {
  onEditProfile: () => void;
  onSettings: () => void;
  onPreviewProfile: () => void;
  onAddStory: (imgUrl: string) => void;
}

export const Aura: React.FC<AuraProps> = ({
  onEditProfile,
  onSettings,
  onPreviewProfile,
  onAddStory,
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const p = await loadAuraProfile(user.uid);
        setProfile(p);
      }
    };
    load();
  }, [user]);

  // Calculate profile completion
  const calculateCompletion = (): number => {
    if (!profile) return 0;
    let score = 0;
    if (profile.name) score += 15;
    if (profile.bio && profile.bio.length > 10) score += 15;
    if (profile.photos && profile.photos.length >= 1) score += 15;
    if (profile.photos && profile.photos.length >= 3) score += 10;
    if (profile.job) score += 10;
    if (profile.interests && profile.interests.length >= 3) score += 15;
    if (profile.prompts && profile.prompts.length >= 1) score += 10;
    if (profile.auraRead) score += 10;
    return Math.min(score, 100);
  };

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-warm-white pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-text-main">My Profile</h1>
        <button
          onClick={onSettings}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Icons.Settings size={22} className="text-gray-600" />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div
          onClick={onPreviewProfile}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-coral">
                <img
                  src={
                    profile?.photos?.[0] ||
                    user?.photoURL ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProfile();
                }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-coral rounded-full flex items-center justify-center shadow-md border-2 border-white"
              >
                <Icons.Pencil size={14} className="text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-main">
                {profile?.name || "Your Name"}
                {profile?.age ? `, ${profile.age}` : ""}
              </h2>
              <p className="text-sm text-gray-500">
                {profile?.job || "Add your job"}
              </p>
              <p className="text-sm text-gray-400">
                {profile?.location || "Add location"}
              </p>
            </div>

            <Icons.ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Profile Strength */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icons.TrendingUp size={18} className="text-coral" />
              <span className="font-bold text-text-main">Profile Strength</span>
            </div>
            <span className="text-lg font-bold text-coral">{completion}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-coral to-gold rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          {/* Tips */}
          {completion < 100 && (
            <div className="space-y-2">
              {!profile?.bio && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-coral rounded-full" />
                  <span>Add a bio to get more matches</span>
                </div>
              )}
              {(!profile?.photos || profile.photos.length < 3) && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-coral rounded-full" />
                  <span>Add more photos</span>
                </div>
              )}
              {(!profile?.interests || profile.interests.length < 3) && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-coral rounded-full" />
                  <span>Add your interests</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boost Profile */}
        <div className="bg-gradient-to-r from-coral to-orange-400 rounded-3xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icons.Zap size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Boost Profile</h3>
              <p className="text-white/80 text-sm">Get seen by more people</p>
            </div>
            <Icons.ChevronRight size={20} className="text-white/80" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onEditProfile}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:border-coral transition-colors"
          >
            <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
              <Icons.Pencil size={18} className="text-coral" />
            </div>
            <span className="font-medium text-text-main text-sm">
              Edit Profile
            </span>
          </button>

          <button
            onClick={onSettings}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:border-coral transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Icons.Settings size={18} className="text-gray-600" />
            </div>
            <span className="font-medium text-text-main text-sm">Settings</span>
          </button>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <Icons.ShieldCheck size={24} className="text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-main">Verification</h3>
              <p className="text-sm text-gray-500">
                {profile?.verified
                  ? "Your profile is verified"
                  : "Verify to get more matches"}
              </p>
            </div>
            {!profile?.verified && (
              <button className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full">
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

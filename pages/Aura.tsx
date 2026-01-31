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
  const { user, signOut } = useAuth();
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
    <div className="min-h-screen bg-bg-light pb-24">
      {/* Header */}
      <div className="flex items-center bg-bg-light p-4 pb-2 justify-between sticky top-0 z-10">
        <button
          onClick={onSettings}
          className="flex size-12 shrink-0 items-center justify-start text-text-main"
        >
          <Icons.Settings size={24} />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-main">
          Me
        </h2>
        <div className="flex size-12 shrink-0 items-center justify-end">
          {profile?.verified && (
            <Icons.ShieldCheck size={24} className="text-primary" />
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div 
        onClick={onPreviewProfile}
        className="mx-4 mb-4 bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4 p-4 pb-2">
          <div className="relative shrink-0">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 border-2 border-white shadow-sm"
              style={{
                backgroundImage: `url("${profile?.photos?.[0] || user?.photoURL || 'https://ui-avatars.com/api/?name=User'}")`
              }}
            />
            {profile?.verified && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white flex items-center justify-center">
                <Icons.Check size={10} className="font-bold" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xl font-extrabold leading-tight tracking-[-0.015em] text-text-main">
              {profile?.name || "Your Name"}{profile?.age ? `, ${profile.age}` : ""}
            </p>
            {profile?.verified && (
              <div className="flex items-center gap-1 mt-0.5">
                <Icons.BadgeCheck size={12} className="text-primary" />
                <p className="text-primary text-xs font-semibold leading-none">Verified Profile</p>
              </div>
            )}
            <p className="text-text-sec text-xs font-medium mt-1">
              {profile?.location || "Add your location"}
            </p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="flex flex-col gap-2 p-4 pt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icons.Pencil size={16} className="text-primary" />
              <p className="text-xs font-bold text-text-main">Profile Completion</p>
            </div>
            <p className="text-primary text-xs font-bold">{completion}%</p>
          </div>
          <div className="rounded-full bg-warm-gray overflow-hidden h-2">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-500" 
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <p className="text-text-sec text-[10px] font-medium">
              Add more photos to get 2x more matches!
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions Title */}
      <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-6 pb-2 pt-2 text-text-main">
        Quick Actions
      </h3>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-8">
        <button
          onClick={onEditProfile}
          className="flex flex-col gap-3 rounded-xl border border-warm-gray bg-white p-5 items-start justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Icons.Edit size={24} />
          </div>
          <h2 className="text-sm font-bold leading-tight text-text-main">Edit Profile</h2>
        </button>

        <button
          onClick={onSettings}
          className="flex flex-col gap-3 rounded-xl border border-warm-gray bg-white p-5 items-start justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Icons.Settings size={24} />
          </div>
          <h2 className="text-sm font-bold leading-tight text-text-main">Settings</h2>
        </button>

        <button
          className="flex flex-col gap-3 rounded-xl border border-warm-gray bg-white p-5 items-start justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Icons.ShieldCheck size={24} />
          </div>
          <h2 className="text-sm font-bold leading-tight text-text-main">Safety</h2>
        </button>

        <button
          className="flex flex-col gap-3 rounded-xl border-2 border-primary bg-primary/5 p-5 items-start justify-center cursor-pointer active:scale-95 transition-transform shadow-sm"
        >
          <div className="bg-primary p-2 rounded-lg text-white">
            <Icons.Zap size={24} />
          </div>
          <h2 className="text-primary text-sm font-bold leading-tight">Boost</h2>
        </button>
      </div>

      {/* Menu Items */}
      <div className="px-4 flex flex-col gap-2 mb-24">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Icons.HelpCircle size={20} className="text-text-sec" />
            <span className="font-semibold text-sm text-text-main">Help Center</span>
          </div>
          <Icons.ChevronRight size={20} className="text-text-sec" />
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Icons.UserPlus size={20} className="text-text-sec" />
            <span className="font-semibold text-sm text-text-main">Invite Friends</span>
          </div>
          <Icons.ChevronRight size={20} className="text-text-sec" />
        </div>

        <button 
          onClick={() => signOut?.()}
          className="flex items-center justify-between p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full"
        >
          <div className="flex items-center gap-3">
            <Icons.LogOut size={20} className="text-text-sec" />
            <span className="font-semibold text-sm text-text-main">Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
};

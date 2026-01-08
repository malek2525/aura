import React from "react";
import { RelationshipIntent, UserProfile } from "../types";
import { ProfileChips } from "./ProfileChips";
import { Icons } from "./Icons";

interface MePanelProps {
  profile: UserProfile; // Using UserProfile to match app types
  isOpen: boolean;
  onClose: () => void;
}

const getAgeFromDob = (dob?: string | null): number | null => {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return age;
};

const buildLifestyleLine = (profile: UserProfile): string => {
  const lifestyle = profile.dating?.lifestyle;
  if (!lifestyle) return "";

  const bits: string[] = [];
  if (lifestyle.smoking === "yes") bits.push("Smokes");
  if (lifestyle.drinking === "yes") bits.push("Drinks");
  if (lifestyle.pets && lifestyle.pets.length > 0) bits.push(`Pets: ${lifestyle.pets.join(", ")}`);
  if (profile.job) bits.push(profile.job);

  return bits.join(" · ");
};

export const MePanel: React.FC<MePanelProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const photos = profile.photos || [];
  const primaryPhoto = photos[0];
  
  // Data extraction compatible with both mock and real structure
  const locationLabel = `${profile.age} · ${profile.location}`;
  const lifestyleLine = buildLifestyleLine(profile);
  const bio = profile.bio || profile.dating?.bio || "";
  const summary = profile.auraRead || profile.summary;
  const interests = profile.interests || [];
  const vibeWords = profile.vibeTags || profile.vibeWords || [];
  
  const greenFlags = profile.greenFlags || profile.aura?.greenFlags || [];
  const redFlags = profile.redFlags || profile.aura?.redFlags || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-xs sm:max-w-sm h-full bg-warm-white border-l border-warm-gray shadow-2xl px-5 py-6 flex flex-col gap-4 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-coral font-bold">
              Me
            </div>
            <div className="text-[10px] text-text-muted font-medium">
              Your Aura dating profile
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-gray text-text-sec transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 rounded-2xl overflow-hidden border border-warm-gray shadow-sm">
            <img
              src={primaryPhoto}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text-main leading-tight">
              {profile.name}
            </span>
            <span className="text-xs text-text-sec font-medium">
              {locationLabel}
            </span>
          </div>
        </div>

        {/* Summary / Bio */}
        <div className="bg-white border border-warm-gray rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-coral-light/50 rounded-bl-full -mr-4 -mt-4"></div>
          {bio && <p className="text-sm text-text-main leading-relaxed relative z-10">{bio}</p>}
          {summary && summary !== bio && (
            <div className="mt-3 pt-3 border-t border-warm-gray relative z-10">
              <p className="text-[11px] text-text-muted font-bold uppercase mb-1">Aura's Read</p>
              <p className="text-xs text-text-sec italic">"{summary}"</p>
            </div>
          )}
        </div>

        {/* Photos Mini Grid */}
        <section className="mt-2 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-bold">
            Photos
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 3).map((url, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden border border-warm-gray bg-gray-100 aspect-[3/4]"
              >
                <img
                  src={url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Vibe & Interests */}
        <section className="mt-2 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-bold">
            Vibe & Interests
          </h3>
          <div className="bg-white border border-warm-gray rounded-2xl p-4 shadow-sm space-y-4">
            {vibeWords.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] text-text-sec font-bold uppercase">Vibe</p>
                <ProfileChips items={vibeWords.slice(0, 4)} tone="primary" />
              </div>
            )}

            {interests.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] text-text-sec font-bold uppercase">Interests</p>
                <ProfileChips items={interests.slice(0, 8)} tone="secondary" />
              </div>
            )}
          </div>
        </section>

        {/* Safety & Flags */}
        {(greenFlags.length > 0 || redFlags.length > 0) && (
          <section className="mt-2 space-y-2 mb-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-bold">
              Safety & Boundaries
            </h3>
            <div className="bg-white border border-warm-gray rounded-2xl p-4 shadow-sm space-y-3">
              {greenFlags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] text-sage font-bold uppercase flex items-center gap-1">
                    <Icons.Check size={10} /> Green flags
                  </p>
                  <p className="text-xs text-text-main leading-relaxed">
                    {greenFlags.slice(0, 4).join(", ")}
                  </p>
                </div>
              )}
              {redFlags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1">
                    <Icons.AlertCircle size={10} /> Red flags
                  </p>
                  <p className="text-xs text-text-main leading-relaxed">
                    {redFlags.slice(0, 4).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Edit Button */}
        <div className="mt-auto pt-4 border-t border-warm-gray">
          <button
            onClick={() => {/* Trigger edit mode logic */}}
            className="w-full py-3 rounded-xl bg-text-main text-white font-bold text-sm shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Pencil size={16} /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};
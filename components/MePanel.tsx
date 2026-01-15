
import React from "react";
import { UserProfile } from "../types";
import { ProfileChips } from "./ProfileChips";
import { Icons } from "./Icons";

interface MePanelProps {
  profile: UserProfile; 
  isOpen: boolean;
  onClose: () => void;
}

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
  
  const locationLabel = `${profile.age} · ${profile.location}`;
  const bio = profile.bio || profile.dating?.bio || "";
  const summary = profile.auraRead || profile.summary;
  const interests = profile.interests || [];
  const vibeWords = profile.vibeTags || profile.vibeWords || [];
  
  const greenFlags = profile.greenFlags || profile.aura?.greenFlags || [];
  const redFlags = profile.redFlags || profile.aura?.redFlags || [];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm h-full bg-warm-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 sm:border-l border-white/20">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/10">
             Preview Mode
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors pointer-events-auto border border-white/10"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-warm-white pb-24">
            
            {/* Cover Photo */}
            <div className="h-[450px] w-full relative">
                <img
                  src={primaryPhoto}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-warm-white"></div>
                
                {/* Name Overlay */}
                <div className="absolute bottom-4 left-5 right-5">
                    <h1 className="text-3xl font-extrabold text-text-main tracking-tight leading-none mb-1">
                        {profile.name}, {profile.age}
                    </h1>
                    <div className="flex items-center gap-1.5 text-text-sec text-sm font-medium">
                        <Icons.MapPin size={14} className="text-coral" />
                        {profile.location || "Unknown Location"}
                    </div>
                </div>
            </div>

            <div className="px-5 space-y-6 -mt-2 relative z-10">
                
                {/* Aura Summary Card */}
                {summary && (
                    <div className="bg-white rounded-2xl p-5 shadow-soft border border-warm-gray/50 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gold/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-coral/10 rounded-full blur-xl"></div>
                        
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <Icons.Sparkles size={16} className="text-gold" />
                            <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Aura Insight</h3>
                        </div>
                        <p className="text-sm text-text-main font-medium italic leading-relaxed relative z-10">
                            "{summary}"
                        </p>
                    </div>
                )}

                {/* Bio */}
                {bio && (
                    <section>
                        <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-2 ml-1">About</h3>
                        <p className="text-text-main text-base leading-relaxed">
                            {bio}
                        </p>
                    </section>
                )}

                {/* Photo Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {photos.slice(1, 3).map((url, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-warm-gray">
                            <img src={url} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Tags */}
                <section>
                    <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">Vibe & Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {vibeWords.map((t, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-xl bg-coral-light/10 text-coral border border-coral/10 text-xs font-bold">
                                #{t}
                             </span>
                        ))}
                        {interests.map((t, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-xl bg-white text-text-main border border-warm-gray text-xs font-bold shadow-sm">
                                {t}
                             </span>
                        ))}
                    </div>
                </section>

                <div className="h-4"></div>
            </div>
        </div>

        {/* Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-md border-t border-warm-gray">
          <button
            onClick={() => {/* Trigger edit mode logic */}}
            className="w-full py-3.5 rounded-xl bg-text-main text-white font-bold text-sm shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Pencil size={16} /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

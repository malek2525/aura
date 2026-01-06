// screens/DiscoverScreen.tsx
import React, { useEffect, useState } from "react";
import { AuraProfile } from "../types";
import {
  PublicProfileSummary,
  fetchDiscoverProfiles,
  likeProfile,
} from "../services/matchService";
import { ProfilePreviewPanel } from "../components/ProfilePreviewPanel";

interface DiscoverScreenProps {
  currentUserUid: string;
  currentUserProfile: AuraProfile;
}

/* ---------- Helpers to read v2 AuraProfile with legacy fallback ---------- */

const computeAge = (dob?: string | null): string | null => {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return `${age}`;
};

const getAgeFromProfile = (p: AuraProfile): string | null => {
  const anyProfile = p as any;
  const dating = anyProfile.dating as
    | { dateOfBirth?: string | null }
    | undefined;

  const dobFromDating = dating?.dateOfBirth;
  const dobLegacy = anyProfile.dateOfBirth || anyProfile.dob;

  return computeAge(dobFromDating || dobLegacy || null) || p.ageRange || null;
};

const getLocationLabel = (p: AuraProfile): string | null => {
  const anyProfile = p as any;
  const dating = anyProfile.dating as
    | { city?: string | null; country?: string | null }
    | undefined;

  const city = dating?.city ?? null;
  const country = dating?.country ?? p.country ?? null;

  const ageLabel = getAgeFromProfile(p);

  const parts = [
    ageLabel ? `${ageLabel}` : null,
    city || country || null,
  ].filter(Boolean);

  return parts.length ? parts.join(" · ") : null;
};

const getPrimaryPhotoUrl = (p: AuraProfile): string => {
  const anyProfile = p as any;
  const dating = anyProfile.dating as
    | { photos?: { url: string; isPrimary?: boolean }[] }
    | undefined;

  if (dating?.photos && dating.photos.length > 0) {
    const primary =
      dating.photos.find((ph) => ph.isPrimary) || dating.photos[0];
    if (primary?.url) return primary.url;
  }

  if (p.photos && p.photos.length > 0) return p.photos[0].url;
  if (p.photoUrls && p.photoUrls.length > 0) return p.photoUrls[0];
  if (p.avatarUrl) return p.avatarUrl;

  return "";
};

const getDisplayName = (p: AuraProfile): string => {
  const anyProfile = p as any;
  const dating = anyProfile.dating as { displayName?: string } | undefined;
  return dating?.displayName || p.displayName;
};

const getRelationshipIntent = (p: AuraProfile) => {
  const anyProfile = p as any;
  const dating = anyProfile.dating as
    | { relationshipIntent?: string }
    | undefined;
  return dating?.relationshipIntent || p.relationshipIntent;
};

const getSummary = (p: AuraProfile): string => {
  const anyProfile = p as any;
  const aura = anyProfile.aura as { summary?: string } | undefined;
  return (
    aura?.summary ||
    p.summary ||
    "Aura has a gentle read on this person. Tap to see more."
  );
};

const getVibeWords = (p: AuraProfile): string[] => {
  const anyProfile = p as any;
  const aura = anyProfile.aura as { vibeWords?: string[] } | undefined;
  if (aura?.vibeWords && aura.vibeWords.length > 0) return aura.vibeWords;
  if (p.vibeWords && p.vibeWords.length > 0) return p.vibeWords;
  return [];
};

/* ------------------------------------------------------------------------ */

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ currentUserUid }) => {
  const [profiles, setProfiles] = useState<PublicProfileSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedRecently, setLikedRecently] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<AuraProfile | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchDiscoverProfiles(currentUserUid);
        setProfiles(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentUserUid]);

  const handleLike = async (p: PublicProfileSummary) => {
    const res = await likeProfile(currentUserUid, p.uid);
    const name = getDisplayName(p.auraProfile);
    setLikedRecently(
      res.isNewMatch ? `${name} is now a new match.` : `You liked ${name}.`,
    );
    setTimeout(() => setLikedRecently(null), 3000);
  };

  const handlePass = (uid: string) => {
    setProfiles((prev) => prev.filter((p) => p.uid !== uid));
  };

  return (
    <>
      <div className="h-full overflow-y-auto p-4 lg:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div>
            <h2 className="text-sm font-semibold text-white">Discover</h2>
            <p className="text-[10px] text-slate-400 tracking-wide">
              Aura shows you people who might feel safe and interesting to meet.
            </p>
          </div>
          {likedRecently && (
            <div className="text-[10px] px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-200">
              {likedRecently}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500/40 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400">Loading people nearby...</p>
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <p className="text-sm text-slate-200">
              No one to discover right now.
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              As more people join Aura Twin, this feed will start to feel like a
              real dating app.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {profiles.map((p) => {
            const ap = p.auraProfile;

            const displayName = getDisplayName(ap);
            const locationLabel =
              getLocationLabel(ap) || "Age & location not set";
            const photoUrl = getPrimaryPhotoUrl(ap);
            const relationshipIntent = getRelationshipIntent(ap);
            const summary = getSummary(ap);
            const vibeTags = getVibeWords(ap).slice(0, 3);

            return (
              <div
                key={p.uid}
                className="rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl p-3 sm:p-4 flex gap-3"
              >
                {/* Photo / avatar */}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewProfile(ap);
                    setIsPreviewOpen(true);
                  }}
                  className="relative flex-shrink-0 h-16 w-16 rounded-2xl overflow-hidden border border-white/15 bg-slate-950/70 group"
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={displayName}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/70 via-violet-500/70 to-sky-400/70" />
                      <span className="relative z-10 flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </>
                  )}
                  <div className="absolute bottom-1 left-1 right-1 text-[9px] text-white/90 bg-black/40 rounded-full px-1.5 py-0.5 text-center">
                    View profile
                  </div>
                </button>

                {/* Text block */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {locationLabel}
                      </p>
                    </div>
                    {relationshipIntent && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/40 text-sky-200 uppercase tracking-[0.16em]">
                        {relationshipIntent === "friends_only"
                          ? "Friends"
                          : relationshipIntent === "casual_dating"
                            ? "Casual"
                            : relationshipIntent === "serious_relationship"
                              ? "Serious"
                              : "Open to see"}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                    {summary}
                  </p>

                  {vibeTags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {vibeTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-slate-950/70 border border-white/10 text-[9px] text-slate-200 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLike(p)}
                      className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 text-white shadow-md shadow-violet-500/30 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all"
                    >
                      Like
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePass(p.uid)}
                      className="px-3 py-1.5 rounded-full text-[11px] border border-white/15 bg-slate-900/70 text-slate-300 hover:bg-slate-800/80 transition-all"
                    >
                      Pass
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {previewProfile && (
        <ProfilePreviewPanel
          profile={previewProfile}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Profile"
          subtitle="Aura preview of this person"
        />
      )}
    </>
  );
};

export default DiscoverScreen;

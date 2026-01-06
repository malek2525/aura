// screens/MatchesScreen.tsx
import React, { useEffect, useState } from "react";

import { AuraProfile } from "../types";
import { MatchWithProfile, fetchMatches } from "../services/matchService";
import { ProfilePreviewPanel } from "../components/ProfilePreviewPanel";
import MatchChatScreen from "./MatchChatScreen";

interface MatchesScreenProps {
  currentUserUid: string;
  currentUserProfile: AuraProfile;
  onOpenReplyLab: (prefillText: string) => void;
}

interface ActiveConversation {
  matchId: string;
  otherUid: string;
  otherProfile: AuraProfile;
}

/** Helpers to read from AuraProfile v2 (dating/aura) with legacy fallback */

const getPrimaryPhotoUrl = (profile: AuraProfile): string => {
  // New model: dating.photos[]
  const datingPhotos = (profile as any).dating?.photos as
    | { url: string; isPrimary?: boolean }[]
    | undefined;

  if (datingPhotos && datingPhotos.length > 0) {
    const primary = datingPhotos.find((p) => p.isPrimary) || datingPhotos[0];
    if (primary?.url) return primary.url;
  }

  // Legacy: photos / photoUrls / avatarUrl
  if (profile.photos && profile.photos.length > 0) {
    return profile.photos[0].url;
  }
  if (profile.photoUrls && profile.photoUrls.length > 0) {
    return profile.photoUrls[0];
  }
  if (profile.avatarUrl) return profile.avatarUrl;

  return "";
};

const getDisplayName = (profile: AuraProfile): string => {
  const dating = (profile as any).dating as
    | { displayName?: string }
    | undefined;
  return dating?.displayName || profile.displayName;
};

const getSummary = (profile: AuraProfile): string => {
  const aura = (profile as any).aura as { summary?: string } | undefined;
  return (
    aura?.summary ||
    profile.summary ||
    "Aura thinks you could have a safe, interesting vibe together."
  );
};

const getVibeWords = (profile: AuraProfile): string[] => {
  const aura = (profile as any).aura as { vibeWords?: string[] } | undefined;
  if (aura?.vibeWords && aura.vibeWords.length > 0) return aura.vibeWords;
  if (profile.vibeWords && profile.vibeWords.length > 0)
    return profile.vibeWords;
  return [];
};

const MatchesScreen: React.FC<MatchesScreenProps> = ({
  currentUserUid,
  currentUserProfile,
  onOpenReplyLab,
}) => {
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<AuraProfile | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<ActiveConversation | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchMatches(currentUserUid);
        setMatches(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentUserUid]);

  // If a match chat is open, show full-screen conversation
  if (activeConversation) {
    return (
      <MatchChatScreen
        currentUser={{ uid: currentUserUid, profile: currentUserProfile }}
        otherUser={{
          uid: activeConversation.otherUid,
          profile: activeConversation.otherProfile,
        }}
        matchId={activeConversation.matchId}
        onBack={() => setActiveConversation(null)}
        onOpenReplyLab={onOpenReplyLab}
      />
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto p-4 lg:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div>
            <h2 className="text-sm font-semibold text-white">Matches</h2>
            <p className="text-[10px] text-slate-400 tracking-wide">
              When both sides like each other, they appear here.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-pink-500/40 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400">
              Checking who matched with you...
            </p>
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <p className="text-sm text-slate-200">
              No matches yet. That&apos;s okay.
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              As you start liking people from{" "}
              <span className="text-violet-300 font-semibold">Discover</span>,
              Aura will surface mutual matches here.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {matches.map(({ match, other }) => {
            const ap = other.auraProfile;
            const photoUrl = getPrimaryPhotoUrl(ap);
            const displayName = getDisplayName(ap);
            const summary = getSummary(ap);
            const vibeTags = getVibeWords(ap).slice(0, 2);

            return (
              <div
                key={match.id}
                className="rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl p-3 sm:p-4 flex gap-3 items-center"
              >
                {/* Avatar / photo */}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewProfile(ap);
                    setIsPreviewOpen(true);
                  }}
                  className="relative flex-shrink-0 h-12 w-12 rounded-2xl overflow-hidden border border-white/15 bg-slate-950/70 group"
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
                      <span className="relative z-10 flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </>
                  )}
                </button>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Matched ·{" "}
                        {new Date(match.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {typeof match.compatibilityScore === "number" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-200">
                        {match.compatibilityScore}/100
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
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveConversation({
                        matchId: match.id,
                        otherUid: other.uid,
                        otherProfile: ap,
                      });
                    }}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-md shadow-pink-500/40 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
                  >
                    Open chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewProfile(ap);
                      setIsPreviewOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-full text-[10px] border border-white/15 bg-slate-900/70 text-slate-200 hover:bg-slate-800/80 transition-all"
                  >
                    View profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right-side profile preview panel */}
      {previewProfile && (
        <ProfilePreviewPanel
          profile={previewProfile}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Match profile"
          subtitle="Aura preview of your match"
        />
      )}
    </>
  );
};

export default MatchesScreen;

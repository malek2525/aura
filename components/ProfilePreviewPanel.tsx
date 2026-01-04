// components/ProfilePreviewPanel.tsx
import React from "react";
import { AuraProfile } from "../types";
import { ProfileChips } from "./ProfileChips";

interface ProfilePreviewPanelProps {
  profile: AuraProfile;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
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

/** Helpers to read layered v2 fields with legacy fallback */

const getDating = (profile: AuraProfile): any => (profile as any).dating || {};
const getAura = (profile: AuraProfile): any => (profile as any).aura || {};
const getPreferences = (profile: AuraProfile): any =>
  (profile as any).preferences || {};

const getPrimaryPhotoUrl = (profile: AuraProfile): string => {
  const dating = getDating(profile);
  const datingPhotos =
    (dating.photos as { url: string; isPrimary?: boolean }[]) || [];
  if (datingPhotos.length > 0) {
    const primary = datingPhotos.find((p) => p.isPrimary) || datingPhotos[0];
    if (primary?.url) return primary.url;
  }

  if (profile.photos && profile.photos.length > 0) {
    return profile.photos[0].url;
  }
  if (profile.photoUrls && profile.photoUrls.length > 0) {
    return profile.photoUrls[0];
  }
  if (profile.avatarUrl) return profile.avatarUrl;

  return "";
};

const getAllPhotoUrls = (profile: AuraProfile): string[] => {
  const dating = getDating(profile);
  const datingPhotos = (dating.photos as { url: string }[]) || [];
  if (datingPhotos.length > 0) return datingPhotos.map((p) => p.url);

  if (profile.photos && profile.photos.length > 0) {
    return profile.photos.map((p) => p.url);
  }
  if (profile.photoUrls && profile.photoUrls.length > 0) {
    return profile.photoUrls;
  }
  return [];
};

const getLocationLabel = (profile: AuraProfile): string => {
  const dating = getDating(profile);

  const dob =
    dating.dateOfBirth ||
    (profile as any).dateOfBirth ||
    (profile as any).dob ||
    null;

  const age = dob ? getAgeFromDob(dob) : null;

  const country = dating.country || profile.country || null;
  // could also add city later if you want
  const parts = [
    age !== null ? `${age}` : profile.ageRange || null,
    country,
  ].filter(Boolean) as string[];

  return parts.join(" · ");
};

const getRelationshipIntentLabel = (profile: AuraProfile): string => {
  const dating = getDating(profile);
  const intent = dating.relationshipIntent || profile.relationshipIntent;

  switch (intent) {
    case "friends_only":
      return "Friends only";
    case "casual_dating":
      return "Casual dating";
    case "serious_relationship":
      return "Serious relationship";
    case "open_to_see":
      return "Open to see";
    default:
      return "";
  }
};

const getPreferredMatchLabel = (profile: AuraProfile): string => {
  const prefs = getPreferences(profile);
  const preferred =
    prefs.preferredGenders || profile.preferredMatchGender || undefined;

  switch (preferred) {
    case "women":
      return "Wants to meet: Women";
    case "men":
      return "Wants to meet: Men";
    case "women_and_men":
      return "Wants to meet: Women & Men";
    case "lgbtq_plus":
      return "Wants to meet: LGBTQ+";
    case "any":
      return "Wants to meet: Anyone";
    default:
      return "";
  }
};

export const ProfilePreviewPanel: React.FC<ProfilePreviewPanelProps> = ({
  profile,
  isOpen,
  onClose,
  title = "Profile",
  subtitle = "Aura profile preview",
}) => {
  if (!isOpen) return null;

  const dating = getDating(profile);
  const aura = getAura(profile);

  const avatarUrl = getPrimaryPhotoUrl(profile);
  const locationLabel = getLocationLabel(profile);
  const photoUrls = getAllPhotoUrls(profile);
  const topPhotos = photoUrls.slice(0, 3);

  const relationshipIntentLabel = getRelationshipIntentLabel(profile);
  const preferredMatchLabel = getPreferredMatchLabel(profile);

  // Summary: prefer aura summary, then root summary
  const summary =
    aura.summary ||
    profile.summary ||
    "Aura has a basic read on this person. As they add more details, this preview will feel more like a real dating card.";

  // Prompts, with fallback to aura / root fields
  const prompts = profile.prompts || {};
  const whatFeelsSafe =
    prompts.whatFeelsSafe || aura.whatFeelsSafe || profile.whatFeelsSafe || "";
  const whatShouldPeopleKnow =
    prompts.whatShouldPeopleKnow ||
    aura.whatShouldPeopleKnow ||
    profile.whatShouldPeopleKnow ||
    "";
  const idealFirstMessage =
    prompts.idealFirstMessage || profile.idealFirstMessage || "";
  const idealFirstMeeting =
    prompts.idealFirstMeeting || profile.idealFirstMeeting || "";
  const lifestyleNotes = prompts.lifestyleNotes || profile.lifestyleNotes || "";

  // Vibe / interests / topics / flags – prefer aura layer, fallback to root
  const vibeWords: string[] =
    (aura.vibeWords && aura.vibeWords.length > 0
      ? aura.vibeWords
      : profile.vibeWords) || [];

  const interests: string[] =
    (dating.interests && dating.interests.length > 0
      ? dating.interests
      : profile.interests) || [];

  const topicsLike: string[] =
    (aura.topicsLike && aura.topicsLike.length > 0
      ? aura.topicsLike
      : profile.topicsLike) || [];

  const topicsAvoid: string[] =
    (aura.topicsAvoid && aura.topicsAvoid.length > 0
      ? aura.topicsAvoid
      : profile.topicsAvoid) || [];

  const greenFlags: string[] =
    (aura.greenFlags && aura.greenFlags.length > 0
      ? aura.greenFlags
      : profile.greenFlags) || [];

  const redFlags: string[] =
    (aura.redFlags && aura.redFlags.length > 0
      ? aura.redFlags
      : profile.redFlags) || [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
      {/* backdrop */}
      <div className="flex-1" onClick={onClose} />
      <div className="w-full max-w-xs sm:max-w-sm h-full bg-slate-950/95 border-l border-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)] px-5 py-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              {title}
            </div>
            <div className="text-[10px] text-slate-400">{subtitle}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* profile header */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15 bg-slate-900/70">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/70 via-violet-500/70 to-sky-500/70" />
                <span className="relative z-10 flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-100">
              {profile.displayName}
            </span>
            <span className="text-[11px] text-slate-400">
              {locationLabel || "Age & location not set"}
            </span>
          </div>
        </div>

        {/* summary */}
        <div className="text-xs text-slate-300 bg-slate-900/60 border border-white/10 rounded-2xl p-3 leading-relaxed space-y-2 mt-2">
          <p>{summary}</p>
          {whatShouldPeopleKnow && (
            <p className="text-[11px] text-slate-400">
              What to know:{" "}
              <span className="text-slate-200">{whatShouldPeopleKnow}</span>
            </p>
          )}
          {lifestyleNotes && (
            <p className="text-[11px] text-slate-400">
              Lifestyle:{" "}
              <span className="text-slate-200">{lifestyleNotes}</span>
            </p>
          )}
        </div>

        {/* photos */}
        <section className="mt-3 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Photos
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {topPhotos.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/80"
              >
                <img
                  src={url}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
            {topPhotos.length === 0 && (
              <div className="col-span-3 text-[10px] text-slate-500">
                No photos added yet.
              </div>
            )}
          </div>
        </section>

        {/* Intent */}
        {(relationshipIntentLabel || preferredMatchLabel) && (
          <section className="mt-3 space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Intent
            </h3>
            <ProfileChips
              items={[relationshipIntentLabel, preferredMatchLabel].filter(
                Boolean,
              )}
              tone="intent"
            />
          </section>
        )}

        {/* Personality & interests */}
        <section className="mt-3 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            About
          </h3>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 space-y-3">
            {vibeWords.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">Vibe</p>
                <ProfileChips items={vibeWords.slice(0, 4)} tone="primary" />
              </div>
            )}

            {interests.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">
                  Interests / aesthetic
                </p>
                <p className="text-xs text-slate-200">
                  {interests.join(" · ")}
                </p>
              </div>
            )}

            {(topicsLike.length > 0 || topicsAvoid.length > 0) && (
              <div className="grid grid-cols-1 gap-2">
                {topicsLike.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-emerald-300/80">
                      Good topics to talk about
                    </p>
                    <p className="text-xs text-slate-200 line-clamp-2">
                      {topicsLike.join(", ")}
                    </p>
                  </div>
                )}
                {topicsAvoid.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-rose-300/80">
                      Topics they avoid
                    </p>
                    <p className="text-xs text-slate-200 line-clamp-2">
                      {topicsAvoid.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Conversation hints */}
        {(idealFirstMessage || idealFirstMeeting) && (
          <section className="mt-3 space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Conversation Hints
            </h3>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 space-y-3">
              {idealFirstMessage && (
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400">
                    They usually reply to...
                  </p>
                  <p className="text-xs text-slate-200">{idealFirstMessage}</p>
                </div>
              )}
              {idealFirstMeeting && (
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400">
                    Ideal first meet / date
                  </p>
                  <p className="text-xs text-slate-200">{idealFirstMeeting}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Safety */}
        {(whatFeelsSafe || greenFlags.length > 0 || redFlags.length > 0) && (
          <section className="mt-3 space-y-2 mb-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Safety
            </h3>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 space-y-3">
              {greenFlags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] text-emerald-300/80">Green flags</p>
                  <p className="text-xs text-slate-200">
                    {greenFlags.join(", ")}
                  </p>
                </div>
              )}
              {redFlags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] text-rose-300/80">Red flags</p>
                  <p className="text-xs text-slate-200">
                    {redFlags.join(", ")}
                  </p>
                </div>
              )}
              {whatFeelsSafe && (
                <div className="space-y-1">
                  <p className="text-[11px] text-sky-300/80">What feels safe</p>
                  <p className="text-xs text-slate-200">{whatFeelsSafe}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

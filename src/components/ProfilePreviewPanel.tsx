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

// Pull DOB from multiple possible places (legacy + new)
const getDobFromProfile = (profile: AuraProfile): string | null => {
  const anyProfile = profile as any;
  return (
    anyProfile.dateOfBirth ||
    anyProfile.dob ||
    profile.dating?.dateOfBirth ||
    null
  );
};

export const ProfilePreviewPanel: React.FC<ProfilePreviewPanelProps> = ({
  profile,
  isOpen,
  onClose,
  title = "Profile",
  subtitle = "Aura profile preview",
}) => {
  if (!isOpen) return null;

  // ---- RESOLVED CORE FIELDS (root first, then new nested) ----
  const dob = getDobFromProfile(profile);
  const age = dob ? getAgeFromDob(dob) : null;
  const ageLabel = age !== null ? `${age}` : profile.ageRange || null;

  const country = profile.country ?? profile.dating?.country ?? null;

  const locationLabel = [ageLabel ? `${ageLabel}` : null, country]
    .filter(Boolean)
    .join(" · ");

  const photoUrls: string[] =
    (profile.photos && profile.photos.map((p) => p.url)) ||
    (profile.photoUrls && profile.photoUrls) ||
    (profile.dating?.photos && profile.dating.photos.map((p) => p.url)) ||
    [];
  const topPhotos = photoUrls.slice(0, 3);

  const relationshipIntentValue =
    profile.relationshipIntent ??
    profile.dating?.relationshipIntent ??
    profile.preferences?.relationshipIntent;

  const relationshipIntentLabel = (() => {
    switch (relationshipIntentValue) {
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
  })();

  const preferredMatchValue =
    profile.preferredMatchGender ?? profile.preferences?.preferredGenders;

  const preferredMatchLabel = (() => {
    switch (preferredMatchValue) {
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
  })();

  const summary =
    profile.summary ?? profile.aura?.summary ?? profile.dating?.bio ?? "";

  const prompts = profile.prompts || {
    idealFirstMessage:
      profile.idealFirstMessage || profile.dating?.idealFirstMessage || "",
    idealFirstMeeting:
      profile.idealFirstMeeting || profile.dating?.idealFirstMeeting || "",
    lifestyleNotes: profile.lifestyleNotes || "",
    whatShouldPeopleKnow:
      profile.whatShouldPeopleKnow || profile.aura?.whatShouldPeopleKnow || "",
    whatFeelsSafe: profile.whatFeelsSafe || profile.aura?.whatFeelsSafe || "",
  };

  // Arrays: prefer root (kept in sync by EditProfileScreen), fallback to aura/dating
  const vibeWords =
    profile.vibeWords ?? profile.aura?.vibeWords ?? ([] as string[]);

  const interests =
    profile.interests ?? profile.dating?.interests ?? ([] as string[]);

  const topicsLike =
    profile.topicsLike ?? profile.aura?.topicsLike ?? ([] as string[]);

  const topicsAvoid =
    profile.topicsAvoid ?? profile.aura?.topicsAvoid ?? ([] as string[]);

  const greenFlags =
    profile.greenFlags ?? profile.aura?.greenFlags ?? ([] as string[]);

  const redFlags =
    profile.redFlags ?? profile.aura?.redFlags ?? ([] as string[]);

  const whatFeelsSafe =
    prompts.whatFeelsSafe ||
    profile.whatFeelsSafe ||
    profile.aura?.whatFeelsSafe ||
    "";

  const whatShouldPeopleKnow =
    prompts.whatShouldPeopleKnow ||
    profile.whatShouldPeopleKnow ||
    profile.aura?.whatShouldPeopleKnow ||
    "";

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
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
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
          <p>
            {summary ||
              "Aura has a basic read on this person. As they add more details, this preview will feel more like a real dating card."}
          </p>
          {whatShouldPeopleKnow && (
            <p className="text-[11px] text-slate-400">
              What to know:{" "}
              <span className="text-slate-200">{whatShouldPeopleKnow}</span>
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
        <section className="mt-3 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Conversation Hints
          </h3>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 space-y-3">
            {prompts.idealFirstMessage && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">
                  They usually reply to...
                </p>
                <p className="text-xs text-slate-200">
                  {prompts.idealFirstMessage}
                </p>
              </div>
            )}
            {prompts.idealFirstMeeting && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">
                  Ideal first meet / date
                </p>
                <p className="text-xs text-slate-200">
                  {prompts.idealFirstMeeting}
                </p>
              </div>
            )}
          </div>
        </section>

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

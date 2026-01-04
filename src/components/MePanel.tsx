// src/components/MePanel.tsx
import React from "react";
import { AuraProfile, RelationshipIntent } from "../types";
import { ProfileChips } from "./ProfileChips";

interface MePanelProps {
  profile: AuraProfile;
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

const buildLifestyleLine = (profile: AuraProfile): string => {
  const lifestyle = profile.dating?.lifestyle;
  if (!lifestyle) return "";

  const bits: string[] = [];

  if (lifestyle.smoking && lifestyle.smoking !== "prefer_not_say") {
    if (lifestyle.smoking === "no") bits.push("Non-smoker");
    if (lifestyle.smoking === "sometimes") bits.push("Smokes sometimes");
    if (lifestyle.smoking === "yes") bits.push("Smokes");
  }

  if (lifestyle.drinking && lifestyle.drinking !== "prefer_not_say") {
    if (lifestyle.drinking === "no") bits.push("Doesn’t drink");
    if (lifestyle.drinking === "sometimes") bits.push("Drinks sometimes");
    if (lifestyle.drinking === "yes") bits.push("Drinks");
  }

  if (lifestyle.kids && lifestyle.kids !== "prefer_not_say") {
    if (lifestyle.kids === "dont_want") bits.push("Doesn’t want kids");
    if (lifestyle.kids === "want_some_day") bits.push("Wants kids someday");
    if (lifestyle.kids === "have_and_done") bits.push("Has kids & done");
    if (lifestyle.kids === "have_and_open") bits.push("Has kids & open");
  }

  if (lifestyle.sleepSchedule && lifestyle.sleepSchedule !== "prefer_not_say") {
    if (lifestyle.sleepSchedule === "early_bird") bits.push("Early bird");
    if (lifestyle.sleepSchedule === "night_owl") bits.push("Night owl");
    if (lifestyle.sleepSchedule === "flexible") bits.push("Flexible sleeper");
  }

  if (lifestyle.pets && lifestyle.pets.length > 0) {
    bits.push(`Pets: ${lifestyle.pets.join(", ")}`);
  }

  if (lifestyle.jobOrStudy) {
    bits.push(lifestyle.jobOrStudy);
  }

  return bits.join(" · ");
};

const relationshipIntentLabel = (intent?: RelationshipIntent): string => {
  switch (intent) {
    case "friends_only":
      return "Open to: Friends only";
    case "casual_dating":
      return "Open to: Casual dating";
    case "serious_relationship":
      return "Open to: Serious relationship";
    case "open_to_see":
      return "Open to: See what happens";
    default:
      return "";
  }
};

export const MePanel: React.FC<MePanelProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const dating = profile.dating;
  const aura = profile.aura;
  const photos = dating?.photos || [];
  const primaryPhoto = photos.find((p) => p.isPrimary) || photos[0];
  const age = dating?.dateOfBirth ? getAgeFromDob(dating.dateOfBirth) : null;
  const ageLabel = age != null ? `${age}` : null;
  const locationBits = [
    ageLabel,
    dating?.city || null,
    (!dating?.city && dating?.country) || null,
  ].filter(Boolean);
  const locationLabel = locationBits.join(" · ");

  const lifestyleLine = buildLifestyleLine(profile);
  const intentText =
    relationshipIntentLabel(
      dating?.relationshipIntent || profile.relationshipIntent,
    ) || "";

  const interests = dating?.interests || profile.interests || [];
  const vibeWords = aura?.vibeWords || profile.vibeWords || [];
  const musicTaste = dating?.musicTaste || profile.musicTaste;
  const bio = dating?.bio || "";
  const summary = aura?.summary || profile.summary;

  const greenFlags = aura?.greenFlags || profile.greenFlags || [];
  const redFlags = aura?.redFlags || profile.redFlags || [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
      {/* backdrop */}
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-xs sm:max-w-sm h-full bg-slate-950/95 border-l border-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)] px-5 py-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Me
            </div>
            <div className="text-[10px] text-slate-400">
              Your Aura dating profile
            </div>
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
            {primaryPhoto ? (
              <img
                src={primaryPhoto.url}
                alt={profile.displayName}
                className="h-full w-full object-cover"
              />
            ) : profile.avatarUrl ? (
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
              {dating?.displayName || profile.displayName}
            </span>
            <span className="text-[11px] text-slate-400">
              {locationLabel || "Age & location not set"}
            </span>
          </div>
        </div>

        {/* summary / bio */}
        <div className="text-xs text-slate-300 bg-slate-900/60 border border-white/10 rounded-2xl p-3 leading-relaxed space-y-2 mt-2">
          {bio && <p className="text-slate-200">{bio}</p>}
          {summary && summary !== bio && (
            <p className="text-[11px] text-slate-400">
              Aura&apos;s read:{" "}
              <span className="text-slate-200">{summary}</span>
            </p>
          )}
          {!bio && !summary && (
            <p className="text-slate-300">
              Aura has a basic read on you. As you add more details, this panel
              will feel more like a real dating profile.
            </p>
          )}
        </div>

        {/* photos mini grid */}
        <section className="mt-3 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Photos
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/80"
              >
                <img
                  src={p.url}
                  alt="Profile"
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
            {photos.length === 0 && (
              <div className="col-span-3 text-[10px] text-slate-500">
                No photos added yet.
              </div>
            )}
          </div>
        </section>

        {/* vibe + interests */}
        <section className="mt-3 space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Vibe & Interests
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
                <p className="text-[11px] text-slate-400">Interests</p>
                <ProfileChips items={interests.slice(0, 8)} tone="secondary" />
              </div>
            )}

            {musicTaste && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">Music</p>
                <p className="text-xs text-slate-200">{musicTaste}</p>
              </div>
            )}
          </div>
        </section>

        {/* lifestyle */}
        {lifestyleLine && (
          <section className="mt-3 space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Lifestyle
            </h3>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3">
              <p className="text-xs text-slate-200">{lifestyleLine}</p>
            </div>
          </section>
        )}

        {/* intent */}
        {(intentText || profile.preferences) && (
          <section className="mt-3 space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Intent
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {intentText && (
                <ProfileChips items={[intentText]} tone="intent" />
              )}
              {profile.preferences && (
                <ProfileChips
                  items={[
                    `Seeing ages ${profile.preferences.minAge}-${profile.preferences.maxAge}`,
                  ]}
                  tone="secondary"
                />
              )}
            </div>
          </section>
        )}

        {/* safety */}
        {(greenFlags.length > 0 ||
          redFlags.length > 0 ||
          aura?.whatFeelsSafe ||
          profile.whatFeelsSafe) && (
          <section className="mt-3 space-y-2 mb-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Safety & Boundaries
            </h3>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 space-y-3">
              {greenFlags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] text-emerald-300/80">Green flags</p>
                  <p className="text-xs text-slate-200">
                    {greenFlags.slice(0, 4).join(", ")}
                  </p>
                </div>
              )}
              {redFlags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] text-rose-300/80">Red flags</p>
                  <p className="text-xs text-slate-200">
                    {redFlags.slice(0, 4).join(", ")}
                  </p>
                </div>
              )}
              {(aura?.whatFeelsSafe || profile.whatFeelsSafe) && (
                <div className="space-y-1">
                  <p className="text-[11px] text-sky-300/80">What feels safe</p>
                  <p className="text-xs text-slate-200">
                    {aura?.whatFeelsSafe || profile.whatFeelsSafe}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* footer buttons (Edit profile - future) */}
        <div className="mt-auto pt-3 border-t border-white/10 flex gap-2">
          <button
            type="button"
            className="flex-1 px-3 py-2 rounded-full bg-white/5 border border-white/15 text-[11px] text-slate-100 hover:bg-white/10 transition-colors"
            disabled
          >
            Edit profile (soon)
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-full bg-white/5 border border-white/15 text-[11px] text-slate-300 hover:bg-white/10 transition-colors"
            disabled
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { AuraProfile } from "../types";

interface ProfileScreenProps {
  profile: AuraProfile;
  onProfileUpdate: (updated: AuraProfile) => void;
}

/**
 * Editable profile page:
 * - Shows main photo + basic info
 * - Lets user edit dating-style fields + safety + interests
 * - On save, calls onProfileUpdate(updatedProfile)
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onProfileUpdate,
}) => {
  const [local, setLocal] = useState({
    displayName: profile.displayName || "",
    ageRange: profile.ageRange || "",
    country: profile.country || "",
    summary: profile.summary || "",

    primaryPhotoUrl: profile.primaryPhotoUrl || "",
    photo2Url: profile.photo2Url || "",
    photo3Url: profile.photo3Url || "",

    relationshipIntent: profile.relationshipIntent ?? "open_to_see",
    preferredMatchGender: profile.preferredMatchGender ?? "any",

    interests: profile.interests || "",
    idealFirstMessage: profile.idealFirstMessage || "",
    idealFirstMeeting: profile.idealFirstMeeting || "",
    lifestyleNotes: profile.lifestyleNotes || "",

    vibeWords: (profile.vibeWords || []).join(", "),
    topicsLike: (profile.topicsLike || []).join(", "),
    topicsAvoid: (profile.topicsAvoid || []).join(", "),

    hardBoundaries: (profile.hardBoundaries || []).join(", "),
    greenFlags: (profile.greenFlags || []).join(", "),
    redFlags: (profile.redFlags || []).join(", "),
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof typeof local, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const parseList = (value: string): string[] =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = () => {
    setSaving(true);

    const updated: AuraProfile = {
      ...profile,
      displayName: local.displayName.trim() || profile.displayName,
      ageRange: local.ageRange || null,
      country: local.country || null,
      summary: local.summary || profile.summary,

      primaryPhotoUrl: local.primaryPhotoUrl || null,
      photo2Url: local.photo2Url || null,
      photo3Url: local.photo3Url || null,

      relationshipIntent:
        local.relationshipIntent as AuraProfile["relationshipIntent"],
      preferredMatchGender:
        local.preferredMatchGender as AuraProfile["preferredMatchGender"],

      interests: local.interests || null,
      idealFirstMessage: local.idealFirstMessage || null,
      idealFirstMeeting: local.idealFirstMeeting || null,
      lifestyleNotes: local.lifestyleNotes || null,

      vibeWords: parseList(local.vibeWords),
      topicsLike: parseList(local.topicsLike),
      topicsAvoid: parseList(local.topicsAvoid),
      hardBoundaries: parseList(local.hardBoundaries),
      greenFlags: parseList(local.greenFlags),
      redFlags: parseList(local.redFlags),
    };

    onProfileUpdate(updated);
    setSaving(false);
  };

  const mainPhoto =
    local.primaryPhotoUrl || profile.avatarUrl || profile.primaryPhotoUrl || "";

  return (
    <div className="w-full bg-slate-950/60 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row">
      {/* Left: visual card */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 flex flex-col items-center gap-4">
        <div className="relative w-40 h-40 rounded-3xl overflow-hidden bg-slate-900/80 border border-white/10 shadow-[0_0_40px_rgba(15,23,42,1)] flex items-center justify-center">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={local.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-3xl font-semibold text-white">
              {local.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-white">
            {local.displayName || profile.displayName}
          </h2>
          <p className="text-xs text-slate-400">
            {local.ageRange || "Age range not set"}
            {local.country && " · "}
            {local.country}
          </p>
        </div>

        <div className="text-[11px] text-slate-400 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 max-w-xs">
          <p className="text-slate-200 text-xs mb-1">Profile summary</p>
          <p className="line-clamp-4">
            {local.summary || "Tell Aura how to introduce you to other people."}
          </p>
        </div>
      </div>

      {/* Right: editable form */}
      <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
        {/* Photos */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Photos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="space-y-1">
              <label className="text-slate-400 ml-1">Main photo URL</label>
              <input
                type="text"
                value={local.primaryPhotoUrl}
                onChange={(e) =>
                  handleChange("primaryPhotoUrl", e.target.value)
                }
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/20"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 ml-1">Photo 2 URL</label>
              <input
                type="text"
                value={local.photo2Url}
                onChange={(e) => handleChange("photo2Url", e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/20"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 ml-1">Photo 3 URL</label>
              <input
                type="text"
                value={local.photo3Url}
                onChange={(e) => handleChange("photo3Url", e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/20"
                placeholder="Optional"
              />
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-white/5" />

        {/* Connection intent */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Connection Intent
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div className="space-y-2">
              <p className="text-slate-400 ml-1">What are you open to?</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "friends_only", label: "Friends only" },
                  { id: "casual_dating", label: "Casual dating" },
                  { id: "serious_relationship", label: "Serious relationship" },
                  { id: "open_to_see", label: "Open to see" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() =>
                      handleChange(
                        "relationshipIntent",
                        opt.id as typeof local.relationshipIntent,
                      )
                    }
                    className={`py-2 rounded-xl border px-2 transition-all ${
                      local.relationshipIntent === opt.id
                        ? "bg-violet-500/20 border-violet-400/70 text-violet-100 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-400 ml-1">Who do you want to meet?</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "any", label: "Anyone" },
                  { id: "women", label: "Women" },
                  { id: "men", label: "Men" },
                  { id: "women_and_men", label: "Women & Men" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() =>
                      handleChange(
                        "preferredMatchGender",
                        opt.id as typeof local.preferredMatchGender,
                      )
                    }
                    className={`py-2 rounded-xl border px-2 transition-all ${
                      local.preferredMatchGender === opt.id
                        ? "bg-blue-500/20 border-blue-400/70 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-white/5" />

        {/* Personality & interests */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Personality & Interests
          </h3>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">Summary</label>
            <textarea
              value={local.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              rows={2}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/20 resize-none"
              placeholder="Short description Aura can use when introducing you."
            />
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">
              Vibe words (comma separated)
            </label>
            <input
              type="text"
              value={local.vibeWords}
              onChange={(e) => handleChange("vibeWords", e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60"
              placeholder="calm, sarcastic, dreamy..."
            />
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">
              Interests / aesthetic (free text)
            </label>
            <input
              type="text"
              value={local.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60"
              placeholder="anime, gym, travel, cozy nights..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="space-y-2">
              <label className="text-slate-400 ml-1">
                Topics you like (comma separated)
              </label>
              <textarea
                value={local.topicsLike}
                onChange={(e) => handleChange("topicsLike", e.target.value)}
                rows={2}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 ml-1">
                Topics you avoid (comma separated)
              </label>
              <textarea
                value={local.topicsAvoid}
                onChange={(e) => handleChange("topicsAvoid", e.target.value)}
                rows={2}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 resize-none"
              />
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-white/5" />

        {/* Safety & first contact */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Safety & First Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="space-y-2">
              <label className="text-slate-400 ml-1">
                Hard boundaries (comma separated)
              </label>
              <textarea
                value={local.hardBoundaries}
                onChange={(e) => handleChange("hardBoundaries", e.target.value)}
                rows={2}
                className="w-full bg-slate-950/60 border border-red-900/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500/60 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 ml-1">
                Green flags (comma separated)
              </label>
              <textarea
                value={local.greenFlags}
                onChange={(e) => handleChange("greenFlags", e.target.value)}
                rows={2}
                className="w-full bg-slate-950/60 border border-emerald-900/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/60 resize-none"
              />
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">
              Red flags (comma separated)
            </label>
            <textarea
              value={local.redFlags}
              onChange={(e) => handleChange("redFlags", e.target.value)}
              rows={2}
              className="w-full bg-slate-950/60 border border-red-900/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500/60 resize-none"
            />
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">
              What kind of first message makes you reply?
            </label>
            <textarea
              value={local.idealFirstMessage}
              onChange={(e) =>
                handleChange("idealFirstMessage", e.target.value)
              }
              rows={2}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 resize-none"
            />
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">
              Ideal first meet / date
            </label>
            <textarea
              value={local.idealFirstMeeting}
              onChange={(e) =>
                handleChange("idealFirstMeeting", e.target.value)
              }
              rows={2}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 resize-none"
            />
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="text-slate-400 ml-1">
              Lifestyle notes (optional)
            </label>
            <textarea
              value={local.lifestyleNotes}
              onChange={(e) => handleChange("lifestyleNotes", e.target.value)}
              rows={2}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400/60 resize-none"
            />
          </div>
        </section>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-slate-100 hover:bg-white/15 hover:border-white/30 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

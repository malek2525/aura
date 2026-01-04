// src/storage/profileStorage.ts
import {
  AuraProfile,
  AuraPersonality,
  DatingProfile,
  MatchPreferences,
  ProfilePhoto,
  LifestyleInfo,
  RelationshipIntent,
  MatchGenderPreference,
} from "../../types";

const STORAGE_PREFIX = "aura_profile_v2_";
const getKey = (userId: string) => `${STORAGE_PREFIX}${userId}`;

/* ------------------------------------------------------- */
/* UTILITY HELPERS                                          */
/* ------------------------------------------------------- */

function computeDefaultPhotos(raw: any): ProfilePhoto[] {
  // Accept older fields: photoUrls, photos
  if (Array.isArray(raw?.dating?.photos)) return raw.dating.photos;

  if (Array.isArray(raw?.photos)) {
    return raw.photos.map((p: any, i: number) => ({
      id: p.id ?? `migrated_${i}`,
      url: p.url,
      isPrimary: i === 0,
      position: i,
    }));
  }

  if (Array.isArray(raw?.photoUrls)) {
    return raw.photoUrls.map((url: string, i: number) => ({
      id: `migrated_${i}`,
      url,
      isPrimary: i === 0,
      position: i,
    }));
  }

  return [];
}

function migrateAura(raw: any): AuraPersonality {
  return {
    introversionLevel:
      raw?.aura?.introversionLevel ?? raw?.introversionLevel ?? 5,
    goals: raw?.aura?.goals ?? raw?.goals ?? [],
    vibeWords: raw?.aura?.vibeWords ?? raw?.vibeWords ?? [],
    topicsLike: raw?.aura?.topicsLike ?? raw?.topicsLike ?? [],
    topicsAvoid: raw?.aura?.topicsAvoid ?? raw?.topicsAvoid ?? [],
    socialSpeed: raw?.aura?.socialSpeed ?? raw?.socialSpeed ?? "slow",
    hardBoundaries: raw?.aura?.hardBoundaries ?? raw?.hardBoundaries ?? [],
    greenFlags: raw?.aura?.greenFlags ?? raw?.greenFlags ?? [],
    redFlags: raw?.aura?.redFlags ?? raw?.redFlags ?? [],
    whatFeelsSafe: raw?.aura?.whatFeelsSafe ?? raw?.whatFeelsSafe,
    whatShouldPeopleKnow:
      raw?.aura?.whatShouldPeopleKnow ?? raw?.whatShouldPeopleKnow,
    summary: raw?.aura?.summary ?? raw?.summary ?? "",
  };
}

function migrateDating(raw: any): DatingProfile {
  const photos = computeDefaultPhotos(raw);

  return {
    displayName: raw?.dating?.displayName ?? raw?.displayName ?? "User",
    dateOfBirth: raw?.dating?.dateOfBirth ?? raw?.dateOfBirth ?? "2000-01-01",
    gender: raw?.dating?.gender,
    orientation: raw?.dating?.orientation,
    country: raw?.dating?.country ?? raw?.country ?? null,
    city: raw?.dating?.city ?? null,

    photos,

    bio: raw?.dating?.bio ?? raw?.bio,
    favoriteQuote: raw?.dating?.favoriteQuote ?? raw?.favoriteQuote,
    musicTaste: raw?.dating?.musicTaste ?? raw?.musicTaste,
    interests: raw?.dating?.interests ?? raw?.interests,

    idealFirstMessage: raw?.dating?.idealFirstMessage ?? raw?.idealFirstMessage,
    idealFirstMeeting: raw?.dating?.idealFirstMeeting ?? raw?.idealFirstMeeting,

    lifestyle:
      raw?.dating?.lifestyle ??
      ({
        smoking: raw?.smoking,
        drinking: raw?.drinking,
        kids: raw?.kids,
        pets: raw?.pets,
        sleepSchedule: raw?.sleepSchedule,
        religionNote: raw?.religionNote,
        jobOrStudy: raw?.jobOrStudy,
      } as LifestyleInfo),

    relationshipIntent:
      raw?.dating?.relationshipIntent ?? raw?.relationshipIntent,
  };
}

function migratePreferences(raw: any): MatchPreferences {
  return {
    preferredGenders:
      raw?.preferences?.preferredGenders ??
      raw?.preferredMatchGender ??
      ("any" as MatchGenderPreference),

    minAge: raw?.preferences?.minAge ?? 18,
    maxAge: raw?.preferences?.maxAge ?? 35,

    relationshipIntent:
      raw?.preferences?.relationshipIntent ?? raw?.relationshipIntent,
  };
}

/* ------------------------------------------------------- */
/* LOADING WITH AUTOMATIC MIGRATION                        */
/* ------------------------------------------------------- */

export function loadAuraProfile(userId: string): AuraProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const rawStr = window.localStorage.getItem(getKey(userId));
    if (!rawStr) return null;

    const raw = JSON.parse(rawStr);

    // If already valid → return as-is
    if (raw?.aura && raw?.dating && raw?.preferences) {
      return raw as AuraProfile;
    }

    // Otherwise → MIGRATE old structure into new v2
    const migrated: AuraProfile = {
      id: raw?.id ?? `profile_${userId}`,
      userId,
      displayName: raw?.displayName ?? raw?.dating?.displayName ?? "User",

      aura: migrateAura(raw),
      dating: migrateDating(raw),
      preferences: migratePreferences(raw),

      avatarUrl: raw?.avatarUrl ?? raw?.photoUrls?.[0],

      // keep all legacy fields to not break UI
      ...raw,
    };

    // Save migrated version
    persistAuraProfile(migrated, userId);

    return migrated;
  } catch (err) {
    console.error("[profileStorage] Failed to load profile", err);
    return null;
  }
}

/* ------------------------------------------------------- */
/* SAVE                                                     */
/* ------------------------------------------------------- */

export function persistAuraProfile(profile: AuraProfile, userId: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getKey(userId), JSON.stringify(profile));
  } catch (err) {
    console.error("[profileStorage] Failed to save profile", err);
  }
}

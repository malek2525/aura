// src/services/matchService.ts
import {
  AuraProfile,
  AuraPersonality,
  DatingProfile,
  MatchPreferences,
} from "../types";

export interface PublicProfileSummary {
  uid: string;
  auraProfile: AuraProfile;
  lastActiveAt?: number;
}

export interface MatchLike {
  fromUid: string;
  toUid: string;
  createdAt: number;
}

export interface MatchPair {
  id: string;
  userA: string;
  userB: string;
  createdAt: number;
  compatibilityScore?: number;
}

// For UI: a single match + the OTHER user's profile
export interface MatchWithProfile {
  match: MatchPair;
  other: PublicProfileSummary;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to build a demo AuraProfile in v2 shape
 * while also populating legacy flat fields so the rest
 * of the app keeps working during migration.
 */
const buildDemoProfile = (params: {
  uid: string;
  displayName: string;
  ageRange: string;
  country: string;
  introversionLevel: number;
  goals: string[];
  vibeWords: string[];
  topicsLike: string[];
  topicsAvoid: string[];
  socialSpeed: "slow" | "normal" | "fast";
  hardBoundaries: string[];
  greenFlags: string[];
  redFlags: string[];
  summary: string;
  relationshipIntent:
    | "friends_only"
    | "casual_dating"
    | "serious_relationship"
    | "open_to_see";
  preferredMatchGender:
    | "any"
    | "women"
    | "men"
    | "women_and_men"
    | "lgbtq_plus";
}): AuraProfile => {
  const {
    uid,
    displayName,
    ageRange,
    country,
    introversionLevel,
    goals,
    vibeWords,
    topicsLike,
    topicsAvoid,
    socialSpeed,
    hardBoundaries,
    greenFlags,
    redFlags,
    summary,
    relationshipIntent,
    preferredMatchGender,
  } = params;

  const aura: AuraPersonality = {
    introversionLevel,
    goals,
    vibeWords,
    topicsLike,
    topicsAvoid,
    socialSpeed,
    hardBoundaries,
    greenFlags,
    redFlags,
    // For demo profiles we keep these simple
    whatFeelsSafe: undefined,
    whatShouldPeopleKnow: undefined,
    summary,
  };

  const dating: DatingProfile = {
    displayName,
    // Demo DOBs – not important, ageRange is still used for them
    dateOfBirth: "2000-01-01",
    gender: undefined,
    orientation: undefined,
    country,
    city: null,
    photos: [],

    bio: summary,
    favoriteQuote: undefined,
    musicTaste: undefined,
    interests: topicsLike,

    idealFirstMessage: undefined,
    idealFirstMeeting: undefined,

    lifestyle: undefined,
    relationshipIntent,
  };

  const preferences: MatchPreferences = {
    preferredGenders: preferredMatchGender,
    minAge: 18,
    maxAge: 40,
    relationshipIntent,
  };

  const profile: AuraProfile = {
    id: uid,
    userId: uid,
    displayName,

    aura,
    dating,
    preferences,

    avatarUrl: undefined,

    // -------- LEGACY MIRROR FIELDS (for compatibility) --------
    ageRange,
    country,

    introversionLevel,
    goals,
    vibeWords,
    topicsLike,
    topicsAvoid,
    socialSpeed,
    hardBoundaries,
    greenFlags,
    redFlags,
    whatFeelsSafe: aura.whatFeelsSafe,
    whatShouldPeopleKnow: aura.whatShouldPeopleKnow,
    summary,

    photoUrls: [],
    photos: [],

    relationshipIntent,
    preferredMatchGender,

    idealFirstMessage: dating.idealFirstMessage,
    idealFirstMeeting: dating.idealFirstMeeting,
    lifestyleNotes: "",

    musicTaste: dating.musicTaste,
    favoriteQuote: dating.favoriteQuote,
    interests: dating.interests,

    prompts: {
      idealFirstMessage: dating.idealFirstMessage,
      idealFirstMeeting: dating.idealFirstMeeting,
      lifestyleNotes: "",
      whatShouldPeopleKnow: aura.whatShouldPeopleKnow,
      whatFeelsSafe: aura.whatFeelsSafe,
    },
  };

  return profile;
};

// --- mock profiles for Discover (demo only) ---
const MOCK_PROFILES: PublicProfileSummary[] = [
  {
    uid: "demo_lina",
    auraProfile: buildDemoProfile({
      uid: "demo_lina",
      displayName: "Lina",
      ageRange: "22-27",
      country: "Germany",
      introversionLevel: 6,
      goals: ["friends", "practice_talking"],
      vibeWords: ["thoughtful", "kind", "curious"],
      topicsLike: ["art", "music", "late-night walks"],
      topicsAvoid: ["politics"],
      socialSpeed: "slow",
      hardBoundaries: ["no explicit content", "no heavy drama"],
      greenFlags: ["honesty", "emotional maturity"],
      redFlags: ["ghosting", "mocking others"],
      summary:
        "Quiet, gentle energy. Loves late-night walks, music, and people who move slowly.",
      relationshipIntent: "open_to_see",
      preferredMatchGender: "any",
    }),
    lastActiveAt: Date.now() - 1000 * 60 * 2,
  },
  {
    uid: "demo_samir",
    auraProfile: buildDemoProfile({
      uid: "demo_samir",
      displayName: "Samir",
      ageRange: "24-30",
      country: "Turkey",
      introversionLevel: 4,
      goals: ["friends", "serious_relationship"],
      vibeWords: ["warm", "protective", "sarcastic"],
      topicsLike: ["football", "anime", "coffee shops"],
      topicsAvoid: ["unnecessary drama"],
      socialSpeed: "normal",
      hardBoundaries: ["no yelling", "no ghosting"],
      greenFlags: ["clear communication", "effort"],
      redFlags: ["games", "ego fights"],
      summary:
        "Warm but sarcastic, secretly soft. Loves quiet coffee dates and late-night Discord calls.",
      relationshipIntent: "serious_relationship",
      preferredMatchGender: "women",
    }),
    lastActiveAt: Date.now() - 1000 * 60 * 15,
  },
  {
    uid: "demo_aya",
    auraProfile: buildDemoProfile({
      uid: "demo_aya",
      displayName: "Aya",
      ageRange: "20-25",
      country: "Hungary",
      introversionLevel: 8,
      goals: ["practice_talking"],
      vibeWords: ["shy", "observant", "sweet"],
      topicsLike: ["books", "cozy games", "cats"],
      topicsAvoid: ["loud parties"],
      socialSpeed: "slow",
      hardBoundaries: ["no pressure to call", "no yelling"],
      greenFlags: ["patience", "gentle teasing"],
      redFlags: ["pushiness"],
      summary:
        "Soft introvert who prefers cozy nights, cats, and people who text gently.",
      relationshipIntent: "friends_only",
      preferredMatchGender: "any",
    }),
    lastActiveAt: Date.now() - 1000 * 60 * 45,
  },
];

// in-memory likes & matches (demo only)
let LIKES: MatchLike[] = [];
let MATCHES: MatchPair[] = [];

const ensureOrder = (a: string, b: string): [string, string] =>
  a < b ? [a, b] : [b, a];

const findPublicProfile = (uid: string): PublicProfileSummary | null => {
  const found = MOCK_PROFILES.find((p) => p.uid === uid);
  return found || null;
};

export async function fetchDiscoverProfiles(
  currentUid: string,
): Promise<PublicProfileSummary[]> {
  await delay(200);
  return MOCK_PROFILES.filter((p) => p.uid !== currentUid);
}

export async function likeProfile(
  currentUid: string,
  targetUid: string,
): Promise<{ isNewMatch: boolean }> {
  await delay(150);

  LIKES.push({
    fromUid: currentUid,
    toUid: targetUid,
    createdAt: Date.now(),
  });

  const reverse = LIKES.find(
    (l) => l.fromUid === targetUid && l.toUid === currentUid,
  );

  if (!reverse) {
    return { isNewMatch: false };
  }

  const [userA, userB] = ensureOrder(currentUid, targetUid);

  let existing = MATCHES.find((m) => m.userA === userA && m.userB === userB);

  if (!existing) {
    existing = {
      id: `match_${userA}_${userB}_${Date.now()}`,
      userA,
      userB,
      createdAt: Date.now(),
      compatibilityScore: 70 + Math.floor(Math.random() * 20),
    };
    MATCHES.push(existing);
  }

  return { isNewMatch: true };
}

export async function fetchMatches(
  currentUid: string,
): Promise<MatchWithProfile[]> {
  await delay(200);

  const relevant = MATCHES.filter(
    (m) => m.userA === currentUid || m.userB === currentUid,
  );

  const result: MatchWithProfile[] = [];
  for (const match of relevant) {
    const otherUid = match.userA === currentUid ? match.userB : match.userA;
    const otherProfile = findPublicProfile(otherUid);
    if (!otherProfile) continue;
    result.push({ match, other: otherProfile });
  }

  return result;
}

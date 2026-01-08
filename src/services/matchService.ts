
import {
  AuraProfile,
  AuraPersonality,
  DatingProfile,
  MatchPreferences,
  UserProfile
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

export interface MatchWithProfile {
  match: MatchPair;
  other: PublicProfileSummary;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildDemoProfile = (params: any): UserProfile => {
  return {
    id: params.uid,
    userId: params.uid,
    name: params.displayName,
    displayName: params.displayName,
    age: 25, 
    job: "Dreamer",
    location: params.country || "Unknown",
    distance: 5,
    verified: true,
    bio: params.summary,
    photos: ["https://picsum.photos/400/600?random=" + Math.floor(Math.random() * 100)],
    auraRead: params.summary,
    vibeTags: params.vibeWords,
    verificationScore: 80,
    verificationTier: 'Silver',
    stories: [],
    interests: params.topicsLike,
    prompts: [],
    details: {
        height: "170cm",
        exercise: "Sometimes",
        education: "Bachelors",
        drinking: "Socially",
        smoking: "No",
        lookingFor: params.relationshipIntent,
        starSign: "Libra",
        languages: ["English"]
    },
    // Deep Fields
    goals: params.goals,
    vibeWords: params.vibeWords,
    topicsLike: params.topicsLike,
    topicsAvoid: params.topicsAvoid,
    socialSpeed: params.socialSpeed,
    greenFlags: params.greenFlags,
    redFlags: params.redFlags,
    introversionLevel: params.introversionLevel,
  };
};

const MOCK_PROFILES: PublicProfileSummary[] = [
  {
    uid: "demo_lina",
    auraProfile: buildDemoProfile({
      uid: "demo_lina",
      displayName: "Lina",
      country: "Germany",
      introversionLevel: 6,
      goals: ["friends", "practice_talking"],
      vibeWords: ["thoughtful", "kind", "curious"],
      topicsLike: ["art", "music", "late-night walks"],
      topicsAvoid: ["politics"],
      socialSpeed: "slow",
      greenFlags: ["honesty", "emotional maturity"],
      redFlags: ["ghosting", "mocking others"],
      summary: "Quiet, gentle energy. Loves late-night walks.",
      relationshipIntent: "open_to_see",
    }),
    lastActiveAt: Date.now(),
  },
  {
    uid: "demo_samir",
    auraProfile: buildDemoProfile({
      uid: "demo_samir",
      displayName: "Samir",
      country: "Turkey",
      introversionLevel: 4,
      goals: ["friends", "serious_relationship"],
      vibeWords: ["warm", "protective", "sarcastic"],
      topicsLike: ["football", "anime", "coffee shops"],
      topicsAvoid: ["unnecessary drama"],
      socialSpeed: "normal",
      greenFlags: ["clear communication", "effort"],
      redFlags: ["games", "ego fights"],
      summary: "Warm but sarcastic, secretly soft.",
      relationshipIntent: "serious_relationship",
    }),
    lastActiveAt: Date.now(),
  },
  {
    uid: "demo_aya",
    auraProfile: buildDemoProfile({
      uid: "demo_aya",
      displayName: "Aya",
      country: "Hungary",
      introversionLevel: 8,
      goals: ["practice_talking"],
      vibeWords: ["shy", "observant", "sweet"],
      topicsLike: ["books", "cozy games", "cats"],
      topicsAvoid: ["loud parties"],
      socialSpeed: "slow",
      greenFlags: ["patience", "gentle teasing"],
      redFlags: ["pushiness"],
      summary: "Soft introvert who prefers cozy nights.",
      relationshipIntent: "friends_only",
    }),
    lastActiveAt: Date.now(),
  },
];

let LIKES: MatchLike[] = [];
let MATCHES: MatchPair[] = [];

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

  // Mock immediate match for demo if target is demo_aya
  if (targetUid === 'demo_aya') {
      const matchId = `match_${Date.now()}`;
      MATCHES.push({
          id: matchId,
          userA: currentUid,
          userB: targetUid,
          createdAt: Date.now(),
          compatibilityScore: 85
      });
      return { isNewMatch: true };
  }

  return { isNewMatch: false };
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
    const otherProfile = MOCK_PROFILES.find((p) => p.uid === otherUid);
    if (!otherProfile) continue;
    result.push({ match, other: otherProfile });
  }
  return result;
}

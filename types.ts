export type SocialSpeed = "slow" | "normal" | "fast";

export interface AuraProfile {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  vibeTags?: string[];
  ageRange?: string | null;
  country?: string | null;

  introversionLevel: number; // 1–10
  goals: string[];           // ["friends", "practice_talking"]

  vibeWords: string[];       // ["calm", "playful", "deep"]
  topicsLike: string[];
  topicsAvoid: string[];

  socialSpeed: SocialSpeed;
  hardBoundaries: string[];
  greenFlags: string[];
  redFlags: string[];

  summary: string;
}

export interface AuraState {
  mood: string;
  moodIntensity: number; // 0–1
}

export interface AuraChatMessage {
  id: string;
  from: "user" | "aura";
  text: string;
  timestamp: number;
}

export interface MatchResult {
  compatibilityScore: number;
  compatibilityLabel: "low" | "medium" | "high";
  matchReasons: string[];
  riskFlags: string[];
  suggestedOpeningForUserA: string;
  suggestedOpeningForUserB: string;
  auraToUserSummaryA: string;
  auraToUserSummaryB: string;
}

export interface AuraMatchResult {
  compatibilityScore: number;
  matchLabel: "Low" | "Medium" | "High";
  summary: string;
  whyItWorks: string[];
  watchOut: string[];
  vibeDescription: string;
  suggestedFirstMessage: string;
}

export type ScreenName = 'ONBOARDING' | 'NEURAL_LINK' | 'MATCH_TEST';

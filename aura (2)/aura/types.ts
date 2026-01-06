// types.ts

/* ------------------------------------------------------- */
/* BASIC ENUMS                                             */
/* ------------------------------------------------------- */

// Biological gender / presentation (simple for now)
export type Gender =
  | "woman"
  | "man"
  | "non_binary"
  | "other"
  | "prefer_not_say";

export type SexualOrientation =
  | "straight"
  | "gay"
  | "lesbian"
  | "bisexual"
  | "pansexual"
  | "asexual"
  | "questioning"
  | "prefer_not_say";

export type RelationshipIntent =
  | "friends_only"
  | "casual_dating"
  | "serious_relationship"
  | "open_to_see";

export type MatchGenderPreference =
  | "any"
  | "women"
  | "men"
  | "women_and_men"
  | "lgbtq_plus";

export type SmokingHabit = "no" | "sometimes" | "yes" | "prefer_not_say";
export type DrinkingHabit = "no" | "sometimes" | "yes" | "prefer_not_say";

export type KidsPreference =
  | "dont_want"
  | "want_some_day"
  | "have_and_done"
  | "have_and_open"
  | "prefer_not_say";

export type SleepSchedule =
  | "early_bird"
  | "night_owl"
  | "flexible"
  | "prefer_not_say";

export type SocialSpeed = "slow" | "normal" | "fast";

/* ------------------------------------------------------- */
/* PHOTOS & LIFESTYLE                                      */
/* ------------------------------------------------------- */

export interface ProfilePhoto {
  id: string; // uuid or generated string
  url: string; // for now: URL or data URL; later: storage path
  isPrimary: boolean;
  position: number; // 0,1,2,... for ordering
}

export interface LifestyleInfo {
  smoking?: SmokingHabit;
  drinking?: DrinkingHabit;
  kids?: KidsPreference;
  pets?: string[]; // ["dog", "cat"]
  sleepSchedule?: SleepSchedule;
  religionNote?: string; // optional free text
  jobOrStudy?: string; // "Software engineer", "Medical student", etc.
}

/* ------------------------------------------------------- */
/* MATCH PREFERENCES                                       */
/* ------------------------------------------------------- */

export interface MatchPreferences {
  preferredGenders: MatchGenderPreference; // for now a single value
  minAge: number; // inclusive
  maxAge: number; // inclusive
  relationshipIntent?: RelationshipIntent; // optional filter
  // later: distance, lifestyle filters, etc.
}

/* ------------------------------------------------------- */
/* DATING PROFILE (WHAT OTHERS SEE)                        */
/* ------------------------------------------------------- */

export interface DatingProfile {
  // Identity & basics
  displayName: string;
  dateOfBirth: string; // ISO "YYYY-MM-DD"
  gender?: Gender;
  orientation?: SexualOrientation;
  country?: string | null;
  city?: string | null;

  // Media
  photos: ProfilePhoto[]; // at least 1 if profile is "complete"

  // Text content
  bio?: string;
  favoriteQuote?: string;
  musicTaste?: string;
  interests?: string[];

  // First contact
  idealFirstMessage?: string;
  idealFirstMeeting?: string;

  // Lifestyle
  lifestyle?: LifestyleInfo;

  // Primary relationship intent for card hints
  relationshipIntent?: RelationshipIntent;
}

/* ------------------------------------------------------- */
/* AURA PERSONALITY LAYER                                  */
/* ------------------------------------------------------- */

export interface AuraPersonality {
  introversionLevel: number; // 1–10
  goals: string[]; // ["friends", "dating", "practice_talking"]
  vibeWords: string[]; // ["calm", "sarcastic", "deep"]
  topicsLike: string[];
  topicsAvoid: string[];

  socialSpeed: SocialSpeed;
  hardBoundaries: string[];
  greenFlags: string[];
  redFlags: string[];

  whatFeelsSafe?: string;
  whatShouldPeopleKnow?: string;

  summary: string; // Aura's synthesized summary of the person
}

/* ------------------------------------------------------- */
/* FINAL AURAPROFILE STRUCTURE                             */
/* ------------------------------------------------------- */

export interface AuraProfile {
  id: string; // profile id (per user)
  userId: string; // auth user uid

  // Convenience
  displayName: string;

  // New layered model
  aura: AuraPersonality;
  dating: DatingProfile;
  preferences: MatchPreferences;

  // Transitional / convenience avatar (e.g. top-left bubble)
  avatarUrl?: string;

  /* ----------------- LEGACY FIELDS (OPTIONAL) ------------------
   * These keep the existing app working while we migrate.
   * Onboarding & editors should fill them from the new sub-objects.
   */

  // Old "flat" identity
  ageRange?: string | null;
  country?: string | null;

  // Aura-like fields at root (mirrors of aura.*)
  introversionLevel?: number;
  goals?: string[];
  vibeWords?: string[];
  topicsLike?: string[];
  topicsAvoid?: string[];
  socialSpeed?: SocialSpeed;
  hardBoundaries?: string[];
  greenFlags?: string[];
  redFlags?: string[];
  whatFeelsSafe?: string;
  whatShouldPeopleKnow?: string;
  summary?: string;

  // Old media fields
  photoUrls?: string[];
  photos?: { id: string; url: string }[];

  // Old relationship / preferences
  relationshipIntent?: RelationshipIntent;
  preferredMatchGender?: MatchGenderPreference;

  // Old text prompts
  idealFirstMessage?: string;
  idealFirstMeeting?: string;
  lifestyleNotes?: string;
  musicTaste?: string;
  favoriteQuote?: string;
  interests?: string[];

  prompts?: {
    idealFirstMessage?: string;
    idealFirstMeeting?: string;
    lifestyleNotes?: string;
    whatShouldPeopleKnow?: string;
    whatFeelsSafe?: string;
  };
}

/* ------------------------------------------------------- */
/* CHAT / STATE TYPES (USED BY UI + LLM SERVICE)           */
/* ------------------------------------------------------- */

export interface AuraState {
  mood:
    | "neutral"
    | "happy"
    | "curious"
    | "calm"
    | "anxious"
    | "sad"
    | "excited";
  moodIntensity: number; // 0–1
}

export interface AuraChatMessage {
  id: string;
  from: "user" | "aura";
  text: string;
  timestamp: number;
}

/* ----------------- MATCHING & TWIN TYPES ---------------- */

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
  matchLabel: "low" | "medium" | "high";
  summary: string;
  vibeDescription: string;
  whyItWorks: string[];
  watchOut: string[];
  suggestedFirstMessage: string;
}

export interface TwinIntroResult {
  title: string;
  auraToAuraScript: string[];
  introSummary: string;
  suggestedOpeners: string[];
  safetyNotes: string[];
}

export interface ReplyOptions {
  safe: string;
  direct: string;
  playful: string;
}

export interface TwinChatMessage {
  from: "auraA" | "auraB";
  text: string;
}

export interface TwinChatResult {
  transcript: TwinChatMessage[];
  summary: string;
}

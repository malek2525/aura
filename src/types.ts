// types.ts - MERGED VERSION
// Contains both AuraProfile (backend) and UserProfile (new UI) types

/* ------------------------------------------------------- */
/* BASIC ENUMS                                             */
/* ------------------------------------------------------- */

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
  id: string;
  url: string;
  isPrimary: boolean;
  position: number;
}

export interface LifestyleInfo {
  smoking?: SmokingHabit;
  drinking?: DrinkingHabit;
  kids?: KidsPreference;
  pets?: string[];
  sleepSchedule?: SleepSchedule;
  religionNote?: string;
  jobOrStudy?: string;
}

/* ------------------------------------------------------- */
/* MATCH PREFERENCES                                       */
/* ------------------------------------------------------- */

export interface MatchPreferences {
  preferredGenders: MatchGenderPreference;
  minAge: number;
  maxAge: number;
  relationshipIntent?: RelationshipIntent;
}

/* ------------------------------------------------------- */
/* DATING PROFILE (WHAT OTHERS SEE)                        */
/* ------------------------------------------------------- */

export interface DatingProfile {
  displayName: string;
  dateOfBirth: string;
  gender?: Gender;
  orientation?: SexualOrientation;
  country?: string | null;
  city?: string | null;
  photos: ProfilePhoto[];
  bio?: string;
  favoriteQuote?: string;
  musicTaste?: string;
  interests?: string[];
  idealFirstMessage?: string;
  idealFirstMeeting?: string;
  lifestyle?: LifestyleInfo;
  relationshipIntent?: RelationshipIntent;
}

/* ------------------------------------------------------- */
/* AURA PERSONALITY LAYER                                  */
/* ------------------------------------------------------- */

export interface AuraPersonality {
  introversionLevel: number;
  goals: string[];
  vibeWords: string[];
  topicsLike: string[];
  topicsAvoid: string[];
  socialSpeed: SocialSpeed;
  hardBoundaries: string[];
  greenFlags: string[];
  redFlags: string[];
  whatFeelsSafe?: string;
  whatShouldPeopleKnow?: string;
  summary: string;
}

/* ------------------------------------------------------- */
/* AURAPROFILE (BACKEND - YOUR EXISTING TYPE)              */
/* ------------------------------------------------------- */

export interface AuraProfile {
  id: string;
  userId: string;
  displayName: string;
  aura: AuraPersonality;
  dating: DatingProfile;
  preferences: MatchPreferences;
  avatarUrl?: string;

  // Legacy fields
  ageRange?: string | null;
  country?: string | null;
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
  photoUrls?: string[];
  photos?: { id: string; url: string }[];
  relationshipIntent?: RelationshipIntent;
  preferredMatchGender?: MatchGenderPreference;
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
/* CHAT / STATE TYPES                                      */
/* ------------------------------------------------------- */

export interface AuraState {
  mood: "neutral" | "happy" | "curious" | "calm" | "anxious" | "sad" | "excited";
  moodIntensity: number;
}

export interface AuraChatMessage {
  id: string;
  from: "user" | "aura";
  text: string;
  timestamp: number;
}

/* ------------------------------------------------------- */
/* MATCHING & TWIN TYPES                                   */
/* ------------------------------------------------------- */

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

/* ======================================================= */
/* NEW UI TYPES (FOR BUMBLE-STYLE INTERFACE)               */
/* ======================================================= */

// Story type for Instagram-style stories
export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string;
  isViewed: boolean;
}

// UserProfile - simplified profile for new UI cards
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  job: string;
  location: string;
  distance: number;
  verified: boolean;
  
  // Aura AI Features
  auraRead: string;
  vibeTags: string[];
  
  // Trust/Verification Score
  verificationScore: number;
  verificationTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  
  // Stories
  stories: Story[];
  
  // Profile Details
  interests: string[];
  prompts: { question: string; answer: string }[];
  details: {
    height: string;
    exercise: string;
    education: string;
    drinking: string;
    smoking: string;
    lookingFor: string;
    starSign: string;
    languages: string[];
  };
}

// Navigation types
export type ViewState = 'aura' | 'discover' | 'likes' | 'chat';
export type SubViewState = 
  | 'main' 
  | 'settings' 
  | 'edit-profile' 
  | 'edit-profile-legacy'
  | 'filters' 
  | 'view-profile' 
  | 'chat-detail' 
  | 'story-viewer' 
  | 'aura-simulation'
  | 'auth'
  | 'onboarding';

// Filter types
export interface FilterState {
  ageRange: [number, number];
  distance: number;
  gender: 'men' | 'women' | 'everyone';
  verifiedOnly: boolean;
  interests: string[];
}

// Chat message for new UI
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'aura-intro';
}

// Match type for new UI
export interface Match {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  timestamp?: string;
  unread: boolean;
  isLike?: boolean;
  hasAuraChat?: boolean;
}

// Verification tier info
export const VERIFICATION_TIERS = {
  Bronze: { min: 0, max: 40, label: 'New member', color: '#B2BEC3' },
  Silver: { min: 41, max: 60, label: 'Active member', color: '#A8A8A8' },
  Gold: { min: 61, max: 80, label: 'Trusted member', color: '#FFC857' },
  Platinum: { min: 81, max: 100, label: 'Verified member', color: '#9B59B6' },
};

// Helper to create empty UserProfile
export const createEmptyUserProfile = (): UserProfile => ({
  id: '',
  name: '',
  age: 0,
  bio: '',
  photos: [],
  job: '',
  location: '',
  distance: 0,
  verified: false,
  auraRead: '',
  vibeTags: [],
  verificationScore: 0,
  verificationTier: 'Bronze',
  stories: [],
  interests: [],
  prompts: [],
  details: {
    height: '',
    exercise: '',
    education: '',
    drinking: '',
    smoking: '',
    lookingFor: '',
    starSign: '',
    languages: [],
  },
});

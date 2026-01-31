// src/types.ts
// Complete type definitions for Aura Twin - ALL EXPORTS

// ============================================
// VIEW & NAVIGATION
// ============================================

export type ViewState = "aura" | "discover" | "likes" | "chat" | "moments";

// ALL SubViewState values used in App.tsx
export type SubViewState =
  | "main"
  | "detail"
  | "settings"
  | "edit"
  | "chat-detail"
  | "view-profile"
  | "story-viewer"
  | "edit-profile"
  | "filters"
  | "app-icons"
  | "code-merger"
  | "aura-simulation"
  | "subscription-plans"
  | "date-planner"
  | "shop";

// ============================================
// USER PROFILE TYPES
// ============================================

export type Gender = "woman" | "man" | "non_binary" | "other";
export type MatchGenderPreference = "women" | "men" | "women_and_men" | "any";
export type RelationshipIntent =
  | "casual_dating"
  | "serious_relationship"
  | "friends_only"
  | "open_to_see";

// Flexible types that accept empty strings and custom values
export type SmokingHabit =
  | "yes"
  | "no"
  | "sometimes"
  | "trying_to_quit"
  | ""
  | string;
export type DrinkingHabit =
  | "yes"
  | "no"
  | "sometimes"
  | "socially"
  | "rarely"
  | "never"
  | "often"
  | ""
  | string;

export type SocialSpeed = "slow" | "normal" | "fast";
export type VerificationTier = "Bronze" | "Silver" | "Gold" | "Platinum";
export type WritingStyle =
  | "casual_emoji"
  | "lowercase_aesthetic"
  | "formal_proper"
  | "short_direct"
  | "long_thoughtful";

export interface AuraPersonality {
  introversionLevel: number;
  vibeWords: string[];
  goals: string[];
  topicsLike: string[];
  topicsAvoid: string[];
  hardBoundaries: string[];
  greenFlags: string[];
  redFlags: string[];
  whatFeelsSafe: string;
  whatShouldPeopleKnow: string;
  summary: string;
  socialSpeed: SocialSpeed;
  writingStyle: WritingStyle;
}

// Alias for compatibility
export type AuraProfile = AuraPersonality;

export interface ProfileDetails {
  height?: string;
  education?: string;
  exercise?: string;
  drinking?: DrinkingHabit | string;
  smoking?: SmokingHabit | string;
  lookingFor?: string;
  starSign?: string;
  languages?: string[];
}

export interface ProfilePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string;
  expiresAt?: number;
  isViewed?: boolean;
}

export interface ProfilePrompt {
  id: string;
  question: string;
  answer: string;
}

export interface DatingProfile {
  displayName: string;
  dateOfBirth: string;
  photos: ProfilePhoto[];
  relationshipIntent: RelationshipIntent;
  gender: Gender;
  interests: string[];
}

export interface UserPreferences {
  preferredGenders: MatchGenderPreference;
  minAge: number;
  maxAge: number;
  maxDistance?: number;
  relationshipIntent: RelationshipIntent;
}

export interface UserProfile {
  id: string;
  oderId?: string;
  userId?: string;
  name: string;
  displayName?: string;
  age: number;
  job: string;
  location: string;
  distance: number;
  verified: boolean;
  verificationScore: number;
  verificationTier: VerificationTier | string;
  bio: string;
  photos: string[];
  interests: string[];
  vibeTags: string[];
  vibeWords?: string[];
  auraRead: string;
  stories: Story[];
  prompts: ProfilePrompt[];
  details: ProfileDetails;
  introversionLevel?: number;
  socialSpeed?: SocialSpeed;
  goals?: string[];
  aura?: AuraPersonality;
  dating?: DatingProfile;
  preferences?: UserPreferences;
  createdAt?: any;
  updatedAt?: any;
  lastActiveAt?: any;
  isActive?: boolean;
}

// ============================================
// AURA & AI TYPES
// ============================================

export interface AuraChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

export interface AuraState {
  isGenerating: boolean;
  hasGenerated: boolean;
  error?: string;
  lastUpdated?: number;
}

export interface ReplyOptions {
  casual: string;
  flirty: string;
  deep: string;
  funny: string;
}

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  vibeMatch: number;
  location?: string;
  estimatedCost?: string;
}

// ============================================
// MATCHING TYPES
// ============================================

export interface TwinChatMessage {
  id?: string;
  from: "auraA" | "auraB";
  text: string;
  senderName: string;
  timestamp?: number;
}

export interface MatchResult {
  matched: boolean;
  matchId?: string;
  compatibilityScore?: number;
  transcript?: TwinChatMessage[];
  icebreaker?: string;
}

export interface AuraMatchResult {
  isMatch: boolean;
  score: number;
  reasons: string[];
  suggestedOpener?: string;
}

export interface TwinIntroResult {
  greeting: string;
  topics: string[];
  tone: string;
}

export interface TwinChatResult {
  response: string;
  sentiment: "positive" | "neutral" | "negative";
  shouldContinue: boolean;
  suggestedFollowUp?: string;
}

export interface MatchPair {
  id: string;
  userA: string;
  userB: string;
  isAuraMatch: boolean;
  compatibilityScore: number;
  twinTranscript: TwinChatMessage[];
  icebreaker?: string;
  status: "pending" | "active" | "unmatched";
  createdAt?: any;
  lastMessageAt?: any;
}

export interface Match {
  matchId: string;
  oderId: string;
  name: string;
  photo: string;
  preview: string;
  time: string;
  unread: boolean;
  isAuraMatch: boolean;
  transcript: TwinChatMessage[];
  profile?: UserProfile;
}

// ============================================
// MESSAGING TYPES
// ============================================

export interface MatchMessage {
  id: string;
  fromUid: string;
  text: string;
  type: "text" | "image" | "gif" | "game";
  mediaUrl?: string;
  gameData?: any;
  createdAt: number | any;
  isRead: boolean;
}

// ============================================
// MOMENTS (Social Feed)
// ============================================

export interface Moment {
  id: string;
  userIds: string[];
  userNames: string[];
  userAvatars: string[];
  location: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
  vibeTag: string;
  isPublic: boolean;
  matchId?: string;
  createdAt?: any;
}

// ============================================
// LIKES
// ============================================

export interface Like {
  id: string;
  fromUid: string;
  toUid: string;
  superLike: boolean;
  createdAt: any;
}

// ============================================
// COMPATIBILITY & AI
// ============================================

export interface CompatibilityResult {
  score: number;
  breakdown: {
    interests: number;
    vibes: number;
    goals: number;
    introversion: number;
  };
  summary: string;
  strengths: string[];
  challenges: string[];
}

export interface TwinConversationResult {
  transcript: TwinChatMessage[];
  summary: string;
  compatibilityScore: number;
  suggestedOpener: string;
}

// ============================================
// SAFETY & REPORTING
// ============================================

export interface Report {
  id: string;
  reporterUid: string;
  reportedUid: string;
  reason: "spam" | "harassment" | "inappropriate" | "fake_profile" | "other";
  details?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: any;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  type: "match" | "message" | "like" | "superlike" | "moment_like" | "system";
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: any;
}

// ============================================
// SETTINGS
// ============================================

export interface UserSettings {
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    marketing: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastActive: boolean;
    showDistance: boolean;
  };
  discovery: {
    enabled: boolean;
    ageRange: [number, number];
    maxDistance: number;
    genderPreference: MatchGenderPreference;
  };
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

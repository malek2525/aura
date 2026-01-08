
export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string;
  isViewed: boolean;
}

export type RelationshipIntent = 
  | 'friends_only' 
  | 'casual_dating' 
  | 'serious_relationship' 
  | 'open_to_see';

export type Gender = 'woman' | 'man' | 'non_binary' | 'other' | 'prefer_not_say';
export type SexualOrientation = 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'pansexual' | 'asexual' | 'questioning' | 'prefer_not_say';
export type SmokingHabit = 'yes' | 'sometimes' | 'no' | 'prefer_not_say';
export type DrinkingHabit = 'yes' | 'sometimes' | 'no' | 'prefer_not_say';
export type KidsPreference = 'dont_want' | 'want_some_day' | 'have_and_done' | 'have_and_open' | 'prefer_not_say';
export type SleepSchedule = 'early_bird' | 'night_owl' | 'flexible' | 'prefer_not_say';
export type SocialSpeed = 'slow' | 'normal' | 'fast';
export type MatchGenderPreference = 'any' | 'women' | 'men' | 'women_and_men' | 'lgbtq_plus';

export interface ProfilePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  position?: number;
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

export interface MatchPreferences {
  preferredGenders?: MatchGenderPreference;
  minAge?: number;
  maxAge?: number;
  relationshipIntent?: RelationshipIntent;
  intent?: RelationshipIntent;      // Alias for compatibility
  preferredGender?: MatchGenderPreference; // Alias for compatibility
}

export interface AuraPersonality {
  introversionLevel: number;
  socialSpeed: SocialSpeed;
  goals: string[];
  vibeWords: string[];
  topicsLike: string[];
  topicsAvoid: string[];
  hardBoundaries: string[]; 
  greenFlags: string[];
  redFlags: string[];
  whatFeelsSafe?: string;
  whatShouldPeopleKnow?: string;
  summary: string;
}

export interface DatingProfile {
  displayName: string;
  dateOfBirth: string; // YYYY-MM-DD
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

export interface AuraChatMessage {
  id: string;
  text: string;
  from: 'user' | 'aura';
  timestamp?: number;
}

export interface AuraState {
  moodIntensity: number;
  isListening?: boolean;
  mood?: string;
}

export interface AuraInsight {
  id: string;
  shortSummary: string;
  vibeSentence: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  userId?: string; 
  name: string;
  displayName?: string; 
  avatarUrl?: string; 
  age: number;
  bio: string;
  photos: string[]; // Simple array for UI display
  
  // Complex Data Structures (v2)
  dating?: DatingProfile;
  aura?: AuraPersonality;
  preferences?: MatchPreferences;

  // AI & Matching Specifics
  matchPreferences?: MatchPreferences; // Alias
  auraInsights?: AuraInsight[];
  
  // Legacy/Flat fields for simple UI compatibility
  job: string;
  location: string;
  distance: number;
  verified: boolean;
  auraRead: string;
  vibeTags: string[];
  verificationScore: number;
  verificationTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  stories: Story[];
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

  // Optional overrides / Flat fields for Service compatibility
  ageRange?: string | null;
  country?: string | null;
  summary?: string;
  primaryPhotoUrl?: string | null;
  photo2Url?: string | null;
  photo3Url?: string | null;
  photoUrls?: string[];
  
  goals?: string[];
  vibeWords?: string[];
  topicsLike?: string[];
  topicsAvoid?: string[];
  greenFlags?: string[];
  redFlags?: string[];
  whatFeelsSafe?: string;
  whatShouldPeopleKnow?: string;
  introversionLevel?: number;
  socialSpeed?: SocialSpeed;
  hardBoundaries?: string[];
  
  relationshipIntent?: RelationshipIntent;
  preferredMatchGender?: MatchGenderPreference;
  idealFirstMessage?: string;
  idealFirstMeeting?: string;
  lifestyleNotes?: string;
  musicTaste?: string;
  favoriteQuote?: string;
  loveLanguages?: string[];
}

// Renaming alias for compatibility with service files
export type AuraProfile = UserProfile;

export interface Match {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  timestamp?: string;
  unread: boolean;
  isLike?: boolean;
  hasAuraChat?: boolean;
}

// --- Matching Service Types ---

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
  matchLabel: string;
  summary: string;
  whyItWorks: string[];
  watchOut: string[];
  vibeDescription: string;
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

export interface MatchMessage {
  id: string;
  matchId: string;
  fromUid: string;
  text: string;
  createdAt: number;
}

// --- App State Types ---
export type ViewState = 'auth' | 'onboarding' | 'aura' | 'discover' | 'likes' | 'chat';
export type SubViewState = 'main' | 'settings' | 'edit-profile' | 'filters' | 'view-profile' | 'chat-detail' | 'story-viewer' | 'aura-simulation' | 'app-icons' | 'code-merger' | 'live-voice' | 'me-panel';

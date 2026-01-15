// --- Core Story Type ---
export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string;
  isViewed: boolean;
}

// --- Enum Types ---
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

// --- Photo Management ---
export interface ProfilePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  position?: number;
}

// --- Lifestyle Info ---
export interface LifestyleInfo {
  smoking?: SmokingHabit;
  drinking?: DrinkingHabit;
  kids?: KidsPreference;
  pets?: string[];
  sleepSchedule?: SleepSchedule;
  religionNote?: string;
  jobOrStudy?: string;
}

// --- Match Preferences ---
export interface MatchPreferences {
  preferredGenders?: MatchGenderPreference;
  minAge?: number;
  maxAge?: number;
  relationshipIntent?: RelationshipIntent;
  intent?: RelationshipIntent;
  preferredGender?: MatchGenderPreference;
  maxDistance?: number;
  minMatchScore?: number; // Minimum Aura compatibility score (0-100)
  strictDealbreakers?: boolean;
}

// --- Aura Personality (AI Twin Config) ---
export interface AuraPersonality {
  introversionLevel: number; // 1-10
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
  writingStyle: 'casual_emoji' | 'lowercase_aesthetic' | 'formal_proper' | 'short_direct' | 'long_thoughtful';
  humorStyle?: string;
}

// --- Dating Profile ---
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

// --- Aura Chat (User <-> Their Aura) ---
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

// --- Main User Profile ---
export interface UserProfile {
  id: string;
  userId?: string; 
  name: string;
  displayName?: string; 
  avatarUrl?: string; 
  age: number;
  bio: string;
  photos: string[];
  
  // Complex Data Structures
  dating?: DatingProfile;
  aura?: AuraPersonality;
  preferences?: MatchPreferences;
  matchPreferences?: MatchPreferences;
  auraInsights?: AuraInsight[];
  
  // Core Profile Fields
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

  // Optional fields
  ageRange?: string | null;
  country?: string | null;
  summary?: string;
  primaryPhotoUrl?: string | null;
  photo2Url?: string | null;
  photo3Url?: string | null;
  photoUrls?: string[];
  
  // Aura/Matching fields (flat for service compatibility)
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

// Alias for matching service
export type AuraProfile = UserProfile;

// --- Twin Chat (Aura <-> Aura Conversation) ---
export interface TwinChatMessage {
  from: "auraA" | "auraB";
  senderName: string;
  text: string;
  timestamp?: number;
}

export interface TwinChatResult {
  transcript: TwinChatMessage[];
  summary: string;
  suggestedOpener?: string;      // Added: AI-generated icebreaker
  compatibilityScore?: number;   // Added: Match score
}

// --- Match Types ---
export interface Match {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  timestamp?: string;
  unread: boolean;
  isLike?: boolean;
  hasAuraChat?: boolean;
  twinTranscript?: TwinChatMessage[];
  icebreaker?: string;           // Added: Suggested first message
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

// --- Like & Match Pair ---
export interface MatchLike {
  fromUid: string;
  toUid: string;
  createdAt: number;
  superLike?: boolean;           // Added: Premium feature
}

export interface MatchPair {
  id: string;
  userA: string;
  userB: string;
  createdAt: number;
  compatibilityScore?: number;
  isAuraMatch?: boolean;
  twinTranscript?: TwinChatMessage[];
  icebreaker?: string;           // Added: AI-suggested opener
  matchReasons?: string[];       // Added: Why they matched
}

export interface PublicProfileSummary {
  uid: string;
  auraProfile: UserProfile;
  lastActiveAt?: number;
}

export interface MatchWithProfile {
  match: MatchPair;
  other: PublicProfileSummary;
}

// --- Messaging ---
export type MessageType = 'text' | 'image' | 'gif' | 'voice' | 'date_plan';

export interface MatchMessage {
  id: string;
  matchId: string;
  fromUid: string;
  text: string;
  type: MessageType;
  mediaUrl?: string;
  createdAt: number;
  isRead?: boolean;              // Added: Read receipts
  isDatePlan?: boolean; 
  dateDetails?: DateIdea;
  replyTo?: string;              // Added: Reply to message ID
}

// --- Date Planner ---
export interface DateIdea {
  id: string;
  title: string;
  description: string;
  locationName: string;
  locationAddress?: string;      // Added: Full address
  locationCoords?: {             // Added: For maps
    lat: number;
    lng: number;
  };
  vibe: string;
  estimatedCost?: string;        // Added: $, $$, $$$
  duration?: string;             // Added: "2-3 hours"
  whyItWorks: string;
  imageUrl?: string;             // Added: Location image
}

export interface DatePlan {
  id: string;
  matchId: string;
  proposedBy: string;
  idea: DateIdea;
  proposedDate?: string;         // ISO date string
  proposedTime?: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: number;
}

// --- Moments (Social Feature) ---
export interface Moment {
  id: string;
  matchId?: string;              // Added: Link to match
  userIds: string[];             // Added: Both users' IDs
  userNames: string[];
  userAvatars: string[];
  location: string;
  locationCoords?: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  caption: string;
  likes: number;
  comments?: MomentComment[];    // Added: Comments
  timestamp: string;
  vibeTag: string;
  isPublic: boolean;             // Added: Privacy control
}

export interface MomentComment {
  id: string;
  momentId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

// --- App Navigation State ---
export type ViewState = 'auth' | 'onboarding' | 'aura' | 'discover' | 'likes' | 'chat' | 'moments';

export type SubViewState = 
  | 'main' 
  | 'settings' 
  | 'edit-profile' 
  | 'filters' 
  | 'view-profile' 
  | 'chat-detail' 
  | 'story-viewer' 
  | 'aura-simulation' 
  | 'app-icons' 
  | 'code-merger' 
  | 'live-voice' 
  | 'me-panel'
  | 'date-planner'               // Added
  | 'create-moment';             // Added

// --- Settings & Preferences ---
export interface AppSettings {
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    moments: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showDistance: boolean;
    showLastActive: boolean;
  };
  auraSettings: {
    minMatchScore: number;       // 0-100
    strictDealbreakers: boolean;
    autoAuraMatch: boolean;      // Auto-trigger Aura convos
  };
}

// --- Conversation Patterns (Learning) ---
export interface ConversationPattern {
  id: string;
  pattern: string;
  example: string;
  successRate: number;
  usageCount: number;
  lastUpdated: number;
}

// --- API Response Types ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Notification Types ---
export interface AppNotification {
  id: string;
  type: 'match' | 'message' | 'like' | 'moment' | 'aura_match' | 'date_plan';
  title: string;
  body: string;
  data?: Record<string, any>;
  createdAt: number;
  isRead: boolean;
}
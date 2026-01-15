import {
  UserProfile,
  MatchPair,
  PublicProfileSummary,
  MatchWithProfile,
  MatchLike
} from "../types";
import { simulateTwinChat, calculateCompatibility } from "./matching";

const MATCH_STORAGE_KEY = 'aura_matches';
const LIKES_STORAGE_KEY = 'aura_likes';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- EXPANDED MOCK PROFILE DATABASE ---
// 10 diverse profiles for better testing

const PROFILES_DB: Record<string, UserProfile> = {
  "demo_lina": {
    id: "demo_lina",
    name: "Lina",
    age: 24,
    job: "Illustrator",
    location: "Berlin",
    distance: 4,
    verified: true,
    bio: "Quiet mornings, loud music, and getting lost in sketches. Looking for someone who understands creative chaos.",
    photos: [
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=600&h=900&fit=crop", 
      "https://images.unsplash.com/photo-1605252579477-96a84d241853?w=600&h=900&fit=crop"
    ],
    auraRead: "Deeply creative and slightly guarded. Needs time to open up.",
    vibeTags: ["Artistic", "Dreamy", "Introvert"],
    verificationScore: 92,
    verificationTier: "Platinum",
    stories: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=900&fit=crop', timestamp: '2h', isViewed: false }
    ],
    interests: ["Art", "Indie Music", "Coffee", "Journaling", "Museums"],
    prompts: [{ question: "My simple pleasure", answer: "The smell of old bookstores." }],
    details: { height: "168cm", exercise: "Yoga", education: "Arts", drinking: "Wine", smoking: "No", lookingFor: "Relationship", starSign: "Cancer", languages: ["German", "English"] },
    introversionLevel: 8,
    socialSpeed: "slow",
    goals: ["serious_relationship"],
    vibeWords: ["creative", "gentle", "thoughtful"]
  },
  
  "demo_sarah": {
    id: "demo_sarah",
    name: "Sarah",
    age: 26,
    job: "Architect",
    location: "Munich",
    distance: 12,
    verified: true,
    bio: "Designing spaces and finding places. Big fan of brutalism and brutal honesty.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=900&fit=crop"
    ],
    auraRead: "Structured thinker with a wild heart.",
    vibeTags: ["Ambitious", "Direct", "Witty"],
    verificationScore: 85,
    verificationTier: "Gold",
    stories: [],
    interests: ["Architecture", "Tennis", "Design", "Travel", "Wine"],
    prompts: [{ question: "I geek out on", answer: "Sustainable building materials." }],
    details: { height: "172cm", exercise: "Active", education: "Masters", drinking: "Socially", smoking: "No", lookingFor: "Relationship", starSign: "Virgo", languages: ["German", "English", "French"] },
    introversionLevel: 4,
    socialSpeed: "normal",
    goals: ["serious_relationship"],
    vibeWords: ["sharp", "energetic", "driven"]
  },
  
  "demo_julia": {
    id: "demo_julia",
    name: "Julia",
    age: 25,
    job: "Software Engineer",
    location: "Hamburg",
    distance: 40,
    verified: true,
    bio: "I speak Python better than French. Looking for a player 2.",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=900&fit=crop"
    ],
    auraRead: "Logical but loves a good fantasy world.",
    vibeTags: ["Nerdy", "Chill", "Smart"],
    verificationScore: 95,
    verificationTier: "Platinum",
    stories: [],
    interests: ["Gaming", "Coding", "Sci-Fi", "Board Games", "Anime"],
    prompts: [{ question: "A non-negotiable", answer: "Must like dogs." }],
    details: { height: "165cm", exercise: "Sometimes", education: "Bachelors", drinking: "No", smoking: "No", lookingFor: "Relationship", starSign: "Gemini", languages: ["English"] },
    introversionLevel: 9,
    socialSpeed: "slow",
    goals: ["serious_relationship"],
    vibeWords: ["geeky", "quiet", "loyal"]
  },
  
  "demo_marcus": {
    id: "demo_marcus",
    name: "Marcus",
    age: 28,
    job: "Chef",
    location: "Berlin",
    distance: 2,
    verified: true,
    bio: "Way to my heart is literally through my stomach. I'll cook, you pick the movie.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop"
    ],
    auraRead: "Warm energy, acts of service lover.",
    vibeTags: ["Passionate", "Warm", "Foodie"],
    verificationScore: 80,
    verificationTier: "Gold",
    stories: [],
    interests: ["Cooking", "Movies", "Jazz", "Wine", "Travel"],
    prompts: [{ question: "Best travel story", answer: "Got lost in Tokyo and found the best ramen of my life." }],
    details: { height: "180cm", exercise: "Active", education: "Culinary School", drinking: "Yes", smoking: "Sometimes", lookingFor: "Relationship", starSign: "Taurus", languages: ["English", "Italian"] },
    introversionLevel: 3,
    socialSpeed: "fast",
    goals: ["serious_relationship"],
    vibeWords: ["warm", "generous", "adventurous"]
  },

  "demo_emma": {
    id: "demo_emma",
    name: "Emma",
    age: 27,
    job: "Psychologist",
    location: "Frankfurt",
    distance: 25,
    verified: true,
    bio: "Professional listener, amateur plant mom. I'll analyze your dreams for free.",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=900&fit=crop"
    ],
    auraRead: "Empathetic soul with hidden depth. Genuinely curious about people.",
    vibeTags: ["Empathetic", "Curious", "Calm"],
    verificationScore: 88,
    verificationTier: "Gold",
    stories: [
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=900&fit=crop', timestamp: '5h', isViewed: false }
    ],
    interests: ["Psychology", "Plants", "Podcasts", "Hiking", "Reading"],
    prompts: [{ question: "I'm looking for", answer: "Deep conversations at 2am." }],
    details: { height: "170cm", exercise: "Yoga", education: "PhD", drinking: "Occasionally", smoking: "No", lookingFor: "Relationship", starSign: "Pisces", languages: ["German", "English"] },
    introversionLevel: 6,
    socialSpeed: "slow",
    goals: ["serious_relationship"],
    vibeWords: ["thoughtful", "nurturing", "wise"]
  },

  "demo_alex": {
    id: "demo_alex",
    name: "Alex",
    age: 29,
    job: "Photographer",
    location: "Berlin",
    distance: 5,
    verified: true,
    bio: "Chasing golden hour and good stories. Let me capture your best angle.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop"
    ],
    auraRead: "Creative eye with wanderlust. Lives in the moment.",
    vibeTags: ["Creative", "Adventurous", "Laid-back"],
    verificationScore: 78,
    verificationTier: "Silver",
    stories: [],
    interests: ["Photography", "Travel", "Coffee", "Vinyl", "Street Art"],
    prompts: [{ question: "Perfect Sunday", answer: "Flea markets, film camera, and finding hidden cafes." }],
    details: { height: "182cm", exercise: "Cycling", education: "Self-taught", drinking: "Socially", smoking: "No", lookingFor: "Open to see", starSign: "Sagittarius", languages: ["English", "Spanish"] },
    introversionLevel: 5,
    socialSpeed: "normal",
    goals: ["open_to_see"],
    vibeWords: ["artistic", "spontaneous", "chill"]
  },

  "demo_nina": {
    id: "demo_nina",
    name: "Nina",
    age: 23,
    job: "Medical Student",
    location: "Heidelberg",
    distance: 35,
    verified: true,
    bio: "Future doctor who can't keep plants alive. The irony isn't lost on me.",
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=900&fit=crop"
    ],
    auraRead: "Ambitious dreamer balancing chaos and care.",
    vibeTags: ["Driven", "Funny", "Caring"],
    verificationScore: 70,
    verificationTier: "Silver",
    stories: [],
    interests: ["Medicine", "Gym", "True Crime", "Baking", "Dogs"],
    prompts: [{ question: "Unpopular opinion", answer: "Pineapple absolutely belongs on pizza." }],
    details: { height: "164cm", exercise: "Gym rat", education: "Med School", drinking: "Weekends", smoking: "No", lookingFor: "Relationship", starSign: "Aries", languages: ["German", "English"] },
    introversionLevel: 4,
    socialSpeed: "normal",
    goals: ["serious_relationship"],
    vibeWords: ["determined", "witty", "warm"]
  },

  "demo_tom": {
    id: "demo_tom",
    name: "Tom",
    age: 31,
    job: "Music Producer",
    location: "Berlin",
    distance: 3,
    verified: true,
    bio: "Making beats by day, finding good food by night. Looking for my duet partner.",
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=900&fit=crop"
    ],
    auraRead: "Creative soul with depth. Values authenticity over everything.",
    vibeTags: ["Creative", "Chill", "Deep"],
    verificationScore: 82,
    verificationTier: "Gold",
    stories: [],
    interests: ["Music", "Vinyl", "Cooking", "Philosophy", "Late nights"],
    prompts: [{ question: "My love language", answer: "Making you a playlist." }],
    details: { height: "178cm", exercise: "Sometimes", education: "Bachelors", drinking: "Socially", smoking: "No", lookingFor: "Relationship", starSign: "Aquarius", languages: ["English", "German"] },
    introversionLevel: 7,
    socialSpeed: "slow",
    goals: ["serious_relationship"],
    vibeWords: ["soulful", "creative", "genuine"]
  },

  "demo_maya": {
    id: "demo_maya",
    name: "Maya",
    age: 26,
    job: "UX Designer",
    location: "Munich",
    distance: 15,
    verified: true,
    bio: "Designing experiences, collecting stamps in my passport. Let's create something beautiful.",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=900&fit=crop"
    ],
    auraRead: "Balances logic and creativity beautifully. Quietly confident.",
    vibeTags: ["Creative", "Balanced", "Curious"],
    verificationScore: 90,
    verificationTier: "Platinum",
    stories: [
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=900&fit=crop', timestamp: '1d', isViewed: false }
    ],
    interests: ["Design", "Travel", "Yoga", "Photography", "Cafes"],
    prompts: [{ question: "Green flag I look for", answer: "You remember the little things I mention." }],
    details: { height: "167cm", exercise: "Yoga", education: "Masters", drinking: "Wine lover", smoking: "No", lookingFor: "Relationship", starSign: "Libra", languages: ["English", "Hindi", "German"] },
    introversionLevel: 5,
    socialSpeed: "normal",
    goals: ["serious_relationship"],
    vibeWords: ["elegant", "thoughtful", "adventurous"]
  },

  "demo_leo": {
    id: "demo_leo",
    name: "Leo",
    age: 27,
    job: "Startup Founder",
    location: "Berlin",
    distance: 8,
    verified: true,
    bio: "Building things and breaking comfort zones. Looking for a co-pilot, not a passenger.",
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=900&fit=crop"
    ],
    auraRead: "High energy with hidden depth. Craves real connection.",
    vibeTags: ["Ambitious", "Energetic", "Genuine"],
    verificationScore: 75,
    verificationTier: "Silver",
    stories: [],
    interests: ["Startups", "Fitness", "Books", "Podcasts", "Networking"],
    prompts: [{ question: "Biggest risk I took", answer: "Quit my job to start a company. Still figuring it out." }],
    details: { height: "185cm", exercise: "Daily", education: "MBA", drinking: "Rarely", smoking: "No", lookingFor: "Relationship", starSign: "Leo", languages: ["English", "German"] },
    introversionLevel: 3,
    socialSpeed: "fast",
    goals: ["serious_relationship"],
    vibeWords: ["driven", "authentic", "bold"]
  }
};

// --- STORAGE HELPERS ---

const loadMatches = (): MatchPair[] => {
  try {
    const data = localStorage.getItem(MATCH_STORAGE_KEY);
    return data ? JSON.parse(data) : [
      // Initial seed match for demo
      { id: "m_julia", userA: "me", userB: "demo_julia", createdAt: Date.now() - 86400000, compatibilityScore: 92 }
    ];
  } catch {
    return [];
  }
};

const saveMatches = (matches: MatchPair[]) => {
  try {
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(matches));
  } catch (e) {
    console.warn("Failed to save matches", e);
  }
};

const loadLikes = (): MatchLike[] => {
  try {
    const data = localStorage.getItem(LIKES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLikes = (likes: MatchLike[]) => {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
  } catch (e) {
    console.warn("Failed to save likes", e);
  }
};

let MATCHES: MatchPair[] = loadMatches();
let LIKES: MatchLike[] = loadLikes();

// --- PUBLIC API ---

export async function fetchDiscoverProfiles(
  currentUid: string,
): Promise<PublicProfileSummary[]> {
  await delay(150);
  MATCHES = loadMatches();
  
  // Get IDs of already matched profiles
  const matchedIds = MATCHES
    .filter(m => m.userA === currentUid || m.userB === currentUid)
    .map(m => m.userA === currentUid ? m.userB : m.userA);
  
  // Return profiles not yet matched, shuffled for variety
  const available = Object.values(PROFILES_DB)
    .filter(p => p.id !== currentUid && !matchedIds.includes(p.id))
    .sort(() => Math.random() - 0.5); // Shuffle
  
  return available.map(p => ({ uid: p.id, auraProfile: p }));
}

export async function fetchDailyPicks(currentUid: string): Promise<UserProfile[]> {
  await delay(200);
  // Return 2-3 high compatibility profiles as "Daily Picks"
  // In production, this would use AI to select best matches
  const picks = ["demo_lina", "demo_marcus", "demo_maya"]
    .map(id => PROFILES_DB[id])
    .filter(Boolean);
  return picks;
}

export async function likeProfile(
  currentUid: string,
  targetUid: string,
): Promise<{ isNewMatch: boolean; matchId?: string }> {
  await delay(150);

  // Record the like
  LIKES = loadLikes();
  LIKES.push({
    fromUid: currentUid,
    toUid: targetUid,
    createdAt: Date.now(),
  });
  saveLikes(LIKES);

  // Check if they already liked us (mutual like = match!)
  const mutualLike = LIKES.find(l => l.fromUid === targetUid && l.toUid === currentUid);
  
  if (mutualLike) {
    // It's a match!
    const matchId = `match_${Date.now()}`;
    const newMatch: MatchPair = {
      id: matchId,
      userA: currentUid,
      userB: targetUid,
      createdAt: Date.now(),
      compatibilityScore: 85 + Math.floor(Math.random() * 15), // 85-100
    };
    
    MATCHES = loadMatches();
    MATCHES.unshift(newMatch);
    saveMatches(MATCHES);
    
    return { isNewMatch: true, matchId };
  }

  // For demo: Sarah always matches instantly
  if (targetUid === 'demo_sarah') {
    const matchId = `match_sarah_${Date.now()}`;
    const newMatch: MatchPair = {
      id: matchId,
      userA: currentUid,
      userB: targetUid,
      createdAt: Date.now(),
      compatibilityScore: 88,
    };
    
    MATCHES = loadMatches();
    MATCHES.unshift(newMatch);
    saveMatches(MATCHES);
    
    return { isNewMatch: true, matchId };
  }

  return { isNewMatch: false };
}

// Core feature: Aura-to-Aura background matching
export async function triggerBackgroundAuraMatch(
  myProfile: UserProfile,
  targetProfile: UserProfile
): Promise<{ success: boolean; compatibilityScore: number; transcript?: any[] }> {
  await delay(1500); // Simulate AI processing time
  
  // Check if match already exists
  MATCHES = loadMatches();
  const existing = MATCHES.find(m => 
    (m.userA === myProfile.id && m.userB === targetProfile.id) || 
    (m.userA === targetProfile.id && m.userB === myProfile.id)
  );

  if (existing) {
    return { success: false, compatibilityScore: existing.compatibilityScore || 0 };
  }

  // Simulate the twin conversation
  const chatResult = simulateTwinChat(myProfile, targetProfile);
  
  // Calculate real compatibility (this could use Gemini in production)
  const compatibilityScore = calculateCompatibility(myProfile, targetProfile);

  // Create the match with Aura metadata
  const matchId = `aura_${Date.now()}`;
  const newMatch: MatchPair = {
    id: matchId,
    userA: myProfile.id,
    userB: targetProfile.id,
    createdAt: Date.now(),
    compatibilityScore,
    isAuraMatch: true,
    twinTranscript: chatResult.transcript,
    icebreaker: chatResult.suggestedOpener
  };
  
  MATCHES.unshift(newMatch);
  saveMatches(MATCHES);
  
  console.log(`[Aura Match] ${myProfile.name} ↔ ${targetProfile.name} | Score: ${compatibilityScore}%`);
  
  return { 
    success: true, 
    compatibilityScore, 
    transcript: chatResult.transcript 
  };
}

export async function fetchMatches(currentUid: string): Promise<MatchWithProfile[]> {
  await delay(100);
  MATCHES = loadMatches();
  
  const relevant = MATCHES.filter(
    m => m.userA === currentUid || m.userB === currentUid
  );

  const result: MatchWithProfile[] = [];
  for (const match of relevant) {
    const otherUid = match.userA === currentUid ? match.userB : match.userA;
    const otherProfile = PROFILES_DB[otherUid];
    if (otherProfile) {
      result.push({ 
        match, 
        other: { uid: otherUid, auraProfile: otherProfile } 
      });
    }
  }
  
  // Sort by newest first
  return result.sort((a, b) => b.match.createdAt - a.match.createdAt);
}

export async function fetchLikesReceived(currentUid: string): Promise<UserProfile[]> {
  await delay(100);
  LIKES = loadLikes();
  
  // Find profiles who liked the current user
  const likerIds = LIKES
    .filter(l => l.toUid === currentUid)
    .map(l => l.fromUid);
  
  return likerIds
    .map(id => PROFILES_DB[id])
    .filter(Boolean);
}

export async function unmatchProfile(currentUid: string, targetUid: string): Promise<void> {
  await delay(300);
  MATCHES = loadMatches();
  MATCHES = MATCHES.filter(m => 
    !((m.userA === currentUid && m.userB === targetUid) || 
      (m.userA === targetUid && m.userB === currentUid))
  );
  saveMatches(MATCHES);
}

export function getProfileById(id: string): UserProfile | undefined {
  return PROFILES_DB[id];
}

export function getAllProfiles(): UserProfile[] {
  return Object.values(PROFILES_DB);
}

export async function reportUser(userId: string, reason: string): Promise<void> {
  await delay(500);
  console.log(`[REPORT] User ${userId} reported for: ${reason}`);
}

// --- DEBUG HELPERS (remove in production) ---

export function debugResetAllData(): void {
  localStorage.removeItem(MATCH_STORAGE_KEY);
  localStorage.removeItem(LIKES_STORAGE_KEY);
  MATCHES = [];
  LIKES = [];
  console.log('[DEBUG] All match data reset');
}

export function debugGetState(): { matches: MatchPair[]; likes: MatchLike[] } {
  return { matches: loadMatches(), likes: loadLikes() };
}
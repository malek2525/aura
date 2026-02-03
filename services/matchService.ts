// src/services/matchService.ts
// Robust match service with expanded mock data, advanced compatibility, and persistence.

import {
  UserProfile,
  TwinChatMessage,
  Match,
  MatchResult,
  AuraMatchResult,
  TwinIntroResult,
  TwinChatResult,
} from "../types";

// ============================================
// EXPANDED MOCK PROFILES (25+ Profiles)
// ============================================

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: "p1",
    name: "Julia",
    age: 26,
    job: "UX Designer",
    location: "Berlin",
    distance: 3,
    verified: true,
    verificationScore: 85,
    verificationTier: "Gold",
    bio: "coffee addict ☕ design nerd 🎨",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&fit=crop",
    ],
    interests: ["Coffee", "Art", "Design", "Travel", "Photography"],
    vibeTags: ["Creative", "Chill", "Curious"],
    auraRead: "warm creative energy",
    stories: [],
    prompts: [
      {
        id: "pr1",
        question: "A perfect Sunday",
        answer: "Coffee → museum → cozy dinner",
      },
    ],
    details: {
      height: "5'6\"",
      education: "Masters",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 6,
    socialSpeed: "normal",
  },
  {
    id: "p2",
    name: "Marcus",
    age: 29,
    job: "Software Engineer",
    location: "Berlin",
    distance: 5,
    verified: true,
    verificationScore: 80,
    verificationTier: "Silver",
    bio: "building apps by day, guitar by night 🎸",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&fit=crop",
    ],
    interests: ["Music", "Coding", "Gaming", "Books", "Hiking"],
    vibeTags: ["Nerdy", "Laid-back", "Deep"],
    auraRead: "thoughtful introvert",
    stories: [],
    prompts: [
      {
        id: "pr2",
        question: "I geek out on",
        answer: "keyboards, music, sci-fi",
      },
    ],
    details: {
      height: "5'11\"",
      education: "Bachelors",
      drinking: "sometimes",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 8,
    socialSpeed: "slow",
  },
  {
    id: "p3",
    name: "Emma",
    age: 24,
    job: "Marketing Manager",
    location: "Berlin",
    distance: 2,
    verified: true,
    verificationScore: 90,
    verificationTier: "Gold",
    bio: "bookworm 📚 plant mom 🌱",
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop",
    ],
    interests: ["Reading", "Plants", "Cooking", "Yoga", "Wine"],
    vibeTags: ["Cozy", "Nurturing", "Adventurous"],
    auraRead: "warm homebody",
    stories: [],
    prompts: [
      {
        id: "pr3",
        question: "My love language",
        answer: "quality time (and snacks)",
      },
    ],
    details: {
      height: "5'4\"",
      education: "Bachelors",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 5,
    socialSpeed: "normal",
  },
  {
    id: "p4",
    name: "Alex",
    age: 27,
    job: "Photographer",
    location: "Berlin",
    distance: 4,
    verified: false,
    verificationScore: 70,
    verificationTier: "Silver",
    bio: "capturing moments ✨ chasing golden hour 🌅",
    photos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&fit=crop",
    ],
    interests: ["Photography", "Travel", "Coffee", "Art", "Music"],
    vibeTags: ["Artistic", "Spontaneous", "Romantic"],
    auraRead: "free spirit",
    stories: [],
    prompts: [
      {
        id: "pr4",
        question: "My ideal date",
        answer: "exploring with cameras",
      },
    ],
    details: {
      height: "5'10\"",
      education: "Self-taught",
      drinking: "sometimes",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 4,
    socialSpeed: "normal",
  },
  {
    id: "p5",
    name: "Sophie",
    age: 25,
    job: "Architect",
    location: "Berlin",
    distance: 6,
    verified: true,
    verificationScore: 88,
    verificationTier: "Gold",
    bio: "designing spaces by day, gaming by night 🎮",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&fit=crop",
    ],
    interests: ["Gaming", "Architecture", "Anime", "Cooking", "Board Games"],
    vibeTags: ["Nerdy", "Creative", "Playful"],
    auraRead: "logical dreamer",
    stories: [],
    prompts: [
      {
        id: "pr5",
        question: "Currently obsessed with",
        answer: "Zelda and ramen recipes",
      },
    ],
    details: {
      height: "5'7\"",
      education: "Masters",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 7,
    socialSpeed: "slow",
  },
  {
    id: "p6",
    name: "Daniel",
    age: 30,
    job: "Chef",
    location: "Berlin",
    distance: 3,
    verified: true,
    verificationScore: 82,
    verificationTier: "Silver",
    bio: "cooking is my love language 🍳",
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&fit=crop",
    ],
    interests: ["Cooking", "Food", "Wine", "Travel", "Markets"],
    vibeTags: ["Foodie", "Warm", "Passionate"],
    auraRead: "nurturing soul",
    stories: [],
    prompts: [
      {
        id: "pr6",
        question: "The way to my heart",
        answer: "is through your stomach",
      },
    ],
    details: {
      height: "6'0\"",
      education: "Culinary School",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 4,
    socialSpeed: "normal",
  },
  {
    id: "p7",
    name: "Mia",
    age: 23,
    job: "Psychology Student",
    location: "Berlin",
    distance: 8,
    verified: false,
    verificationScore: 65,
    verificationTier: "Bronze",
    bio: "studying minds, collecting vinyl 🎵",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&fit=crop",
    ],
    interests: ["Psychology", "Music", "Writing", "Coffee", "Art Films"],
    vibeTags: ["Deep", "Thoughtful", "Creative"],
    auraRead: "old soul",
    stories: [],
    prompts: [
      {
        id: "pr7",
        question: "Let's debate about",
        answer: "whether free will exists",
      },
    ],
    details: {
      height: "5'5\"",
      education: "Student",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Connection",
    },
    introversionLevel: 8,
    socialSpeed: "slow",
  },
  {
    id: "p8",
    name: "Leo",
    age: 28,
    job: "Product Manager",
    location: "Berlin",
    distance: 4,
    verified: true,
    verificationScore: 78,
    verificationTier: "Silver",
    bio: "tech nerd who actually touches grass 🌿",
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop",
    ],
    interests: ["Hiking", "Tech", "Podcasts", "Board Games", "Cooking"],
    vibeTags: ["Active", "Nerdy", "Balanced"],
    auraRead: "grounded techie",
    stories: [],
    prompts: [
      {
        id: "pr8",
        question: "Perfect weekend",
        answer: "hike, gaming, cooking",
      },
    ],
    details: {
      height: "5'9\"",
      education: "Bachelors",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 6,
    socialSpeed: "normal",
  },
  {
    id: "p9",
    name: "Nina",
    age: 26,
    job: "Illustrator",
    location: "Berlin",
    distance: 5,
    verified: true,
    verificationScore: 85,
    verificationTier: "Gold",
    bio: "drawing my way through life ✏️ cat mom 🐱",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&fit=crop",
    ],
    interests: ["Art", "Cats", "Anime", "Coffee", "Museums"],
    vibeTags: ["Creative", "Cozy", "Quirky"],
    auraRead: "artistic dreamer",
    stories: [],
    prompts: [
      {
        id: "pr9",
        question: "I'll fall for you if",
        answer: "you like my cats",
      },
    ],
    details: {
      height: "5'3\"",
      education: "Art School",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 7,
    socialSpeed: "slow",
  },
  {
    id: "p10",
    name: "Liam",
    age: 31,
    job: "Fitness Coach",
    location: "Berlin",
    distance: 2,
    verified: true,
    verificationScore: 92,
    verificationTier: "Platinum",
    bio: "strong body, calm mind 🧘‍♂️ early bird ☀️",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&fit=crop",
    ],
    interests: ["Fitness", "Yoga", "Outdoors", "Coffee", "Healthy Cooking"],
    vibeTags: ["Disciplined", "Warm", "Active"],
    auraRead: "stable grounding energy",
    stories: [],
    prompts: [
      {
        id: "pr10",
        question: "I'm most proud of",
        answer: "completing a marathon last year",
      },
    ],
    details: {
      height: "6'2\"",
      education: "Bachelors",
      drinking: "rarely",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 3,
    socialSpeed: "fast",
  },
  {
    id: "p11",
    name: "Elena",
    age: 27,
    job: "Journalist",
    location: "Berlin",
    distance: 4,
    verified: true,
    verificationScore: 81,
    verificationTier: "Gold",
    bio: "searching for stories and the perfect matcha 🍵",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&fit=crop",
    ],
    interests: ["Writing", "Politics", "Travel", "Museums", "Music"],
    vibeTags: ["Intellectual", "Wanderer", "Sharp"],
    auraRead: "vibrant curious spirit",
    stories: [],
    prompts: [
      {
        id: "pr11",
        question: "Unusual skill",
        answer: "I can name any font from 10 feet away",
      },
    ],
    details: {
      height: "5'8\"",
      education: "Masters",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Serious",
    },
    introversionLevel: 5,
    socialSpeed: "normal",
  },
  {
    id: "p12",
    name: "Sven",
    age: 32,
    job: "Barista",
    location: "Berlin",
    distance: 1,
    verified: false,
    verificationScore: 45,
    verificationTier: "Bronze",
    bio: "making art with foam ☕ vinyl collector",
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&fit=crop",
    ],
    interests: ["Coffee", "Music", "City Walks", "Nightlife"],
    vibeTags: ["Chill", "Urban", "Creative"],
    auraRead: "relaxed city vibe",
    stories: [],
    prompts: [
      {
        id: "pr12",
        question: "Typical Saturday",
        answer: "Market in the morning, techno at night",
      },
    ],
    details: {
      height: "6'1\"",
      education: "High School",
      drinking: "socially",
      smoking: "sometimes",
      lookingFor: "Casual",
    },
    introversionLevel: 4,
    socialSpeed: "fast",
  },
  {
    id: "p13",
    name: "Chloe",
    age: 22,
    job: "Model",
    location: "Berlin",
    distance: 5,
    verified: true,
    verificationScore: 95,
    verificationTier: "Platinum",
    bio: "living for the aesthetic 📸",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&fit=crop",
    ],
    interests: ["Fashion", "Photography", "Design", "Nightlife", "Travel"],
    vibeTags: ["Confident", "Elegant", "Social"],
    auraRead: "magnetic social energy",
    stories: [],
    prompts: [
      {
        id: "pr13",
        question: "Dream destination",
        answer: "Tokyo during cherry blossom season",
      },
    ],
    details: {
      height: "5'10\"",
      education: "Student",
      drinking: "socially",
      smoking: "trying_to_quit",
      lookingFor: "Casual",
    },
    introversionLevel: 2,
    socialSpeed: "fast",
  },
  {
    id: "p14",
    name: "Hugo",
    age: 29,
    job: "Data Scientist",
    location: "Berlin",
    distance: 12,
    verified: true,
    verificationScore: 76,
    verificationTier: "Silver",
    bio: "quantifying life 📊 cat dad",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&fit=crop",
    ],
    interests: ["Tech", "Mathematics", "Chess", "Reading", "Cats"],
    vibeTags: ["Logical", "Quiet", "Kind"],
    auraRead: "focused intellectual aura",
    stories: [],
    prompts: [
      {
        id: "pr14",
        question: "My favorite book",
        answer: "Foundation by Isaac Asimov",
      },
    ],
    details: {
      height: "5'9\"",
      education: "PhD",
      drinking: "no",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 9,
    socialSpeed: "slow",
  },
  {
    id: "p15",
    name: "Amelie",
    age: 26,
    job: "Florist",
    location: "Berlin",
    distance: 3,
    verified: true,
    verificationScore: 84,
    verificationTier: "Gold",
    bio: "surrounded by blooms 🌸 vintage lover",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&fit=crop",
    ],
    interests: ["Plants", "Nature", "Vintage", "Art", "Cooking"],
    vibeTags: ["Soft", "Nurturing", "Creative"],
    auraRead: "gentle healing energy",
    stories: [],
    prompts: [
      {
        id: "pr15",
        question: "First date idea",
        answer: "Walk through the botanical gardens",
      },
    ],
    details: {
      height: "5'5\"",
      education: "Bachelors",
      drinking: "rarely",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 7,
    socialSpeed: "slow",
  },
  {
    id: "p16",
    name: "Jonas",
    age: 28,
    job: "Video Editor",
    location: "Berlin",
    distance: 4,
    verified: true,
    verificationScore: 89,
    verificationTier: "Gold",
    bio: "splicing reality 🎬 gamer at heart",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&fit=crop",
    ],
    interests: ["Movies", "Gaming", "Editing", "Music", "Tech"],
    vibeTags: ["Observant", "Witty", "Nerdy"],
    auraRead: "dynamic creative focus",
    stories: [],
    prompts: [
      {
        id: "pr16",
        question: "A movie I can watch forever",
        answer: "Spider-Man: Into the Spider-Verse",
      },
    ],
    details: {
      height: "5'11\"",
      education: "Bachelors",
      drinking: "socially",
      smoking: "sometimes",
      lookingFor: "Friends",
    },
    introversionLevel: 6,
    socialSpeed: "normal",
  },
  {
    id: "p17",
    name: "Clara",
    age: 30,
    job: "Doctor",
    location: "Berlin",
    distance: 7,
    verified: true,
    verificationScore: 98,
    verificationTier: "Platinum",
    bio: "caring for others 🩺 finding balance",
    photos: [
      "https://images.unsplash.com/photo-1559839734-2b71f1e59816?w=800&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop",
    ],
    interests: ["Health", "Reading", "Running", "Hiking", "Piano"],
    vibeTags: ["Empathetic", "Ambitious", "Calm"],
    auraRead: "strong empathetic light",
    stories: [],
    prompts: [
      {
        id: "pr17",
        question: "What I'm looking for",
        answer: "Someone to ground me after a long shift",
      },
    ],
    details: {
      height: "5'7\"",
      education: "Medical Degree",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Serious",
    },
    introversionLevel: 5,
    socialSpeed: "normal",
  },
  {
    id: "p18",
    name: "Timo",
    age: 25,
    job: "Skateboarder",
    location: "Berlin",
    distance: 3,
    verified: false,
    verificationScore: 50,
    verificationTier: "Bronze",
    bio: "always on wheels 🛹 catch me at the park",
    photos: [
      "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&fit=crop",
    ],
    interests: ["Skating", "Music", "Street Art", "Photography"],
    vibeTags: ["Rebellious", "Free", "Energetic"],
    auraRead: "high-octane kinetic energy",
    stories: [],
    prompts: [
      {
        id: "pr18",
        question: "My favorite spot",
        answer: "Tempelhof at sunset",
      },
    ],
    details: {
      height: "5'9\"",
      education: "High School",
      drinking: "socially",
      smoking: "yes",
      lookingFor: "Casual",
    },
    introversionLevel: 3,
    socialSpeed: "fast",
  },
  {
    id: "p19",
    name: "Isabella",
    age: 24,
    job: "Law Student",
    location: "Berlin",
    distance: 6,
    verified: true,
    verificationScore: 83,
    verificationTier: "Gold",
    bio: "arguing for a living, dancing for fun 💃",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&fit=crop",
    ],
    interests: ["Law", "Salsa", "Travel", "History", "Museums"],
    vibeTags: ["Sharp", "Passionate", "Ambitious"],
    auraRead: "determined fiery aura",
    stories: [],
    prompts: [
      {
        id: "pr19",
        question: "First impression",
        answer: "Usually that I'm intimidating (I'm not!)",
      },
    ],
    details: {
      height: "5'6\"",
      education: "Student",
      drinking: "socially",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 4,
    socialSpeed: "fast",
  },
  {
    id: "p20",
    name: "Felix",
    age: 27,
    job: "Game Developer",
    location: "Berlin",
    distance: 8,
    verified: true,
    verificationScore: 87,
    verificationTier: "Gold",
    bio: "coding worlds 🎮 coffee in hand",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop",
    ],
    interests: ["Gaming", "Coding", "Anime", "Sci-Fi", "Keyboards"],
    vibeTags: ["Creative", "Introverted", "Witty"],
    auraRead: "imaginative digital pulse",
    stories: [],
    prompts: [
      {
        id: "pr20",
        question: "Secret talent",
        answer: "I can beat anyone at Smash Bros",
      },
    ],
    details: {
      height: "5'10\"",
      education: "Bachelors",
      drinking: "no",
      smoking: "no",
      lookingFor: "Relationship",
    },
    introversionLevel: 8,
    socialSpeed: "slow",
  },
];

// ============================================
// CORE PROFILE FUNCTIONS
// ============================================

export function getProfileById(profileId: string): UserProfile | undefined {
  return MOCK_PROFILES.find((p) => p.id === profileId);
}

// Simple pagination state for the session
let seenProfileIds: Set<string> = new Set();

export async function fetchDiscoverProfiles(
  currentUserId?: string,
  page: number = 1,
  limit: number = 10,
): Promise<UserProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network

  // 1. Reset if page 1
  if (page === 1) seenProfileIds = new Set();

  // 2. Filter out current user and already seen
  const pool = MOCK_PROFILES.filter(
    (p) => p.id !== currentUserId && !seenProfileIds.has(p.id),
  );

  // 3. Take batch
  const batch = pool.slice(0, limit);

  // 4. Mark as seen
  batch.forEach((p) => seenProfileIds.add(p.id));

  return batch;
}

export async function fetchDailyPicks(
  currentUserId?: string,
): Promise<UserProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Return 4 random profiles
  return [...MOCK_PROFILES]
    .filter((p) => p.id !== currentUserId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}

export function resetDiscoverPagination(): void {
  seenProfileIds = new Set();
}

// ============================================
// MATCHING & PERSISTENCE
// ============================================

export async function fetchMatches(): Promise<Match[]> {
  const stored = localStorage.getItem("aura_matches");
  if (stored) return JSON.parse(stored);

  // Seed initial match for demo
  const initialMatch: Match = {
    matchId: "demo_1",
    oderId: "p1",
    name: "Julia",
    photo: MOCK_PROFILES[0].photos[0],
    preview: "Aura Match! Score: 88% ✨",
    time: "2h",
    unread: true,
    isAuraMatch: true,
    transcript: generateDemoTranscript("You", "Julia"),
    profile: MOCK_PROFILES[0],
  };
  return [initialMatch];
}

export async function likeProfile(
  fromUserId: string,
  toProfile: UserProfile,
): Promise<MatchResult> {
  await new Promise((r) => setTimeout(r, 400));
  const isMatch = Math.random() > 0.5; // 50% match rate for demo

  if (isMatch) {
    const transcript = generateDemoTranscript("You", toProfile.name);
    const newMatch: Match = {
      matchId: `m_${Date.now()}`,
      oderId: toProfile.id,
      name: toProfile.name,
      photo: toProfile.photos[0],
      preview: "Your auras connected! ✨",
      time: "Just now",
      unread: true,
      isAuraMatch: true,
      transcript,
      profile: toProfile,
    };

    saveMatch(newMatch);
    return { matched: true, matchId: newMatch.matchId, transcript };
  }

  return { matched: false };
}

function saveMatch(match: Match) {
  const existing = localStorage.getItem("aura_matches");
  const matches = existing ? JSON.parse(existing) : [];
  if (!matches.some((m: Match) => m.oderId === match.oderId)) {
    matches.unshift(match);
    localStorage.setItem("aura_matches", JSON.stringify(matches));
  }
}

export async function triggerBackgroundAuraMatch(
  my: UserProfile,
  target: UserProfile,
): Promise<AuraMatchResult> {
  const score = calculateCompatibility(my, target);
  const transcript = generateDemoTranscript(my.name, target.name);

  const newMatch: Match = {
    matchId: `aura_${Date.now()}`,
    oderId: target.id,
    name: target.name,
    photo: target.photos[0],
    preview: `Aura Match! Score: ${score}%`,
    time: "Just now",
    unread: true,
    isAuraMatch: true,
    transcript,
    profile: target,
  };

  saveMatch(newMatch);

  return {
    isMatch: true,
    score,
    reasons: [
      "High visual compatibility",
      "Shared interest in " + target.interests[0],
    ],
    suggestedOpener: `Hey ${target.name}! Our auras are vibing... noticed you're into ${target.interests[0]}?`,
  };
}

// ============================================
// COMPATIBILITY LOGIC
// ============================================

export function calculateCompatibility(
  pA: UserProfile,
  pB: UserProfile,
): number {
  let score = 60; // Base score

  // 1. Shared interests
  const shared = pA.interests.filter((i) => pB.interests.includes(i)).length;
  score += shared * 8;

  // 2. Introversion balance
  const diff = Math.abs(
    (pA.introversionLevel || 5) - (pB.introversionLevel || 5),
  );
  if (diff <= 2)
    score += 10; // Similar energy
  else if (diff > 5) score -= 15; // Mismatch

  // 3. Social speed
  if (pA.socialSpeed === pB.socialSpeed) score += 5;

  return Math.min(99, Math.max(40, score));
}

export function getCompatibilityBreakdown(pA: UserProfile, pB: UserProfile) {
  const shared = pA.interests.filter((i) => pB.interests.includes(i));
  return {
    overall: calculateCompatibility(pA, pB),
    sharedInterests: shared,
    vibeMatch: pA.vibeTags.some((v) => pB.vibeTags.includes(v))
      ? "High"
      : "Good",
    energy:
      Math.abs((pA.introversionLevel || 5) - (pB.introversionLevel || 5)) < 3
        ? "Synced"
        : "Complementary",
  };
}

// ============================================
// AI CONVERSATION SIMULATION
// ============================================

function generateDemoTranscript(me: string, them: string): TwinChatMessage[] {
  return [
    {
      id: "t1",
      from: "auraB",
      senderName: them,
      text: `Hey! I'm ${them}'s AI twin. Their aura vibed with yours immediately.`,
      timestamp: Date.now(),
    },
    {
      id: "t2",
      from: "auraA",
      senderName: me,
      text: `Oh really? That's cool. What stood out?`,
      timestamp: Date.now() + 1000,
    },
    {
      id: "t3",
      from: "auraB",
      senderName: them,
      text: `Mostly the shared interest in ${MOCK_PROFILES.find((p) => p.name === them)?.interests[0] || "art"}. ${them} is really passionate about that.`,
      timestamp: Date.now() + 2000,
    },
    {
      id: "t4",
      from: "auraA",
      senderName: me,
      text: `I love that. Tell them I'm definitely interested in chatting more.`,
      timestamp: Date.now() + 3000,
    },
    {
      id: "t5",
      from: "auraB",
      senderName: them,
      text: `They're listening! I think it's a match. ✨`,
      timestamp: Date.now() + 4000,
    },
  ];
}

export async function processTwinChat(
  message: string,
  user: UserProfile,
  target: UserProfile,
  history: TwinChatMessage[],
): Promise<TwinChatResult> {
  await new Promise((r) => setTimeout(r, 800));
  const responses = [
    `${target.name}'s aura says: That's such a specific vibe, they'd totally agree.`,
    `Ooh, noted. I'll pass that to ${target.name}. They love people who are direct.`,
    `Haha, ${target.name} actually mentioned that in their training! Great minds.`,
    `Interesting... our data suggests a 90% compatibility on that specific point.`,
  ];

  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    sentiment: "positive",
    shouldContinue: history.length < 10,
    suggestedFollowUp:
      history.length > 4
        ? "Should I set up a real chat for you two?"
        : undefined,
  };
}

// ============================================
// SAFETY & BLOCKING
// ============================================

export async function blockUser(
  myId: string,
  targetId: string,
): Promise<boolean> {
  const blocked = JSON.parse(localStorage.getItem("aura_blocked") || "[]");
  if (!blocked.includes(targetId)) {
    blocked.push(targetId);
    localStorage.setItem("aura_blocked", JSON.stringify(blocked));
  }
  // Remove from matches
  const matches = JSON.parse(localStorage.getItem("aura_matches") || "[]");
  const filtered = matches.filter((m: any) => m.oderId !== targetId);
  localStorage.setItem("aura_matches", JSON.stringify(filtered));
  return true;
}

export async function unmatchUser(matchId: string): Promise<boolean> {
  const matches = JSON.parse(localStorage.getItem("aura_matches") || "[]");
  const filtered = matches.filter((m: any) => m.matchId !== matchId);
  localStorage.setItem("aura_matches", JSON.stringify(filtered));
  return true;
}

// Alias for unmatchProfile
export const unmatchProfile = unmatchUser;

// ============================================
// REPORTING & MODERATION
// ============================================

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  timestamp: number;
  status: "pending" | "reviewed" | "resolved";
}

export async function reportUser(
  reporterId: string,
  reportedUserId: string,
  reportedUserName: string,
  reason: string,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  try {
    // Get existing reports
    const reports: Report[] = JSON.parse(
      localStorage.getItem("aura_reports") || "[]",
    );

    // Check if user already reported this person
    const existingReport = reports.find(
      (r) => r.reporterId === reporterId && r.reportedUserId === reportedUserId,
    );

    if (existingReport) {
      // Update existing report
      existingReport.reason = reason;
      existingReport.timestamp = Date.now();
      existingReport.status = "pending";
    } else {
      // Create new report
      const newReport: Report = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        reporterId,
        reportedUserId,
        reportedUserName,
        reason,
        timestamp: Date.now(),
        status: "pending",
      };
      reports.push(newReport);
    }

    // Save reports
    localStorage.setItem("aura_reports", JSON.stringify(reports));

    // Optionally: Auto-unmatch after reporting
    const matches = JSON.parse(localStorage.getItem("aura_matches") || "[]");
    const filtered = matches.filter((m: any) => m.oderId !== reportedUserId);
    localStorage.setItem("aura_matches", JSON.stringify(filtered));

    console.log(`User ${reportedUserName} reported for: ${reason}`);
    return true;
  } catch (error) {
    console.error("Error reporting user:", error);
    return false;
  }
}

export async function getMyReports(userId: string): Promise<Report[]> {
  const reports: Report[] = JSON.parse(
    localStorage.getItem("aura_reports") || "[]",
  );
  return reports.filter((r) => r.reporterId === userId);
}

export async function getAllReports(): Promise<Report[]> {
  // Admin function to see all reports
  return JSON.parse(localStorage.getItem("aura_reports") || "[]");
}

// Default Export for easy importing
export default {
  MOCK_PROFILES,
  getProfileById,
  fetchDiscoverProfiles,
  fetchDailyPicks,
  resetDiscoverPagination,
  fetchMatches,
  likeProfile,
  triggerBackgroundAuraMatch,
  calculateCompatibility,
  getCompatibilityBreakdown,
  processTwinChat,
  blockUser,
  unmatchUser,
  unmatchProfile,
  reportUser,
  getMyReports,
  getAllReports,
};

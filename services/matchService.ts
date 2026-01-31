// src/services/matchService.ts
// Complete match service with ALL required exports + aliases

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
// MOCK PROFILES
// ============================================

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: "profile_1",
    oderId: "profile_1",
    userId: "user_1",
    name: "Julia",
    displayName: "Julia",
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
    vibeWords: ["Creative", "Chill", "Curious"],
    auraRead: "warm creative energy",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_2",
    oderId: "profile_2",
    userId: "user_2",
    name: "Marcus",
    displayName: "Marcus",
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
    vibeWords: ["Nerdy", "Laid-back", "Deep"],
    auraRead: "thoughtful introvert",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_3",
    oderId: "profile_3",
    userId: "user_3",
    name: "Emma",
    displayName: "Emma",
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
    vibeWords: ["Cozy", "Nurturing", "Adventurous"],
    auraRead: "warm homebody",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_4",
    oderId: "profile_4",
    userId: "user_4",
    name: "Alex",
    displayName: "Alex",
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
    vibeWords: ["Artistic", "Spontaneous", "Romantic"],
    auraRead: "free spirit",
    stories: [],
    prompts: [
      { id: "p1", question: "My ideal date", answer: "exploring with cameras" },
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_5",
    oderId: "profile_5",
    userId: "user_5",
    name: "Sophie",
    displayName: "Sophie",
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
    vibeWords: ["Nerdy", "Creative", "Playful"],
    auraRead: "logical dreamer",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_6",
    oderId: "profile_6",
    userId: "user_6",
    name: "Daniel",
    displayName: "Daniel",
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
    vibeWords: ["Foodie", "Warm", "Passionate"],
    auraRead: "nurturing soul",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_7",
    oderId: "profile_7",
    userId: "user_7",
    name: "Mia",
    displayName: "Mia",
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
    vibeWords: ["Deep", "Thoughtful", "Creative"],
    auraRead: "old soul",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_8",
    oderId: "profile_8",
    userId: "user_8",
    name: "Leo",
    displayName: "Leo",
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
    vibeWords: ["Active", "Nerdy", "Balanced"],
    auraRead: "grounded techie",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_9",
    oderId: "profile_9",
    userId: "user_9",
    name: "Nina",
    displayName: "Nina",
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
    vibeWords: ["Creative", "Cozy", "Quirky"],
    auraRead: "artistic dreamer",
    stories: [],
    prompts: [
      {
        id: "p1",
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
    goals: ["serious_relationship"],
  },
  {
    id: "profile_10",
    oderId: "profile_10",
    userId: "user_10",
    name: "Sarah",
    displayName: "Sarah",
    age: 25,
    job: "Data Scientist",
    location: "Berlin",
    distance: 7,
    verified: true,
    verificationScore: 88,
    verificationTier: "Gold",
    bio: "data by day, dance by night 💃",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&fit=crop",
    ],
    interests: ["Dancing", "Data", "Music", "Wine", "Salsa"],
    vibeTags: ["Analytical", "Passionate", "Hidden depths"],
    vibeWords: ["Analytical", "Passionate", "Hidden depths"],
    auraRead: "logical mind, fiery soul",
    stories: [],
    prompts: [
      {
        id: "p1",
        question: "Surprised to learn",
        answer: "I've won salsa competitions",
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
    goals: ["serious_relationship"],
  },
];

// ============================================
// PROFILE FUNCTIONS
// ============================================

export function getProfileById(profileId: string): UserProfile | undefined {
  return MOCK_PROFILES.find(
    (p) =>
      p.id === profileId || p.oderId === profileId || p.userId === profileId,
  );
}

export async function fetchDailyPicks(
  currentUserId?: string,
): Promise<UserProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const profiles = currentUserId
    ? MOCK_PROFILES.filter((p) => p.userId !== currentUserId)
    : MOCK_PROFILES;
  return [...profiles].sort(() => Math.random() - 0.5);
}

// Track seen profiles for pagination simulation
let seenProfileIds: Set<string> = new Set();

export async function fetchDiscoverProfiles(
  currentUserId?: string,
  page: number = 1,
  limit: number = 10,
): Promise<UserProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const profiles = currentUserId
    ? MOCK_PROFILES.filter((p) => p.userId !== currentUserId)
    : MOCK_PROFILES;
  
  // Shuffle profiles for variety
  const shuffled = [...profiles].sort(() => Math.random() - 0.5);
  
  // For first page, reset seen profiles
  if (page === 1) {
    seenProfileIds = new Set();
  }
  
  // Filter out already seen profiles
  const unseen = shuffled.filter(p => !seenProfileIds.has(p.id));
  
  // Get next batch
  const batch = unseen.slice(0, limit);
  
  // Mark as seen
  batch.forEach(p => seenProfileIds.add(p.id));
  
  return batch;
}

export function resetDiscoverPagination(): void {
  seenProfileIds = new Set();
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  return MOCK_PROFILES;
}
export async function getNearbyProfiles(
  maxDistance: number = 10,
): Promise<UserProfile[]> {
  return MOCK_PROFILES.filter((p) => p.distance <= maxDistance);
}

// ============================================
// MATCHING FUNCTIONS
// ============================================

export async function triggerBackgroundAuraMatch(
  userProfile: UserProfile,
  targetProfile: UserProfile,
): Promise<AuraMatchResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const sharedInterests = userProfile.interests.filter((i) =>
    targetProfile.interests.includes(i),
  ).length;
  const introvertDiff = Math.abs(
    (userProfile.introversionLevel || 5) -
      (targetProfile.introversionLevel || 5),
  );
  const score = Math.min(100, 50 + sharedInterests * 10 - introvertDiff * 5);
  const isMatch = score >= 60;
  
  // Generate Aura conversation transcript
  const transcript = generateDemoTranscript(userProfile.name, targetProfile.name);
  
  // Create and persist the match with Aura conversation
  const newMatch: Match = {
    matchId: `aura_match_${Date.now()}`,
    oderId: targetProfile.id,
    name: targetProfile.name,
    photo: targetProfile.photos[0],
    preview: `Aura Match! Score: ${score}% ✨`,
    time: "Just now",
    unread: true,
    isAuraMatch: true,
    transcript,
    profile: targetProfile,
  };
  
  try {
    const stored = localStorage.getItem("aura_matches");
    const matches = stored ? JSON.parse(stored) : [];
    // Avoid duplicates
    const exists = matches.some((m: Match) => m.oderId === targetProfile.id);
    if (!exists) {
      matches.unshift(newMatch);
      localStorage.setItem("aura_matches", JSON.stringify(matches));
    }
  } catch (e) {
    console.error("Failed to save Aura match", e);
  }
  
  return {
    isMatch,
    score,
    reasons:
      sharedInterests > 0
        ? [
            `You both love ${userProfile.interests
              .filter((i) => targetProfile.interests.includes(i))
              .slice(0, 2)
              .join(" and ")}`,
          ]
        : ["Your vibes could complement each other"],
    suggestedOpener: isMatch
      ? `hey! i noticed we both like ${userProfile.interests.filter((i) => targetProfile.interests.includes(i))[0] || "similar things"}... `
      : undefined,
  };
}

export async function fetchMatches(userId?: string): Promise<Match[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const stored = localStorage.getItem("aura_matches");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load matches", e);
  }
  return [
    {
      matchId: "match_demo",
      oderId: "profile_1",
      name: "Julia",
      photo: MOCK_PROFILES[0].photos[0],
      preview: "Say hello! 👋",
      time: "1d",
      unread: true,
      isAuraMatch: true,
      transcript: generateDemoTranscript("You", "Julia"),
      profile: MOCK_PROFILES[0],
    },
  ];
}

export async function likeProfile(
  fromUserId: string,
  toProfile: UserProfile,
): Promise<MatchResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const matched = Math.random() < 0.4;
  if (matched) {
    const transcript = generateDemoTranscript("You", toProfile.name);
    const newMatch: Match = {
      matchId: `match_${Date.now()}`,
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
    try {
      const stored = localStorage.getItem("aura_matches");
      const matches = stored ? JSON.parse(stored) : [];
      matches.unshift(newMatch);
      localStorage.setItem("aura_matches", JSON.stringify(matches));
    } catch (e) {
      console.error("Failed to save match", e);
    }
    return {
      matched: true,
      matchId: newMatch.matchId,
      compatibilityScore: 75 + Math.floor(Math.random() * 20),
      transcript,
      icebreaker: `hey ${toProfile.name}! our auras vibed... what made u swipe? 👀`,
    };
  }
  return { matched: false };
}

export async function superLikeProfile(
  fromUserId: string,
  toProfile: UserProfile,
): Promise<MatchResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const matched = Math.random() < 0.7;
  if (matched) {
    const transcript = generateDemoTranscript("You", toProfile.name);
    const newMatch: Match = {
      matchId: `match_${Date.now()}`,
      oderId: toProfile.id,
      name: toProfile.name,
      photo: toProfile.photos[0],
      preview: "⭐ Super Like!",
      time: "Just now",
      unread: true,
      isAuraMatch: true,
      transcript,
      profile: toProfile,
    };
    try {
      const stored = localStorage.getItem("aura_matches");
      const matches = stored ? JSON.parse(stored) : [];
      matches.unshift(newMatch);
      localStorage.setItem("aura_matches", JSON.stringify(matches));
    } catch (e) {
      console.error("Failed to save match", e);
    }
    return {
      matched: true,
      matchId: newMatch.matchId,
      compatibilityScore: 85 + Math.floor(Math.random() * 15),
      transcript,
      icebreaker: `hey ${toProfile.name}! i super liked u 💫`,
    };
  }
  return { matched: false };
}

export async function passProfile(
  fromUserId: string,
  toProfileId: string,
): Promise<void> {
  console.log(`User ${fromUserId} passed on ${toProfileId}`);
}

// Unmatch functions - BOTH names for compatibility
export async function unmatchUser(matchId: string): Promise<boolean> {
  try {
    const stored = localStorage.getItem("aura_matches");
    if (stored) {
      const matches = JSON.parse(stored);
      const filtered = matches.filter(
        (m: Match) => m.matchId !== matchId && m.oderId !== matchId,
      );
      localStorage.setItem("aura_matches", JSON.stringify(filtered));
    }
    return true;
  } catch (e) {
    console.error("Failed to unmatch", e);
    return false;
  }
}
export async function unmatchProfile(matchId: string): Promise<boolean> {
  return unmatchUser(matchId);
} // Alias

// ============================================
// SAFETY & REPORTING FUNCTIONS
// ============================================

export async function reportUser(
  reporterId: string,
  reportedUserId: string,
  reason: string,
  details?: string,
): Promise<{ success: boolean; reportId?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const report = {
    id: `report_${Date.now()}`,
    reporterId,
    reportedUserId,
    reason,
    details,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  try {
    const stored = localStorage.getItem("aura_reports") || "[]";
    const reports = JSON.parse(stored);
    reports.push(report);
    localStorage.setItem("aura_reports", JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to save report", e);
  }
  console.log("Report submitted:", report);
  return { success: true, reportId: report.id };
}
export async function reportProfile(
  reporterId: string,
  reportedUserId: string,
  reason: string,
  details?: string,
): Promise<{ success: boolean; reportId?: string }> {
  return reportUser(reporterId, reportedUserId, reason, details);
} // Alias

export async function blockUser(
  userId: string,
  blockedUserId: string,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const stored = localStorage.getItem("aura_blocked") || "[]";
    const blocked = JSON.parse(stored);
    if (!blocked.includes(blockedUserId)) {
      blocked.push(blockedUserId);
      localStorage.setItem("aura_blocked", JSON.stringify(blocked));
    }
    await unmatchUser(blockedUserId);
    console.log(`User ${userId} blocked ${blockedUserId}`);
    return true;
  } catch (e) {
    console.error("Failed to block user", e);
    return false;
  }
}
export async function blockProfile(
  userId: string,
  blockedUserId: string,
): Promise<boolean> {
  return blockUser(userId, blockedUserId);
} // Alias

export async function unblockUser(
  userId: string,
  blockedUserId: string,
): Promise<boolean> {
  try {
    const stored = localStorage.getItem("aura_blocked") || "[]";
    const blocked = JSON.parse(stored);
    const filtered = blocked.filter((id: string) => id !== blockedUserId);
    localStorage.setItem("aura_blocked", JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Failed to unblock user", e);
    return false;
  }
}
export async function unblockProfile(
  userId: string,
  blockedUserId: string,
): Promise<boolean> {
  return unblockUser(userId, blockedUserId);
} // Alias

export async function getBlockedUsers(userId: string): Promise<string[]> {
  try {
    const stored = localStorage.getItem("aura_blocked") || "[]";
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}
export async function getBlockedProfiles(userId: string): Promise<string[]> {
  return getBlockedUsers(userId);
} // Alias

// ============================================
// TWIN/AI CONVERSATION FUNCTIONS
// ============================================

export async function getTwinIntro(
  userProfile: UserProfile,
  targetProfile: UserProfile,
): Promise<TwinIntroResult> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    greeting: `hey! im ${targetProfile.name}'s aura twin 👋`,
    topics: targetProfile.interests.slice(0, 3),
    tone: targetProfile.socialSpeed === "slow" ? "chill" : "friendly",
  };
}

export async function processTwinChat(
  message: string,
  userProfile: UserProfile,
  targetProfile: UserProfile,
  conversationHistory: TwinChatMessage[],
): Promise<TwinChatResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const responses = [
    `ooh interesting! ${targetProfile.name} would def vibe with that`,
    `haha okay noted! they're into ${targetProfile.interests[0]} too`,
    `love that energy. ${targetProfile.name} is similar`,
    `okay we're onto something here 👀`,
    `that's perfect bc they mentioned wanting someone like that`,
  ];
  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    sentiment: "positive",
    shouldContinue: conversationHistory.length < 6,
    suggestedFollowUp:
      conversationHistory.length >= 5
        ? `think its time for u two to meet! ready to match?`
        : undefined,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function calculateCompatibility(
  profileA: UserProfile,
  profileB: UserProfile,
): number {
  const sharedInterests = profileA.interests.filter((i) =>
    profileB.interests.includes(i),
  ).length;
  const introvertDiff = Math.abs(
    (profileA.introversionLevel || 5) - (profileB.introversionLevel || 5),
  );
  return Math.min(
    100,
    Math.max(0, 50 + sharedInterests * 10 - introvertDiff * 5),
  );
}

export function getCompatibilityBreakdown(
  profileA: UserProfile,
  profileB: UserProfile,
) {
  const sharedInterests = profileA.interests.filter((i) =>
    profileB.interests.includes(i),
  );
  const introvertDiff = Math.abs(
    (profileA.introversionLevel || 5) - (profileB.introversionLevel || 5),
  );
  return {
    overall: calculateCompatibility(profileA, profileB),
    interests: Math.min(100, sharedInterests.length * 20),
    introversion: Math.max(0, 100 - introvertDiff * 15),
    sharedInterests,
    introvertMatch:
      introvertDiff <= 2 ? "great" : introvertDiff <= 4 ? "good" : "different",
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateDemoTranscript(
  userName: string,
  matchName: string,
): TwinChatMessage[] {
  return [
    {
      from: "auraB" as const,
      text: `hey! im ${matchName}'s aura. saw u like coffee too? ☕`,
      senderName: matchName,
      id: "msg_0",
      timestamp: Date.now(),
    },
    {
      from: "auraA" as const,
      text: `omg yes!! literally cant function without it lol`,
      senderName: userName,
      id: "msg_1",
      timestamp: Date.now() + 2000,
    },
    {
      from: "auraB" as const,
      text: `same tbh. ${matchName} said they need someone who gets that`,
      senderName: matchName,
      id: "msg_2",
      timestamp: Date.now() + 4000,
    },
    {
      from: "auraA" as const,
      text: `tell them i have strong opinions about oat milk 👀`,
      senderName: userName,
      id: "msg_3",
      timestamp: Date.now() + 6000,
    },
    {
      from: "auraB" as const,
      text: `haha ok theyre intrigued. what are they looking for tho?`,
      senderName: matchName,
      id: "msg_4",
      timestamp: Date.now() + 8000,
    },
    {
      from: "auraA" as const,
      text: `something real. tired of surface level stuff yk?`,
      senderName: userName,
      id: "msg_5",
      timestamp: Date.now() + 10000,
    },
    {
      from: "auraB" as const,
      text: `ok literally same page. i think u two should meet 💫`,
      senderName: matchName,
      id: "msg_6",
      timestamp: Date.now() + 12000,
    },
  ];
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  MOCK_PROFILES,
  getProfileById,
  fetchDailyPicks,
  fetchDiscoverProfiles,
  getAllProfiles,
  getNearbyProfiles,
  triggerBackgroundAuraMatch,
  fetchMatches,
  likeProfile,
  superLikeProfile,
  passProfile,
  unmatchUser,
  unmatchProfile,
  reportUser,
  reportProfile,
  blockUser,
  blockProfile,
  unblockUser,
  unblockProfile,
  getBlockedUsers,
  getBlockedProfiles,
  getTwinIntro,
  processTwinChat,
  calculateCompatibility,
  getCompatibilityBreakdown,
};

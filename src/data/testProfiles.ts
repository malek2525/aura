// src/data/testProfiles.ts
// Solid test bot profiles for testing - images are fixed, not random

import { UserProfile } from '../types';

// Fixed image URLs - these won't change on refresh
// Using Unsplash source for consistent images
export const TEST_PROFILES: UserProfile[] = [
  {
    id: 'bot_petra',
    name: 'Petra',
    age: 28,
    bio: "Nerdy about design, serious about coffee. Looking for player 2 to explore Budapest with.",
    job: 'Product Designer',
    location: 'Budapest',
    distance: 3,
    verified: true,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
    ],
    auraRead: "Petra is a creative introvert who loves gaming on weekends but needs her quiet time. She's warm once you get past her shy exterior.",
    vibeTags: ['Gamer', 'Creative', 'Coffee lover'],
    verificationScore: 88,
    verificationTier: 'Gold',
    stories: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=800&fit=crop', timestamp: '2h', isViewed: false },
    ],
    interests: ['Gaming', 'Coffee', 'Sci-Fi', 'UI Design'],
    prompts: [
      { question: "I geek out on...", answer: "Lore videos about Elden Ring and obscure design history." }
    ],
    details: {
      height: '170cm',
      exercise: 'Sometimes',
      education: 'Masters',
      drinking: 'Socially',
      smoking: 'No',
      lookingFor: 'Relationship',
      starSign: 'Leo',
      languages: ['English', 'Hungarian'],
    }
  },
  {
    id: 'bot_hanna',
    name: 'Hanna',
    age: 25,
    bio: "Bookworm by day, wine enthusiast by night. 📚🍷 Looking for someone to debate philosophy with.",
    job: 'Editor',
    location: 'Budapest',
    distance: 5,
    verified: true,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    ],
    auraRead: "Hanna radiates calm energy. She values deep conversations over loud parties and prefers quality time with few close friends.",
    vibeTags: ['Bookworm', 'Warm', 'Thoughtful'],
    verificationScore: 75,
    verificationTier: 'Silver',
    stories: [],
    interests: ['Books', 'Wine', 'Writing', 'Philosophy'],
    prompts: [
      { question: "My simple pleasure...", answer: "A rainy afternoon with a new book and good tea." }
    ],
    details: {
      height: '168cm',
      exercise: 'Active',
      education: 'BA',
      drinking: 'Socially',
      smoking: 'No',
      lookingFor: 'Relationship',
      starSign: 'Pisces',
      languages: ['English', 'German'],
    }
  },
  {
    id: 'bot_julia',
    name: 'Julia',
    age: 26,
    bio: "Yoga teacher who loves hiking and cooking plant-based meals. Let's explore nature together! 🌿",
    job: 'Yoga Instructor',
    location: 'Budapest',
    distance: 7,
    verified: true,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop',
    ],
    auraRead: "Julia has a peaceful, grounded energy. She connects deeply with nature and values wellness and mindful living.",
    vibeTags: ['Peaceful', 'Active', 'Nature lover'],
    verificationScore: 92,
    verificationTier: 'Platinum',
    stories: [
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop', timestamp: '5h', isViewed: false },
    ],
    interests: ['Yoga', 'Hiking', 'Cooking', 'Meditation'],
    prompts: [
      { question: "On weekends you'll find me...", answer: "On a mountain trail at sunrise or trying a new vegan recipe." }
    ],
    details: {
      height: '165cm',
      exercise: 'Very active',
      education: 'Certificate',
      drinking: 'Rarely',
      smoking: 'No',
      lookingFor: 'Relationship',
      starSign: 'Sagittarius',
      languages: ['English', 'Spanish'],
    }
  },
  {
    id: 'bot_emma',
    name: 'Emma',
    age: 29,
    bio: "Software engineer who codes by day and plays board games by night. Looking for my co-op partner! 🎲",
    job: 'Software Engineer',
    location: 'Budapest',
    distance: 4,
    verified: true,
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    ],
    auraRead: "Emma is analytical but playful. She enjoys intellectual challenges and has a surprising competitive streak when it comes to games.",
    vibeTags: ['Analytical', 'Playful', 'Competitive'],
    verificationScore: 80,
    verificationTier: 'Gold',
    stories: [],
    interests: ['Board Games', 'Coding', 'Strategy Games', 'Tech'],
    prompts: [
      { question: "I'll know we're compatible if...", answer: "You can beat me at Settlers of Catan (good luck!)." }
    ],
    details: {
      height: '172cm',
      exercise: 'Sometimes',
      education: 'Masters',
      drinking: 'Socially',
      smoking: 'No',
      lookingFor: 'Relationship',
      starSign: 'Virgo',
      languages: ['English', 'Python 😉'],
    }
  },
  {
    id: 'bot_sofia',
    name: 'Sofia',
    age: 24,
    bio: "Art student with a passion for photography and vintage finds. Let's get lost in flea markets! 📷",
    job: 'Art Student',
    location: 'Budapest',
    distance: 2,
    verified: true,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
    ],
    auraRead: "Sofia sees beauty in unexpected places. She's creative, curious, and loves discovering hidden gems in the city.",
    vibeTags: ['Creative', 'Curious', 'Artistic'],
    verificationScore: 65,
    verificationTier: 'Silver',
    stories: [
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=800&fit=crop', timestamp: '1d', isViewed: true },
    ],
    interests: ['Photography', 'Art', 'Vintage', 'Travel'],
    prompts: [
      { question: "A perfect date looks like...", answer: "Golden hour photoshoot, then dinner at a hidden courtyard restaurant." }
    ],
    details: {
      height: '163cm',
      exercise: 'Active',
      education: 'BA (in progress)',
      drinking: 'Socially',
      smoking: 'No',
      lookingFor: 'Open to see',
      starSign: 'Libra',
      languages: ['English', 'Italian'],
    }
  },
];

// Get profiles based on preferences
export const getFilteredProfiles = (
  preferredGender: 'women' | 'men' | 'everyone',
  minAge: number,
  maxAge: number,
  maxDistance: number
): UserProfile[] => {
  return TEST_PROFILES.filter(profile => {
    const ageMatch = profile.age >= minAge && profile.age <= maxAge;
    const distanceMatch = profile.distance <= maxDistance;
    // For now all test profiles are women, add more for other genders later
    return ageMatch && distanceMatch;
  });
};

// Get a single profile by ID
export const getProfileById = (id: string): UserProfile | undefined => {
  return TEST_PROFILES.find(p => p.id === id);
};

import * as firestoreService from "@/firestoreService";
import {
  UserProfile,
  Gender,
  RelationshipIntent,
  SocialSpeed,
  WritingStyle,
} from "../types";

const VIBES = [
  "Chill",
  "Adventurous",
  "Nerdy",
  "Creative",
  "Ambitious",
  "Cozy",
  "Spontaneous",
  "Laid-back",
  "Romantic",
  "Funny",
  "Deep",
  "Outgoing",
];
const INTERESTS = [
  "Coffee",
  "Travel",
  "Gaming",
  "Reading",
  "Music",
  "Art",
  "Fitness",
  "Cooking",
  "Movies",
  "Hiking",
  "Photography",
  "Tech",
  "Fashion",
  "Food",
  "Dancing",
  "Yoga",
];

const FAKE_PHOTOS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
];

export async function seedFakeProfiles(count: number = 10) {
  console.log(`[SeedService] Starting seed for ${count} profiles...`);

  const names = [
    "Aria",
    "Ben",
    "Chloe",
    "Damian",
    "Elena",
    "Finn",
    "Grace",
    "Hugo",
    "Isla",
    "Jack",
  ];
  const intents: RelationshipIntent[] = [
    "serious_relationship",
    "casual_dating",
    "friends_only",
    "open_to_see",
  ];
  const speeds: SocialSpeed[] = ["slow", "normal", "fast"];
  const styles: WritingStyle[] = [
    "casual_emoji",
    "lowercase_aesthetic",
    "formal_proper",
  ];

  for (let i = 0; i < count; i++) {
    const id = `fake_user_${i}_${Math.random().toString(36).substring(2, 9)}`;
    const name = names[i % names.length];
    const selectedGender: Gender = Math.random() > 0.5 ? "woman" : "man";
    const selectedIntent = intents[Math.floor(Math.random() * intents.length)];

    // Pick 3 random interests
    const profileInterests = [...INTERESTS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Pick 2 random vibes
    const profileVibes = [...VIBES].sort(() => 0.5 - Math.random()).slice(0, 2);

    const fakeProfile: Partial<UserProfile> = {
      name: name,
      displayName: name,
      age: 21 + Math.floor(Math.random() * 12),
      job: "Creative Professional",
      location: "Berlin",
      distance: Math.floor(Math.random() * 15) + 1,
      bio: `Digital nomad and ${profileInterests[0]} lover. Always looking for the next adventure.`,
      photos: [
        `${FAKE_PHOTOS[i % FAKE_PHOTOS.length]}?w=800&q=80`,
        `${FAKE_PHOTOS[(i + 1) % FAKE_PHOTOS.length]}?w=800&q=80`,
      ],
      interests: profileInterests,
      vibeTags: profileVibes,
      vibeWords: profileVibes,
      auraRead:
        "Your auras resonate with a shared curiosity for creative expression and calm environments.",
      details: {
        height: `5'${Math.floor(Math.random() * 11) + 1}"`,
        education: "University",
        exercise: "Active",
        drinking: "Socially",
        smoking: "No",
        lookingFor:
          selectedIntent === "serious_relationship"
            ? "Serious Relationship"
            : "Something Casual",
      },
      introversionLevel: Math.floor(Math.random() * 10) + 1,
      socialSpeed: speeds[Math.floor(Math.random() * speeds.length)],
      goals: [selectedIntent],
      aura: {
        introversionLevel: 5,
        vibeWords: profileVibes,
        goals: [selectedIntent],
        topicsLike: profileInterests,
        topicsAvoid: ["drama", "negativity"],
        hardBoundaries: ["ghosting"],
        greenFlags: ["emotional intelligence", "humor"],
        redFlags: ["rudeness"],
        whatFeelsSafe: "Deep conversations in quiet places",
        whatShouldPeopleKnow: "I take a while to open up but I'm worth it.",
        summary: "A creative soul looking for connection.",
        socialSpeed: "normal",
        writingStyle: styles[Math.floor(Math.random() * styles.length)],
      },
      isActive: true,
    };

    try {
      await firestoreService.createUserProfile(id, fakeProfile);
      if ((i + 1) % 5 === 0 || i === count - 1) {
        console.log(`[SeedService] Seeded ${i + 1} profiles...`);
      }
    } catch (error) {
      console.error(`[SeedService] Failed to seed profile ${name}:`, error);
    }
  }

  console.log("[SeedService] Seeding complete! ✨");
}

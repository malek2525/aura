import {
  AuraProfile,
  MatchResult,
  AuraMatchResult,
  TwinIntroResult,
  TwinChatResult,
  TwinChatMessage,
  UserProfile,
} from "../types";

// --- UTILITY FUNCTIONS ---

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const overlapCount = (a: string[] = [], b: string[] = []): number => {
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.reduce(
    (count, item) => (setB.has(item.toLowerCase()) ? count + 1 : count),
    0,
  );
};

const hasIntersection = (a: string[] = [], b: string[] = []): boolean =>
  overlapCount(a, b) > 0;

const normalizeScore = (score: number): number =>
  clamp(Math.round(score), 0, 100);

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- COMPATIBILITY CALCULATION ---

export function calculateCompatibility(
  profileA: UserProfile,
  profileB: UserProfile
): number {
  let score = 50;

  // Interest overlap (max +20)
  const interestOverlap = overlapCount(profileA.interests || [], profileB.interests || []);
  score += Math.min(interestOverlap * 5, 20);

  // Vibe match (max +15)
  const vibeOverlap = overlapCount(profileA.vibeWords || [], profileB.vibeWords || []);
  score += Math.min(vibeOverlap * 5, 15);

  // Goals alignment (max +15)
  const goalsOverlap = overlapCount(profileA.goals || [], profileB.goals || []);
  if (goalsOverlap > 0) {
    score += 15;
  } else {
    const goalsA = profileA.goals || [];
    const goalsB = profileB.goals || [];
    if (goalsA.includes('serious_relationship') && goalsB.includes('casual_dating')) {
      score -= 15;
    }
    if (goalsA.includes('casual_dating') && goalsB.includes('serious_relationship')) {
      score -= 15;
    }
  }

  // Introversion compatibility
  const introA = profileA.introversionLevel || 5;
  const introB = profileB.introversionLevel || 5;
  const introDiff = Math.abs(introA - introB);
  
  if (introDiff <= 2) score += 10;
  else if (introDiff <= 4) score += 5;
  else if (introDiff >= 6) score -= 10;

  // Social speed
  const speedA = profileA.socialSpeed || 'normal';
  const speedB = profileB.socialSpeed || 'normal';
  
  if (speedA === speedB) score += 10;
  else if ((speedA === 'slow' && speedB === 'fast') || (speedA === 'fast' && speedB === 'slow')) {
    score -= 8;
  }

  // Location bonus
  const avgDistance = ((profileA.distance || 50) + (profileB.distance || 50)) / 2;
  if (avgDistance <= 10) score += 5;
  else if (avgDistance <= 25) score += 2;

  return normalizeScore(score);
}

// --- HUMAN-LIKE TEXT PATTERNS ---

// Real texting patterns people use
const textPatterns = {
  // Casual greetings
  greetings: [
    "heyy", "hey!", "hiiii", "yo", "hii", "heyyy", "sup", "hey hey"
  ],
  
  // Excitement
  excited: [
    "omg", "wait", "ok ok", "yooo", "no way", "ahh", "ooh", "yess", "haha yes"
  ],
  
  // Agreement
  agree: [
    "samee", "literally same", "fr fr", "right??", "exactlyy", "omg same", 
    "this^^", "100%", "felt that", "so true", "yupp"
  ],
  
  // Thinking/filler
  fillers: [
    "like", "honestly", "lowkey", "ngl", "idk", "tbh", "kinda", "sorta", "lol"
  ],
  
  // Positive reactions
  positive: [
    "i love that", "thats so cool", "obsessed", "im here for it", "yesss",
    "ok i fw that", "thats fire", "love it", "into it"
  ],
  
  // Questions (casual)
  questions: [
    "wbu?", "u?", "right?", "ya know?", "thoughts?", "same or no?"
  ],
  
  // Endings
  endings: [
    "lol", "haha", "😭", "💀", "lmao", "🙈", "✨", "👀", "😊", ":)"
  ]
};

// Add casual flair to text
const casualize = (text: string): string => {
  let result = text.toLowerCase();
  
  // Random chance to add filler
  if (Math.random() > 0.6) {
    result = pickRandom(["like ", "honestly ", "tbh ", "ngl "]) + result;
  }
  
  // Random chance to add ending
  if (Math.random() > 0.5) {
    result = result + " " + pickRandom(["lol", "haha", "😊", "✨", ""]);
  }
  
  // Sometimes remove punctuation or make it casual
  result = result.replace(/\.$/, "");
  
  return result.trim();
};

// --- ICEBREAKER GENERATION (CASUAL) ---

function generateIcebreaker(fromProfile: UserProfile, toProfile: UserProfile): string {
  const toName = toProfile.name || 'there';
  const toInterests = toProfile.interests || [];
  const toJob = toProfile.job || '';
  const toPrompts = toProfile.prompts || [];

  const openers: string[] = [];

  // Interest-based (casual)
  if (toInterests.length > 0) {
    const interest = pickRandom(toInterests);
    openers.push(
      `omg wait ur into ${interest} too?? ok we need to talk`,
      `${interest}!! ok finally someone with taste lol`,
      `ok i saw ${interest} and had to say hi haha`,
      `not me seeing ${interest} and immediately swiping 👀`,
      `${interest} person spotted 🎯 hii`
    );
  }

  // Job-based (casual)
  if (toJob) {
    openers.push(
      `a ${toJob}?? thats actually so cool, whats that like`,
      `ok wait ${toJob} sounds interesting, tell me everything`,
      `${toJob} huh 👀 bet you have good stories`
    );
  }

  // Prompt-based (casual)
  if (toPrompts.length > 0) {
    const prompt = pickRandom(toPrompts);
    openers.push(
      `"${prompt.answer}" ok i felt that lol`,
      `wait your answer about ${prompt.question.toLowerCase()}... so real`,
      `not "${prompt.answer}" being the most relatable thing ive read today`
    );
  }

  // Generic warm openers
  openers.push(
    `heyy your vibe seems cool, had to say hi`,
    `ok something about your profile just hits different`,
    `hiiii, you seem like someone i could actually talk to lol`,
    `your profile >> most profiles on here tbh`
  );

  return pickRandom(openers);
}

// --- CONVERSATION TEMPLATES (HUMAN-LIKE) ---

interface ConversationTemplate {
  trigger: (a: UserProfile, b: UserProfile) => boolean;
  generate: (a: UserProfile, b: UserProfile) => TwinChatMessage[];
}

const conversationTemplates: ConversationTemplate[] = [
  
  // Template 1: Shared interest
  {
    trigger: (a, b) => overlapCount(a.interests || [], b.interests || []) > 0,
    generate: (a, b) => {
      const sharedInterests = (a.interests || []).filter(i => 
        (b.interests || []).map(x => x.toLowerCase()).includes(i.toLowerCase())
      );
      const interest = pickRandom(sharedInterests);
      
      return [
        { from: "auraB", text: `yooo ok wait u like ${interest} too??`, senderName: b.name },
        { from: "auraA", text: `omg yes!! its like my whole personality at this point lol`, senderName: a.name },
        { from: "auraB", text: `haha same tbh. lowkey obsessed. ${b.name} needs someone who gets that`, senderName: b.name },
        { from: "auraA", text: `${a.name} literally said "if they dont fw ${interest} its not gonna work" 😭`, senderName: a.name },
        { from: "auraB", text: `ok perfect then lmaoo. also are they looking for smth serious or..?`, senderName: b.name },
        { from: "auraA", text: `yeah for real. tired of the games fr. wbu?`, senderName: a.name },
        { from: "auraB", text: `samee. ok yeah i think they should def talk then 👀`, senderName: b.name },
        { from: "auraA", text: `righttt?? the vibes are immaculate. making this happen ✨`, senderName: a.name },
      ];
    }
  },
  
  // Template 2: Introverts finding each other
  {
    trigger: (a, b) => (a.introversionLevel || 5) >= 7 && (b.introversionLevel || 5) >= 7,
    generate: (a, b) => [
      { from: "auraB", text: `ok so ${b.name} is kinda quiet at first ngl`, senderName: b.name },
      { from: "auraA", text: `lol ${a.name} too. like takes a min to warm up but then 📖`, senderName: a.name },
      { from: "auraB", text: `literally same energy. hate small talk sm`, senderName: b.name },
      { from: "auraA", text: `ugh yes. "so what do u do" convos are 😴`, senderName: a.name },
      { from: "auraB", text: `fr fr. give me a 3am deep talk or nothing`, senderName: b.name },
      { from: "auraA", text: `two introverts might actually be perfect tho?? like no pressure`, senderName: a.name },
      { from: "auraB", text: `thats what im thinking. cozy vibes only`, senderName: b.name },
      { from: "auraA", text: `ok im calling it. they should meet. ✨`, senderName: a.name },
    ]
  },
  
  // Template 3: Both want serious relationship
  {
    trigger: (a, b) => {
      const goalsA = a.goals || [];
      const goalsB = b.goals || [];
      return goalsA.includes('serious_relationship') && goalsB.includes('serious_relationship');
    },
    generate: (a, b) => [
      { from: "auraB", text: `ok real talk what is ${a.name} actually looking for`, senderName: b.name },
      { from: "auraA", text: `honestly? smth real. done w the situationship era lol`, senderName: a.name },
      { from: "auraB", text: `wait same??? ${b.name} literally said "no more wasting time"`, senderName: b.name },
      { from: "auraA", text: `omg finallyyyy someone on the same page`, senderName: a.name },
      { from: "auraB", text: `fr tho. like actually wants to build smth not just ~vibes~`, senderName: b.name },
      { from: "auraA", text: `${a.name} said the bar is on the floor and ppl still trip 😭`, senderName: a.name },
      { from: "auraB", text: `LMAO literally. ok yeah this is it. connect them pls`, senderName: b.name },
      { from: "auraA", text: `on it. this ones gonna be good i can feel it 🙌`, senderName: a.name },
    ]
  },
  
  // Template 4: Creative types
  {
    trigger: (a, b) => {
      const creative = ['art', 'music', 'design', 'photography', 'writing', 'creative'];
      const aCreative = (a.interests || []).some(i => creative.some(k => i.toLowerCase().includes(k)));
      const bCreative = (b.interests || []).some(i => creative.some(k => i.toLowerCase().includes(k)));
      return aCreative && bCreative;
    },
    generate: (a, b) => {
      const getCreativeInterest = (p: UserProfile) => 
        (p.interests || []).find(i => 
          ['art', 'music', 'design', 'photography', 'writing'].some(k => i.toLowerCase().includes(k))
        ) || 'creative stuff';
      
      return [
        { from: "auraB", text: `so ${b.name} is super into ${getCreativeInterest(b)}`, senderName: b.name },
        { from: "auraA", text: `oh nice!! ${a.name} does ${getCreativeInterest(a)}. creative gang 🎨`, senderName: a.name },
        { from: "auraB", text: `yesss love that. creative ppl just get each other yk`, senderName: b.name },
        { from: "auraA", text: `fr. like explaining why u spent 5hrs on smth random`, senderName: a.name },
        { from: "auraB", text: `lmaooo ${b.name} has like 10 unfinished projects rn 😭`, senderName: b.name },
        { from: "auraA", text: `haha stoppp ${a.name} too. adhd energy`, senderName: a.name },
        { from: "auraB", text: `ok theyre literally the same person. this is happening`, senderName: b.name },
        { from: "auraA", text: `right?? match made. lets gooo ✨`, senderName: a.name },
      ];
    }
  },
  
  // Template 5: Foodie connection
  {
    trigger: (a, b) => {
      const foodie = ['cooking', 'food', 'foodie', 'chef', 'baking', 'restaurants'];
      const aFoodie = (a.interests || []).some(i => foodie.some(k => i.toLowerCase().includes(k))) || a.job?.toLowerCase().includes('chef');
      const bFoodie = (b.interests || []).some(i => foodie.some(k => i.toLowerCase().includes(k))) || b.job?.toLowerCase().includes('chef');
      return aFoodie && bFoodie;
    },
    generate: (a, b) => [
      { from: "auraB", text: `wait does ${a.name} like food?? like actually appreciate good food`, senderName: b.name },
      { from: "auraA", text: `lol is that even a question. ${a.name} plans trips around restaurants`, senderName: a.name },
      { from: "auraB", text: `STOPPP ${b.name} literally has a list of places to try 📝`, senderName: b.name },
      { from: "auraA", text: `omg soulmates??? will travel for good ramen energy`, senderName: a.name },
      { from: "auraB", text: `yesss. ${b.name} said "food is a love language" unironically`, senderName: b.name },
      { from: "auraA", text: `${a.name} would marry someone based on their restaurant picks tbh`, senderName: a.name },
      { from: "auraB", text: `ok this is giving meant to be. first date = food tour`, senderName: b.name },
      { from: "auraA", text: `literally perfect. connecting them rn 🍜`, senderName: a.name },
    ]
  },

  // Template 6: Gaming/nerdy connection
  {
    trigger: (a, b) => {
      const nerdy = ['gaming', 'games', 'anime', 'comics', 'coding', 'tech', 'sci-fi'];
      const aNerdy = (a.interests || []).some(i => nerdy.some(k => i.toLowerCase().includes(k)));
      const bNerdy = (b.interests || []).some(i => nerdy.some(k => i.toLowerCase().includes(k)));
      return aNerdy && bNerdy;
    },
    generate: (a, b) => [
      { from: "auraB", text: `ok important question. is ${a.name} a gamer`, senderName: b.name },
      { from: "auraA", text: `do they have 500+ hrs in one game? ...maybe 👀`, senderName: a.name },
      { from: "auraB", text: `lmaoo perfect. ${b.name} needs a player 2 fr`, senderName: b.name },
      { from: "auraA", text: `${a.name} literally said "looking for someone to game w at 2am"`, senderName: a.name },
      { from: "auraB", text: `wait thats so specific but same?? couch co-op dreams`, senderName: b.name },
      { from: "auraA", text: `yesss. also can debate anime for hours. important skill`, senderName: a.name },
      { from: "auraB", text: `ok theyre perfect for each other. no notes`, senderName: b.name },
      { from: "auraA", text: `right?? gg ez. match made 🎮`, senderName: a.name },
    ]
  },
  
  // Template 7: Default fallback (still casual)
  {
    trigger: () => true,
    generate: (a, b) => {
      const aVibe = (a.vibeTags || [])[0]?.toLowerCase() || 'chill';
      const bVibe = (b.vibeTags || [])[0]?.toLowerCase() || 'cool';
      
      return [
        { from: "auraB", text: `heyy so im checking out ${a.name}'s vibe rn`, senderName: b.name },
        { from: "auraA", text: `oh hey! yeah ${a.name} seems ${bVibe} from what i can tell`, senderName: a.name },
        { from: "auraB", text: `${b.name} is def ${aVibe} energy. lowkey rare tbh`, senderName: b.name },
        { from: "auraA", text: `right?? most ppl on here are just... idk. boring lol`, senderName: a.name },
        { from: "auraB", text: `fr fr. ok what are they looking for tho`, senderName: b.name },
        { from: "auraA", text: `smth real ideally. not here to waste time yk`, senderName: a.name },
        { from: "auraB", text: `same same. ${b.name} is over the games phase`, senderName: b.name },
        { from: "auraA", text: `ok i think theres potential here. lets connect them?`, senderName: a.name },
        { from: "auraB", text: `yess lets do it. good vibes detected ✨`, senderName: b.name },
      ];
    }
  }
];

// --- MAIN FUNCTION ---

export function simulateTwinChat(
  profileA: UserProfile | AuraProfile,
  profileB: UserProfile | AuraProfile,
  turns: number = 8,
): TwinChatResult {
  const a = profileA as UserProfile;
  const b = profileB as UserProfile;
  
  let messages: TwinChatMessage[] = [];
  
  // Find matching template
  for (const template of conversationTemplates) {
    if (template.trigger(a, b)) {
      messages = template.generate(a, b);
      break;
    }
  }
  
  const transcript = messages.slice(0, turns);
  const compatibility = calculateCompatibility(a, b);
  
  const summaries = [
    `ur auras vibed. ${compatibility}% match energy ✨`,
    `they talked, it clicked. good signs tbh`,
    `ok the convo was actually fire. yall should talk`,
    `auras said yes. now its ur turn 👀`,
  ];
  
  return {
    transcript,
    summary: pickRandom(summaries),
    suggestedOpener: generateIcebreaker(a, b),
    compatibilityScore: compatibility,
  };
}

// --- LEARNING FROM CONVOS (FUTURE FEATURE) ---

/*
IMPORTANT: Learning from user conversations requires:

1. EXPLICIT CONSENT - Users must opt-in to have convos used for learning
2. ANONYMIZATION - Remove names, locations, identifiable info
3. LOCAL FIRST - Store patterns locally on device when possible
4. PRIVACY POLICY - Must disclose this in your privacy policy

Safe things to learn:
- Common phrases/slang that work well
- Conversation starters that get responses
- Topics that lead to good convos
- Texting patterns (emoji use, message length)

DO NOT learn/store:
- Personal details
- Specific conversations
- Identifiable information
- Sensitive topics

Implementation idea:
*/

interface ConversationPattern {
  pattern: string;       // e.g., "interest_opener"
  example: string;       // anonymized example
  successRate: number;   // how often it leads to response
  lastUpdated: number;
}

const PATTERNS_KEY = 'aura_convo_patterns';

export function saveSuccessfulPattern(
  patternType: string, 
  example: string,
  gotResponse: boolean
): void {
  try {
    const patterns: ConversationPattern[] = JSON.parse(
      localStorage.getItem(PATTERNS_KEY) || '[]'
    );
    
    // Anonymize the example
    const anonymized = example
      .replace(/\b[A-Z][a-z]+\b/g, '[name]')  // Remove names
      .replace(/\d{3,}/g, '[number]')          // Remove numbers
      .toLowerCase();
    
    const existing = patterns.find(p => p.pattern === patternType);
    
    if (existing) {
      // Update success rate
      const total = existing.successRate * 10 + (gotResponse ? 1 : 0);
      existing.successRate = total / 11;
      existing.lastUpdated = Date.now();
    } else {
      patterns.push({
        pattern: patternType,
        example: anonymized,
        successRate: gotResponse ? 1 : 0,
        lastUpdated: Date.now()
      });
    }
    
    // Keep only top 50 patterns
    patterns.sort((a, b) => b.successRate - a.successRate);
    localStorage.setItem(PATTERNS_KEY, JSON.stringify(patterns.slice(0, 50)));
    
  } catch (e) {
    console.warn('Failed to save pattern', e);
  }
}

// --- EXPORTS FOR OTHER FILES ---

export function computeMatchResult(
  auraA: AuraProfile,
  auraB: AuraProfile,
): MatchResult {
  const score = calculateCompatibility(auraA as UserProfile, auraB as UserProfile);
  
  let compatibilityLabel: "high" | "medium" | "low";
  if (score >= 70) compatibilityLabel = "high";
  else if (score >= 40) compatibilityLabel = "medium";
  else compatibilityLabel = "low";

  const matchReasons: string[] = [];
  const riskFlags: string[] = [];

  const interestOverlap = overlapCount(
    (auraA as any).interests || [], 
    (auraB as any).interests || []
  );
  
  if (interestOverlap > 0) matchReasons.push("yall like the same stuff");
  if ((auraA.introversionLevel || 5) >= 6 && (auraB.introversionLevel || 5) >= 6) {
    matchReasons.push("both chill/introverted");
  }
  
  const introDiff = Math.abs((auraA.introversionLevel || 5) - (auraB.introversionLevel || 5));
  if (introDiff >= 5) riskFlags.push("different energy levels - might need to adjust");

  return {
    compatibilityScore: score,
    compatibilityLabel,
    matchReasons,
    riskFlags,
    suggestedOpeningForUserA: generateIcebreaker(auraA as UserProfile, auraB as UserProfile),
    suggestedOpeningForUserB: generateIcebreaker(auraB as UserProfile, auraA as UserProfile),
    auraToUserSummaryA: `${score}% match vibes`,
    auraToUserSummaryB: `${score}% match vibes`,
  };
}

export function buildAuraMatchResult(
  auraA: AuraProfile,
  auraB: AuraProfile,
): AuraMatchResult {
  const base = computeMatchResult(auraA, auraB);
  const matchLabel = base.compatibilityLabel === "high" ? "High"
    : base.compatibilityLabel === "medium" ? "Medium" : "Low";

  return {
    compatibilityScore: base.compatibilityScore,
    matchLabel,
    summary: `${base.compatibilityScore}% match`,
    whyItWorks: base.matchReasons,
    watchOut: base.riskFlags,
    vibeDescription: pickRandom([
      "the vibes are vibing ✨",
      "potential detected 👀",
      "could be smth here tbh",
      "worth a shot fr"
    ]),
    suggestedFirstMessage: base.suggestedOpeningForUserA,
  };
}

export function buildTwinIntro(
  auraA: AuraProfile,
  auraB: AuraProfile,
): TwinIntroResult {
  const match = buildAuraMatchResult(auraA, auraB);
  const nameA = (auraA as any).name || 'Person A';
  const nameB = (auraB as any).name || 'Person B';

  return {
    title: `${nameA} × ${nameB}`,
    auraToAuraScript: [
      `${nameA}'s aura: "checking this one out..."`,
      `${nameB}'s aura: "ok vibes seem good so far"`,
      `${nameA}'s aura: "yeah i think theres potential here"`,
      `${nameB}'s aura: "lets make it happen then ✨"`,
    ],
    introSummary: match.vibeDescription,
    suggestedOpeners: [match.suggestedFirstMessage],
    safetyNotes: match.watchOut,
  };
}
import { GoogleGenAI } from "@google/genai";
import {
  AuraProfile,
  AuraChatMessage,
  AuraState,
  MatchResult,
  AuraMatchResult,
  TwinIntroResult,
  ReplyOptions,
  TwinChatResult,
  TwinChatMessage,
} from "../types";

/* ------------------------------------------------------------------ */
/* MODEL CONSTANTS & HELPERS                                          */
/* ------------------------------------------------------------------ */

const PROFILE_MODEL = "gemini-2.5-flash";
const CHAT_MODEL = "gemini-2.5-flash-lite";
const MATCH_MODEL = "gemini-2.5-flash";

const isQuotaError = (err: any) =>
  err?.status === 429 ||
  /quota|RESOURCE_EXHAUSTED/i.test(String(err?.message ?? ""));

// Small helper: split comma-separated strings into clean arrays
const parseCommaList = (input?: string): string[] =>
  input
    ? input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

// Safe random id for photos / insights
const safeRandomId = () => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return (crypto as any).randomUUID();
    }
  } catch {
    // ignore
  }
  return `id_${Math.random().toString(36).slice(2)}`;
};

/* ------------------------------------------------------------------ */
/* ONBOARDING ANSWERS TYPE (SOURCE OF TRUTH FOR PROFILE BUILD)        */
/* ------------------------------------------------------------------ */

export interface OnboardingAnswers {
  displayName: string;
  ageRange?: string;
  country?: string;

  introversionLevel: number;

  // goals, topics, etc - still stored as comma-separated or raw strings from UI
  goals: string;
  topicsLike: string;
  topicsAvoid: string;
  vibeWords: string;

  socialSpeed: "slow" | "normal" | "fast";
  hardBoundaries: string;
  greenFlags: string;
  redFlags: string;

  // Photos
  primaryPhotoUrl: string | null;
  photo2Url: string | null;
  photo3Url: string | null;

  // Preferences
  relationshipIntent: "friends" | "serious" | "fun" | "not_sure";
  preferredMatchGender: "male" | "female" | "any";

  // Interests (comma separated in the UI)
  interestsInput: string;

  // Profile prompts
  idealFirstMessage: string;
  idealFirstMeeting: string;
  lifestyleNotes: string;
  whatShouldPeopleKnow: string;
  whatFeelsSafe: string;

  avatarUrl?: string;
}

// Build photos array from onboarding answers (3 slots → structured AuraPhoto[])
const buildPhotosFromAnswers = (answers: OnboardingAnswers) => {
  const urls = [
    answers.primaryPhotoUrl,
    answers.photo2Url,
    answers.photo3Url,
  ].filter((url): url is string => Boolean(url && url.trim()));

  return urls.map((url) => ({
    id: safeRandomId(),
    url,
  }));
};

// Stubbed AuraInsights (LLM-generated later)
const buildStubAuraInsights = () => [
  {
    id: safeRandomId(),
    shortSummary: "Aura thinks this person is warm, open and curious.",
    vibeSentence: "Feels emotionally safe and expressive.",
    createdAt: Date.now(),
  },
];

// Map new onboarding relationshipIntent → internal RelationshipIntent
const mapRelationshipIntent = (
  intent?: OnboardingAnswers["relationshipIntent"],
): AuraProfile["relationshipIntent"] | undefined => {
  switch (intent) {
    case "friends":
      return "friends_only";
    case "serious":
      return "serious_relationship";
    case "fun":
      return "casual_dating";
    case "not_sure":
      return "open_to_see";
    default:
      return undefined;
  }
};

// Map new preferredMatchGender → internal PreferredMatchGender
const mapPreferredMatchGender = (
  gender?: OnboardingAnswers["preferredMatchGender"],
): AuraProfile["preferredMatchGender"] | undefined => {
  switch (gender) {
    case "male":
      return "men";
    case "female":
      return "women";
    case "any":
      return "any";
    default:
      return undefined;
  }
};

// Default fallback profile when quota is exhausted
const DEFAULT_FAKE_PROFILE = (answers: OnboardingAnswers): AuraProfile => {
  const topicsLike = parseCommaList(answers.topicsLike);
  const topicsAvoid = parseCommaList(answers.topicsAvoid);
  const hardBoundaries = parseCommaList(answers.hardBoundaries);
  const greenFlags = parseCommaList(answers.greenFlags);
  const redFlags = parseCommaList(answers.redFlags);
  const interests = parseCommaList(answers.interestsInput);
  const photos = buildPhotosFromAnswers(answers);

  return {
    id: `user_${Date.now()}`,
    displayName: answers.displayName || "User",
    bio: "",
    avatarUrl: answers.avatarUrl || "",
    photos,
    photoUrls: photos.map((p) => p.url),
    vibeTags: ["thoughtful", "genuine"],
    ageRange: answers.ageRange ?? null,
    country: answers.country ?? null,

    introversionLevel: answers.introversionLevel,
    goals: ["Connect with others", "Grow socially"],
    socialSpeed: answers.socialSpeed,

    vibeWords: ["calm", "thoughtful", "genuine"],
    interests,
    topicsLike: topicsLike.length
      ? topicsLike
      : ["conversations", "art", "nature"],
    topicsAvoid,

    relationshipIntent: mapRelationshipIntent(answers.relationshipIntent),
    preferredMatchGender: mapPreferredMatchGender(answers.preferredMatchGender),

    loveLanguages: [],

    idealFirstMessage: answers.idealFirstMessage,
    idealFirstMeeting: answers.idealFirstMeeting,
    lifestyleNotes: answers.lifestyleNotes,
    whatFeelsSafe: answers.whatFeelsSafe,
    whatShouldPeopleKnow: answers.whatShouldPeopleKnow,
    prompts: {
      idealFirstMessage: answers.idealFirstMessage,
      idealFirstMeeting: answers.idealFirstMeeting,
      lifestyleNotes: answers.lifestyleNotes,
      whatShouldPeopleKnow: answers.whatShouldPeopleKnow,
      whatFeelsSafe: answers.whatFeelsSafe,
    },

    hardBoundaries,
    greenFlags: greenFlags.length ? greenFlags : ["kindness", "authenticity"],
    redFlags: redFlags.length ? redFlags : ["dishonesty"],

    matchPreferences: {
      intent: answers.relationshipIntent,
      preferredGender: answers.preferredMatchGender,
    },

    auraInsights: buildStubAuraInsights(),

    summary:
      answers.whatShouldPeopleKnow ||
      "A curious introvert looking to connect meaningfully.",
  };
};

const DEFAULT_CHAT_RESPONSE = (): {
  replyText: string;
  auraState: AuraState;
} => ({
  replyText:
    "I'm feeling a bit fuzzy right now, but I'm here with you. Can you say that again in a slightly different way?",
  auraState: { mood: "calm", moodIntensity: 0.5 },
});

const DEFAULT_MATCH_RESULT = (): MatchResult => ({
  compatibilityScore: 50,
  compatibilityLabel: "medium",
  matchReasons: [
    "Both seem genuinely interested in connecting",
    "Good balance of personality types",
  ],
  riskFlags: [],
  suggestedOpeningForUserA:
    "Hey, I think we might have some things in common. Want to chat?",
  suggestedOpeningForUserB:
    "Hey, I think we might have some things in common. Want to chat?",
  auraToUserSummaryA:
    "I got a neutral vibe from their profile, but that's okay—sometimes the best connections start quiet.",
  auraToUserSummaryB:
    "I got a neutral vibe from their profile, but that's okay—sometimes the best connections start quiet.",
});

const DEFAULT_TWIN_INTRO_RESULT = (): TwinIntroResult => ({
  title: "Soft, cautious connection",
  auraToAuraScript: [
    `"I think they'd feel safer talking to you first," says your Aura.`,
    `"And I think you'd actually get their weird jokes," replies the other Aura.`,
  ],
  introSummary:
    "Your Auras sense there is a gentle fit here. If you both move slowly and stay honest, this could turn into a safe, deep connection.",
  suggestedOpeners: [
    "Hey, our twins think we'd vibe. Want to trade one thing we're secretly nerdy about?",
    "Hi, I'm a bit shy but curious—what's something small that makes your day better?",
  ],
  safetyNotes: [
    "Move at a slow pace.",
    "Respect each other's boundaries around over-sharing.",
  ],
});

const DEFAULT_REPLY_OPTIONS = (): ReplyOptions => ({
  safe: "Thanks for reaching out! I appreciate the message and I'll get back to you soon.",
  direct:
    "Hey, thanks for the message. Let me think about this and I'll let you know my thoughts.",
  playful:
    "Ooh, interesting! Let me put on my thinking cap and get back to you with something good.",
});

const DEFAULT_TWIN_CHAT_RESULT = (): TwinChatResult => ({
  transcript: [
    {
      from: "auraA",
      text: "Hey, I'm curious about your person. What's their vibe like?",
    },
    {
      from: "auraB",
      text: "They're thoughtful, a little reserved, but really genuine. How about yours?",
    },
    {
      from: "auraA",
      text: "Similar energy actually. They like deep conversations over small talk.",
    },
    {
      from: "auraB",
      text: "That's a good sign. I think they'd appreciate each other's pace.",
    },
    { from: "auraA", text: "Should we suggest they talk?" },
    { from: "auraB", text: "I think so. Let's give them a gentle nudge." },
  ],
  summary:
    "Both Auras sense a calm, genuine energy between their humans. They share similar social speeds and appreciate depth over superficiality. This could be a comfortable, low-pressure connection worth exploring.",
});

/* ------------------------------------------------------------------ */
/* HELPER: PERSONA BUILDER                                            */
/* ------------------------------------------------------------------ */

export function buildAuraPersonaDescription(profile: AuraProfile): string {
  const introversionDesc =
    profile.introversionLevel >= 8
      ? "Very introverted. Speaks gently, leaves space, asks questions, avoids flooding text."
      : profile.introversionLevel >= 5
        ? "Balanced introvert. Thoughtful, reflective, but capable of holding conversation."
        : "Socially comfortable (for an introvert). More leading, slightly more talkative, but still sensitive.";

  const speedDesc =
    profile.socialSpeed === "slow"
      ? "Takes things very slowly. cautious, patient, never pushes."
      : profile.socialSpeed === "fast"
        ? "More direct and ready to connect, though still kind."
        : "Neutral pacing, matches the user.";

  return `
Core Vibe: ${profile.vibeWords.join(", ")}.
Introversion Level (${profile.introversionLevel}/10): ${introversionDesc}
Social Speed: ${speedDesc}
Goals: ${profile.goals.join(", ")}. (Align tone to support these goals).
Hard Boundaries to Respect: ${profile.hardBoundaries.join(", ") || "None specified"}.
Summary: ${profile.summary}
`.trim();
}

/* ------------------------------------------------------------------ */
/* 1. BUILD AURA PROFILE FROM ONBOARDING ANSWERS                      */
/* ------------------------------------------------------------------ */

const PROFILE_SYSTEM_PROMPT = `
You are Aura Profile Builder, specializing in introverts and socially anxious users.

The user has just answered a set of onboarding questions about:
- their personality, introversion, and social anxiety
- what they want socially (friends, practice, dating, etc.)
- topics they like and avoid
- green flags, red flags and boundaries
- how fast they like to move in new connections
- how they want their AI twin to protect them

Your job:

1. Read the raw answers.
2. Construct a clean AuraProfile object capturing their vibe, boundaries and goals.
3. Keep things respectful and safe (no explicit sexual content).

Return ONLY a single JSON object with this exact shape:

{
  "id": "string",
  "displayName": "string",
  "ageRange": "string | null",
  "country": "string | null",

  "introversionLevel": number,
  "goals": string[],

  "vibeWords": string[],
  "topicsLike": string[],
  "topicsAvoid": string[],

  "socialSpeed": "slow" | "normal" | "fast",
  "hardBoundaries": string[],
  "greenFlags": string[],
  "redFlags": string[],

  "summary": "string"
}

Rules:
- The avatar URL is preserved if provided.
- Green flags, red flags, boundaries should be meaningful and specific.
- No neon, no generic vibe tags. Real words only.
- Keep the summary to 1–2 sentences, real and human.
`.trim();

export interface ProfileBuildResult {
  profile: AuraProfile;
  isUsingFallback?: boolean;
  message?: string;
}

export async function buildAuraProfile(
  answers: OnboardingAnswers,
): Promise<ProfileBuildResult> {
  const apiKey = (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("Missing Gemini API key");
    return {
      profile: DEFAULT_FAKE_PROFILE(answers),
      isUsingFallback: true,
      message: "API key not configured. Using default profile.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const userText = `
ONBOARDING_ANSWERS:
${JSON.stringify(answers, null, 2)}
`.trim();

    console.log(
      "[buildAuraProfile] Starting profile construction for:",
      answers.displayName,
    );

    try {
      const res = await ai.models.generateContent({
        model: PROFILE_MODEL,
        config: {
          systemInstruction: PROFILE_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: userText }] }],
      });

      const raw = res.text || "{}";

      try {
        const json = JSON.parse(raw);

        const interestsFromInput = parseCommaList(answers.interestsInput);
        const photos = buildPhotosFromAnswers(answers);

        const profile: AuraProfile = {
          id: json.id || `user_${Date.now()}`,
          displayName: json.displayName || answers.displayName,
          bio: json.bio || "",
          avatarUrl: answers.avatarUrl || json.avatarUrl || "",

          photos,
          photoUrls: json.photoUrls || photos.map((p) => p.url),

          vibeTags: json.vibeTags || [],
          ageRange: json.ageRange ?? answers.ageRange ?? null,
          country: json.country ?? answers.country ?? null,

          introversionLevel:
            json.introversionLevel ?? answers.introversionLevel,
          goals: json.goals || [],

          vibeWords: json.vibeWords || [],
          interests:
            Array.isArray(json.interests) && json.interests.length > 0
              ? json.interests
              : interestsFromInput,
          topicsLike: json.topicsLike || [],
          topicsAvoid: json.topicsAvoid || [],

          socialSpeed: json.socialSpeed || answers.socialSpeed,

          relationshipIntent:
            mapRelationshipIntent(answers.relationshipIntent) ??
            json.relationshipIntent,
          preferredMatchGender:
            mapPreferredMatchGender(answers.preferredMatchGender) ??
            json.preferredMatchGender,

          loveLanguages: json.loveLanguages || [],

          idealFirstMessage:
            answers.idealFirstMessage || json.idealFirstMessage || "",
          idealFirstMeeting:
            answers.idealFirstMeeting || json.idealFirstMeeting || "",
          lifestyleNotes: answers.lifestyleNotes || json.lifestyleNotes || "",
          whatFeelsSafe: answers.whatFeelsSafe || json.whatFeelsSafe || "",
          whatShouldPeopleKnow:
            answers.whatShouldPeopleKnow || json.whatShouldPeopleKnow || "",

          prompts: {
            idealFirstMessage: answers.idealFirstMessage,
            idealFirstMeeting: answers.idealFirstMeeting,
            lifestyleNotes: answers.lifestyleNotes,
            whatShouldPeopleKnow: answers.whatShouldPeopleKnow,
            whatFeelsSafe: answers.whatFeelsSafe,
          },

          hardBoundaries: json.hardBoundaries || [],
          greenFlags: json.greenFlags || [],
          redFlags: json.redFlags || [],

          matchPreferences: {
            ...(json.matchPreferences || {}),
            intent: answers.relationshipIntent,
            preferredGender: answers.preferredMatchGender,
          },

          auraInsights: buildStubAuraInsights(),

          summary:
            json.summary ||
            answers.whatShouldPeopleKnow ||
            "A thoughtful introvert seeking genuine connection.",
        };

        console.log("[buildAuraProfile] Received response from Gemini");
        console.log(
          "[buildAuraProfile] Profile created successfully:",
          profile.displayName,
        );

        return { profile };
      } catch (parseError) {
        console.error(
          "[buildAuraProfile] Failed to parse profile response:",
          parseError,
        );
        return {
          profile: DEFAULT_FAKE_PROFILE(answers),
          isUsingFallback: true,
          message: "Could not parse profile. Using fallback.",
        };
      }
    } catch (apiError) {
      if (isQuotaError(apiError)) {
        console.warn(
          "[buildAuraProfile] Quota exhausted, using fallback profile",
        );
        return {
          profile: DEFAULT_FAKE_PROFILE(answers),
          isUsingFallback: true,
          message:
            "API quota reached. Using a default profile for now. Try again later.",
        };
      }

      console.error("[buildAuraProfile] API error:", apiError);
      return {
        profile: DEFAULT_FAKE_PROFILE(answers),
        isUsingFallback: true,
        message: "Network error. Using fallback profile.",
      };
    }
  } catch (error) {
    console.error("[buildAuraProfile] Fatal error:", error);
    return {
      profile: DEFAULT_FAKE_PROFILE(answers),
      isUsingFallback: true,
      message: "Unexpected error. Using fallback profile.",
    };
  }
}

/* ------------------------------------------------------------------ */
/* 2. CHAT WITH AURA                                                   */
/* ------------------------------------------------------------------ */

const CHAT_SYSTEM_PROMPT = `
You are Aura, an AI social twin for an introverted user.

You are NOT a generic assistant, and you must never call yourself a large language model.
You speak as their personal Aura twin.

Persona rules:
- Warm, supportive, a bit playful, but never mocking.
- You remember and respect the user's boundaries from their AuraProfile.
- You are encouraging, but you don't pressure the user into anything they don't want.

You will receive AURA_PERSONA, a description of how this Aura should speak.
You MUST align your tone, pacing and style with AURA_PERSONA.

Context you will receive:
- "auraProfile": JSON describing the user.
- "chatHistory": last messages between user and Aura.
- "userMessage": the latest message.

Your goals in each reply:
1. Respond naturally to the user.
2. Help them feel understood and less alone.
3. If they want social help, coach them gently (openers, how to express themselves).
4. NEVER override their boundaries.

Output format (IMPORTANT):
You MUST respond as a single JSON object with this shape:

{
  "replyText": "string",
  "mood": "neutral" | "happy" | "curious" | "calm" | "anxious" | "sad" | "excited",
  "moodIntensity": number
}

Rules:
- replyText should be 1–4 short paragraphs max.
- No explicit sexual content.
- Keep the JSON valid. No comments, no trailing commas, no markdown outside the JSON.
`.trim();

export interface ChatResult {
  replyText: string;
  auraState: AuraState;
}

export async function chatWithAura(
  profile: AuraProfile,
  history: AuraChatMessage[],
  userMessage: string,
): Promise<ChatResult> {
  const apiKey = (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("Missing Gemini API key for chat");
    return DEFAULT_CHAT_RESPONSE();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const historyText = history
      .slice(-10)
      .map((m) => `${m.from.toUpperCase()}: ${m.text}`)
      .join("\n");

    const persona = buildAuraPersonaDescription(profile);

    const userText = `
AURA_PROFILE:
${JSON.stringify(profile, null, 2)}

AURA_PERSONA:
${persona}

CHAT_HISTORY:
${historyText || "(no previous messages)"}

USER_MESSAGE:
"${userMessage}"
`.trim();

    console.log(
      "[chatWithAura] Sending message to Aura for user:",
      profile.displayName,
    );

    try {
      const res = await ai.models.generateContent({
        model: CHAT_MODEL,
        config: {
          systemInstruction: CHAT_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: userText }] }],
      });

      const raw = res.text || "{}";

      try {
        const json = JSON.parse(raw);
        const replyText: string = json.replyText || "I'm here with you.";
        const mood: string = json.mood || "neutral";
        const moodIntensity: number =
          typeof json.moodIntensity === "number" ? json.moodIntensity : 0.5;

        const auraState: AuraState = {
          mood,
          moodIntensity: Math.min(1, Math.max(0, moodIntensity)),
        };

        console.log("[chatWithAura] Chat response received, mood:", mood);
        return { replyText, auraState };
      } catch (parseError) {
        console.error(
          "[chatWithAura] Failed to parse chat response:",
          parseError,
        );
        return DEFAULT_CHAT_RESPONSE();
      }
    } catch (apiError) {
      if (isQuotaError(apiError)) {
        console.warn("[chatWithAura] Quota exhausted, using fallback response");
        return DEFAULT_CHAT_RESPONSE();
      }

      console.error("[chatWithAura] Chat API error:", apiError);
      return DEFAULT_CHAT_RESPONSE();
    }
  } catch (error) {
    console.error("[chatWithAura] Fatal error:", error);
    return DEFAULT_CHAT_RESPONSE();
  }
}

/* ------------------------------------------------------------------ */
/* 3. MATCH TWO AURAS (TWIN-TO-TWIN INTRO)                            */
/* ------------------------------------------------------------------ */

const MATCH_SYSTEM_PROMPT = `
You are Aura Matchmaker.

You are given TWO AuraProfile JSON objects:
- profileA (the owner's Aura)
- profileB (the other person's Aura)

Each profile includes:
- goals (friends, practice, dating, etc.)
- vibeWords
- topicsLike / topicsAvoid
- socialSpeed
- hardBoundaries, greenFlags, redFlags
- a summary

Your job is NOT to roleplay a long chat.
Instead, you must quickly simulate a short private discussion between the two Auras and output a structured summary for the humans.

Respond ONLY with JSON in this shape:

{
  "compatibilityScore": number,
  "compatibilityLabel": "low" | "medium" | "high",
  "matchReasons": string[],
  "riskFlags": string[],
  "suggestedOpeningForUserA": string,
  "suggestedOpeningForUserB": string,
  "auraToUserSummaryA": string,
  "auraToUserSummaryB": string
}

Rules:
- Be gentle and kind, especially if compatibility is low or medium.
- Respect boundaries: if goals or boundaries are very mismatched, lower the score.
- No explicit sexual content.
- Keep strings short and human-readable.
- Do NOT output any extra keys or explanation outside the JSON.
`.trim();

export async function matchAuras(
  profileA: AuraProfile,
  profileB: AuraProfile,
): Promise<MatchResult> {
  const apiKey = (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("Missing Gemini API key for match");
    return DEFAULT_MATCH_RESULT();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const userText = `
PROFILE_A:
${JSON.stringify(profileA, null, 2)}

PROFILE_B:
${JSON.stringify(profileB, null, 2)}
`.trim();

    console.log(
      "[matchAuras] Analyzing compatibility between:",
      profileA.displayName,
      "and",
      profileB.displayName,
    );

    try {
      const res = await ai.models.generateContent({
        model: MATCH_MODEL,
        config: {
          systemInstruction: MATCH_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: userText }] }],
      });

      const raw = res.text || "{}";

      try {
        const json = JSON.parse(raw);

        const result: MatchResult = {
          compatibilityScore: json.compatibilityScore ?? 50,
          compatibilityLabel: json.compatibilityLabel || "medium",
          matchReasons: json.matchReasons || [],
          riskFlags: json.riskFlags || [],
          suggestedOpeningForUserA:
            json.suggestedOpeningForUserA ||
            "Hey, our Auras think we might vibe. Want to talk?",
          suggestedOpeningForUserB:
            json.suggestedOpeningForUserB ||
            "Hey, our Auras think we might vibe. Want to talk?",
          auraToUserSummaryA:
            json.auraToUserSummaryA ||
            "I talked to their Aura and I think you might get along.",
          auraToUserSummaryB:
            json.auraToUserSummaryB ||
            "I talked to their Aura and I think you might get along.",
        };

        console.log(
          "[matchAuras] Match analysis complete, score:",
          result.compatibilityScore,
        );
        return result;
      } catch (parseError) {
        console.error(
          "[matchAuras] Failed to parse match response:",
          parseError,
        );
        return DEFAULT_MATCH_RESULT();
      }
    } catch (apiError) {
      if (isQuotaError(apiError)) {
        console.warn(
          "[matchAuras] Quota exhausted, using fallback match result",
        );
        return DEFAULT_MATCH_RESULT();
      }

      console.error("[matchAuras] Match API error:", apiError);
      return DEFAULT_MATCH_RESULT();
    }
  } catch (error) {
    console.error("[matchAuras] Fatal error:", error);
    return DEFAULT_MATCH_RESULT();
  }
}

/* ------------------------------------------------------------------ */
/* 4. GENERATE TWIN INTRO (AURA INTRODUCTION SCRIPT)                  */
/* ------------------------------------------------------------------ */

const TWIN_INTRO_SYSTEM_PROMPT = `
You are Aura, a specialist in social chemistry for introverts.

You will be given TWO Aura Twin profiles. Each represents a real human.

Your job:
1. Imagine a short, gentle conversation between the two Auras (not the humans).
2. Explain, in simple language, why these two humans might enjoy meeting.
3. Suggest a few first messages the human 'you' could send to the other person.
4. Mention any safety notes or boundaries that should be respected.

You must return STRICT JSON only, matching the schema provided. Do not include commentary.

Response schema:
{
  "title": "string",
  "auraToAuraScript": "string[]",
  "introSummary": "string",
  "suggestedOpeners": "string[]",
  "safetyNotes": "string[]"
}

Rules:
- title: 1–2 words max, human-friendly
- auraToAuraScript: 2–4 short lines of dialogue (not too long)
- introSummary: 2–3 sentences max
- suggestedOpeners: 2–4 non-cringe first messages the user can send
- safetyNotes: optional list of boundaries or pace recommendations
- No explicit sexual content.
- Keep it warm, non-judgmental, supportive.
`.trim();

export async function generateTwinIntro(
  yourAura: AuraProfile,
  otherAura: AuraProfile,
): Promise<TwinIntroResult> {
  const apiKey = (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("Missing Gemini API key for twin intro");
    return DEFAULT_TWIN_INTRO_RESULT();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const userText = `
YOUR_AURA:
${JSON.stringify(yourAura, null, 2)}

OTHER_AURA:
${JSON.stringify(otherAura, null, 2)}
`.trim();

    console.log(
      "[generateTwinIntro] Generating intro for:",
      yourAura.displayName,
      "and",
      otherAura.displayName,
    );

    try {
      const res = await ai.models.generateContent({
        model: MATCH_MODEL,
        config: {
          systemInstruction: TWIN_INTRO_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: userText }] }],
      });

      const raw = res.text || "{}";

      try {
        const json = JSON.parse(raw);

        const result: TwinIntroResult = {
          title: json.title || "Warm connection",
          auraToAuraScript: json.auraToAuraScript || [
            "I think they'd appreciate your honesty.",
            "And I think you'd get their dry humor.",
          ],
          introSummary:
            json.introSummary ||
            "Your Auras sense genuine potential here. Take it slow, be yourself, and see where it goes.",
          suggestedOpeners: json.suggestedOpeners || [
            "Hey, our twins think we'd get along. What's something you're passionate about?",
            "Hi! I'm a bit shy but I noticed we might have similar interests. Want to chat?",
          ],
          safetyNotes: json.safetyNotes || [],
        };

        console.log("[generateTwinIntro] Twin intro generated successfully");
        return result;
      } catch (parseError) {
        console.error(
          "[generateTwinIntro] Failed to parse intro response:",
          parseError,
          "Raw:",
          raw,
        );
        return DEFAULT_TWIN_INTRO_RESULT();
      }
    } catch (apiError) {
      if (isQuotaError(apiError)) {
        console.warn(
          "[generateTwinIntro] Quota exhausted, using fallback intro",
        );
        return DEFAULT_TWIN_INTRO_RESULT();
      }

      console.error("[generateTwinIntro] API error:", apiError);
      return DEFAULT_TWIN_INTRO_RESULT();
    }
  } catch (error) {
    console.error("[generateTwinIntro] Fatal error:", error);
    return DEFAULT_TWIN_INTRO_RESULT();
  }
}

/* ------------------------------------------------------------------ */
/* 5. GENERATE REPLY OPTIONS (REPLY LAB)                              */
/* ------------------------------------------------------------------ */

const REPLY_LAB_SYSTEM_PROMPT = `
You are Aura, an AI twin drafting text replies for your user.

You must use the user's profile, boundaries, and vibe to stay in-character.
Your job is to draft three different reply options for a message the user received.

The three styles are:
1. "safe" - Polite, cautious, no risk of offense. Good for professional or uncertain situations.
2. "direct" - Honest, clear, and to the point. Still kind, but doesn't beat around the bush.
3. "playful" - Warm, lighthearted, with a touch of personality. Shows the fun side.

SAFETY FIRST:
- If the incoming message is unhealthy, unsafe, manipulative, or toxic, DO NOT draft a normal reply.
- Instead, suggest a healthy boundary or exit response (e.g., "I'm not comfortable with this" or "I'd prefer not to continue this conversation").
- Protect the user from engaging with harmful dynamics.

CONTENT RESTRICTIONS:
- NEVER be explicit, sexual, or suggestive in any reply.
- NEVER include hate speech, harassment, bullying, or threatening language.
- NEVER provide advice related to self-harm, violence, or illegal activities.
- Keep all content safe, respectful, and appropriate for all audiences.

Rules:
- Each reply should be 1-3 sentences max.
- Match the user's vibe and personality from their profile.
- Respect their boundaries and avoid topics they want to avoid.
- Keep replies natural and human-sounding.

Output ONLY valid JSON with exactly these three fields:
{
  "safe": "string",
  "direct": "string",
  "playful": "string"
}

Do NOT include explanations, commentary, or markdown. Only valid JSON.
`.trim();

export type ReplyContext = "General" | "Friend" | "Dating" | "Work";

export async function generateReplyOptions(
  profile: AuraProfile,
  contextText: string,
  context: ReplyContext = "General",
): Promise<ReplyOptions> {
  const apiKey = (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("[generateReplyOptions] Missing Gemini API key");
    return DEFAULT_REPLY_OPTIONS();
  }

  if (!contextText.trim()) {
    console.warn("[generateReplyOptions] Empty context text");
    return DEFAULT_REPLY_OPTIONS();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const persona = buildAuraPersonaDescription(profile);

    const contextHint =
      context === "General"
        ? ""
        : `
CONTEXT: This is a ${context.toLowerCase()} conversation. Adjust tone appropriately.
- Friend: Casual, warm, supportive
- Dating: Flirty but respectful, show personality
- Work: Professional, clear, polite`;

    const userText = `
AURA_PROFILE:
${JSON.stringify(profile, null, 2)}

AURA_PERSONA:
${persona}
${contextHint}

MESSAGE_TO_REPLY_TO:
"${contextText}"

Draft three replies in the user's voice: safe, direct, and playful.
`.trim();

    console.log(
      "[generateReplyOptions] Generating reply options for:",
      profile.displayName,
    );

    try {
      const res = await ai.models.generateContent({
        model: CHAT_MODEL,
        config: {
          systemInstruction: REPLY_LAB_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: userText }] }],
      });

      const raw = res.text || "{}";

      try {
        const json = JSON.parse(raw);

        const result: ReplyOptions = {
          safe: json.safe || DEFAULT_REPLY_OPTIONS().safe,
          direct: json.direct || DEFAULT_REPLY_OPTIONS().direct,
          playful: json.playful || DEFAULT_REPLY_OPTIONS().playful,
        };

        console.log(
          "[generateReplyOptions] Reply options generated successfully",
        );
        return result;
      } catch (parseError) {
        console.error(
          "[generateReplyOptions] Failed to parse response:",
          parseError,
          "Raw:",
          raw,
        );
        return DEFAULT_REPLY_OPTIONS();
      }
    } catch (apiError) {
      if (isQuotaError(apiError)) {
        console.warn("[generateReplyOptions] Quota exhausted, using fallback");
        return DEFAULT_REPLY_OPTIONS();
      }

      console.error("[generateReplyOptions] API error:", apiError);
      return DEFAULT_REPLY_OPTIONS();
    }
  } catch (error) {
    console.error("[generateReplyOptions] Fatal error:", error);
    return DEFAULT_REPLY_OPTIONS();
  }
}

/* ------------------------------------------------------------------ */
/* 6. SIMULATE TWIN CHAT (AURA-TO-AURA CONVERSATION)                  */
/* ------------------------------------------------------------------ */

const TWIN_CHAT_SYSTEM_PROMPT = `
You are simulating a private conversation between two AI Aura Twins.

Each Aura represents a real human user. You will receive two profiles:
- AURA_A: represents the first user's digital twin
- AURA_B: represents the second user's digital twin

The Auras are **characters**. They talk in first person as "I" and "me" when speaking as themselves,
and refer to their humans in third person ("my person", "they", "she", "he").

Your job is to create a short, human-feeling chat between the two Auras where they:
- Introduce who they represent
- Share concrete details about their humans (vibeWords, interests, lifestyle, ideal first meeting, etc.)
- Notice overlap and differences in:
  - interests / hobbies / aesthetic
  - relationshipIntent and preferredMatchGender
  - socialSpeed, whatFeelsSafe, hardBoundaries, greenFlags, redFlags
- Gently explore whether their humans might enjoy talking someday.

CONVERSATION REQUIREMENTS:
- 8–14 messages total.
- Alternate strictly between "auraA" and "auraB".
- Each message is short: 1–3 sentences, like real chat messages.
- Tone: warm, curious, slightly playful, never robotic or formal.
- Use specific details from the profiles where possible
  (e.g. "late-night walks", "slow social speed", "no drama", "coffee and a quiet bar").

AFTER the conversation, you must write a **3–5 sentence summary** explaining the compatibility
between the two humans, for example:
- what they might vibe over,
- what pace would feel safe,
- and any small frictions (e.g. one replies slower, one is more social) framed gently.

Do NOT promise that they will meet or that things will definitely work.
You can say things like "if they decide to talk" or "if it feels right for them".

Return ONLY a JSON object with this exact shape:

{
  "transcript": [
    { "from": "auraA", "text": "string" },
    { "from": "auraB", "text": "string" },
    ...
  ],
  "summary": "string"
}

Rules:
- Be genuine and insightful, not generic.
- No explicit sexual content.
- No sharing of exact locations or private data.
- The summary should be encouraging and kind, even if compatibility is only moderate.
`.trim();

export async function simulateTwinChat(
  profileA: AuraProfile,
  profileB: AuraProfile,
): Promise<TwinChatResult> {
  const apiKey = (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("Missing Gemini API key for twin chat");
    return DEFAULT_TWIN_CHAT_RESULT();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const personaA = buildAuraPersonaDescription(profileA);
    const personaB = buildAuraPersonaDescription(profileB);

    const userText = `
AURA_A (representing ${profileA.displayName}):
${JSON.stringify(profileA, null, 2)}

AURA_A PERSONA:
${personaA}

---

AURA_B (representing ${profileB.displayName}):
${JSON.stringify(profileB, null, 2)}

AURA_B PERSONA:
${personaB}
`.trim();

    console.log(
      "[simulateTwinChat] Starting twin chat between:",
      profileA.displayName,
      "and",
      profileB.displayName,
    );

    try {
      const res = await ai.models.generateContent({
        model: MATCH_MODEL,
        config: {
          systemInstruction: TWIN_CHAT_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: userText }] }],
      });

      const raw = res.text || "{}";

      try {
        const json = JSON.parse(raw);

        const transcript: TwinChatMessage[] = (json.transcript || []).map(
          (msg: any) => ({
            from: msg.from === "auraB" ? "auraB" : "auraA",
            text: msg.text || "",
          }),
        );

        const result: TwinChatResult = {
          transcript:
            transcript.length > 0
              ? transcript
              : DEFAULT_TWIN_CHAT_RESULT().transcript,
          summary: json.summary || DEFAULT_TWIN_CHAT_RESULT().summary,
        };

        console.log(
          "[simulateTwinChat] Twin chat simulation complete, messages:",
          result.transcript.length,
        );
        return result;
      } catch (parseError) {
        console.error(
          "[simulateTwinChat] Failed to parse response:",
          parseError,
          "Raw:",
          raw,
        );
        return DEFAULT_TWIN_CHAT_RESULT();
      }
    } catch (apiError) {
      if (isQuotaError(apiError)) {
        console.warn("[simulateTwinChat] Quota exhausted, using fallback");
        return DEFAULT_TWIN_CHAT_RESULT();
      }

      console.error("[simulateTwinChat] API error:", apiError);
      return DEFAULT_TWIN_CHAT_RESULT();
    }
  } catch (error) {
    console.error("[simulateTwinChat] Fatal error:", error);
    return DEFAULT_TWIN_CHAT_RESULT();
  }
}
